import React from 'react';
import { SaveSubmission, UpdateSubmission, FetchSubmission, FetchCurrentParticipantDemographics } from '../../../components/utils/Helpers';
import './Results.css';
import { v4 as uuidv4 } from 'uuid';

class SubmitResults extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            message: '',
            ptLotReceivedDate: '',
            ptReconstituionDate: '',
            kitExpiryDate: '',
            testJustification: 'Periodic testing as per the protocol',
            kitReceivedDate: '',
            kitLotNo: '',
            nameOfTest: '',
            ptLotNumber: '',
            testingDate: '',
            sampleType: 'DTS',
            ptFile: null,
            labId: '',
            userId: '',
            ptNegativeIntepreation: '',

            ptRecentIntepreation: '',
            ptLongtermIntepreation: '',
            isPtDone: true,

            userDemographics: [],
            otherComments: '',
            notTestedReason: 'Issue with sample',
            edittableSubmission: {},
            testerName: '',
            pt_shipements_id: '',
            samples: {},
            submissionId: '',
            test_instructions: '',
            endDate: Date.parse('1970-01-01'),
            survey_questions: [],
            qa_responses: [],
        }

        this.onNameOfTestHandler = this.onNameOfTestHandler.bind(this);
        this.onPtLotReceiceDateHandler = this.onPtLotReceiceDateHandler.bind(this);
        this.onKitExpiryDateHandler = this.onKitExpiryDateHandler.bind(this);
        this.onKitReceivedDateHandler = this.onKitReceivedDateHandler.bind(this);
        this.onKitLotHandler = this.onKitLotHandler.bind(this);
        this.onTestingDateHandler = this.onTestingDateHandler.bind(this);
        this.validateTestingAndRecivedDate = this.validateTestingAndRecivedDate.bind(this);
        this.onReconstitutionDateHandler = this.onReconstitutionDateHandler.bind(this);
        this.validateTestingAndReconstituionDate = this.validateTestingAndReconstituionDate.bind(this);
        this.validateTestingAndPTLotRecivedDate = this.validateTestingAndPTLotRecivedDate.bind(this);
        this.onPtLotNumberHandler = this.onPtLotNumberHandler.bind(this);
        this.onTestJustificationHandler = this.onTestJustificationHandler.bind(this);
        this.onSampleTypeHandler = this.onSampleTypeHandler.bind(this);
        this.validateTestingDateAndCurrentDate = this.validateTestingDateAndCurrentDate.bind(this);

        this.handleSurveyQnResponse = this.handleSurveyQnResponse.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.onNameOfTestHandler = this.onNameOfTestHandler.bind(this);
        this.otherCommentsHandler = this.otherCommentsHandler.bind(this);
        this.notTestedReasonHandler = this.notTestedReasonHandler.bind(this);

        this.visualResultsHandler = this.visualResultsHandler.bind(this);
        this.ptInterpretation = this.ptInterpretation.bind(this);

        this.onTesternameChangeHandler = this.onTesternameChangeHandler.bind(this);
        this.isChecked = this.isChecked.bind(this);

    }

    componentDidMount() {
        (async () => {
            let edittableSubmission = null;
            let userDemographics = await FetchCurrentParticipantDemographics();
            if (this.props.selectedElementHasSubmmisions) {
                edittableSubmission = await FetchSubmission(this.props.shipment.submission);
            }
            let samples = {};

            if (this.props.selectedElementHasSubmmisions) {
                if (edittableSubmission['test_results'].length == 0) {
                    this.props.shipment.samples.map((sample) => {
                        samples[sample.sample_id] = {
                            "visual": { c: 0, v: 0, lt: 0 },
                            "interpretation": null
                        }
                    });
                } else {
                    edittableSubmission['test_results'].map((sample) => {
                        samples[sample.sample_id] = {
                            "visual": { c: sample.control_line, v: sample.verification_line, lt: sample.longterm_line },
                            "interpretation": sample.interpretation
                        }
                    });
                }
            } else {
                this.props.shipment.samples.map((sample) => {
                    samples[sample.sample_id] = {
                        "visual": { c: 0, v: 0, lt: 0 },
                        "interpretation": null
                    }
                });
            }

            if (this.props.selectedElementHasSubmmisions) {

                this.setState({
                    ptLotReceivedDate: edittableSubmission['data']['lot_date_received'],
                    ptReconstituionDate: edittableSubmission['data']['sample_reconstituion_date'],
                    kitExpiryDate: edittableSubmission['data']['kit_expiry_date'],
                    testJustification: edittableSubmission['data']['test_justification'],
                    kitReceivedDate: edittableSubmission['data']['kit_date_received'],
                    kitLotNo: edittableSubmission['data']['kit_lot_no'],
                    testerName: edittableSubmission['data']['tester_name'],
                    nameOfTest: edittableSubmission['data']['name_of_test'],
                    ptLotNumber: edittableSubmission['data']['pt_lot_no'],
                    testingDate: edittableSubmission['data']['testing_date'],
                    edit_pt_file: edittableSubmission['data']['file'] || {},
                    sampleType: edittableSubmission['data']['sample_type'],
                    labId: edittableSubmission['data']['lab_id'],
                    userId: edittableSubmission['data']['user_id'],

                    isPtDone: edittableSubmission['data']['pt_tested'] == 1 ? true : false,

                    userDemographics: userDemographics,
                    notTestedReason: edittableSubmission['data']['not_test_reason'] ? edittableSubmission['data']['not_test_reason'] : '',
                    otherNotTestedReason: edittableSubmission['data']['other_not_tested_reason'] ? edittableSubmission['data']['other_not_tested_reason'] : 'Issue with sample',
                    otherComments: edittableSubmission['data']['other_not_tested_reason'] ? edittableSubmission['data']['other_not_tested_reason'] : '',
                    pt_shipements_id: this.props.shipment.pt_shipements_id,
                    submissionId: edittableSubmission['data']['id'],
                    test_instructions: edittableSubmission['data']['test_instructions'],
                    samples: samples,
                    endDate: this.props.shipment.end_date
                });

            } else {

                this.setState({
                    userDemographics: userDemographics,
                    testerName: userDemographics.length > 0 ? (userDemographics[0].name + ' ' + userDemographics[0].second_name) : '',
                    labId: userDemographics[0].lab_id,
                    userId: userDemographics[0].user_id,
                    edittableSubmission: edittableSubmission,
                    test_instructions: this.props.shipment.test_instructions,
                    survey_questions: this.props.shipment.survey_questions ? this.props.shipment.survey_questions : [],
                    qa_responses: this.props.shipment.survey_questions ? Array.from(this.props.shipment.survey_questions, q=>{
                        return {
                            "question_id": q.id,
                            "response": ""
                        }
                    }) : [],
                    samples: samples,
                    endDate: this.props.shipment.end_date
                });

            }

        })();
    }

    componentDidUpdate(prevProps) {

    }


    handleSurveyQnResponse(e, qnId) {
        let survey_questions = this.state.survey_questions;
        let qn = survey_questions.find(q => q.id == qnId);
        // qn.response = e.target.value;
        // this.setState({
        //     survey_questions: survey_questions
        // });
        let survey_questions_responses = this.state.qa_responses;
        let survey_questions_response = this.state.qa_responses.find(q => q.question_id == qnId);
        let response_index = this.state.qa_responses.findIndex(q => q.question_id == qnId);
        if (survey_questions_response) {
            survey_questions_response.response = e.target.value;
            survey_questions_responses[response_index] = survey_questions_response;
            this.setState({
                qa_responses: survey_questions_responses
            });
        } else {
            survey_questions_response = {
                question_id: qnId,
                response: e.target.value
            }
            this.setState({
                qa_responses: [...this.state.qa_responses, survey_questions_response]
            });
        }
    }

    submitForm() {
        console.log(this.state.samples);
        //check if results filled
        if (this.state.isPtDone) {
            for (const [key, value] of Object.entries(this.state.samples)) {
                // console.log("Checking ", key, value);
                if (value['interpretation'] == null) {
                    this.setState({
                        message: "Please fill in all the fields marked *"
                    })
                    $('#messageModal').modal('toggle');
                    return;
                }
            }
        }

        if (
            this.state.ptLotReceivedDate.length == 0 ||
            this.state.kitExpiryDate.length == 0 ||
            this.state.kitReceivedDate.length == 0 ||
            this.state.kitLotNo.length == 0 ||
            this.state.nameOfTest.length == 0 ||
            this.state.testerName.length == 0 ||
            // this.state.ptLotNumber.length == 0 ||
            this.state.ptReconstituionDate.length == 0 ||
            this.state.testingDate.length == 0
            // ||
            // (this.state.ptNegativeIntepreation.length == 0 && this.state.isPtDone) ||
            // (this.state.ptRecentIntepreation.length == 0 && this.state.isPtDone) ||
            // (this.state.ptLongtermIntepreation.length == 0 && this.state.isPtDone)
        ) {
            this.setState({
                message: "Fill in all the fields marked *"
            })
            $('#messageModal').modal('toggle');
        } else {
            let submission = {};
            submission["ptLotReceivedDate"] = this.state.ptLotReceivedDate;
            submission["kitExpiryDate"] = this.state.kitExpiryDate;
            submission["kitReceivedDate"] = this.state.kitReceivedDate;
            submission["kitLotNo"] = this.state.kitLotNo;
            submission["ptReconstituionDate"] = this.state.ptReconstituionDate;
            submission["testingDate"] = this.state.testingDate;
            submission["ptLotNumber"] = 0;//this.state.ptLotNumber;
            submission["nameOfTest"] = this.state.nameOfTest;
            submission["testerName"] = this.state.testerName;
            submission["isPTTested"] = this.state.isPtDone;
            submission["testJustification"] = this.state.testJustification;
            submission["ptNotTestedReason"] = !this.state.isPtDone ? this.state.notTestedReason : "";
            submission["ptNotTestedOtherReason"] = this.state.notTestedReason || (!this.state.isPtDone ? this.state.otherComments : "");
            submission["otherComments"] = this.state.otherComments || this.state.notTestedReason;
            submission["labId"] = this.state.labId;
            submission["userId"] = this.state.userId;
            submission["sampleType"] = this.state.sampleType;
            submission["ptShipementId"] = this.props.shipment.id;
            submission["samples"] = this.state.samples;
            submission["ptPanelId"] = this.props.shipment.pt_panel_id || this.state.samples[0]?.panel || null;
            submission["id"] = this.state.submissionId;
            submission["qa_responses"] = this.state.qa_responses;
            // submission["file"] = this.state.ptFile;

            // console.log("submission", submission)

            (async () => {
                if (this.props.selectedElementHasSubmmisions) {
                    let response = await UpdateSubmission(submission);
                    this.setState({
                        message: response?.data?.Message,
                    });
                    $('#messageModal').modal('toggle');
                    if (response?.status == 200) {
                        this.props.toggleView("list");
                    }
                } else {
                    let response = await SaveSubmission(submission, this.state.ptFile);
                    this.setState({
                        message: response?.data?.Message,
                    });
                    $('#messageModal').modal('toggle');
                    if (response?.status == 200) {
                        this.props.toggleView("list");
                    }
                }
            })();
        }
    }

    ptInterpretation(event, sample_id) {
        // console.log("sample_id");
        // console.log(sample_id);
        let samples = this.state.samples;
        let interpretValue = event.target.value;
        let status = event.target.checked ? 1 : 0;

        samples[sample_id]["interpretation"] = interpretValue;

        this.setState({
            samples: samples
        });


    }

    visualResultsHandler(event, sample_id) {

        let samples = this.state.samples;
        let visualValue = event.target.value;
        let status = event.target.checked ? 1 : 0;

        let results = samples[sample_id]["visual"]; //{ c: 0, v: 0, lt: 0 };
        results[visualValue] = status;
        samples[sample_id]["visual"] = results;

        this.setState({
            samples: samples
        });

        // console.log("Sample: ", sample_id, "Visual: ", samples[sample_id]["visual"], "Interpretation: ", samples[sample_id]["interpretation"]);

    }


    onPtLotReceiceDateHandler(event) {
        let isValid = this.validateTestingAndPTLotRecivedDate(this.state.testingDate, event.target.value);

        if (isValid) {
            this.setState({
                ptLotReceivedDate: event.target.value
            });
        }
    }

    onPtLotNumberHandler(event) {
        this.setState({
            ptLotNumber: event.target.value
        });
    }

    onTesternameChangeHandler(event) {
        this.setState({
            testerName: this.state.userDemographics.length > 0 ? this.state.userDemographics[0].name + ' ' + this.state.userDemographics[0].second_name : event.target.value || ''
        });
    }

    onSampleTypeHandler(event) {
        this.setState({
            sampleType: event.target.value
        });
    }
    onTestJustificationHandler(event) {
        this.setState({
            testJustification: event.target.value
        });
    }

    onKitExpiryDateHandler(event) {
        this.setState({
            kitExpiryDate: event.target.value
        });
    }
    onKitReceivedDateHandler(event) {
        let isValid = this.validateTestingAndRecivedDate(this.state.testingDate, event.target.value);
        if (isValid) {
            this.setState({
                kitReceivedDate: event.target.value
            });
        }

    }
    onKitLotHandler(event) {
        this.setState({
            kitLotNo: event.target.value
        });
    }
    onTestingDateHandler(event) {
        this.setState({
            testingDate: event.target.value
        });
        this.validateTestingDateAndCurrentDate(event.target.value);
        this.validateTestingAndRecivedDate(event.target.value, this.state.kitReceivedDate);
        this.validateTestingAndPTLotRecivedDate(event.target.value, this.state.ptLotReceivedDate);
        this.validateTestingAndReconstituionDate(this.state.ptReconstituionDate, event.target.value)
    }

    onNameOfTestHandler(event) {
        this.setState({
            nameOfTest: event.target.value
        });
    }

    onReconstitutionDateHandler(event) {

        let isValid = this.validateTestingAndReconstituionDate(event.target.value, this.state.testingDate);
        if (isValid) {
            this.setState({
                ptReconstituionDate: event.target.value
            });
        }
    }

    validateTestingAndRecivedDate(testingDate, receiveData) {
        if (testingDate < receiveData && (testingDate && receiveData)) {
            this.setState({
                message: "PT Panel Date received cannot be greater than testing date",
                testingDate: '',
                kitReceivedDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingDateAndCurrentDate(sampleTestingDate) {

        let today = new Date();
        let testingDate = new Date(sampleTestingDate);
        if (testingDate > today) {
            this.setState({
                message: "Testing date cannot be greater than todays date",
                testingDate: '',
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingAndReconstituionDate(reconstituionDate, testingDate) {
        if (testingDate < reconstituionDate && (reconstituionDate && testingDate)) {
            this.setState({
                message: "Kit testing Date cannot be greater than reconstitution date",
                testingDate: '',
                ptReconstituionDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingAndPTLotRecivedDate(testingDate, receiveDate) {
        if (testingDate < receiveDate && (testingDate && receiveDate)) {
            this.setState({
                message: "PT Panel Date received cannot be greater than testing date",
                testingDate: '',
                ptLotReceivedDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    notTestedReasonHandler(event) {
        this.setState({
            notTestedReason: event.target.value
        });
    }

    otherCommentsHandler(event) {
        this.setState({
            otherComments: event.target.value
        });
    }

    isChecked(sample) {
        try {
            return this.props.selectedElementHasSubmmisions
                // &&
                // this.state.samples[sample.sample_id]["visual"]['c'] == 1
                ? true : false
        } catch (err) {
            return false;
        }

    }

    render() {
        let samplesToDisplay = [];
        if (this.props.selectedElementHasSubmmisions) {
            samplesToDisplay = this.state.samples;
        } else {
            samplesToDisplay = this.props.shipment.samples;
        }

        const labInfo = {
            backgroundColor: "#f9f9f9",
        };
        const boxLine = {
            borderTop: "1px solid grey",
            borderBottom: "1px solid grey",
            borderRight: "1px solid grey",
            paddingTop: "4px"
        }
        const boxLineLeft = boxLine;
        boxLineLeft["borderLeft"] = "1px solid grey";

        const displayInlineBlock = {
            display: "inline-block",
        }
        let today = new Date().toLocaleDateString();
        let isPtDone = this.state.isPtDone;
        return (

            <>
                <div className="row">

                    <div className='w-100' style={{ display: 'flex wrap', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h1 className='w-100'>
                            RTRI PT Submission form
                        </h1>
                        {Date.parse(this.state.endDate) > new Date() ?
                            this.props.shipment.readiness_approval_id == null ?
                                <div className='w-100 alert alert-warning py-2 mt-2 text-center'> Waiting for readiness approval</div>
                                : ''
                            : ''
                        }
                        <hr />

                    </div>
                    {/* {this.state.message && <div className='col-md-12'>
                        <div className={"alert alert-default-" + ((this.state.message && this.state.message.toLowerCase().includes("success")) ? "success" : "warning")} role="alert">
                            {this.state.message}
                        </div>
                    </div>} */}
                    <div className="col-sm-12 float-left">
                        {new Date() > Date.parse(this.state.endDate) ?
                            <h3 style={{ "color": "red" }} className="col-sm-12">Past Due date. Submission disabled</h3>
                            :
                            ''}
                    </div>
                    {/* <div className='col-md-12'>
                        <small>
                            <details>
                                <summary>this.state</summary>
                                <pre>
                                    {JSON.stringify(this.state, null, 2)}
                                </pre>
                            </details>
                        </small>
                    </div>
                    <div className='col-md-12'>
                        <small>
                            <details>
                                <summary>this.props.shipment</summary>
                                <pre>
                                    {JSON.stringify(this.props.shipment, null, 2)}
                                </pre>
                            </details>
                        </small>
                    </div> */}

                    <div className="col-sm-12 pl-4 pr-4">
                        {/* lab basic info */}
                        <div style={labInfo} className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <strong><p>Lab code</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].mfl_code : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Lab Name</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].lab_name : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Phone No.</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].phone_number : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Email</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].email : ''}
                            </div>
                        </div>
                        {/* row two */}
                        <div style={labInfo} className="row mt-1">
                            <div style={boxLineLeft} className="col-sm-3">
                                <strong><p>Submitter Name</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].name : ''}
                                <span> </span>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].second_name : ''}

                            </div>

                        </div>
                        {/* row two */}
                        {/* End lab basic info */}
                        <hr />
                    </div>

                    <div className="col-sm-12 mt-4 pl-4 pr-4">
                        {/* submission form  header */}
                        <div style={labInfo} className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>Submission Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                {today}
                            </div>

                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>Testing Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.testingDate} onChange={() => this.onTestingDateHandler(event)} className="form-control" type="date" />
                            </div>

                        </div>
                        {/* end submission form  header */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4 mt-2">
                        {/* Test Kit Information */}
                        Test Kit Information
                        {/* end Test Kit Information */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4">
                        {/* testing dates */}
                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Name of test *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.nameOfTest} onChange={() => this.onNameOfTestHandler(event)} className="form-control" type="text" />
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>RTRI Kit Lot No. *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.kitLotNo} onChange={() => this.onKitLotHandler(event)} className="form-control" type="text" />
                            </div>
                        </div>
                        {/* end testing dates */}
                    </div>

                    <div style={labInfo} className="col-sm-12  pl-4 pr-4">
                        {/* kit info */}
                        <div className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>RTRI Kit Date Received *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.kitReceivedDate} onChange={() => this.onKitReceivedDateHandler(event)} className="form-control" type="date" />

                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>RTRI Kit Expiry Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.kitExpiryDate} onChange={() => this.onKitExpiryDateHandler(event)} className="form-control" type="date" />
                            </div>
                        </div>
                        {/* end  kit info  */}

                    </div>

                    <div className="col-sm-12  pl-4 pr-4 mt-2">
                        {/* Test Kit Information */}
                        PT sample Information
                        {/* end Test Kit Information */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4">
                        {/* PT Lot info */}
                        <div className="row">
                            {/* <div style={boxLine} className="col-sm-3">
                                <p><strong>PT Lot Number: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.ptLotNumber} onChange={() => this.onPtLotNumberHandler(event)} className="form-control" type="text" />
                            </div> */}

                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>PT Panel Date Received *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.ptLotReceivedDate} onChange={() => this.onPtLotReceiceDateHandler(event)} className="form-control" type="date" />
                            </div>

                        </div>

                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Date PT Samples Reconstituted:</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.ptReconstituionDate} onChange={() => this.onReconstitutionDateHandler(event)} className="form-control" type="date" />
                            </div>

                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Tester name: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.testerName} defaultValue={this.state.userDemographics.length > 0 ? this.state.userDemographics[0].name + ' ' + this.state.userDemographics[0].second_name : this.state.testerName || ''} readOnly onChange={() => this.onTesternameChangeHandler(event)} className="form-control" type="text" />
                            </div>

                        </div>
                        {/* end  PT Lot info  */}
                        <hr />
                    </div>


                    <div className="col-sm-12  pl-4 pr-4">
                        {/* Test justification */}
                        <div className="row">
                            {/* <div style={boxLine} className="col-sm-3">
                                <p><strong>Jutification for PT testing: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <select
                                    value={this.state.testJustification} onChange={() => this.onTestJustificationHandler(event)}
                                    className="custom-select" aria-label="Default select example">
                                    <option selected>Periodic testing as per the protocol</option>
                                    <option>New kit lot/batch</option>
                                    <option>Change in environmental conditions</option>
                                </select>
                            </div> */}
                            {/* sample type */}
                            {/* <div style={boxLine} className="col-sm-3">
                                <p><strong>Sample type:</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <select
                                    value={this.state.sampleType} onChange={() => this.onSampleTypeHandler(event)}
                                    className="custom-select" aria-label="Default select example">
                                    <option selected>DTS</option>
                                    <option>Plasma</option>
                                </select>
                            </div> */}

                        </div>
                        {/* End Test justification */}

                        <hr />
                    </div>

                    <div className="col-sm-12  pl-4 pr-4" style={{ marginTop: '2.1em' }}>
                        <h5><b>Testing Instructions</b></h5>
                    </div>
                    <div className="col-sm-12  pl-4 pr-4 mb-3">
                        <div style={{ width: '100%', border: '1px solid #cdc5c5', backgroundColor: '#fffbea', padding: '15px 12px', borderRadius: '5px' }}>
                            <pre style={{ fontFamily: 'inherit', fontSize: '1em', whiteSpace: 'pre-wrap' }}>{this.state.test_instructions}</pre>
                        </div>
                    </div>

                    <div className="col-sm-12 mb-4  pl-4 pr-4">
                        {/* Test justification */}
                        <div className="form-check text-center">
                            <input
                                className="form-check-input"
                                checked={isPtDone ? false : true}
                                onChange={() => {
                                    $("#pt-test-results").toggle();
                                    $("#test-not-done-section").toggle();
                                    this.setState({
                                        isPtDone: !this.state.isPtDone
                                    })
                                }}
                                type="checkbox"
                                value="" id="ptTestDone" />
                            <label className="form-check-label" htmlFor="ptTestDone">
                                <strong>Click here if PT test was not done?</strong>
                            </label>
                        </div>
                        {/* End Test justification */}

                    </div>

                    <div id="test-not-done-section" style={{ "display": this.state.isPtDone ? "none" : "" }} className="col-sm-12 mb-4 ">
                        {/* why test not done */}
                        <form style={{ "paddingRight": "20%", "paddingLeft": "20%" }}>
                            <div className="form-group" >
                                <label htmlFor="exampleFormControlSelect1">Pick a reason</label>
                                <select value={this.state.notTestedReason} onChange={() => this.notTestedReasonHandler(event)} className="form-control" id="exampleFormControlSelect1">
                                    <option selected="selected">Issue with sample</option>
                                    <option>Issue with RTRI kit lot</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="otherCommentsTxtbox">Other comments</label>
                                <textarea defaultValue={this.state.otherComments} onChange={() => this.otherCommentsHandler(event)} className="form-control" id="otherCommentsTxtbox" rows="3"></textarea>
                            </div>
                        </form>
                        {/* End why test not done */}

                    </div>

                    <div id='pt-test-results' style={{ "display": this.state.isPtDone ? "" : "none" }} className="col-sm-12 ">

                        {/* PT Test results fields */}
                        <div className="row ml-5 mr-5">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="file_">Scanned PT form: {(this.state.edit_pt_file && Object.keys(this.state.edit_pt_file).length > 0) ? <a href={window.location.origin + '/api/resources/files/download/' + this.state.edit_pt_file?.id} target="_blank" download={this.state.edit_pt_file?.name}>{"File_" + this.state.edit_pt_file?.id}</a> : ""}</label>
                                    <input type="file" className="form-control" id="file_" name="file_" title="Please select a file" onChange={(f) => {
                                        this.setState({
                                            ptFile: f.target.files[0]
                                        })
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="otherCommentsTxtbox2">Other comments</label>
                                    <textarea defaultValue={this.state.otherComments} onChange={() => this.otherCommentsHandler(event)} className="form-control" id="otherCommentsTxtbox2" rows="3"></textarea>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th style={{ verticalAlign: 'middle' }} rowSpan={2} className="text-center">PT Sample ID</th>
                                            <th style={{ verticalAlign: 'middle' }} colSpan={3} className="text-center">Visual results</th>
                                            <th style={{ verticalAlign: 'middle' }} rowSpan={2} className="text-center">Interpretation *</th>
                                        </tr>
                                        <tr>
                                            <th style={{ verticalAlign: 'middle' }} className="text-center">Control line (C)</th>
                                            <th style={{ verticalAlign: 'middle' }} className="text-center">Verification line (V)</th>
                                            <th style={{ verticalAlign: 'middle' }} className="text-center">Long-term line (LT)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/*  PT - Long Term*/}

                                        {this.props.shipment.samples.map((sample) => {

                                            return <tr key={uuidv4()}>
                                                <td>{sample.sample_name}</td>
                                                <td ><input onChange={(event) => this.visualResultsHandler(event, sample.sample_id)}
                                                    defaultChecked={

                                                        // samples[sample.sample_id] = {
                                                        //     "visual": { c: 0, v: 0, lt: 0 },
                                                        //     "interpretation": null
                                                        // }

                                                        this.props.selectedElementHasSubmmisions
                                                            &&
                                                            Object.keys(this.state.samples).length !== 0
                                                            &&
                                                            this.state.samples[sample.sample_id]["visual"]['c'] == 1
                                                            ? true : false

                                                    }
                                                    checked={this.state.samples && this.state.samples[sample.sample_id] && this.state.samples[sample.sample_id]["visual"] && this.state.samples[sample.sample_id]["visual"]['c'] && this.state.samples[sample.sample_id]["visual"]['c'] == 1}
                                                    value="c" type="checkbox" /> Control line</td>
                                                <td ><input onChange={(event) => this.visualResultsHandler(event, sample.sample_id)}
                                                    defaultChecked={

                                                        this.props.selectedElementHasSubmmisions
                                                            &&
                                                            Object.keys(this.state.samples).length !== 0
                                                            &&
                                                            this.state.samples[sample.sample_id]["visual"]['v'] == 1
                                                            ? true : false

                                                    }
                                                    checked={this.state.samples && this.state.samples[sample.sample_id] && this.state.samples[sample.sample_id]["visual"] && this.state.samples[sample.sample_id]["visual"]['v'] && this.state.samples[sample.sample_id]["visual"]['v'] == 1}
                                                    value="v" type="checkbox" /> Verification line</td>
                                                <td ><input onChange={(event) => this.visualResultsHandler(event, sample.sample_id)}
                                                    defaultChecked={
                                                        this.props.selectedElementHasSubmmisions
                                                            &&
                                                            Object.keys(this.state.samples).length !== 0
                                                            &&
                                                            this.state.samples[sample.sample_id]["visual"]['lt'] == 1
                                                            ? true : false
                                                    }
                                                    checked={this.state.samples && this.state.samples[sample.sample_id] && this.state.samples[sample.sample_id]["visual"] && this.state.samples[sample.sample_id]["visual"]['lt'] && this.state.samples[sample.sample_id]["visual"]['lt'] == 1}
                                                    value="lt" type="checkbox" /> Long-Term line</td>
                                                <td onChange={(event) => this.ptInterpretation(event, sample.sample_id)}>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="lt"
                                                            name={`interpret-radio-${sample.sample_id}`} id="result_lt"
                                                            defaultChecked={
                                                                this.props.selectedElementHasSubmmisions
                                                                    &&
                                                                    Object.keys(this.state.samples).length !== 0
                                                                    &&
                                                                    this.state.samples[sample.sample_id]["interpretation"] == 'lt'
                                                                    ? true : false
                                                            }
                                                            checked={this.state.samples && this.state.samples[sample.sample_id] && this.state.samples[sample.sample_id]["interpretation"] && this.state.samples[sample.sample_id]["interpretation"] == 'lt'}
                                                        />
                                                        <label className="form-check-label" htmlFor="result_lt">
                                                            Long-Term (LT)
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="recent"
                                                            name={`interpret-radio-${sample.sample_id}`}
                                                            id="result_recent"
                                                            defaultChecked={
                                                                this.props.selectedElementHasSubmmisions
                                                                    &&
                                                                    Object.keys(this.state.samples).length !== 0
                                                                    &&
                                                                    this.state.samples[sample.sample_id]["interpretation"] == 'recent'
                                                                    ? true : false
                                                            }
                                                            checked={this.state.samples && this.state.samples[sample.sample_id] && this.state.samples[sample.sample_id]["interpretation"] && this.state.samples[sample.sample_id]["interpretation"] == 'recent'}
                                                        />
                                                        <label className="form-check-label" htmlFor="result_recent">
                                                            Recent
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="neg"
                                                            name={`interpret-radio-${sample.sample_id}`}
                                                            id="result_neg"
                                                            defaultChecked={
                                                                this.props.selectedElementHasSubmmisions
                                                                    &&
                                                                    Object.keys(this.state.samples).length !== 0
                                                                    &&
                                                                    this.state.samples[sample.sample_id]["interpretation"] == 'neg'
                                                                    ? true : false
                                                            }
                                                            checked={this.state.samples && this.state.samples[sample.sample_id] && this.state.samples[sample.sample_id]["interpretation"] && this.state.samples[sample.sample_id]["interpretation"] == 'neg'}
                                                        />
                                                        <label className="form-check-label" htmlFor="result_neg">
                                                            Negative
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="invalid"
                                                            name={`interpret-radio-${sample.sample_id}`}
                                                            id="result_invalid"
                                                            defaultChecked={
                                                                this.props.selectedElementHasSubmmisions
                                                                    &&
                                                                    Object.keys(this.state.samples).length !== 0
                                                                    &&
                                                                    this.state.samples[sample.sample_id]["interpretation"] == 'invalid'
                                                                    ? true : false
                                                            }
                                                            checked={this.state.samples && this.state.samples[sample.sample_id] && this.state.samples[sample.sample_id]["interpretation"] && this.state.samples[sample.sample_id]["interpretation"] == 'invalid'}
                                                        />
                                                        <label className="form-check-label" htmlFor="result_invalid">
                                                            Invalid
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        })
                                        }

                                        {/*  End PT - Long Term */}

                                    </tbody>


                                </table>

                            </div>
                        </div>

                        {/* End PT Test results fields */}
                        <hr />
                    </div>

                    {/* <survey section */}
                    {this.state.survey_questions && this.state.survey_questions.length > 0 && <div className="w-100 d-flex flex-column">
                        <div className="text-center">
                            <h4 className='text-bold'>Survey</h4>
                            <p className='text-muted'> Additonal questions related to the test </p>
                            {/* <small><pre>{JSON.stringify(this.state.qa_responses)}</pre></small> */}
                            <hr style={{ maxWidth: '400px' }} />
                        </div>
                        <div className="px-3 text-center">
                            {this.state.survey_questions && this.state.survey_questions.length > 0 ? this.state.survey_questions.map((question, index) => {
                                return (
                                    <div className="form-group d-flex flex-column align-items-center" key={index}>
                                        <label htmlFor="question">{question.question}</label>
                                        {question.question_type != "select" ? <input style={{ maxWidth: '320px' }} type={question.question_type || "text"} className="form-control" id="question" name={question.id} placeholder={question.question}
                                        value={(()=>{
                                            let response_obj = this.state.qa_responses.find(qa=>qa.question_id == question.id)
                                            return response_obj ? response_obj.response : ''
                                        })()}
                                        onChange={e=>{
                                            this.handleSurveyQnResponse(e, question.id)
                                        }}
                                        /> : <select style={{ maxWidth: '320px' }} className="form-control" id="question" name={question.id} placeholder={question.question}
                                        value={(()=>{
                                            let response_obj = this.state.qa_responses.find(qa=>qa.question_id == question.id)
                                            return response_obj ? response_obj.response : ''
                                        })()}
                                        onChange={e=>{
                                            this.handleSurveyQnResponse(e, question.id)
                                        }}
                                        >
                                            <option value="">Select</option>
                                            {question.question_options.map((option, index) => {
                                                return (
                                                    <option value={option} key={index}>{option}</option>
                                                )
                                            })}
                                        </select>}
                                    </div>
                                )
                            }) : ""}
                        </div>
                        <hr />
                    </div>}
                    {/* survey section/> */}

                    <div className="d-flex w-100 justify-content-center">

                        {Date.parse(this.state.endDate) > new Date() && this.props.shipment.readiness_approval_id != null ?
                            <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">Submit</button>
                            : ''
                        }
                        <button type="button" onClick={() => {
                            this.props.toggleView('list');
                        }} className="btn btn-danger float-left mx-2">Exit</button>
                    </div>
                </div>

                {/* user persist alert box */}
                <div className="modal fade" id="messageModal" tabIndex="-1" role="dialog" aria-labelledby="messageModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Notice</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p id="returnedMessage">{this.state.message ? this.state.message : "An error has occurred. Please refresh and try again"}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SubmitResults;
