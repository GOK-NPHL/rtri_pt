import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { FetchShipmentResponsesReport, FetchAdminParams } from '../../../components/utils/Helpers';
import ReactToPrint from "react-to-print";

import { matchPath } from "react-router";


class PTPerformanceReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rptCode: '',
            shipmentDate: '',
            specimenReceiptDate: '',
            kitLotNumber: '',
            labName: '',
            resultSubmissionDate: '',
            testingDate: '',
            kitExpiration: '',
            phoneNo: '',
            userName: '',
            userParams: {},
            adminParams: {},
            results: [],
            passMark: 100,
        }


    }

    componentDidMount() {
        // alert("pdf docuemnts 1")
        let pathname = window.location.pathname;
        let isPart = 0;
        let pathObject = matchPath(pathname, {
            path: `/get-shipment-response-performance/:submissionId`,
        });

        if (!pathObject) {
            pathObject = matchPath(pathname, {
                path: `/get-participant-shipment-response-performance/:submissionId`,
            });
            isPart = 1;
        }

        if (pathObject) {
            (async () => {

                let response = await FetchShipmentResponsesReport(pathObject.params.submissionId, isPart);

                if (response.status == 500) {
                    this.setState({
                        message: response.data.Message,
                    })
                    $('#readinessReponseReportModal').modal('toggle');
                } else {

                    this.setState({
                        data: response,
                        results: response['results'],
                        rptCode: response['metadata'][0].code,
                        shipmentDate: response['metadata'][0].shipment_date,
                        specimenReceiptDate: response['metadata'][0].kit_date_received,
                        passMark: response['metadata'][0].pass_mark,
                        kitLotNumber: response['metadata'][0].pt_lot_no,
                        labName: response['metadata'][0].lab_name,
                        resultSubmissionDate: response['metadata'][0].update_submission_date,
                        testingDate: response['metadata'][0].testing_date,
                        kitExpiration: response['metadata'][0].kit_expiry_date,
                        phoneNo: response['metadata'][0].phone_number,
                        userName: response['metadata'][0]?.fname + ' ' + response['metadata'][0]?.sname,
                    });

                }
            })();
        }

        (async () => {
            let response = await FetchAdminParams();
            this.setState({
                adminParams: response,
                // userName: (response?.user?.name || '')//+' '+(response?.user?.surname || ''),
            })
        })();
    }


    render() {
        const imgStyle = {
            width: "80px"
        };
        let tdtyle = {
            textAlign: 'left',
            verticalAlign: 'middle'
        }
        let paragraphStyle = {
            lineHeight: '17px',
            textAlign: 'left',
            marginBottom: '0px'
        }
        let borderLeft = {
            borderLeft: '1px solid #999'
        }
        let borderRight = {
            borderRight: '1px solid #999'
        }
        let totalTableLength = 8;

        let results = [];
        let isPassOverallScore = true;
        let passedScore = 0;
        let totalSamples = 0;
        this.state.results.map((data) => {
            let isPass = false;
            ///////// SCORING ///////////
            if (
                data.result_interpretation == data.reference_result
            ) {
                isPass = true;
                passedScore += 1;
            } else {
                isPassOverallScore = false;
            }
            // console.log('scoring', data.sample_name, '('+data.result_interpretation+' == '+data.reference_result+')', ' result: ', isPass);
            ///////// SCORING ///////////
            results.push(<tr className='' key={uuidv4()} style={{ textTransform: 'uppercase' }}>
                <td style={{...tdtyle, textAlign: 'center'}}>{data.sample_name}</td>
                {/* <td style={{ verticalAlign: 'middle', textTransform: 'uppercase' }}>{[data.control_line == 1 ? "Control line" : null, data.verification_line == 1 ? "Verification line" : null, data.longterm_line == 1 ? "Long-term line" : null].filter(n => n != null).join('; ')}</td> */}
                <td style={{ verticalAlign: 'middle', textTransform: 'uppercase', textAlign: 'center' }}>{data.result_interpretation ? data.result_interpretation : 'No Result'}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{data.reference_result}</td>
                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{isPass ? 'ACCEPTABLE' : 'UNACCEPATBE'}</td>
            </tr>);
            totalSamples += 1;
        })

        return (
            <React.Fragment>
                <div className='container'>
                    <div className='row' style={{ padding: '16px 4px' }}>
                        <div className='col-md-12 py-3'>
                            <ReactToPrint
                                documentTitle={"HIV Recency PT Report"}
                                trigger={() => <button className='btn btn-primary float-right'>Download report</button>}
                                content={() => this.componentRef}
                            />
                        </div>
                        <div className='col-md-12 w-100'>

                            <table className="table table-condensed" style={{ verticalAlign: 'middle' }}
                                ref={el => (this.componentRef = el)}>
                                <tbody >
                                    <tr >
                                        <td colSpan={totalTableLength}>
                                            <img style={imgStyle} src={this.props.chart1}></img>
                                        </td>
                                    </tr>
                                    <tr style={{ "fontWeight": "bold" }} >
                                        <td style={{ "lineHeight": "8px", padding: '8px', textAlign: 'center' }} colSpan={totalTableLength}>
                                            <h3>MINISTRY OF HEALTH</h3>
                                            <p>DEPARTMENT OF LABORATORY SERVICES</p>
                                            <p>NATIONAL PUBLIC HEALTH LABORATORIES</p>
                                            <p>NATIONAL HIV REFERENCE LABORATORY</p>
                                            <p style={{ "fontWeight": "normal" }}>P.O Box 20750 - 00202 NAIROBI</p>
                                            <h4><b>HIV RECENCY PROFICIENCY TESTING SCHEME REPORT</b></h4>
                                        </td>
                                    </tr>
                                    <tr style={{ "marginTop": "5px" }}>
                                        <td style={tdtyle}>
                                            <div><strong>Code:</strong> &nbsp;{this.state.rptCode}</div>
                                            <div><strong>Shipment Date:</strong> &nbsp; {this.state.shipmentDate}</div>
                                            <div><strong>Specimen Receipt Date:</strong> &nbsp; {this.state.specimenReceiptDate}</div>
                                            <div><strong>HIV Recency Lot No:</strong> &nbsp; {this.state.kitLotNumber}</div>
                                        </td>
                                        <td style={tdtyle}>
                                            <div><strong>Lab Name:</strong> &nbsp; {this.state.labName}</div>
                                            <div><strong>Result Submission Date:</strong> &nbsp; {this.state.resultSubmissionDate}</div>
                                            <div><strong>HIV Recency Expiry Date :</strong> &nbsp; {this.state.kitExpiration}</div>
                                        </td>
                                        <td style={tdtyle}>
                                            {true && <div style={{ textTransform: 'capitalize' }}><strong>Laboratory personnel testing:</strong> &nbsp; {this.state.userName}</div>}
                                            <div><strong>Phone No:</strong> &nbsp; {this.state.phoneNo}</div>
                                            <div><strong>Testing Date:</strong> &nbsp; {this.state.testingDate}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={totalTableLength}>
                                            <table className='table table-bordered'>
                                                <thead>
                                                    <tr style={{ "fontWeight": "bold" }} className=''>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }} rowSpan={2} >SAMPLE </th>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }} colSpan={2}> ANALYSIS </th>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }} rowSpan={2}>PERFORMANCE</th>
                                                    </tr>

                                                    <tr style={{ "fontWeight": "bold" }} className=''>
                                                        {/* <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Visual Result</th> */}
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Interpretation</th>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Expected</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {results}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={paragraphStyle} colSpan={totalTableLength}>
                                            <strong>Expert comment:</strong> Thank you for participating in KNEQAS HIV Recency PT.
                                            Your overall performance: Your EQA performance is <strong>
                                                {Math.round((passedScore / totalSamples) * 100)}&#37; {Math.round((passedScore / totalSamples) * 100) >= this.state.passMark ? 'ACCEPATBLE' : 'UNACCEPATBE'}
                                                </strong>. The
                                            expected performance outcome was {this.state?.passMark || 100}% whereby, each sample has an equal score.

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={paragraphStyle} colSpan={totalTableLength}>
                                            <p><strong>Testing scheme information:</strong></p>

                                            <ol className="report">
                                                <li>HIV Recency PT is a qualitative scheme.</li>
                                                <li>The panel samples come as dried samples.</li>
                                                <li>The PT samples have been fully characterised for the assigned qualitative HIV Recency status.</li>
                                                <li>The reference values are used to grade the participants.</li>
                                                <li>The panel samples have been tested for stability and are stable.</li>
                                                <li>Homogeneity was done using systematic random sampling and the results were the same as the expected results.</li>
                                                <li>Participants performance report is confidential and will only be shared with the<br /> responsible quality assurance officers for the participating laboratories and for any purpose of corrective interventions.</li>
                                                <li>Subcontracted services: PT panel distribution and return of results.</li>
                                                <li>The schemes final report with summaries of overall performance analysis are indicated below</li>
                                            </ol>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={totalTableLength}>
                                            <hr />
                                        </td>
                                    </tr>

                                    <tr style={paragraphStyle} >
                                        <td colSpan={4} style={{ "textAlign": "left", "marginBottom": "0px" }} >
                                            <strong>Documentation of Report Review:</strong>
                                            We the undersigned, have read and reviewed the above HIV Recency performance evaluation report. If the final score is less than {this.state?.passMark || 100}% we have downloaded the root cause analysis and corrective actions forms from ePT, completed, and attached them to this report. Performance report and any attachments must be filed and retained as documentation.
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={totalTableLength}>
                                            <hr />
                                        </td>
                                    </tr>

                                    {/* <tr><td><p></p></td></tr>
                                    <tr style={{ "fontWeight": "bold" }} >
                                        <td style={paragraphStyle} colSpan={totalTableLength}>
                                            <p>Kenya External Public Health Laboratory(KNEQAS)</p>
                                            <p>HIV Recency Proficiency Testing</p>
                                        </td>
                                    </tr>
                                    <tr style={{ "fontWeight": "bold" }} >
                                        <td style={paragraphStyle} colSpan={totalTableLength}>
                                            <p>KNEQAS QA: Charity Maina</p>
                                            <p>HIV SCOPE Coordinator: Nancy Bowen</p>
                                        </td>
                                    </tr>
                                    <tr><td><p></p></td></tr> */}

                                    <tr>
                                        <td colSpan={3}>
                                            <table className='table table-bordered' style={{ verticalAlign: 'middle' }}>
                                                <tbody>
                                                    <tr>
                                                        <td className='text-left '>
                                                            <p style={{ margin: 0, padding: '2px 7px' }}>
                                                                Nancy Bowen<br />
                                                                Head, National HIV Reference Laboratory<br />
                                                                Department of Laboratory Services - NPHL<br />
                                                                {/* P.O. Box 20750-00200<br />
                                                                Nairobi, Kenya<br /> */}
                                                                
                                                                Contact: 254722845874<br />
                                                            </p>
                                                        </td>
                                                        <td className='text-left '>
                                                            <p style={{ margin: 0, padding: '2px 7px' }}>
                                                                Christabel Awuor<br />
                                                                HIV Serology<br />
                                                                National HIV Reference Laboratory<br />
                                                                {/* P.O. Box 20750-00200<br />
                                                                Nairobi, Kenya<br /> */}
                                                                Contact: 254723777442
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={totalTableLength}>
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr style={{ "fontWeight": "bold" }} >
                                        <td>
                                            Final Report Authorized By:
                                        </td>
                                        <td>
                                            Date:
                                        </td>
                                    </tr>
                                    <tr style={{ "fontWeight": "bold" }} >
                                        <td style={paragraphStyle} >
                                            Final Results Released By:
                                        </td>
                                        <td style={paragraphStyle} >
                                            Date:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ padding: '14px 0 0' }} >
                                            <div style={{ borderTop: '1px solid #ccc', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span>MOH/DLS/NPHL/KNEQAS/HIV-RTRI/F/01</span>
                                                <span>Version <strong>1.1.0</strong></span>
                                                <span>Effective date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="readinessReponseReportModal" tabIndex="-1" role="dialog" aria-labelledby="readinessReponseReportModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="readinessReponseReportModalTitle">Notice!</h5>
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
            </React.Fragment>
        );
    }

}

export default PTPerformanceReport;

if (document.getElementById('pt_perfornance_report')) {
    // find element by id
    let domValues = [];
    let domValuesMap = {};
    const dataChart1 = document.getElementById('data-chart1');
    //const dataChart2 = document.getElementById('data-chart2');

    domValues.push(dataChart1.dataset);
    //domValues.push(dataChart2.dataset);

    domValues.forEach(element => {
        for (const property in element) {
            domValuesMap[property] = element[property];
        }
    });

    const props = Object.assign({}, domValuesMap);
    ReactDOM.render(<PTPerformanceReport {...props} />, document.getElementById('pt_perfornance_report'));
}