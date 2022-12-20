import React from 'react';
import { FetchPanel, FetchPanels, FetchParticipantList, SaveShipment, FetchShipmentReadiness, FetchShipmentById, UpdateShipment, FetchPanelsByReadinessId } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import './PtShipment.css';

import ReactTooltip from 'react-tooltip';
import { matchPath } from "react-router";


class ShipmentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            readinesses: [],
            isSubmitResult: false,
            dtObject: null,
            id: '',
            message: '',
            round: '',
            shipmentCode: '',
            resultDueDate: '',
            passMark: 100,
            testInstructions: '',
            dualListptions: [],
            readinessChecklists: [],
            pageState: '',
            panels: [],
            panel_ids: [],
            allPanelDetails: [],
            tempanel: null,
            surveyQns: [],
            newSurveyQn: {},
        }

        this.handleRoundChange = this.handleRoundChange.bind(this);
        this.handleShipmentCodeChange = this.handleShipmentCodeChange.bind(this);
        this.handleResultDueDateChange = this.handleResultDueDateChange.bind(this);
        this.handlePassMarkChange = this.handlePassMarkChange.bind(this);
        this.handlePanelChange = this.handlePanelChange.bind(this);
        this.handleTestInstructionsChange = this.handleTestInstructionsChange.bind(this);
        this.handleParticipantSourceChange = this.handleParticipantSourceChange.bind(this);
        this.dualListOnChange = this.dualListOnChange.bind(this);
        this.getShipementDataById = this.getShipementDataById.bind(this);
        this.addSurveyQn = this.addSurveyQn.bind(this);
        this.editSurveyQn = this.editSurveyQn.bind(this);
        this.deleteSurveyQn = this.deleteSurveyQn.bind(this);


    }

    getShipementDataById(id) {
        (async () => {

            let editData = await FetchShipmentById(id);
            if (editData.status == 500) {
                this.setState({
                    message: editData.data.Message,
                    pageState: 'edit',
                });
                $('#addPersonelModal').modal('toggle');
            } else {

                this.setState({
                    id: id,
                    round: editData.shipment.round_name,
                    shipmentCode: editData.shipment.code,
                    readiness_id: editData.shipment.readiness_id,
                    resultDueDate: editData.shipment.end_date,
                    passMark: editData.shipment.pass_mark,
                    testInstructions: editData.shipment.test_instructions,
                    surveyQns: Array.from(editData.survey_questions, q=>{
                        return {
                            ...q,
                            _id: uuidv4(),
                        }
                    }) || [],
                    pageState: 'edit',
                });

                let all_panels = Array.from(editData.shipment.ptpanel_ids, x => x);
                if (all_panels && all_panels.length > 0) {
                    all_panels.forEach((panel) => {
                        FetchPanel(panel).then((response) => {
                            // console.log('panel::::', response);
                            this.setState({
                                panel_ids: [...this.state.panel_ids, panel],
                                allPanelDetails: [...this.state.allPanelDetails, response]
                            });
                        });
                    });
                }

                FetchPanelsByReadinessId(editData.shipment.readiness_id).then((response) => {
                    if (response.status == 500) {
                        this.setState({
                            message: response.data.Message,
                        });
                        $('#addShipmentModal').modal('toggle');
                    } else {
                        this.setState({
                            panels: response
                        });
                    }
                });
            }
        })();
    }

    addSurveyQn = () => {
        // add this.state.newSurveyQn to this.state.surveyQns
        if (Object.keys(this.state.newSurveyQn).length === 0) {
            return;
        } else if (
            Object.keys(this.state.newSurveyQn).length > 0 && Object.keys(this.state.newSurveyQn).includes('question') && Object.keys(this.state.newSurveyQn).includes('question_type')
        ) {
            // if qn contains _id, then it is an edit
            if (Object.keys(this.state.newSurveyQn).includes('_id')) {
                let index = this.state.surveyQns.findIndex((qn) => qn._id === this.state.newSurveyQn._id);
                let surveyQns = [...this.state.surveyQns];
                surveyQns[index] = this.state.newSurveyQn;
                this.setState({
                    surveyQns: surveyQns,
                    newSurveyQn: {}
                });
            } else {
                this.setState({
                    surveyQns: [...this.state.surveyQns, {
                        ...this.state.newSurveyQn,
                        _id: uuidv4()
                    }],
                    newSurveyQn: {}
                });
            }
        }
    }

    editSurveyQn = (id) => {
        let qn2edit = this.state.surveyQns.find((qn) => qn._id === id);
        console.log(qn2edit);
        if (qn2edit) {
            this.setState({
                newSurveyQn: qn2edit
            });
            $('#surveyQnModal').modal('toggle');
        }else{
            return;
        }
        // modal
    }

    deleteSurveyQn = (uid) => {
        let qns = this.state.surveyQns
        let qn = this.state.surveyQns.find((qn) => qn._id === uid);
        if (!qn) {
            return;
        }
        let qn_index = this.state.surveyQns.findIndex((qn) => qn._id === uid);
        if(Object.keys(qn).includes('id')){
            qns[qn_index].delete = true;
        }else{
            qns = qns.filter((qn) => qn._id !== uid);
        }
        this.setState({
            surveyQns: qns
        });
    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentDidMount() {
        (async () => {
            let response = await FetchShipmentReadiness(1);
            this.setState({
                readinesses: response
            });
        })();

        (async () => {
            if (this.props.pageState == 'edit') {
                this.getShipementDataById(this.props.id);
            }
            else {
                this.setState({
                    pageState: this.props.pageState,
                    id: '',
                    message: '',
                    round: '',
                    shipmentCode: '',
                    resultDueDate: '',
                    passMark: 100,
                    testInstructions: '',
                    panel_ids: [],
                    readiness_id: '',
                });
            }
        })();
    }

    dualListOnChange(selected) {
        this.setState({ selected: selected });
    }

    handleChecklistChange(readinessId) {
        this.setState({ readiness_id: readinessId });
        FetchPanelsByReadinessId(readinessId).then((response) => {
            if (response.status == 500) {
                this.setState({
                    message: response.data.Message,
                });
                $('#addShipmentModal').modal('toggle');
            } else {
                this.setState({
                    panels: response
                });
            }
        });
    }

    handleParticipantSourceChange(participantSource) {

        if (participantSource == 'participants') {
            this.setState({
                participantSource: participantSource,
                readinessId: ''
            });
        } else if (participantSource == 'checklist') {
            this.setState({
                participantSource: participantSource,
                selected: []
            });
        }

    }
    handleRoundChange(round) {

        this.setState({
            round: round
        });
    }

    handleShipmentCodeChange(shipmentCode) {

        this.setState({
            shipmentCode: shipmentCode
        });
    }

    handleResultDueDateChange(resultDueDate) {
        let today = new Date();
        let rstlDate = Date.parse(resultDueDate);
        if (rstlDate < today) {
            this.setState({
                message: "Result due date cannot be less than todays date"
            });
            $('#addShipmentModal').modal('toggle');
            return;
        }

        this.setState({
            resultDueDate: resultDueDate
        });
    }

    handlePassMarkChange(passMark) {

        this.setState({
            passMark: passMark
        });
    }

    handleTestInstructionsChange(testInstructions) {

        this.setState({
            testInstructions: testInstructions
        });
    }


    saveShipment() {
        if (
            (!this.state.passMark || this.state.passMark == '') ||
            (!this.state.resultDueDate || this.state.resultDueDate == '') ||
            (!this.state.shipmentCode || this.state.shipmentCode == '') ||
            (!this.state.round || this.state.round == '') ||
            (!this.state.readiness_id || this.state.readiness_id == '') ||
            (!this.state.panel_ids || this.state.panel_ids.length == 0)

        ) {
            let msg = [
                <p>Please fix the following errors:</p>,
                <p>{(!this.state.passMark || this.state.passMark == '') ? <strong>Pass mark field</strong> : ''}</p>,
                <p>{(!this.state.resultDueDate || this.state.resultDueDate == '') ? <strong>Result Due Date field</strong> : ''}</p>,
                <p>{(!this.state.shipmentCode || this.state.shipmentCode == '') ? <strong>Shipement code field</strong> : ''}</p>,
                <p>{(!this.state.round || this.state.round == '') ? <strong>Round Name field</strong> : ''}</p>,
                <p>{(!this.state.readiness_id || this.state.readiness_id == '') ? <strong>Readiness checklist field</strong> : ''}</p>,
                <p>{(!this.state.panel_ids || this.state.panel_ids.length == 0) ? <strong>Panels field</strong> : ''}</p>,
            ]

            this.setState({
                message:
                    [
                        <p>Kindly fill the required fileds marked in *</p>,
                        <div>{msg}</div>
                    ]
            });
            $('#addShipmentModal').modal('toggle');
        } else {

            (async () => {
                let shipement = {};
                { this.state.pageState == 'edit' ? shipement['id'] = this.state.id : '' }
                shipement['pass_mark'] = this.state.passMark;
                shipement['result_due_date'] = this.state.resultDueDate;
                shipement['shipment_code'] = this.state.shipmentCode;
                shipement['round'] = this.state.round;
                // shipement['panel_id'] = this.state.panel_id;
                shipement['panel_ids'] = this.state.panel_ids;
                shipement['readiness_id'] = this.state.readiness_id;
                shipement['test_instructions'] = this.state.testInstructions;
                // survey questions
                shipement['survey_questions'] = this.state.surveyQns;

                if (this.state.pageState == 'edit') {
                    let response = await UpdateShipment(shipement);
                    this.setState({
                        message: response.data.Message,
                    });
                } else {
                    let response = await SaveShipment(shipement);
                    if (response.status == 200) {
                        this.setState({
                            message: response.data.Message,
                            passMark: 80,
                            resultDueDate: '',
                            shipmentCode: '',
                            round: '',
                            panel_ids: [],
                            testInstructions: '',
                            allPanelDetails: [],
                        });
                    } else {
                        this.setState({
                            message: response.data.Message,
                        });
                    }
                }
                $('#addShipmentModal').modal('toggle');
            })();
        }
    }

    handlePanelChange(panel) {
        if (panel) {
            this.setState({
                // panel_id: panel,
                panel_ids: this.state.panel_ids.includes(panel) ? this.state.panel_ids : [...this.state.panel_ids, panel]
            });
            FetchPanel(panel).then((response) => {
                if (!Array.from(this.state.allPanelDetails, p => p.name).includes(response.name) & !Array.from(this.state.allPanelDetails, p => p.id).includes(response.id)) {
                    this.setState({
                        allPanelDetails: this.state.allPanelDetails.includes(response) ? this.state.allPanelDetails : [...this.state.allPanelDetails, response]
                    });
                } else {
                    this.setState({
                        message: "Panel already added",
                    });
                    $('#addShipmentModal').modal('toggle');
                }
            });
        }
    }


    render() {
        let dualListValues = [];


        if (this.state.dualListptions.length != 0) {
            dualListValues = this.state.dualListptions.map((participant) => {
                let pat = {};
                pat['value'] = participant.id;
                pat['label'] = participant.lab_name;
                return pat;
            })
        }

        let checklists = [];
        if (this.state.readinessChecklists.length > 0) {
            this.state.readinessChecklists.map((checklist) => {
                checklists.push(<option key={checklist.id} value={checklist.id}>{checklist.name}</option>);
            });
        }

        return (
            <React.Fragment>

                <div className="row">
                    {/* <div className='col-md-3'>
                        <small>
                            <details open>
                                <summary>this.state</summary>
                                <pre>
                                    {JSON.stringify(this.state, null, 2)}
                                </pre>
                            </details>
                        </small>
                    </div>
                    <div className='col-md-9'> */}
                    <div className='col-md-12'>
                        <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                            <div className="card-body">

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_round" >Round Name *</label>
                                        <input
                                            value={this.state.round}
                                            onChange={(event) => this.handleRoundChange(event.target.value)} type="text"
                                            className="form-control" id="u_round" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_shipment_code" >Shipment Code *</label>
                                        <input
                                            value={this.state.shipmentCode}
                                            onChange={(event) => this.handleShipmentCodeChange(event.target.value)} type="text"
                                            className="form-control" id="u_shipment_code" />
                                    </div>

                                </div>


                                <div className="form-row">
                                    {/* add */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_result_due_date" >Result Due Date  *</label>
                                        <input
                                            value={this.state.resultDueDate}
                                            onChange={(event) => this.handleResultDueDateChange(event.target.value)}
                                            type="date" className="form-control" id="u_result_due_date" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_pass_mark" >Pass mark (%)*</label>

                                        <input
                                            min={0}
                                            max={100}
                                            value={this.state.passMark}
                                            onChange={(event) => this.handlePassMarkChange(event.target.value)}
                                            type="number" className="form-control" id="u_pass_mark" />
                                    </div>

                                </div>

                                <div className="form-row">

                                    <div className="col-sm-12 mb-3">
                                        <label htmlFor="test_instructions" >Testing Instructions</label>
                                        <textarea
                                            value={this.state.testInstructions}
                                            onChange={(event) => this.handleTestInstructionsChange(event.target.value)}
                                            className="form-control" id="test_instructions" rows="3"></textarea>
                                    </div>
                                </div>

                                {/* READINESS */}
                                <div className="form-row">
                                    <div className='col-md-12'>
                                        <div className="form-group">
                                            <label htmlFor="description">Readiness</label>
                                            <select className='form-control' id='readiness'
                                                value={this.state.readiness_id || ''} onChange={ev => {
                                                    this.handleChecklistChange(ev.target.value)
                                                }}>
                                                <option value=''>Select Readiness</option>
                                                {this.state.readinesses.length > 0 && this.state.readinesses.map((readiness, index) => {
                                                    return (
                                                        <option key={index} value={readiness.id}>{readiness.name}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* READINESS */}


                                {this.state.readiness_id && <div className="form-row bg-white p-2">
                                    <div className="col-sm-7  ml-2">
                                        <h5>Panel</h5>
                                        <hr />
                                        <div className="form-group w-100">
                                            <label htmlFor="panel">Select a panel {this.state.tempanel}</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <select data-dropup-auto="false" data-live-search="true" className="form-control" id="panel" name="panel"
                                                    onChange={(event) => {
                                                        this.setState({
                                                            tempanel: event.target.value
                                                        })
                                                    }}
                                                    // value={this.state?.panel_id || ''}>
                                                    value={this.state?.tempanel || ''}>
                                                    <option value="">Select a panel</option>
                                                    {this.state.panels.map((panel, index) => {
                                                        return <option key={index} value={panel.id}>{panel.name}</option>
                                                    })}
                                                </select>
                                                <div className="form-group w-100 mb-0">
                                                    <button className='btn btn-primary btn-sm' disabled={this.state.tempanel == null} onClick={() => {
                                                        if (this.state.tempanel) {
                                                            this.handlePanelChange(this.state.tempanel)
                                                            this.setState({
                                                                tempanel: ''
                                                            })
                                                        }
                                                    }}>Add panel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}


                                {(this.props.pageState == 'edit' || this.state.allPanelDetails.length > 0) && <div className="row mt-2 mb-2">
                                    <div className="col-sm-12 bg-white ml-2 pt-2 pb-2">
                                        <h5>Panel details</h5>
                                        <hr />
                                    </div>
                                </div>}
                                {this.state.allPanelDetails.length > 0 && this.state.allPanelDetails.map(panel => <div key={panel?.id + "_" + panel?.name} className="form-row bg-white p-2" style={{ fontSize: '15px' }}>
                                    <div className="col-sm-12 p-4" style={{ backgroundColor: 'papayawhip', border: '0px solid white', borderRadius: '5px' }}>
                                        <div className='row mb-0'>
                                            <div className='col-md-12 mb-3 p-0' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <span role={"button"} onClick={() => {
                                                    this.setState({
                                                        panel_ids: this.state.panel_ids.filter(p => p != panel.id),
                                                        allPanelDetails: this.state.allPanelDetails.filter(p => p.id != panel.id)
                                                    })
                                                }} className='fa-2x text-danger' style={{ lineHeight: '0px', cursor: 'pointer' }}>&times;</span>
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            <div className='col-sm-4'>
                                                <label>Panel name</label>
                                                <p>
                                                    <a href={`/panel/${panel.id}`}>{panel?.name || "-"}</a>
                                                </p>
                                            </div>
                                            <div className='col-sm-4'>
                                                <label>Created at</label>
                                                <p>{new Date(panel?.created_at).toLocaleString() || "-"}</p>
                                            </div>
                                            <div className='col-sm-4'>
                                                <label>Readiness Checklist</label>
                                                <p>
                                                    <a href={`/edit-readiness/${panel?.readiness?.id}`}>{panel?.readiness?.name || "-"}</a>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            <div className='col-sm-1' style={{ display: 'flex', alignItems: 'center' }}>
                                                <label>Lots</label>
                                            </div>
                                            <div className='col-sm-11'>
                                                <table className='table table-condensed table-bordered mb-2' style={{ backgroundColor: 'cornsilk' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ border: '1px solid #db8', textAlign: 'center' }}>Lot name</th>
                                                            <th style={{ border: '1px solid #db8', textAlign: 'center' }}># Participants</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {panel?.lots?.map((lot, index) => {
                                                            return <tr key={index}>
                                                                <td style={{ border: '1px solid #db8', textAlign: 'center' }}>
                                                                    <a href={`/lots/edit/${lot.id}`}>{lot?.name || "-"}</a>
                                                                </td>
                                                                <td style={{ border: '1px solid #db8', textAlign: 'center' }}>
                                                                    <a href={`/lots/${lot.id}/participants`}>{lot.participants.length || 0}</a>

                                                                </td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            <div className='col-sm-1' style={{ display: 'flex', alignItems: 'center' }}>
                                                <label>Samples</label>
                                            </div>
                                            <div className='col-sm-11'>
                                                <table className='table table-condensed table-bordered mb-2' style={{ backgroundColor: 'cornsilk' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ border: '1px solid #db8', textAlign: 'center' }}>Sample name</th>
                                                            <th style={{ border: '1px solid #db8', textAlign: 'center' }}>Reference result</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {panel?.samples?.map((sample, index) => {
                                                            return <tr key={index}>
                                                                <td style={{ border: '1px solid #db8', textAlign: 'center' }}>{sample.name}</td>
                                                                <td style={{ border: '1px solid #db8', textAlign: 'center' }}>{sample.reference_result || '-'}</td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>)}

                                <hr />
                                {/* <survey questions> */}
                                <div className="row mt-2 mb-2">
                                    <div className="col-sm-8">
                                        <h5>Survey questions</h5>
                                    </div>
                                    <div className="col-sm-4 text-right">
                                        {/* modal */}
                                        <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#surveyQnModal" id="surveyQnModalTrigger"> {this.state.newSurveyQn && (Object.keys(this.state.newSurveyQn).includes("_id")) ? "Edit" : "Add"} survey question</button>
                                        <div className="modal fade" id="surveyQnModal" tabIndex="-1" role="dialog" aria-labelledby="surveyQnModalLabel" aria-hidden="true">
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="surveyQnModalLabel">Add survey question</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body text-left">
                                                        <div className="form-group">
                                                            <label htmlFor="surveyQn">Question type</label>
                                                            <select className="form-control" id="surveyQn" value={
                                                                (this.state.newSurveyQn && this.state.newSurveyQn.question_type) ? this.state.newSurveyQn.question_type : ""
                                                            } onChange={(e) => {
                                                                this.setState({
                                                                    newSurveyQn: {
                                                                        ...this.state.newSurveyQn,
                                                                        question_type: e.target.value
                                                                    }
                                                                })
                                                            }}>
                                                                <option value=""> - Select - </option>
                                                                <option value="select">Dropdown</option>
                                                                <option value="text">Text</option>
                                                                <option value="number">Number</option>
                                                                <option value="date">Date</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="surveyQn">Question</label>
                                                            <input type="text" className="form-control" value={
                                                                (this.state.newSurveyQn && this.state.newSurveyQn.question) ? this.state.newSurveyQn.question : ""
                                                            } id="surveyQn" placeholder="Enter question" onChange={(e) => {
                                                                this.setState({
                                                                    newSurveyQn: {
                                                                        ...this.state.newSurveyQn,
                                                                        question: e.target.value
                                                                    }
                                                                })
                                                            }} />
                                                        </div>
                                                        {this.state.newSurveyQn && this.state.newSurveyQn?.question_type == "select" && <div className="form-group">
                                                            <label htmlFor="surveyQn">Options (pipe-separated)</label>
                                                            <input type="text" className="form-control" value={
                                                                (this.state.newSurveyQn && this.state.newSurveyQn.question_options) ? this.state.newSurveyQn.question_options.join('|') : ""
                                                            } id="surveyQn" placeholder="Enter options" onChange={(e) => {
                                                                this.setState({
                                                                    newSurveyQn: {
                                                                        ...this.state.newSurveyQn,
                                                                        question_options: Array.from(e.target.value.split('|'), o=>o.trim()) || []
                                                                    }
                                                                })
                                                            }} />
                                                        </div>}
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-sm text-muted" data-dismiss="modal">Cancel</button>
                                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                                            this.addSurveyQn()
                                                        }}>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        {/* list */}
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Type</th>
                                                    <th scope="col">Question</th>
                                                    {/* <th scope="col">Options</th> */}
                                                    <th scope="col" className='text-right'>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.surveyQns && this.state.surveyQns.length > 0 ? this.state.surveyQns.filter(q=>{
                                                    return (q?.deleted_at == null || q?.deleted_at == undefined) && (q?.delete == false || q?.delete == undefined)
                                                }).map((qn, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ textTransform: 'capitalize' }} title={qn?._id}>{qn.question_type}</td>
                                                            <td>{qn.question}</td>
                                                            {/* <td style={{ textTransform: 'capitalize' }}>{qn.question_options ? qn.question_options.join(',') : ""}</td> */}
                                                            <td className='text-right'>
                                                                <a href="#" onClick={() => {
                                                                    this.editSurveyQn(qn._id)
                                                                }} className="btn btn-sm btn-primary btn-xs">Edit</a> &nbsp;
                                                                <a href="#" onClick={() => {
                                                                    this.deleteSurveyQn(qn._id)
                                                                }} className="btn btn-sm btn-danger btn-xs">Delete</a>
                                                            </td>
                                                        </tr>
                                                    )
                                                }) : <tr><td colSpan="4" className="text-center">No questions added</td></tr>}
                                            </tbody>
                                        </table>
                                        {/* <div className="col-md-12">
                                            <pre>{JSON.stringify(this.state.surveyQns,null,2)}</pre>
                                        </div> */}
                                    </div>
                                </div>
                                {/* </survey questions> */}


                                <div className="form-group row mt-4">
                                    <div className="col-sm-12 text-center">
                                        <a href="#" onClick={() => this.saveShipment()} type="" className="d-inline m-2 btn btn-info m">

                                            {this.props.pageState == 'edit' ? "Update Shipment" : "Ship Round"}

                                        </a>
                                        <a
                                            onClick={() => {
                                                this.props.toggleView('list');
                                            }

                                            }
                                            className="d-inline m-2 btn btn-danger">Exit</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="addShipmentModal" tabIndex="-1" role="dialog" aria-labelledby="addShipmentModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addShipmentModalTitle">Notice!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    // this.state.message ? this.state.message : ''
                                    // check of array of elements
                                    this.state.message && Array.isArray(this.state.message) && this.state.message.length > 0 ? this.state.message.map((msg, index) => {
                                        return <React.Fragment key={index}>{msg}</React.Fragment>
                                    }) : this.state.message ? this.state.message : ''
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

export default ShipmentForm;