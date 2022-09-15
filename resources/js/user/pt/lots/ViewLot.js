import React from 'react';
import ReactDOM from 'react-dom';
import { SaveAdminUser, FetchParticipantList, SaveReadiness } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
// import ReadinessForm from './ReadinessForm';

class ViewLot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {


        return (
            <React.Fragment>
                View lot
            </React.Fragment>
        );
    }

}

export default ViewLot;

if (document.getElementById('view_lots')) {
    ReactDOM.render(<ViewLot />, document.getElementById('view_lots'));
}