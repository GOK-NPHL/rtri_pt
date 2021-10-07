import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { SaveAdminUser } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import UserForm from './UserForm';


class EditUser extends React.Component {

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

export default EditUser;

if (document.getElementById('edit_admin_user')) {
    ReactDOM.render(<EditUser />, document.getElementById('edit_admin_user'));
}