import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { EvaluateSubmission, FetchShipmentResponses, EvaluateShipment } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";

class ShipmentResponses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            message: '',
            currElementsTableEl: [],
            allTableElements: [],
            selectedElement: null,
            allowedPermissions: [],
            userActionState: 'userList',
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
            shipmentId: null,
            is_evaluating: false,
        }
        this.handlePageChange = this.handlePageChange.bind(this)
    }

    componentDidMount() {
        let pathname = window.location.pathname;

        let pathObject = matchPath(pathname, {
            path: `/get-shipment-responses/:shipmentId`,
        });

        // if (this.props.page == 'report') {
        if (!pathObject || pathObject == null) {
            pathObject = matchPath(pathname, {
                path: `/get-shipment-report-responses/:shipmentId`,
            });
        }

        if (pathObject) {
            (async () => {

                this.setState({
                    shipmentId: pathObject.params.shipmentId
                })
                let response = await FetchShipmentResponses(pathObject.params.shipmentId, this.props.userId);
                if (response.status == 500) {
                    this.setState({
                        message: response.data.Message,
                    })
                    $('#readinessReponseModal').modal('toggle');
                } else {

                    this.setState({
                        data: response
                    });

                }
            })();
        }

    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        let pgNumber = pageNumber * 10 + 1;
        this.setState({
            startTableData: pgNumber - 11,
            endeTableData: pgNumber - 1,
            activePage: pageNumber
        });
    }

    updatedSearchItem(currElementsTableEl) {
        this.setState({
            currElementsTableEl: currElementsTableEl,
            activePage: 1,
            startTableData: 0,
            endeTableData: 10,
        })
    }

    render() {
        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        let tableElem = [];

        if (this.state.data.length > 0) {

            this.state.data.map((element, index) => {
                tableElem.push(<tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{element.fname} {element.sname}</td>
                    <td>{element.lab_name}</td>
                    <td>{element.name}</td>
                    <td>{element.code}</td>
                    <td>{element.created_at}</td>
                    <td>{element.updated_at}</td>
                    <td>{element.score}{!isNaN(element.score) ? '%' : ''}</td>
                    <td>
                        {element.pt_submission_file_id ? <a href={window.location.origin + '/api/resources/files/download/' + element.pt_submission_file_id} target="_blank" download={element.pt_submission_file_name}>{"File_" + element.pt_submission_file_id}</a> : <span className="badge badge-dark">No File</span>}
                    </td>

                    {
                        //lab_id   id
                        <td>

                            {
                                this.props.page == 'report' ?
                                    <>
                                        <a
                                            onClick={() => {
                                                window.location.assign('/get-shipment-response-performance/' + element.ptsubmission_id)
                                            }}
                                            data-toggle="tooltip" data-placement="top" title="View performance report"
                                            className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white m-1">
                                            <i className="fas fa-file-pdf"></i> View Performance
                                        </a> &nbsp;
                                        <a
                                            onClick={() => {
                                                window.location.assign('/get-shipment-response-form/' + element.ptsubmission_id)
                                            }}
                                            data-toggle="tooltip" data-placement="top" title="View responses"
                                            className="d-none d-sm-inline-block btn btn-sm btn-light shadow-sm m-1">
                                            <i className="fas fa-eye"></i> View Response
                                        </a> &nbsp;
                                        <a
                                            onClick={() => {
                                                EvaluateSubmission(element.ptsubmission_id).then(res => {
                                                    if (res.error) {
                                                        alert("Evaluation failed")
                                                    } else {
                                                        alert("Evaluation successful")
                                                        window.location.reload()
                                                    }
                                                })
                                            }}
                                            className="d-none d-sm-inline-block btn btn-sm btn-dark text-light shadow-sm m-1">
                                            {element.evaluation_id ? "Re-evaluate" : "Evaluate"}
                                        </a>
                                    </>
                                    :
                                    <a
                                        onClick={() => {
                                            window.location.assign('/get-shipment-response-form/' + element.ptsubmission_id)
                                        }}
                                        data-toggle="tooltip" data-placement="top" title="View responses"
                                        className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                        <i className="fas fa-eye"></i>
                                    </a>
                            }

                        </td>
                    }

                </tr>
                );
            });
            if (this.state.allTableElements.length == 0) {
                this.setState({
                    allTableElements: tableElem,
                    currElementsTableEl: tableElem
                })
            }
        } else {
            tableElem.push(<tr key={1}>
                <th scope="row">{1}</th>
                <td colSpan={7}>No submissions done</td>
            </tr>)

        }



        let pageContent = <div id='user_table' className='row'>
            <div className="col-md-12 mb-3 mt-3">
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="float-left">Shipment response list</h3>
                    </div>
                    <div className="col-md-4">
                        {this.state.shipmentId && <button className='btn btn-primary btn-sm btn-dark text-white' onClick={() => {
                            this.setState({
                                is_evaluating: true
                            })
                            EvaluateShipment(this.state.shipmentId).then(res => {
                                if (res.error) {
                                    alert("Evaluation failed: " + (res?.count ? res.count : "No") + " submissions evaluated. " + (res?.error || ""))
                                } else {
                                    alert("Evaluation successful. " + (res?.count ? res.count : "All") + " submissions evaluated")
                                    window.location.reload()
                                }
                                this.setState({
                                    is_evaluating: false
                                })
                            })
                        }} disabled={this.state.is_evaluating}>{this.state.is_evaluating ? "Evaluating..." : "Evaluate all submissions"}</button>}
                    </div>
                    <div className="col-md-4">
                        <button style={{ "color": "white" }} type="button"
                            className="btn btn-success float-right"
                            onClick={() => {
                                this.props.page == 'report' ?
                                    window.location.assign('/pt-shipment-report-list') :
                                    window.location.assign('/pt-shipment')
                            }}>
                            ← back
                        </button>
                    </div>
                </div>
            </div>
            <div className='col-sm-12 col-md-12'>
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][3]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][4]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][5]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][6]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control" placeholder="search reponse"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Participant name</th>
                            <th scope="col">Responded by</th>
                            <th scope="col">Round name</th>
                            <th scope="col">Shipment code</th>
                            <th scope="col">Date responded</th>
                            <th scope="col">Date updated</th>
                            <th scope="col">Score</th>
                            <th scope="col">PT Files</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currElementsTableEl.slice(this.state.startTableData, this.state.endeTableData)}
                    </tbody>

                </table>
                <br />
                <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.currElementsTableEl.length}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                />
            </div>
        </div>;

        return (
            <React.Fragment>
                {pageContent}

                < div className="modal fade" id="readinessReponseModal" tabIndex="-1" role="dialog" aria-labelledby="readinessReponseModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="readinessReponseModalTitle">Notice!</h5>
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

export default ShipmentResponses;
