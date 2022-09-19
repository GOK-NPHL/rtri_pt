import React from 'react';
import { FetchPanel, FetchPanels, FetchParticipantList, SaveShipment, FetchShipmentReadiness as FetchReadiness, FetchShipmentById, UpdateShipment } from '../../../components/utils/Helpers';
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
            isSubmitResult: false,
            dtObject: null,
            id: '',
            message: '',
            round: '',
            shipmentCode: '',
            resultDueDate: '',
            passMark: 100,
            testInstructions: '',
            participantSource: 'checklist',
            dualListptions: [],
            readinessChecklists: [],
            selected: [],
            pageState: '',
            panels: [],
            panelDetails: null,
            panel_id: ''
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
                    resultDueDate: editData.shipment.end_date,
                    passMark: editData.shipment.pass_mark,
                    testInstructions: editData.shipment.test_instructions,
                    pageState: 'edit',
                });
            }
        })();
    }

    componentDidUpdate(prevProps, prevState) {
        // if (prevState.panelDetails != this.state.panelDetails) {
        //     this.setState({
        //         panelDetails: this.state.panelDetails
        //     });
        // }
    }

    componentDidMount() {
        (async () => {
            let panels = await FetchPanels();
            if (panels.status == 500) {
                this.setState({
                    message: panels.data.Message,
                });
                $('#addShipmentModal').modal('toggle');
            } else {
                this.setState({
                    panels: panels
                });
            }
        })();

        (async () => {
            if (this.props.pageState == 'edit') {
                this.getShipementDataById(this.props.id);
                FetchPanel(this.props.id).then((panel) => {
                    this.setState({
                        panelDetails: panel,
                        panel_id: panel.id,
                    });
                });
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
                        panel_id: '',
                    });
            }
        })();
    }

    dualListOnChange(selected) {
        this.setState({ selected: selected });
    }

    handleChecklistChange(readinessId) {
        this.setState({ readinessId: readinessId });
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
            (!this.state.panel_id || this.state.panel_id == '')

        ) {
            let msg = [
                <p>Please fix the following errors:</p>,
                <p>{(!this.state.passMark || this.state.passMark == '') ? <strong>Pass mark field</strong> : ''}</p>,
                <p>{(!this.state.resultDueDate || this.state.resultDueDate == '') ? <strong>Result Due Date field</strong> : ''}</p>,
                <p>{(!this.state.shipmentCode || this.state.shipmentCode == '') ? <strong>Shipement code field</strong> : ''}</p>,
                <p>{(!this.state.round || this.state.round == '') ? <strong>Round Name field</strong> : ''}</p>,
                <p>{(!this.state.panel_id || this.state.panel_id == '') ? <strong>Panel field</strong> : ''}</p>,
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
                shipement['panel_id'] = this.state.panel_id;
                shipement['test_instructions'] = this.state.testInstructions;

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
                            selected: [],
                            panel_id: '',
                            testInstructions: '',
                            panelDetails: null,
                            panels: [],
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
                panel_id: panel
            });
            FetchPanel(panel).then((response) => {
                this.setState({
                    panelDetails: response
                });
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

        let labSelect = <div>No checklist defined
            {/* . Readiness: {this.state.readinessId} */}
        </div>;
        if (this.state.pageState == 'edit' && this.state.readinessId && this.state.readinessId != '' && this.state.readinessId != null) {
            console.log('this.state.readinessId: ', this.state.readinessId);
            console.log('this.state.readinessChecklists: ', this.state.readinessChecklists);
            labSelect = <div> {this.state.readinessId}{JSON.stringify(this.state.readinessChecklists) || '~'} </div>
        }
        if (this.state.readinessChecklists.length != 0) {
            labSelect = <select
                id="u_readinessId"
                value={this.state.readinessId}
                onChange={(event) => this.handleChecklistChange(event.target.value)} type="text"
                data-dropup-auto="false"
                data-live-search="true"
                // className="selectpicker form-control dropup">
                className="form-control"
            >
                <option >Select checklist...</option>
                {checklists}
            </select>;
        }

        let participantList = <div key={uuidv4()} className="mt-3"
            style={{
                "display": this.state.participantSource == 'participants' ? '' : "none",
                "width": "80%"
            }} >
            <p style={{ "fontWeight": "700" }}>Choose participants:</p>
            <DualListBox
                canFilter
                options={dualListValues}
                selected={this.state.selected}
                onChange={this.dualListOnChange}
            />
        </div>

        let checklistParticipant = <div key={uuidv4()} className="mt-3"
            style={{
                "display": this.state.participantSource == 'checklist' ? '' : "none",
                "width": "50%"
            }}>
            <label htmlFor="u_readinessId" >Select Checklist *</label>
            {labSelect}
        </div>

        let participants = [participantList, checklistParticipant];
        if (this.state.pageState == 'edit') {
            if (this.state.participantSource == 'participants') {
                participants = [participantList];
            } else if (this.state.participantSource == 'checklist') {
                participants = [checklistParticipant];
            }
        }
        //  pageState: 'edit', participantSource: editData.shipment.readiness_id == null ? 'participants' : 'checklist'

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

                                <div className="form-row bg-white mb-3 pt-2 rounded hidden">
                                    {/* choose participant source */}
                                    <div className="col-sm-12 mb-3  ml-2">
                                        {this.state.pageState != 'edit' ?
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input"
                                                    checked={this.state.participantSource == 'checklist'}
                                                    type="radio" value="checklist" onChange={() => this.handleParticipantSourceChange('checklist')}
                                                    name="attach_participants" id="checklist" />
                                                <label className="form-check-label" htmlFor="checklist" >
                                                    Attach Checklist Sent to Laboratories
                                                </label>
                                            </div>
                                            : ''}
                                        {this.state.pageState != 'edit' ?
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio"
                                                    checked={this.state.participantSource == 'participants'}
                                                    value="participants" onChange={() => this.handleParticipantSourceChange('participants')}
                                                    name="attach_participants" id="participants" />
                                                <label className="form-check-label" htmlFor="participants" >
                                                    Select Laboratories
                                                </label>
                                            </div>
                                            : ''}

                                        {participants}

                                    </div>
                                    {/* End choose participant source */}
                                </div>





                                <div className="form-row bg-white p-2">
                                    <div className="col-sm-7  ml-2">
                                        <h5>Panel</h5>
                                        <hr />
                                        <div className="form-group w-100">
                                            <label htmlFor="panel">Select a panel</label>
                                            <select data-dropup-auto="false" data-live-search="true" className="form-control" id="panel" name="panel"
                                                onChange={(event) => this.handlePanelChange(event.target.value)}
                                                value={this.state?.panel_id || ''}>
                                                <option value="">Select a panel</option>
                                                {this.state.panels.map((panel, index) => {
                                                    return <option key={index} value={panel.id}>{panel.name}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                                {this.state.panelDetails && <div className="form-row bg-white p-2" style={{ fontSize: '15px' }}>
                                    <div className="col-sm-12  ml-2">
                                        <h5>Panel details</h5>
                                        <hr />
                                    </div>
                                    <div className="col-sm-12 p-4" style={{ backgroundColor: 'papayawhip', border: '0px solid white', borderRadius: '5px' }}>
                                        <div className='row mb-3'>
                                            <div className='col-sm-4'>
                                                <label>Panel name</label>
                                                <p>
                                                    <a href={`/panel/${this.state.panelDetails.id}`}>{this.state.panelDetails?.name || "-"}</a>
                                                </p>
                                            </div>
                                            <div className='col-sm-4'>
                                                <label>Created at</label>
                                                <p>{new Date(this.state.panelDetails?.created_at).toLocaleString() || "-"}</p>
                                            </div>
                                            <div className='col-sm-4'>
                                                <label>Readiness Checklist</label>
                                                <p>
                                                    <a href={`/edit-readiness/${this.state.panelDetails?.readiness?.id}`}>{this.state.panelDetails?.readiness?.name || "-"}</a>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row mb-3'>
                                            <div className='col-sm-2'>
                                                <label>Lots</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <table className='table table-condensed table-bordered' style={{ backgroundColor: 'cornsilk' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ border: '1px solid #db8', textAlign: 'center' }}>Lot name</th>
                                                            <th style={{ border: '1px solid #db8', textAlign: 'center' }}># Participants</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.panelDetails?.lots?.map((lot, index) => {
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
                                            <div className='col-sm-2'>
                                                <label>Samples</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <table className='table table-condensed table-bordered' style={{ backgroundColor: 'cornsilk' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ border: '1px solid #db8', textAlign: 'center' }}>Sample name</th>
                                                            <th style={{ border: '1px solid #db8', textAlign: 'center' }}>Reference result</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.panelDetails?.samples?.map((sample, index) => {
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
                                </div>}

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