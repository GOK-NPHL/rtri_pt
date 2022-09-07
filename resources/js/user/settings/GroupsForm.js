
import React from 'react';
import ReactDOM from 'react-dom';
import { FetchUserAuthorities, fetchCurrentUserParams, saveAMresource, updateAMresource, getAMresource, deleteAMresource, exportToExcel } from '../../components/utils/Helpers';
import {matchPath} from 'react-router';
import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css"

class GroupsForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            showUserTable: true,
            groups: [],
            currentUser: {},
            allowedGroups: [],
            status: {},
            editedGroup: {},
            editMode: false,
            allPermissions: [],
            selectedPermissions: [],
        }
        this.onChange = this.onChange.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.editGroup = this.editGroup.bind(this);
        this.updateEditMode = this.updateEditMode.bind(this);

    }

    componentDidMount() {
        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/access-management/groups/edit/:groupId`,
        });
        //fetch groups
        if(pathObject && pathObject.params.groupId){
            this.state.editMode = true;
            this.setState({
                editMode: true
            });
            (async () => {
                let returnedData = await getAMresource('group', pathObject.params.groupId);
                if (returnedData.status === 200) {
                    this.setState({
                        editedGroup: returnedData.data,
                        selectedPermissions: JSON.parse(returnedData.data.permissions) || [],
                        editMode: true
                    });
                } else {
                    if (window && window != undefined && window.location) {
                        window.location.href = '/access-management/groups';
                    }
                    this.setState({
                        editedGroup: {},
                        selectedPermissions: [],
                        message: returnedData.statusText || returnedData.message || 'An error occured while fetching groups'
                    });
                }
            })();
        }

        (async () => {
            try {
                let al_p = await getAMresource('permissions');
                if (al_p.status == 200) {
                    this.setState({
                        allPermissions: al_p.data.filter(p => { return p.is_active == 1 || p.is_active == true }),
                    });
                } else {
                    this.setState({
                        allPermissions: [],
                        message: returnedData.statusText || returnedData.message || 'An error occured while fetching permissions'
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })()

    }


    deleteGroup(pm) {
        (async () => {
            if (window && window.confirm("Are you sure you want to delete this group?")) {
                let response = await deleteAMresource(pm, 'group', pm.id);
                if (response.status === 200) {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'Deleted successfully'
                    })
                } else {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'An error occured while deleting the group'
                    })
                }
                $('#messageModal').modal('toggle');
            } else if (!window || !window.confirm || window == undefined) {
                let response = await deleteAMresource(pm, 'group', pm.id);
                this.setState({
                    message: response?.data?.Message || response?.data?.statusText || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            }
        })();

        setTimeout(() => {
            if (window && window != undefined && window.location) {
                window.location.href = '/access-management/groups';
            }
        }, 4500);
    }

    commitGroupEdits() {
        (async () => {
            if (this.state.editMode) {
                let updateObj = {
                    ...this.state.editedGroup,
                    permissions: this.state.selectedPermissions
                }
                delete updateObj.created_at
                delete updateObj.updated_at
                this.setState({
                    editedGroup: updateObj,
                });
                let response = await updateAMresource(updateObj, 'group', updateObj.id || this.state.editedGroup.id);
                if (response.status === 200) {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'Updated successfully'
                    })
                } else {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'An error occured while updating the group'
                    })
                }
            } else {
                let response = await saveAMresource(this.state.editedGroup, 'group');
                if (response.status === 200) {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'Created successfully'
                    })
                } else {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'An error occured while creating the group'
                    })
                }
            }
            $('#formModal').modal('toggle');
            $('#messageModal').modal('toggle');
            this.setState({
                editMode: false
            });

            setTimeout(() => {
                if (window && window != undefined && window.location) {
                    window.location.href = '/access-management/groups';
                }
            }, 4500);
        })();
    }

    editGroup(group) {
        // if (typeof window !== 'undefined') {
        //     window.scrollTo(0, 0);
        //     window.document.getElementById('groupName').focus();
        // }
        this.setState({
            editedGroup: group,
            editMode: true
        });
        $('#formModal').modal('toggle');
    }

    updateEditMode(editMode) {
        this.setState({
            editMode: editMode,
        });
    }


    handlePermissionsChange(selectedItems) {
        this.setState({
            // selectedPermissions: Array.from(selectedItems, item => item.slug),
            editedGroup: {
                ...this.state.editedGroup,
                permissions: Array.from(selectedItems, item => item.slug)
            }
        });
    }

    onChange(currentNode, selectedNodes) {
        console.log("path::", currentNode.path);
    };

    toggleDisplay() {
        let booll = this.state.showUserTable;
        this.setState({
            showUserTable: !booll
        });
    }



    render() {

        let alertBox =
            <div className="modal fade" id="messageModal" tabIndex="-1" group="dialog" aria-labelledby="messageModalTitle" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered" group="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="messageModalTitle">Alert</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {
                                this.state.message ? this.state.message : ''
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div >

        return (
            <React.Fragment>
                {/* Page Heading */}
                <div className='row mb-3'>
                    <div className='col-md-6 text-left pull-left zd-sm-flex zalign-items-center'>
                        <a className='btn btn-link' href='/access-management/groups'>&larr; All groups</a>
                    </div>
                    <div className='col-md-6 text-left'>
                        <h1 className="text-bold">{this.state.editMode ? "Edit" : "Add"} group</h1>
                    </div>
                </div>
                <div className="col-md-12 m-1">
                    {/* <hr className='mb-7'/> */}
                    {/* ---- */}
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className="panel panel-default px-4 py-3" style={{backgroundColor: '#f7f7fa', borderRadius: '5px'}}>
                                <div className="panel-body">
                                    <div className='row'>
                                        <div className='col-md-10'>
                                            <div className='form-group text-center'>
                                                <label>Name</label>
                                                <input type='text' className='form-control' name='groupName' id='groupName' defaultValue={this.state.editedGroup.name || ''} onChange={ev => {
                                                    // this.state.editedGroup.name = ev.target.value;
                                                    this.setState({
                                                        editedGroup: {
                                                            ...this.state.editedGroup,
                                                            name: ev.target.value
                                                        }
                                                    });
                                                }} />
                                            </div>
                                        </div>
                                        <div className='col-md-2'>
                                            <div className='form-group text-center'>
                                                <label>Active?</label>
                                                <select className='form-control' defaultValue={this.state.editedGroup.is_active ? this.state.editedGroup.is_active : 1} onChange={ev => {
                                                    this.setState({
                                                        editedGroup: {
                                                            ...this.state.editedGroup,
                                                            is_active: parseInt(ev.target.value)
                                                        }
                                                    });
                                                }}>
                                                    <option value={1}>Yes</option>
                                                    <option value={0}>No</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="u_is_active" >Permissions</label>
                                        {(this.state.allPermissions && this.state.allPermissions.length > 0) && <>
                                            <MultiSelect
                                                items={Array.from(this.state.allPermissions.filter(r => { return r.is_active == 1 || r.is_active == true }), (ap, ax) => {
                                                    return {
                                                        id: ap.slug, //parseInt(ap.id),
                                                        label: ap.name
                                                    }
                                                })}
                                                // selectedItems={this.state.selectedPermissions}
                                                selectedItems={Array.from(this.state.selectedPermissions, sp => {
                                                    return {
                                                        id: sp,
                                                        label: this.state.allPermissions.find(p => p.slug == sp).name
                                                    }
                                                })}
                                                onChange={w=>this.setState({
                                                    selectedPermissions: Array.from(w, item => item.id)
                                                })}
                                                // onChange={this.handlePermissionsChange}
                                            />
                                            {/* <pre>All: {JSON.stringify(this.state.allPermissions)}</pre> */}
                                            {/* <pre>Picked: {JSON.stringify(this.state.selectedPermissions)}</pre> */}
                                        </>}
                                    </div>
                                </div>
                                <div className="panel panel-footer text-center">
                                    <button className='btn btn-primary' onClick={ev => {
                                        this.commitGroupEdits();
                                    }}>Save changes</button>
                                    {this.state.editMode && <button className='btn btn-link text-danger float-right' onClick={ev => {
                                        this.deleteGroup(this.state.editedGroup);
                                    }}>Delete group</button>}
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* ---- */}
                </div>
                {alertBox}

            </React.Fragment>
        );
    }

}

export default GroupsForm;

if (document.getElementById('groups_form')) {
    ReactDOM.render(<GroupsForm />, document.getElementById('groups_form'));
}