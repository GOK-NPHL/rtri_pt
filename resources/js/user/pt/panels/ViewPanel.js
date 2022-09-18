import React from 'react';
import ReactDOM from 'react-dom';
import { SaveAdminUser, FetchParticipantList, SaveReadiness } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
// import ReadinessForm from './ReadinessForm';

class ViewPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {


        return (
            <React.Fragment>
                View panel
            </React.Fragment>
        );
    }

}

export default ViewPanel;

if (document.getElementById('view_panels')) {
    ReactDOM.render(<ViewPanel />, document.getElementById('view_panels'));
}