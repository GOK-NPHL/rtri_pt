import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { SaveAdminUser } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import UserForm from './UserForm';


class AddUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {

    }

    render() {

        return (
            <UserForm />
        );
    }

}

export default AddUser;

if (document.getElementById('add_admin_user')) {
    ReactDOM.render(<AddUser />, document.getElementById('add_admin_user'));
}