import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import SubmitResults from './SubmitResults'
import { FetchSubmissions } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';




const $ = require('jquery')
$.DataTable = require('datatables.net')

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null
        }
        this.toggleView = this.toggleView.bind(this);
    }

    componentDidMount() {

        (async () => {
            let response = await FetchSubmissions();
            console.log(response);
            this.setState({
                submissions: response
            })
        })();
        let dtObject = $("#tabella").DataTable({});
        this.setState({
            dtObject: dtObject
        })

    }


    toggleView() {
        this.setState({
            isSubmitResult: !this.state.isSubmitResult
        })
    }

    render() {
        let dashboardHeader = <div key={1} className="row mb-5">
            <div className="col-sm-6">
                <h1 className="m-0 text-dark">RTRI PT</h1>
            </div>
            <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="/dashboard">RTRI PT</a></li>
                    <li className="breadcrumb-item active">Dashboard</li>
                </ol>
            </div>
        </div>

        let dashboardTable = <div key={2} className="row">
            <div className="col-sm-12">
                <div className="col-sm-12 mb-5">
                    <h3 className="float-left">All Submissions</h3>
                    <div className="float-right">
                        <button onClick={() => {
                            this.setState({
                                isSubmitResult: true
                            })
                        }} type="button" className="btn btn-info">Submit result</button>
                    </div>
                </div>
                <table id="tabella">
                    <thead>
                        <tr>
                            <th>Scheme</th>
                            <th>Laboratory</th>
                            <th>Kit Date Received</th>
                            <th>Kit Lot No</th>
                            <th>Testing Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.submissions ?
                                this.state.submissions.map(submission => {
                                    return (
                                        <tr key={uuidv4()}>
                                            <td>RIRI QC</td>
                                            <td>EDARP</td>
                                            <td>{submission['kit_date_received']}</td>
                                            <td>{submission['kit_lot_no']}</td>
                                            <td>{submission['testing_date']}</td>
                                            <td>
                                                <a
                                                    href="#"
                                                    style={{ "display": "inlineBlock", 'marginRight': '5px' }}
                                                    className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm">
                                                    <i className="fas fa-user-edit"></i>
                                                </a>
                                                <a
                                                    style={{ "display": "inlineBlock" }}
                                                    className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm">
                                                    <i className="fas fa-user-times"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })
                                : ''
                        }


                    </tbody>
                </table>
            </div>
        </div>;

        let dashboardContent = [dashboardHeader, dashboardTable];
        if (this.state.isSubmitResult) {
            dashboardContent = <SubmitResults toggleView={this.toggleView} />
        }

        return (
            <React.Fragment>
                {dashboardContent}
            </React.Fragment>
        );
    }

}

export default Dashboard;

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}