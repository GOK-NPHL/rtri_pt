import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchSampleResponseResultById } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import SubmitResults from '../participant/SubmitResults';

class ShipmentResponseForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/get-shipment-response-form/:submissionId`,
        });

        if (pathObject) {
            (async () => {

                let response = await FetchSampleResponseResultById(pathObject.params.submissionId);

                if (response.status == 500) {
                    this.setState({
                        message: response.data.Message,
                    })
                    $('#readinessReponseModal').modal('toggle');
                } else {
                    // let submission = null;
                    // for (const [key, element] of Object.entries(response)) {
                    //     submission = element;
                    // }
                    this.setState({
                        data: response
                    });

                }
            })();
        }

    }

    render() {
        console.log(this.state.data)
        return (
            <React.Fragment>
                {/* {this.state.data ? <SubmitResults
                    selectedElementHasSubmmisions={true}
                    shipment={this.state.data}
                    toggleView={() => { }}
                    isAdmin={true}
                /> : ''
                } */}
                {/* <details>
                    <summary>Data:</summary>
                    <pre style={{ padding: '8px', backgroundColor: 'thistle', borderRadius: '4px' }}>
                        {JSON.stringify(this.state.data, null, 2)}
                    </pre>
                </details> */}
                <div className='row'>
                    <div className='col-md-12'>
                        <h3>General information</h3>
                        {(this.state.data && this.state.data?.shipmentsResponses && this.state.data?.shipmentsResponses.length > 0) ? <table className='table table-condensed table-bordered'>
                            <thead className='text-center' style={{ verticalAlign: 'middle' }}>
                                <tr>
                                    <th>Field</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(this.state.data?.shipmentsResponses[0])
                                .filter(w=>!['id','lab_id','ptsubmission_id','survey_responses'].includes(w))
                                .map((key, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{textTransform: 'capitalize'}}>{key.split('_').join(' ').trim()}</td>
                                            <td style={{textTransform: 'capitalize'}}>{this.state.data?.shipmentsResponses[0][key] || '-'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table> : 'No data'}
                    </div>
                    <hr style={{borderColor: '#cfddcf', width: '100%'}}/>
                    <div className='col-md-12 mt-3'>
                        <h3>Results</h3>
                        <table className='table table-condensed table-bordered'>
                            <thead className='text-center' style={{ verticalAlign: 'middle' }}>
                                <tr>
                                    <th rowSpan={2}>Sample</th>
                                    <th colSpan={3}>Visual results</th>
                                    <th rowSpan={2}>Interpretation</th>
                                    <th rowSpan={2}>Expected</th>
                                </tr>
                                <tr>
                                    <th>Long-term</th>
                                    <th>Verification</th>
                                    <th>Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.data && this.state.data?.sample_results && this.state.data?.sample_results.length > 0) ? <>
                                    {this.state.data?.sample_results.map((sample, index) => {
                                        let expected = this.state.data?.reference_results.find(r => (r.sample_name == sample.sample_name && r.ref_panel_id == sample.panel_id))?.reference_result || '';
                                        return (
                                            <tr key={index}>
                                                <td>{sample.sample_name}</td>
                                                <td style={{ textTransform: 'uppercase' }}>{(sample.longterm_line == 1).toString()}</td>
                                                <td style={{ textTransform: 'uppercase' }}>{(sample.verification_line == 1).toString()}</td>
                                                <td style={{ textTransform: 'uppercase' }}>{(sample.control_line == 1).toString()}</td>
                                                <td style={{ textTransform: 'capitalize' }}>
                                                    {sample.result_interpretation == 'lt' ? 'Long-term' : (sample.result_interpretation == 'neg' ? 'Negative' : sample.result_interpretation)}
                                                </td>
                                                <td style={{ textTransform: 'capitalize' }}>
                                                    {expected == 'lt' ? 'Long-term' : (expected == 'neg' ? 'Negative' : expected)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </> : <tr><td colSpan='3'>No results</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <hr style={{borderColor: '#cfddcf', width: '100%'}}/>
                    <div className='col-md-12 mt-3 mb-5'>
                        <h3>Survey responses</h3>

                        <table className='table table-striped table-condensed table-bordered'>
                            <thead className='text-center' style={{ verticalAlign: 'middle' }}>
                                <tr>
                                    <th>Question</th>
                                    <th>Response</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.data && this.state.data.shipmentsResponses[0]?.survey_responses && this.state.data?.shipmentsResponses[0]?.survey_responses.length > 0) ? this.state.data.shipmentsResponses[0].survey_responses.map((question, index) => {
                                    return (
                                        <tr key={question.question_id}>
                                            <td>{question.question}</td>
                                            <td>{question.response}</td>
                                        </tr>
                                    )
                                }) : <tr><td colSpan='2'>No surveys/responses</td></tr>}
                            </tbody>
                        </table>

                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default ShipmentResponseForm;

if (document.getElementById('shipment_response_form')) {
    ReactDOM.render(<ShipmentResponseForm />, document.getElementById('shipment_response_form'));
}