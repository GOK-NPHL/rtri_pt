import React from 'react';
import ReactDOM from 'react-dom';
import { FetchReadnessSurveyById } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import { v4 as uuidv4 } from 'uuid';


class ReadinessQuestions extends React.Component {

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
            questionIds: [],
            questionsAnswerMap: {},
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
                    startDate: startDate,
                    endDate: endDate,
                    questionsAnswerMap: questionsAnswerMap,
                    readinessItems: readinessItems,
                });
            }

        })();

    }


    addReadinessQuestion(readiness) {

        if (readiness['qustion_type'] == 'question') {

            if (readiness['answer_type'] == 'list') {
                let id = uuidv4();
                let qstOptins = readiness['answer_options'].split(',');
                let qstElement =
                    <div key={id} className="form-group">

                        <label className="float-left" htmlFor={readiness['question_id']}>{readiness['question']}</label>
                        <select
                            value={this.props.questionsAnswerMap[readiness['question_id']]}
                            onChange={(event) => this.props.questionAnswerHandler(event)}
                            className="custom-select" id={readiness['question_id']}>
                            {qstOptins.map((option) => {
                                return <option key={uuidv4()} value={option}>{option}</option>
                            })}
                        </select>
                    </div>
                return qstElement;

            } else if (readiness['answer_type'] == 'number') {
                let id = uuidv4();
                let qstElement =
                    <div key={id} className="form-group">

                        <label className="float-left" htmlFor={readiness['question_id']}>{readiness['question']}</label>
                        <input
                            value={this.props.questionsAnswerMap[readiness['question_id']]}
                            onChange={
                                (event) => {
                                    console.log(this.props.questionsAnswerMap[readiness['question_id']]);
                                    this.props.questionAnswerHandler(event)
                                }}
                            type="number" className="form-control"
                            id={readiness['question_id']}
                            aria-describedby="qst_answer"
                        />
                    </div>

                return qstElement;
            }

        } else if (readiness['qustion_type'] == 'comment') {
            let id = uuidv4();
            let qstElement =
                <div key={uuidv4()} className="form-group">

                    <label className="float-left" htmlFor={readiness['question_id']}>{readiness['question']}</label>
                    <textarea className="form-control"
                        onChange={(event) => {
                            let key = readiness['question_id'];
                            this.props.questionAnswerHandler(event)
                        }}
                        name={readiness['question_id']}
                        defaultValue={this.props.questionsAnswerMap[readiness['question_id']]}
                        id={readiness['question_id']} aria-describedby="qst_answer" placeholder="Enter your comment" >

                    </textarea>
                </div>
            return qstElement;
        }

    }

    render() {
        let qstnsElem = [];
        this.props.readinessItems.map((questionItem) => {
            let qstElement = this.addReadinessQuestion(questionItem);
            qstnsElem.push(qstElement);
        });

        return (
            <React.Fragment>

                <div className="card">
                    <div className="card-body">
                        {qstnsElem}
                    </div>
                </div>

            </React.Fragment>
        );

    }
}

export default ReadinessQuestions;