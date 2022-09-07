
import React from 'react';
import ReactDOM from 'react-dom';
import { FetchUserAuthorities, fetchCurrentUserParams, saveAMresource, updateAMresource, getAMresource, deleteAMresource, exportToExcel } from '../../components/utils/Helpers';


const PopupTemplate = (title, children, actions) => {
    return (< div className="modal fade" id="customPopupModal" tabIndex="-1" role="dialog" aria-labelledby="customPopupModalTitle" aria-hidden="true" >
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="customPopupModalTitle">{title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    {actions}
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div >)
}

class ManageGroups extends React.Component {


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
        }
        this.onChange = this.onChange.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.fetchGroups = this.fetchGroups.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.editGroup = this.editGroup.bind(this);
        this.updateEditMode = this.updateEditMode.bind(this);

    }

    fetchGroups() {
        (async () => {
            let returnedData = await getAMresource('groups');
            if (returnedData.status === 200) {
                this.setState({
                    groups: returnedData.data,
                });
            } else {
                this.setState({
                    groups: [],
                    message: returnedData.statusText || returnedData.message || 'An error occured while fetching groups'
                });
            }
        })();
    }

    componentDidMount() {
        //fetch groups
        (async () => {
            let returnedData = await getAMresource('groups');
            if (returnedData.status === 200) {
                this.setState({
                    groups: returnedData.data,
                });
            } else {
                this.setState({
                    groups: [],
                    message: returnedData.statusText || returnedData.message || 'An error occured while fetching groups'
                });
            }
        })();

    }

    componentDidUpdate(prevProps) {
        if (this.state.allowedGroups.length > 0) {
            if (this.state.allowedGroups.includes('view_group')) {
                if (this.props.groups != prevProps.groups) {
                    this.fetchGroups();
                }
            }
        }
    }


    deleteGroup(pm) {
        (async () => {
            if (window && window.confirm("Are you sure you want to delete this commodity?")) {
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
                let response = await deleteCommodityById(id);
                this.setState({
                    message: response?.data?.Message || response?.data?.statusText || response?.message || 'Deleted successfully'
                })
                $('#messageModal').modal('toggle');
            }
        })();

        setTimeout(() => {
            if (window && window != undefined && window.location) {
                window.location.reload();
            }
        }, 3000);
    }

    commitGroupEdits() {
        (async () => {
            if (this.state.editMode) {
                let updateObj = {
                    ...this.state.editedGroup,
                }
                delete updateObj.created_at
                this.setState({
                    editedGroup: updateObj,
                });
            }
            this.setState({
                editedGroup: {
                    ...this.state.editedGroup,
                    slug: this.state.editedGroup.slug.toLowerCase() || this.state.editedGroup.name.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replaceAll(' ', '_')
                }
            });
            if (this.state.editMode) {
                let response = await updateAMresource(this.state.editedGroup, 'group', this.state.editedGroup.id);
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

            // setTimeout(() => {
            //     if (window && window != undefined && window.location) {
            //         window.location.reload();
            //     }
            // }, 3000);
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
        let formBox =
            <div className="modal fade" id="formModal" tabIndex="-1" role="dialog" aria-labelledby="formModalTitle" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formModalTitle">{this.state.editMode ? "Edit group" : "Add new group"}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body p-3">
                            {/* ---- */}
                            <div className='row'>
                                <div className='col-md-10'>
                                    <div className='form-group text-center'>
                                        <label>Name</label>
                                        <input type='text' className='form-control' name='groupName' id='groupName' defaultValue={this.state.editedGroup.name || ''} onChange={ev => {
                                            // this.state.editedGroup.name = ev.target.value;
                                            this.setState({
                                                editedGroup: {
                                                    ...this.state.editedGroup,
                                                    name: ev.target.value,
                                                    slug: ev.target.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replaceAll(' ', '_').replaceAll('__', '_')
                                                }
                                            });
                                        }} />
                                        <div className='col-md-12 p-1 text-left'>
                                            <small className='text-muted text-left'>Slug: <b>{this.state.editedGroup.slug || ''}</b></small>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className='form-group text-center'>
                                        <label>Active?</label>
                                        <select className='form-control' defaultValue={this.state.editedGroup.is_active} onChange={ev => {
                                            this.setState({
                                                editedGroup: {
                                                    ...this.state.editedGroup,
                                                    is_active: parseInt(ev.target.value)
                                                }
                                            });
                                        }}>
                                            <option value={null} disabled> - </option>
                                            <option value={1}>Yes</option>
                                            <option value={0}>No</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* ---- */}
                        </div>
                        <div className="modal-footer d-sm-flex justify-content-between">
                            <button className='btn btn-primary' onClick={ev => {
                                this.commitGroupEdits();
                            }}>Save changes</button>
                            <button type="button" className="btn btn-link text-muted" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div >
        return (
            <React.Fragment>
                {/* Page Heading */}
                <div className="col-md-12 m-1">
                    <div className='row mb-3'>
                        <div className='col-md-9'>
                            <h1 className="text-bold">Groups</h1>
                        </div>
                        <div className='col-md-3 text-right pull-right zd-sm-flex zalign-items-center'>
                            <button onClick={ev => {
                                this.setState({
                                    editMode: false,
                                    editedGroup: {
                                        name: '',
                                        is_active: true
                                    }
                                })
                                $('#formModal').modal('toggle');
                            }} className='btn btn-primary'>Add new group</button>
                        </div>
                    </div>
                    {/* <hr className='mb-7'/> */}
                    <div className='row'>
                        <div className='col-md-12'>
                            {this.state.groups && this.state.groups.length > 0 ?
                                <>
                                    <div className='row my-2'>
                                        <div className="col-md-10 form-group mb-2">
                                            {/* <input type="text"
                                                style={{ maxWidth: '300px' }}
                                                onChange={(event) => {
                                                    console.log(this.state.allTableElements);
                                                    let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                                        elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                                        elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                                        elemnt['props']['children'][3]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                                                    );
                                                    this.updatedSearchItem(currElementsTableEl);
                                                }}
                                                className="form-control" placeholder="Search"></input> */}
                                        </div>
                                        <div className='col-md-2 text-right'>
                                            <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                                                if (this.state.groups && this.state.groups.length > 0) {
                                                    let final_data = this.state.groups.map(element => {
                                                        return element
                                                    })
                                                    exportToExcel(final_data, 'Groups');
                                                } else {
                                                    console.error('No data to export');
                                                    alert('No data to export')
                                                }
                                            }}>
                                                <i className='fa fa-download'></i>&nbsp;
                                                Excel/CSV
                                            </button>
                                        </div>
                                    </div>
                                    <table className='table table-condensed'>
                                        <thead className='text-uppercase text-muted'>
                                            <tr>
                                                <th>Status</th>
                                                <th>Name</th>
                                                <th>Roles</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.groups.map((group, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className='text-center'>
                                                            {group.is_active == true || group.is_active == 1 ?
                                                                <>
                                                                    <i className='fa fa-check-circle text-success' title='Active'></i>&nbsp;
                                                                    <small className='text-muted'>Active</small>
                                                                </>
                                                                :
                                                                <>
                                                                    <i className='fa fa-times-circle text-danger'></i>&nbsp;
                                                                    <small className='text-muted'>Deactivated</small>
                                                                </>
                                                            }
                                                        </td>
                                                        <td className='text-left'>{group.name}</td>
                                                        <td>{group.roles ? <>
                                                            {JSON.parse(group.roles).length}
                                                        </> : 0}</td>
                                                        <td className='text-muted'>{
                                                            new Date(group.created_at).toLocaleString()
                                                        }</td>
                                                        <td>
                                                            <button className='btn btn-sm btn-info' onClick={() => this.editGroup(group)}>Edit</button>&nbsp;
                                                            <button className='btn btn-sm btn-danger' onClick={() => this.deleteGroup(group)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </> : <>

                                </>}
                        </div>
                    </div>
                    {/* {groupCreateButton} */}
                </div>
                {/* {pageContent} */}
                {alertBox}
                {formBox}
                {/* {<PopupTemplate
                    title={this.state.popupTitle}
                    children={this.state.popupContent}
                    actions={this.state.popupActions}
                />} */}


            </React.Fragment>
        );
    }

}

export default ManageGroups;

if (document.getElementById('manage_groups')) {
    ReactDOM.render(<ManageGroups />, document.getElementById('manage_groups'));
}