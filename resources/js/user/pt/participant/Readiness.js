import React from 'react';
import ReactDOM from 'react-dom';
import { FetchReadnessSurveyById, SaveSuveyAnswers } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import ReadinessQuestions from './ReadinessQuestions';


class Readiness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            id: '',
            lab_id: '',
            name: '',
            startDate: '',
            endDate: '',
            readinessItems: [],
            questionsAnswerMap: {},
        }

        this.questionAnswerHandler = this.questionAnswerHandler.bind(this);
        this.saveAnswers = this.saveAnswers.bind(this);
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

                let questionsAnswerMap = {};

                readinessItems.map((questionItem) => {

                    questionsAnswerMap[questionItem.question_id] = '';
                });

                readinessId = readinessItems[0].id;
                startDate = readinessItems[0].start_date;
                endDate = readinessItems[0].end_date;
                name = readinessItems[0].name;

                this.setState({
                    id: readinessId,
                    name: name,
                    lab_id: readinessItems[0].lab_id,
                    startDate: startDate,
                    endDate: endDate,
                    questionsAnswerMap: questionsAnswerMap,
                    readinessItems: readinessItems,
                });
            }

        })();

    }

    questionAnswerHandler(event) {
        let questionsAnswerMap = this.state.questionsAnswerMap;
        questionsAnswerMap[event.target.id] = event.target.value;
        this.setState({
            questionsAnswerMap: questionsAnswerMap,
        })
    }

    saveAnswers() {

        for (const [key, element] of Object.entries(this.state.questionsAnswerMap)) {

            if (element == '' || element == null) {
                this.setState({
                    message: "Please answer all questions"
                })
                return;
            }
        }

        let ansqwers = {
            readiness_id: this.state.id,
            lab_id: this.state.lab_id,
            questionsAnswerMap: questionsAnswerMap,
        }
        SaveSuveyAnswers(ansqwers);

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

                                    <ReadinessQuestions
                                        questionsAnswerMap={this.state.questionsAnswerMap}
                                        readinessItems={this.state.readinessItems}
                                        questionAnswerHandler={this.questionAnswerHandler}

                                    />

                                </div>

                            </div>

                            <div className="form-group row">
                                <div className="col-sm-10 mt-3">
                                    <a onClick={() => this.saveAnswers()} type="" className="d-inline m-2 btn btn-info m">
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