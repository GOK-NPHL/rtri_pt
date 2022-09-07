
import React from 'react';
import ReactDOM from 'react-dom';
import { FetchUserAuthorities, fetchCurrentUserParams, saveAMresource, updateAMresource, getAMresource, deleteAMresource, exportToExcel } from '../../components/utils/Helpers';
import {matchPath} from 'react-router';
import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css"

class RolesForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            showUserTable: true,
            roles: [],
            currentUser: {},
            allowedRoles: [],
            status: {},
            editedRole: {
                is_active: 1,
                name: '',
                permissions: []
            },
            editMode: false,
            allPermissions: [],
            selectedPermissions: [],
        }
        this.onChange = this.onChange.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.editRole = this.editRole.bind(this);
        this.updateEditMode = this.updateEditMode.bind(this);

    }

    componentDidMount() {
        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/access-management/roles/edit/:roleId`,
        });
        //fetch roles
        if(pathObject && pathObject.params.roleId){
            this.state.editMode = true;
            this.setState({
                editMode: true
            });
            (async () => {
                let returnedData = await getAMresource('role', pathObject.params.roleId);
                if (returnedData.status === 200) {
                    this.setState({
                        editedRole: returnedData.data,
                        selectedPermissions: JSON.parse(returnedData.data.permissions) || [],
                        editMode: true
                    });
                } else {
                    if (window && window != undefined && window.location) {
                        window.location.href = '/access-management/roles';
                    }
                    this.setState({
                        editedRole: {},
                        selectedPermissions: [],
                        message: returnedData.statusText || returnedData.message || 'An error occured while fetching roles'
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


    deleteRole(pm) {
        (async () => {
            if (window && window.confirm("Are you sure you want to delete this role?")) {
                let response = await deleteAMresource(pm, 'role', pm.id);
                if (response.status === 200) {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'Deleted successfully'
                    })
                } else {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'An error occured while deleting the role'
                    })
                }
                $('#messageModal').modal('toggle');
            } else if (!window || !window.confirm || window == undefined) {
                let response = await deleteAMresource(pm, 'role', pm.id);
                this.setState({
                    message: response?.data?.Message || response?.data?.statusText || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            }
        })();

        setTimeout(() => {
            if (window && window != undefined && window.location) {
                window.location.href = '/access-management/roles';
            }
        }, 4500);
    }

    commitRoleEdits() {
        (async () => {
            if (this.state.editMode) {
                let updateObj = {
                    ...this.state.editedRole,
                    permissions: this.state.selectedPermissions
                }
                delete updateObj.created_at
                delete updateObj.updated_at
                this.setState({
                    editedRole: updateObj,
                });
                let response = await updateAMresource(updateObj, 'role', updateObj.id || this.state.editedRole.id);
                if (response.status === 200) {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'Updated successfully'
                    })
                } else {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'An error occured while updating the role'
                    })
                }
            } else {
                let updateObj = {
                    ...this.state.editedRole,
                    permissions: this.state.selectedPermissions
                }
                let response = await saveAMresource(updateObj, 'role');
                if (response.status === 200) {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'Created successfully'
                    })
                } else {
                    this.setState({
                        message: response?.data?.Message || response?.data?.statusText || response?.message || 'An error occured while creating the role'
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
                    window.location.href = '/access-management/roles';
                }
            }, 4500);
        })();
    }

    editRole(role) {
        // if (typeof window !== 'undefined') {
        //     window.scrollTo(0, 0);
        //     window.document.getElementById('roleName').focus();
        // }
        this.setState({
            editedRole: role,
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
            editedRole: {
                ...this.state.editedRole,
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
            <div className="modal fade" id="messageModal" tabIndex="-1" role="dialog" aria-labelledby="messageModalTitle" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered" role="document">
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
                        <a className='btn btn-link' href='/access-management/roles'>&larr; All roles</a>
                    </div>
                    <div className='col-md-6 text-left'>
                        <h1 className="text-bold">{this.state.editMode ? "Edit" : "Add"} role</h1>
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
                                                <input type='text' className='form-control' name='roleName' id='roleName' defaultValue={this.state.editedRole.name || ''} onChange={ev => {
                                                    // this.state.editedRole.name = ev.target.value;
                                                    this.setState({
                                                        editedRole: {
                                                            ...this.state.editedRole,
                                                            name: ev.target.value
                                                        }
                                                    });
                                                }} />
                                            </div>
                                        </div>
                                        <div className='col-md-2'>
                                            <div className='form-group text-center'>
                                                <label>Active?</label>
                                                <select className='form-control' defaultValue={this.state.editedRole.is_active ? this.state.editedRole.is_active : 1} onChange={ev => {
                                                    this.setState({
                                                        editedRole: {
                                                            ...this.state.editedRole,
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
                                        this.commitRoleEdits();
                                    }}>Save changes</button>
                                    {this.state.editMode && <button className='btn btn-link text-danger float-right' onClick={ev => {
                                        this.deleteRole(this.state.editedRole);
                                    }}>Delete role</button>}
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

export default RolesForm;

if (document.getElementById('roles_form')) {
    ReactDOM.render(<RolesForm />, document.getElementById('roles_form'));
}