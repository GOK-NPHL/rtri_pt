import React from 'react';
import ReactDOM from 'react-dom';
import { FetchReadnessSurveyById } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";


class Readiness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {


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

                // readinessItems.payload.questions.map((questionItem) => {
                //     this.addReadinessQuestion(questionItem);
                // });
                this.setState({

                });
            }


        })();


    }

    render() {

        return (
            <React.Fragment>
                Hi
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