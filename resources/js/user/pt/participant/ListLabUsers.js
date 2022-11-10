import React from 'react';
import ReactDOM from 'react-dom';
import Pagination from "react-js-pagination";
import { FetchLabUsers, SaveLabPersonelMgr, SwitchAccountActivity } from '../../../components/utils/Helpers';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            newUser: {
                name: '',
                second_name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: '',
                phone_number: '',
            }
        }
        this.createNewUser = this.createNewUser.bind(this);
        this.switchAccountActivity = this.switchAccountActivity.bind(this);

    }

    componentDidMount() {

        (async () => {
            let response = await FetchLabUsers();
            this.setState({
                data: response.participants,
                lab: response.lab
            })
        })();

    }

    createNewUser() {
        (async () => {

            // check that passwords match
            if (this.state.newUser.password !== this.state.newUser.password_confirmation) {
                alert('Passwords do not match');
                return;
            }

            let personel = {};
            personel['email'] = this.state.newUser.email;
            personel['first_name'] = this.state.newUser.name;
            personel['second_name'] = this.state.newUser.second_name ? this.state.newUser.second_name : null;
            personel['phone_number'] = this.state.newUser.phone_number;
            personel['password'] = this.state.newUser.password;
            personel['role'] = this.state.newUser.role;
            personel['has_qc_access'] = 1;
            personel['has_pt_access'] = 1;
            personel['is_active'] = 1;

            let response;

            response = await SaveLabPersonelMgr(personel);
            if (response.status == 200) {
                this.setState({
                    message: response.data.Message,
                    alertType: 'info',
                    newUser: {
                        name: '',
                        second_name: '',
                        email: '',
                        password: '',
                        password_confirmation: '',
                        role: '',
                        lab_id: '',
                        phone_number: '',
                    }
                });
            } else {
                this.setState({
                    message: response.data.Message,
                    alertType: 'danger'
                });
            }


            $('#addPersonelModal').modal('toggle');
        })();
    }


    switchAccountActivity(id) {
        (async () => {
            let response = await SwitchAccountActivity(id);
            if (response.status == 200) {
                this.setState({
                    message: response.Message,
                    alertType: 'info'
                });
            } else {
                this.setState({
                    message: response.Message,
                    alertType: 'info'
                });
            }
        })();
    }

    componentDidUpdate(prevProps, prevState) {

    }

    render() {


        return (
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            {this.state.message ? <div className={"alert alert-default-" + this.state.alertType} role="alert">
                                <div className='row'>
                                    <div className='col-md-11'>
                                        <p className='mb-0'>{this.state.message}</p>
                                    </div>
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div> : null}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <h3><b>{this.state.lab?.lab_name}</b> users</h3>
                        </div>
                        <div className="col-md-4">
                            {/* <a href="/user/pt/participant/create" className="btn btn-primary float-right">Add new user</a> */}

                            <a className="btn btn-primary float-right" data-toggle="modal" href='#addPersonelModal'>Add new user</a>
                            <div className="modal fade" id="addPersonelModal">
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header bg-light">
                                            <h4 className="modal-title">Add new user</h4>
                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                        </div>
                                        <form onSubmit={ev => {
                                            ev.preventDefault();
                                            console.log('saving ', this.state.newUser);
                                            // save new user
                                            this.createNewUser();
                                        }}>
                                            <div className="modal-body">
                                                {/* new user form */}
                                                <div className="form-group row">
                                                    <div className='col-md-3'>
                                                        <label htmlFor="name">Name</label>
                                                    </div>
                                                    <div className='col-md-7'>
                                                        <input required type="text" name="name" id="name" className="form-control" placeholder="Name" onChange={ev => {
                                                            this.setState({
                                                                newUser: {
                                                                    ...this.state.newUser,
                                                                    name: ev.target.value
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className='col-md-3'>
                                                        <label htmlFor="second_name">Second name</label>
                                                    </div>
                                                    <div className='col-md-7'>
                                                        <input required type="text" name="second_name" id="second_name" className="form-control" placeholder="Second Name" onChange={ev => {
                                                            this.setState({
                                                                newUser: {
                                                                    ...this.state.newUser,
                                                                    second_name: ev.target.value
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className='col-md-3'>
                                                        <label htmlFor="email">Email</label>
                                                    </div>
                                                    <div className='col-md-7'>
                                                        <input required type="text" name="email" id="email" className="form-control" placeholder="Email" onChange={ev => {
                                                            this.setState({
                                                                newUser: {
                                                                    ...this.state.newUser,
                                                                    email: ev.target.value
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className='col-md-3'>
                                                        <label htmlFor="email">Phone</label>
                                                    </div>
                                                    <div className='col-md-7'>
                                                        <input required type="text" name="phone" id="phone" className="form-control" placeholder="+254700100200" onChange={ev => {
                                                            this.setState({
                                                                newUser: {
                                                                    ...this.state.newUser,
                                                                    phone_number: ev.target.value
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className='col-md-3'>
                                                        <label htmlFor="password">Password</label>
                                                    </div>
                                                    <div className='col-md-7'>
                                                        <input required type="password" name="password" id="password" className="form-control" placeholder="Password" onChange={ev => {
                                                            this.setState({
                                                                newUser: {
                                                                    ...this.state.newUser,
                                                                    password: ev.target.value
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className='col-md-3'>
                                                        <label htmlFor="password_confirmation">Confirm Password</label>
                                                    </div>
                                                    <div className='col-md-7'>
                                                        <input required type="password" name="password_confirmation" id="password_confirmation" className="form-control" placeholder="Confirm Password" onChange={ev => {
                                                            this.setState({
                                                                newUser: {
                                                                    ...this.state.newUser,
                                                                    password_confirmation: ev.target.value
                                                                }
                                                            })
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className='col-md-3'>
                                                        <label htmlFor="role">Role</label>
                                                    </div>
                                                    <div className='col-md-7'>
                                                        <select required name="role" id="role" className="form-control" onChange={ev => {
                                                            this.setState({
                                                                newUser: {
                                                                    ...this.state.newUser,
                                                                    role: ev.target.value
                                                                }
                                                            })
                                                        }}>
                                                            <option value="participant">Participant</option>
                                                            <option value="lab_manager">Laboratory manager</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                                <button type="submit" className="btn btn-primary">Save changes</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            {/* <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(this.state.data, null, 2)}
                            </pre> */}
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone number</th>
                                        <th scope="col">Role</th>
                                        <th scope="col">Created</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name} {item.second_name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phone_number}</td>
                                            <td>{item.roles && item.roles.length > 0 ? item.roles[0].name : '-'}</td>
                                            <td>{new Date(item.created_at).toLocaleString('en-GB')}</td>
                                            <td>
                                                {(item.is_active == 1) ? <button onClick={ev => {
                                                    // Deactivate user
                                                    this.switchAccountActivity(item.id)
                                                }} className="btn btn-xs btn-outline-danger">Deactivate</button> : <button onClick={ev => {
                                                    // Activate user
                                                    this.switchAccountActivity(item.id)
                                                }} className="btn btn-xs btn-outline-success">Activate</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}


export default Dashboard;

if (document.getElementById('list_laboratory_users')) {
    ReactDOM.render(<Dashboard />, document.getElementById('list_laboratory_users'));
}