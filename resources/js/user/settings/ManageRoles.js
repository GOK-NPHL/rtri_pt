
import React from 'react';
import ReactDOM from 'react-dom';
import { FetchUserAuthorities, fetchCurrentUserParams, saveAMresource, updateAMresource, getAMresource, deleteAMresource, exportToExcel } from '../../components/utils/Helpers';
import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css"

class ManageRoles extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            showUserTable: true,
            roles: [],
            currentUser: {},
            allowedRoles: [],
            status: {},
            editedRole: {},
            editMode: false,
            allPermissions: [],
            selectedPermissions: [],
        }
        this.onChange = this.onChange.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.fetchRoles = this.fetchRoles.bind(this);
        this.deleteRole = this.deleteRole.bind(this);

    }

    fetchRoles() {
        (async () => {
            let returnedData = await getAMresource('roles');
            if (returnedData.status === 200) {
                this.setState({
                    roles: returnedData.data,
                });
            } else {
                this.setState({
                    roles: [],
                    message: returnedData.statusText || returnedData.message || 'An error occured while fetching roles'
                });
            }
        })();
    }

    componentDidMount() {
        //fetch roles
        (async () => {
            let returnedData = await getAMresource('roles');
            if (returnedData.status === 200) {
                this.setState({
                    roles: returnedData.data,
                });
            } else {
                this.setState({
                    roles: [],
                    message: returnedData.statusText || returnedData.message || 'An error occured while fetching roles'
                });
            }
        })();

        (async () => {
            try {
                let al_p = await getAMresource('permissions');
                if(al_p.status == 200){
                    this.setState({
                        allPermissions: al_p.data.filter(p => {return p.is_active == 1 || p.is_active == true}),
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

    componentDidUpdate(prevProps) {
        if (this.state.allowedRoles.length > 0) {
            if (this.state.allowedRoles.includes('view_role')) {
                if (this.props.roles != prevProps.roles) {
                    this.fetchRoles();
                }
            }
        }
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
                window.location.reload();
            }
        }, 3000);
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
        return (
            <React.Fragment>
                {/* Page Heading */}
                <div className="col-md-12 m-1">
                    <div className='row mb-3'>
                        <div className='col-md-9'>
                            <h1 className="text-bold">Roles</h1>
                            
                        </div>
                        <div className='col-md-3 text-right pull-right zd-sm-flex zalign-items-center'>
                            {/* <button onClick={ev => {
                                this.setState({
                                    editMode: false,
                                    editedRole: {
                                        name: '',
                                        is_active: true
                                    }
                                })
                                $('#formModal').modal('toggle');
                            }} className='btn btn-primary'>Add new role</button> */}
                            <a href='/access-management/roles/new' className='btn btn-primary'>Add new roles</a>
                        </div>
                    </div>
                    {/* <hr className='mb-7'/> */}
                    <div className='row'>
                        <div className='col-md-12'>
                            {this.state.roles && this.state.roles.length > 0 ?
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
                                                if (this.state.roles && this.state.roles.length > 0) {
                                                    let final_data = this.state.roles.map(element => {
                                                        return element
                                                    })
                                                    exportToExcel(final_data, 'Roles');
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
                                                <th>Permissions</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.roles.map((role, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className='text-center'>
                                                            {role.is_active == true || role.is_active == 1 ?
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
                                                        <td className='text-left'>{role.name}</td>
                                                        <td>{role.permissions ? <span title={
                                                            JSON.parse(role.permissions).join(', ').replaceAll('_', ' ')
                                                        }>
                                                            {JSON.parse(role.permissions).length}
                                                        </span> : 0}</td>
                                                        <td className='text-muted'>{
                                                            new Date(role.created_at).toLocaleString()
                                                        }</td>
                                                        <td>
                                                            <a href={'/access-management/roles/edit/'+role.id} className='btn btn-sm btn-info'>Edit</a>&nbsp;
                                                            <button className='btn btn-sm btn-danger' onClick={() => this.deleteRole(role)}>Delete</button>
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
                    {/* {roleCreateButton} */}
                </div>
                {/* {pageContent} */}
                {alertBox}
                {/* {<PopupTemplate
                    title={this.state.popupTitle}
                    children={this.state.popupContent}
                    actions={this.state.popupActions}
                />} */}


            </React.Fragment>
        );
    }

}

export default ManageRoles;

if (document.getElementById('manage_roles')) {
    ReactDOM.render(<ManageRoles />, document.getElementById('manage_roles'));
}