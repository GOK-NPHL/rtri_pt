import React from 'react';
import ReactDOM from 'react-dom';
import { FetchReadinessById, FetchParticipantList, SaveReadiness, UpdateReadiness, FetchDefaultReadinessQn } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import AddReadinessQuestion from './AddReadinessQuestion';
import { matchPath } from "react-router";

class ReadinessForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            message: '',
            id: '',
            name: '',
            startDate: '',
            endDate: '',
            selected: [],
            askDefaultQuestion: 0,
            no_lots: 1,
            dualListptions: [],
            readinessQuestions: [],
            readinessItems: [],
            pageState: 'add',
            submitting: false,
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.removeQn = this.removeQn.bind(this);
        this.handleDefaultQnChange = this.handleDefaultQnChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.authoritiesOnChange = this.authoritiesOnChange.bind(this);
        this.addReadinessQuestion = this.addReadinessQuestion.bind(this);

    }

    componentDidMount() {


        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/edit-readiness/:readinessId`,
        });


        (async () => {

            let partsList = await FetchParticipantList();
            if (pathObject) {
                let editData = await FetchReadinessById(pathObject.params.readinessId);
                if (editData.status == 500) {
                    this.setState({
                        message: editData.data.Message,
                        pageState: 'edit',
                    });
                    $('#addPersonelModal').modal('toggle');
                } else {

                    editData.payload.questions.map((questionItem) => {
                        this.addReadinessQuestion(questionItem);
                    });
                    this.setState({
                        id: editData?.payload?.readiness[0]?.id,
                        dualListptions: partsList,
                        name: editData?.payload?.readiness[0]?.name,
                        askDefaultQuestion: editData?.payload?.readiness[0]?.ask_default_qn == 1 ? true : false,
                        startDate: editData?.payload?.readiness[0]?.start_date,
                        endDate: editData?.payload?.readiness[0]?.end_date,
                        no_lots: editData?.payload?.lots.length || 1,
                        selected: editData?.payload?.labs,
                        pageState: 'edit',
                    });
                }
            } else {
                this.setState({
                    dualListptions: partsList,
                });
            }

        })();


    }

    handleNameChange(name) {
        this.setState({
            name: name
        });
    }

    handleStartDateChange(startDate) {

        try {
            if (this.state.endDate != null && this.state.endDate.length != 0) {
                let srtDate = Date.parse(startDate);
                let enDate = Date.parse(this.state.endDate);
                if (srtDate > enDate) {
                    this.setState({
                        message: "Start date cannot be greater than end date",
                        startDate: this.state.startDate
                    });
                    $('#addAdminUserModal').modal('toggle');
                    return;
                }
            }
        } catch (err) {

        }

        this.setState({
            startDate: startDate
        });
    }

    handleDefaultQnChange(checked) {
        console.log('handleDefaultQnChange: ', checked);
        try {
            if (checked && (this.state.readinessQuestions.length == 0 || this.state.readinessQuestions.indexOf(q => q.is_default == true) == -1)) {
                let defaultQns = FetchDefaultReadinessQn();
                defaultQns.then((data) => {
                    data.map((questionItem) => {
                        this.addReadinessQuestion({
                            is_default: true,
                            ...questionItem
                        });
                    });
                });
                this.setState({
                    askDefaultQuestion: checked
                });
            } else {
                // remove default questions
                let newReadinessQuestions = this.state.readinessQuestions.filter((question) => {
                    // return (question?.is_default != 1);
                    return (question?.props['data-default'] == undefined || question?.props['data-default'] != 1);
                });
                let newReadinessItems = this.state.readinessItems.filter((questionItem) => {
                    return (questionItem?.is_default != 1);
                });
                console.log('newReadinessQuestions: ', newReadinessQuestions);
                this.setState({
                    readinessQuestions: newReadinessQuestions.filter(n => n != null),
                    readinessItems: newReadinessItems.filter(n => n != null),
                    askDefaultQuestion: checked
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    handleEndDateChange(endDate) {
        try {
            if (this.state.startDate != null && this.state.startDate.length != 0) {
                let srtDate = Date.parse(this.state.startDate);
                let enDate = Date.parse(endDate);
                if (srtDate > enDate) {
                    this.setState({
                        message: "Start date cannot be greater than end date",
                        startDate: this.state.endDate
                    });
                    $('#addAdminUserModal').modal('toggle');
                    return;
                }
            }
        } catch (err) {

        }

        this.setState({
            endDate: endDate
        });
    }

    removeQn(itemIndex) {
        console.log('removeQn: ', itemIndex);
        let readinessItems = this.state.readinessItems;
        let questions = this.state.readinessQuestions;

        if (this.state.pageState == 'edit') { //for edit mark as one to be deleted from controller and database
            let qItem = readinessItems[itemIndex];
            qItem['delete_status'] = 1;
            readinessItems[itemIndex] = qItem;
        } else {
            // readinessItems[itemIndex] = null;
            readinessItems = readinessItems.filter((item, index) => {
                return index != itemIndex;
            });
        }

        // questions[itemIndex] = null;
        questions = questions.filter((item, index) => {
            return index != itemIndex;
        });

        this.setState({
            readinessQuestions: questions,
            readinessItems: readinessItems
        })
    }

    authoritiesOnChange(selected) {
        this.setState({ selected: selected });
    }

    addReadinessQuestion(readiness) {

        let rdItems = this.state.readinessItems;
        rdItems.push(readiness);
        let itemIndex = rdItems.length - 1;
        readiness['delete_status'] = 0;
        if (readiness['qustion_type'] == 'question') {

            if (readiness['answer_type'] == 'list') {
                let id = uuidv4();
                let qstOptins = readiness['answer_options'].split(',');
                let qstElement =
                    <div key={id} data-default={readiness?.is_default ? "1" : null} className="card">
                        <div className="card-body">
                            <div className="form-group text-left">
                                {!readiness.is_default && <a href="#" onClick={
                                    (event) => {
                                        event.preventDefault();
                                        this.removeQn(itemIndex);
                                    }
                                }
                                    className="float-right" style={{ padding: '2px', fontSize: '22px', lineHeight: 0, color: 'red', fontWeight: 'bold' }}>
                                    &times;
                                </a>}
                                <label className="float-left text-left" style={{ fontSize: '18px' }} htmlFor={id + "qst_answer"}>{readiness['question']}  <span style={{ color: 'red' }}>{(readiness['is_required'] && parseInt(readiness['is_required']) == 1) ? "*" : ""}</span></label>
                                <select
                                    className="custom-select" id={id + "qst_answer"}>
                                    {qstOptins.map((option) => {
                                        return <option key={uuidv4()} value={option}>{option}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                let questions = this.state.readinessQuestions;
                questions.push(qstElement);
                this.setState({
                    readinessQuestions: questions.filter(n => n != null),
                    readinessItems: rdItems.filter(n => n != null)
                })
            } else if (readiness['answer_type'] == 'number') {
                let id = uuidv4();
                let qstElement =
                    <div key={id} data-default={readiness?.is_default ? "1" : null} className="card">
                        <div className="card-body">
                            <div className="form-group">
                                <a href="#" onClick={
                                    (event) => {
                                        event.preventDefault();
                                        let readinessItems = this.state.readinessItems;
                                        let questions = this.state.readinessQuestions;
                                        questions[itemIndex] = null;
                                        if (this.state.pageState == 'edit') { //for edit mark as one to be deleted from controller and database
                                            let qItem = readinessItems[itemIndex];
                                            qItem['delete_status'] = 1;
                                            readinessItems[itemIndex] = qItem;
                                        } else {
                                            readinessItems[itemIndex] = null;
                                        }
                                        this.setState({

                                            readinessQuestions: questions,
                                            readinessItems: readinessItems
                                        })
                                    }
                                }
                                    className="float-right" style={{ padding: '2px', fontSize: '22px', lineHeight: 0, color: 'red', fontWeight: 'bold' }}>
                                    &times;</a>
                                <label className="float-left" htmlFor={id + "qst_answer"}>{readiness['question']} <span style={{ color: 'red' }}>{(readiness['is_required'] && parseInt(readiness['is_required']) == 1) ? "*" : ""}</span></label>
                                <input type="number" className="form-control" id={id + "qst_answer"} aria-describedby="qst_answer" placeholder="Enter your answer" />
                            </div>
                        </div>
                    </div>
                let questions = this.state.readinessQuestions;
                questions.push(qstElement);
                this.setState({
                    readinessQuestions: questions,
                    readinessItems: rdItems
                })
            }

        } else if (readiness['qustion_type'] == 'comment') {
            let id = uuidv4();
            let qstElement =
                <div className="form-group" data-default={readiness?.is_default ? "1" : null}>
                    <a href="#" onClick={
                        (event) => {
                            event.preventDefault();
                            let readinessItems = this.state.readinessItems;
                            let questions = this.state.readinessQuestions;

                            questions[itemIndex] = null;

                            if (this.state.pageState == 'edit') { //for edit mark as one to be deleted from controller and database
                                let qItem = readinessItems[itemIndex];
                                qItem['delete_status'] = 1;
                                readinessItems[itemIndex] = qItem;
                            } else {
                                readinessItems[itemIndex] = null;
                            }

                            this.setState({

                                readinessQuestions: questions,
                                readinessItems: readinessItems
                            })
                        }
                    }
                        className="float-right" style={{ "color": "red" }}>Delete</a>
                    <label className="float-left" htmlFor={id + "qst_answer"}>{readiness['question']}</label>
                    <textarea className="form-control" id={id + "qst_answer"} aria-describedby="qst_answer" placeholder="Enter your comment" />
                </div>
            let questions = this.state.readinessQuestions;
            questions.push(qstElement);
            this.setState({
                readinessQuestions: questions,
                readinessItems: rdItems
            })
        }

    }

    saveReadiness() {
        this.setState({
            submitting: true
        });
        if (
            this.state.name == '' ||
            this.state.start_date == '' ||
            this.state.end_date == '' ||
            this.state.selected.length == 0 ||
            this.state.readinessQuestions.length == 0

        ) {
            this.setState({
                message: "Kindly fill all fields marked * in the form",
                submitting: false
            })
            $('#addAdminUserModal').modal('toggle');
        } else {
            (async () => {
                let readiness = {};

                { this.state.pageState == 'edit' ? readiness['id'] = this.state.id : '' }
                readiness['name'] = this.state.name;
                readiness['start_date'] = this.state.startDate;
                readiness['end_date'] = this.state.endDate;
                readiness['participants'] = this.state.selected;
                readiness['readiness_questions'] = this.state.readinessItems;
                readiness['ask_default_qn'] = this.state.askDefaultQuestion || false;
                readiness['no_lots'] = this.state.no_lots || 1;

                let response;
                if (this.state.pageState == 'edit') {
                    response = await UpdateReadiness(readiness);
                    this.setState({
                        message: response.data.Message,
                        submitting: false
                    });
                } else {
                    response = await SaveReadiness(readiness);
                    if (response.status == 200) {
                        this.setState({
                            message: response.data.Message,
                            startDate: '',
                            endDate: '',
                            name: '',
                            selected: [],
                            readinessQuestions: [],
                            readinessItems: [],
                            no_lots: 1,
                            submitting: false
                        });
                    } else {
                        this.setState({
                            message: response.data.Message,
                            submitting: false
                        });
                    }

                }

                $('#addAdminUserModal').modal('toggle');

            })();
        }
        this.setState({
            submitting: false
        });
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

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">
                            {this.state.pageState == 'edit' ? 'Update Readiness Checklist' : 'Add Readiness Checklist'}
                        </h5>
                        <hr />
                        {/* <span>askDefaultQuestion ({this.state.askDefaultQuestion})</span>
                        <hr />
                        <details>
                            <summary>state</summary>
                            <pre style={{whiteSpace: 'pre'}}>
                                {JSON.stringify(this.state,null,2)}
                            </pre>
                        </details>
                        <hr />
                        <details>
                            <summary>readinessQuestions ({this.state.readinessQuestions.length})</summary>
                            <pre style={{whiteSpace: 'pre'}}>
                                {JSON.stringify(this.state.readinessQuestions)}
                            </pre>
                        </details>
                        <hr /> */}
                        <div className="text-center mx-3">

                            <div className="form-group row">
                                <label htmlFor="u_name" className="col-sm-2 col-form-label">Name/Title *</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.name}
                                        onChange={(event) => this.handleNameChange(event.target.value)}
                                        type="email" className="form-control" id="u_name" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="u_start_date" className="col-sm-2 col-form-label">Start date *</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.startDate}
                                        onChange={(event) => this.handleStartDateChange(event.target.value)} type="date"
                                        className="form-control" id="u_start_date" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="u_end_date" className="col-sm-2 col-form-label">End Date *</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.endDate}
                                        onChange={(event) => this.handleEndDateChange(event.target.value)} type="date"
                                        className="form-control" id="u_end_date" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-sm-2 mb-3">
                                    <label className="float-left">Assign laboratory *</label><br />
                                </div>
                                <div className="col-sm-10 mb-3">

                                    <DualListBox
                                        canFilter
                                        options={dualListValues}
                                        selected={this.state.selected}
                                        onChange={this.authoritiesOnChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-sm-2 mb-3">
                                    <label className="float-left">Create lots *</label><br />
                                </div>
                                <div className="col-sm-10 mb-3">
                                    <p className='text-left mb-0'>The participants in the laboratories picked above will be randomly split into lots.<br />Please specify the <u>number of lots</u> to create.</p>
                                    <input type="number" className="form-control" id="u_lots" placeholder='Number of lots to create' value={this.state.no_lots || 1} onChange={ev => {
                                        this.setState({
                                            no_lots: ev.target.value
                                        })
                                    }} />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="u_end_date" className="col-sm-2 col-form-label">Automatic response approval? *</label>
                                <div className="col-sm-10">
                                    <p className='text-left mb-0'>By selecting <u>Yes</u> here, you will activate automatic approval of the readiness checklist responses. This means that participants who respond to the default question with a 'Yes' will proceed to enter results, regardless of their other reponses.</p>
                                    <input
                                        type='radio'
                                        name='ask_default_qn'
                                        value={true}
                                        checked={this.state.askDefaultQuestion === true}
                                        onChange={(event) => this.handleDefaultQnChange(true)}
                                    /> Yes
                                    &nbsp; &nbsp; &nbsp;
                                    <input
                                        type='radio'
                                        name='ask_default_qn'
                                        value={false}
                                        checked={this.state.askDefaultQuestion === false}
                                        onChange={(event) => this.handleDefaultQnChange(false)}
                                    /> No
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-sm-2 mb-3">
                                    <label className="float-left">Checklist Question(s) *</label><br />
                                </div>
                                <div className="col-sm-10 mb-3">

                                    {this.state.readinessQuestions.map((rdnsQuestion) => {
                                        return (<React.Fragment key={uuidv4()}>
                                            {rdnsQuestion}
                                        </React.Fragment>)
                                    })}

                                    <button onClick={() => {
                                        $('#addQuestionModal').modal('toggle');
                                    }} type="button"
                                        className="btn btn-info float-left">Add question</button>

                                </div>

                            </div>

                            <div className="form-group row">
                                <div className="col-sm-10 mt-3">
                                    <button onClick={(ev) => {
                                        ev.preventDefault();

                                        this.setState({
                                            submitting: true
                                        });
                                        this.saveReadiness();
                                    }} type="" className="d-inline m-2 btn btn-info m" disabled={this.state.submitting}>
                                        {this.state.pageState == 'edit' ? (this.state.submitting ? 'Updating...' : 'Update Readiness') : (this.state.submitting ? 'Sending...' : 'Send Readiness')}
                                    </button>
                                    <a
                                        onClick={
                                            () => {
                                                window.location.assign('/list-readiness')
                                            }
                                        }
                                        className="d-inline m-2 btn btn-danger">Exit</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Message modal */}
                <div className="modal fade" id="addAdminUserModal" tabIndex="-1" role="dialog" aria-labelledby="addAdminUserModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addAdminUserModalTitle">Notice!</h5>
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
                {/* End Message modal */}

                {/* Add quetion modal */}
                <div className="modal fade" id="addQuestionModal" tabIndex="-1" role="dialog" aria-labelledby="addQuestionModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <AddReadinessQuestion addReadinessQuestion={this.addReadinessQuestion} />
                    </div>
                </div >
                {/* End add quetion modal */}
            </React.Fragment>
        );
    }

}

export default ReadinessForm;