import React from 'react';
import ReactDOM from 'react-dom';
import Pagination from "react-js-pagination";
import { FetchReadnessSurvey } from '../../../components/utils/Helpers';
import DashTable from './DashTable';
import SubmitResults from './SubmitResults';


class Readiness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {


        }

    }

    componentDidMount() {

        (async () => {
            let response = await FetchReadnessSurvey();
            this.setState({
                data: response
            })
        })();

    }


    render() {

        return (
            <React.Fragment>
                Hi
            </React.Fragment>
        );


    }
}


export default Readiness;

if (document.getElementById('readiness')) {
    ReactDOM.render(<Readiness />, document.getElementById('readiness'));
}