import React from 'react';
import ReactDOM from 'react-dom';
import { FetchReadnessSurveyById } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import { v4 as uuidv4 } from 'uuid';


class Readiness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            id: '',
            name: '',
            startDate: '',
            endDate: '',
            readinessQuestions: [],
            readinessItems: [],
        }

        this.addReadinessQuestion = this.addReadinessQuestion.bind(this);

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
                    <div key={id} className="form-group">

                        <label className="float-left" htmlFor={id + "qst_answer"}>{readiness['question']}</label>
                        <select
                            className="custom-select" id={id + "qst_answer"}>
                            {qstOptins.map((option) => {
                                return <option key={uuidv4()} value={option}>{option}</option>
                            })}
                        </select>
                    </div>
                let questions = this.state.readinessQuestions;
                questions.push(qstElement);
                this.setState({
                    readinessQuestions: questions,
                    readinessItems: rdItems
                })
            } else if (readiness['answer_type'] == 'number') {
                let id = uuidv4();
                let qstElement =
                    <div key={id} className="form-group">

                        <label className="float-left" htmlFor={id + "qst_answer"}>{readiness['question']}</label>
                        <input type="number" className="form-control" id={id + "qst_answer"} aria-describedby="qst_answer" placeholder="Enter your answer" />
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
                <div className="form-group">

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

    componentDidMount() {

        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/get-readiness-form/:readinessId`,
        });

        (async () => {

            let readinessItems = await FetchReadnessSurveyById(pathObject.params.readinessId);
            if (readinessItems.status == 500) {
                this.setState({
                    message: readinessItems.data.Message,
                });
                $('#readinessFormModal').modal('toggle');
            } else {
                let readinessId = null;

                let startDate = null; "2021-09-29"
                let endDate = null;
                let name = null;

                readinessItems.map((questionItem) => {
                    this.addReadinessQuestion(questionItem)
                    readinessId = questionItem.id;
                    startDate = questionItem.start_date;
                    endDate = questionItem.end_date;
                    name = questionItem.name;
                    // addReadinessQuestion(questionItem);
                });
                this.setState({
                    id: readinessId,
                    name: name,
                    startDate: startDate,
                    endDate: endDate

                });
            }

        })();

    }

    render() {
        return (
            <React.Fragment>


                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">
                            Readiness Checklist Survey Form
                        </h5><br />
                        <hr />
                        <div style={{ "margin": "0 auto", "width": "80%" }} className="text-center">

                            <div className="form-group row">
                                <label htmlFor="u_name" className="col-sm-2 col-form-label">Name/Title</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.name}
                                        readOnly
                                        type="email" className="form-control" id="u_name" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="u_start_date" className="col-sm-2 col-form-label">Start date</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.startDate}
                                        readOnly
                                        type="date"
                                        className="form-control" id="u_start_date" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="u_end_date" className="col-sm-2 col-form-label">End Date</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.endDate}
                                        readOnly
                                        type="date"
                                        className="form-control" id="u_end_date" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-sm-2 mb-3">
                                    <label className="float-left">Checklist Question(s) *</label><br />
                                </div>
                                <div className="col-sm-10 mb-3">

                                    <div className="card">
                                        <div className="card-body">
                                            {
                                                this.state.readinessQuestions.map((rdnsQuestion) => {

                                                    return <span key={uuidv4()}>{rdnsQuestion}</span>
                                                })
                                            }

                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="form-group row">
                                <div className="col-sm-10 mt-3">
                                    <a onClick={() => this.saveReadiness()} type="" className="d-inline m-2 btn btn-info m">
                                        Save
                                    </a>
                                    <a
                                        onClick={
                                            () => {
                                                window.location.assign('/participant-pt-home')
                                            }
                                        }
                                        className="d-inline m-2 btn btn-danger">Exit</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>






                < div className="modal fade" id="readinessFormModal" tabIndex="-1" role="dialog" aria-labelledby="readinessModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addPersonelModalTitle">Notice!</h5>
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


export default Readiness;

if (document.getElementById('readiness')) {
    ReactDOM.render(<Readiness />, document.getElementById('readiness'));
}