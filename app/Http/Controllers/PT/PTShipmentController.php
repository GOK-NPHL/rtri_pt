<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Laboratory;
use App\Lot;
use App\PtPanel;
use App\PtSample;
use App\PtShipement;
use App\ptsubmission;
use App\Readiness;
use App\ReadinessAnswer;
use App\ReadinessApproval;
use App\ReadinessQuestion;
use App\SurveyQuestion;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PTShipmentController extends Controller
{

    public function getShipments(Request $request)
    {

        try {
            $data = array();
            $shipments = PtShipement::where('deleted_at', null)->get();
            $user = User::where('id', $request->userId)->first();
            if ($user || $request->userId == '156f41ed97') {
                foreach ($shipments as $shipment) {
                    // check if there is a submission for this shipment by this user
                    $submission = ptsubmission::where('pt_shipements_id', $shipment->id)->where('user_id', $request->userId)->first();
                    if ($submission) {
                        Log::info('Submission ' . $submission->id . ' found for shipment ' . $shipment->id . ' and user ' . $request->userId);
                        // filter shipments that have been submitted by this user
                        if ($submission->pt_shipements_id == $shipment->id) {
                            $pnls = [];
                            foreach ($shipment->ptpanel_ids as $panel_id) {
                                $panel = PtPanel::find($panel_id);
                                if ($panel) {
                                    $pnls[] = [
                                        'id' => $panel->id,
                                        'name' => $panel->name,
                                        'participant_count' => count($panel->participants()) ?? 0,
                                    ];
                                }
                            }
                            $shipment->panels = $pnls;
                            $data[] = $shipment;
                        }
                    }
                }
                if ($request->filterEmpty) {
                    return $data;
                } else {
                    return $shipments;
                }
            }
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipmentById(Request $request)

    {

        try {
            $labIds = [];
            $shipment = PtShipement::find($request->id);
            if ($shipment) {
                // panels
                $panels = PtPanel::whereIn('id', $shipment->ptpanel_ids)->get();
                if ($panels && count($panels) > 0) {
                    foreach ($panels as $panel) {
                        $panel->participants = [];
                        $panelots = [];
                        foreach ($panel->lots() as $lot) {
                            $lt = $lot;
                            if ($lt) {
                                $panelots[] = $lt;
                                //readiness
                                $rdn = $lt->readiness();
                                $panel->readiness = $rdn ?? null;
                                // labs
                                $labids = DB::table('laboratory_readiness')->where('readiness_id', $rdn->id)->get();
                                foreach ($labids as $labid) {
                                    $labIds[] = $labid->laboratory_id;
                                }
                            }
                        }
                        $panel->lots = $panelots;
                        $panel->samples = $panel->ptsamples() ?? [];
                    }
                }

                // survey questions
                $surveyQns = SurveyQuestion::where('shipment_id', $shipment->id)
                    ->where('deleted_at', null)
                    ->get();

                $payload = [];
                $payload['shipment'] = $shipment;
                $payload['labs'] = $labIds;
                $payload['panel'] = $panel;
                $payload['samples'] = $panel->samples;
                $payload['survey_questions'] = $surveyQns;
                return $payload;
            } else {
                return response()->json(['Message' => 'Could not find shipment'], 404);
            }
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch shipment: ' . $ex->getMessage()], 500);
        }
    }


    public function saveShipment(Request $request)
    {

        try {
            $shipments = PtShipement::where('round_name', $request->shipement['round'])->get();
            if (count($shipments) > 0) {
                return response()->json(['Message' => 'Error during creating shipment. A round with this name already exists '], 500);
            }

            if (empty($request->shipement['panel_ids']) && count($request->shipement['panel_ids']) == 0) {
                return response()->json(['Message' => 'Please select a panel for this shipment '], 500);
            }
            if (empty($request->shipement['readiness_id']) && count($request->shipement['readiness_id']) == 0) {
                return response()->json(['Message' => 'Please select a readiness checklist for this shipment '], 500);
            }
            $shipment = PtShipement::create([
                'pass_mark' => $request->shipement['pass_mark'],
                'round_name' => $request->shipement['round'],
                'code' => $request->shipement['shipment_code'],
                'end_date' => $request->shipement['result_due_date'],
                'test_instructions' => $request->shipement['test_instructions'],
                'readiness_id' => $request->shipement['readiness_id'],
                'ptpanel_ids' => $request->shipement['panel_ids'] ?? $request->shipement['panels'] ?? [],
            ]);

            // save participants
            foreach ($request->shipement['panel_ids'] as $panel_id) {
                $panel = PtPanel::find($panel_id);
                if ($panel) {
                    $participants = $panel->participants();
                    if ($participants && count($participants) > 0) {
                        foreach ($participants as $participant) {
                            $useracc = User::find($participant['id']);
                            if ($useracc) {
                                // save to laboratory_pt_shipment table
                                DB::table('laboratory_pt_shipement')->insert([
                                    'laboratory_id' => $useracc->lab()->id,
                                    'pt_shipement_id' => $shipment['id'],
                                    'pt_panel_id' => $panel_id,
                                ]);
                            }
                        }
                    }
                }
            }

            // save survey questions
            if (isset($request->shipement['survey_questions']) && count($request->shipement['survey_questions']) > 0) {
                foreach ($request->shipement['survey_questions'] as $question) {
                    $survey = SurveyQuestion::create([
                        'question' => $question['question'],
                        'question_type' => $question['question_type'],
                        'question_options' => $question['question_options'] ?? null,
                        'meta' => $question['meta'] ?? null,
                        'shipment_id' => $shipment['id'],
                    ]);
                }
            }
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }


    public function updateShipment(Request $request)
    {

        try {

            $shipments = PtShipement::find($request->shipement['id']);

            if (empty($shipments)) {
                return response()->json(['Message' => 'Could not find the shipment'], 404);
            }


            $shipments->pass_mark = $request->shipement['pass_mark'];
            $shipments->round_name = $request->shipement['round'];
            $shipments->code = $request->shipement['shipment_code'];
            $shipments->end_date = $request->shipement['result_due_date'];
            $shipments->readiness_id = $request->shipement['readiness_id'];
            $shipments->test_instructions = $request->shipement['test_instructions'];
            $shipments->ptpanel_ids = $request->shipement['panel_ids'] ?? $request->shipement['ptpanel_ids'];

            // update survey questions
            if (isset($request->shipement['survey_questions'])) {
                foreach ($request->shipement['survey_questions'] as $question) {
                    if (!empty($question['id'])) {
                        $survey = SurveyQuestion::find($question['id']);
                        if (!empty($question['delete']) && $question['delete'] == true) {
                            $survey->delete();
                        } else {
                            $survey->question = $question['question'];
                            $survey->question_type = $question['question_type'];
                            $survey->question_options = $question['question_options'] ?? null;
                            $survey->meta = $question['meta'] ?? null;
                            $survey->save();
                        }
                    } else {
                        $survey = SurveyQuestion::create([
                            'question' => $question['question'],
                            'question_type' => $question['question_type'],
                            'question_options' => $question['question_options'] ?? null,
                            'meta' => $question['meta'] ?? null,
                            'shipment_id' => $request->shipement['id'],
                        ]);
                    }
                }
            }

            $shipments->save();

            // save participants
            // $shipments->laboratories()->sync($participantsList);

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    public function deleteShipment(Request $request)
    {
        try {
            $shipment = PtShipement::find($request->id);
            if ($shipment) {
                $shipment->delete();
                // delete all the survey questions
                $surveyQuestions = SurveyQuestion::where('shipment_id', $request->id)->get();
                foreach ($surveyQuestions as $question) {
                    $question->delete();
                }
                return response()->json(['Message' => 'Deleted successfully'], 200);
            } else {
                return response()->json(['Message' => 'Could not find the shipment'], 404);
            }
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not delete the shipment ' . $ex->getMessage()], 500);
        }
    }

    public function getUserSamples()
    {
        $user = Auth::user();
        $user_id = $user->id;

        try {
            // get shipments (id, round_name, code, start_date), 
            // join shipments with readiness (id, name) on shipment.readiness_id = readiness.id, 
            // join with panels (name, participants) on shipment.panel_ids includes panels.id, 
            // join with samples (name, reference_result) on panels.samples includes samples.id
            // join with lots (name, participants()) on panels.lots includes lots.id
            // where shipment.start_date <= today and shipment.end_date >= today and shipment.participants includes user_id

            // shoud return the following json: 
            /* [
                {
                    "id": 4,
                    "pt_shipements_id": 4,
                    "round_name": "Round A",
                    "code": "R-01",
                    "start_date": null,
                    "end_date": "2022-09-28",
                    "test_instructions": "Discover a whole host of new companies explictly approved by me",
                    "sample_id": 1,
                    "sample_name": "SAMPLE A",
                    "submission_id": null,
                    "is_readiness_answered": 1,
                    "readiness_id": null,
                    "readiness_approval_id": 1
                }
            ] */

            $data = array();

            $shipments = PtShipement::all();
            foreach ($shipments as $shipment) {
                // $readiness = Readiness::find($shipment->readiness_id);
                // if ($readiness) {
                //     $shipment->readiness = $readiness;
                // }

                $panels = PtPanel::whereIn('id', $shipment->ptpanel_ids)->get();
                if ($panels) {
                    foreach ($panels as $pnl) {
                        $pnl->samples = $pnl->ptsamples();
                    }
                    // $shipment->panels = $panels;
                    foreach ($panels as $panel) {
                        // filter where participants includes user_id
                        $participants = $panel->participants();
                        if ($participants && count($participants) > 0) {
                            foreach ($participants as $participant) {
                                if ($participant['id'] == $user_id) {
                                    $useracc = User::find($participant['id']);
                                    if ($useracc) {
                                        // find if the readiness assigned to the lab has been answered
                                        $readinessAnswer = ReadinessAnswer::where('laboratory_id', $useracc->lab()->id)->where('readiness_id', $shipment->readiness_id)->first();
                                        if ($readinessAnswer) {
                                            $shipment->is_readiness_answered = 1;
                                            $shipment->readiness_approval_id = ReadinessApproval::where('lab_id', $useracc->lab()->id)->where('readiness_id', $shipment->readiness_id)->first()->id ?? null;
                                        } else {
                                            $shipment->is_readiness_answered = 0;
                                            $shipment->readiness_approval_id = null;
                                        }
                                        // samples
                                        $samples = $panel->ptsamples();
                                        if ($samples) {
                                            $shipsamples = array();
                                            foreach ($samples as $sample) {
                                                $shipsamples[] = [
                                                    'sample_id' => $sample['id'],
                                                    'sample_name' => $sample['name'],
                                                    'panel' => $panel->id,
                                                ];
                                            }
                                            $shipment->samples = $shipsamples;
                                        }
                                        $shipment->pt_panel_id = $panel->id;
                                        // submissions
                                        $submission = ptsubmission::where('pt_shipements_id', $shipment->id)->where('lab_id', $useracc->lab()->id)->where('user_id', $user_id)->first();
                                        $shipment->submission = $submission->id ?? null;

                                        // survey questions
                                        $survey_qns = SurveyQuestion::where('shipment_id', $shipment->id)->get();
                                        $shipment->survey_questions = $survey_qns;
                                    }
                                    // push to data
                                    $data[] = $shipment;
                                }
                            }
                        }
                    }
                }
            }
            // $data['shipments'] = $shipments;

            return $data;











            // $shipments = PtShipement::select( //when using labs
            //     "pt_shipements.id",
            //     "pt_shipements.id as pt_shipements_id",
            //     "pt_shipements.round_name",
            //     "pt_shipements.code",
            //     "pt_shipements.start_date",
            //     "pt_shipements.end_date",
            //     "pt_shipements.test_instructions",
            //     "pt_samples.id as sample_id",
            //     "pt_samples.name as sample_name",
            //     "ptsubmissions.id as submission_id",
            //     DB::raw("1 as is_readiness_answered"),
            //     DB::raw("null as readiness_id"),
            //     DB::raw("1 as readiness_approval_id")

            // )
            //     ////
            //     ->leftJoin('pt_panels', 'pt_panels.readiness_id', '=', 'pt_panels.readiness_id')
            //     ////
            //     ->leftJoin('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
            //     ->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
            //     //// ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
            //     ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id')
            //     ->join('laboratories', 'laboratory_pt_shipement.laboratory_id', '=', 'laboratories.id')
            //     ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
            //     ->where('users.id', $user_id);

            // $shipments2 = PtShipement::select( //when using readiness
            //     "pt_shipements.id",
            //     "pt_shipements.id as pt_shipements_id",
            //     "pt_shipements.round_name",
            //     "pt_shipements.code",
            //     "pt_shipements.start_date",
            //     "pt_shipements.end_date",
            //     "pt_shipements.test_instructions",
            //     //// "pt_shipements.readiness_id as readiness_id",

            //     "pt_panels.readiness_id as readiness_id",

            //     "pt_samples.id as sample_id",
            //     "pt_samples.name as sample_name",

            //     "ptsubmissions.id as submission_id",

            //     "readiness_answers.id as is_readiness_answered", //check if readiness for this shipment id filled
            //     "readiness_approvals.id as readiness_approval_id"

            // )
            //     ////
            //     ->leftJoin('pt_panels', 'pt_panels.readiness_id', '=', 'pt_panels.readiness_id')
            //     //// ->join('pt_panels', 'pt_panels.id', 'in', 'pt_shipements.ptpanel_ids')
            //     ////
            //     ->leftJoin('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
            //     //// ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
            //     ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_panels.readiness_id')
            //     ->leftJoin('readiness_answers',  'laboratory_readiness.readiness_id', '=',  'readiness_answers.readiness_id')
            //     ->leftJoin('readiness_approvals', 'readiness_answers.laboratory_id', '=',  'readiness_approvals.lab_id')
            //     //// ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')

            //     ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id')
            //     ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
            //     ->join('users', 'users.laboratory_id', '=', 'laboratories.id')

            //     ->where('users.id', $user_id)
            //     ->union($shipments)
            //     // ->orderBy('pt_shipements.end_date')
            //     ->get();

            // $payload = [];
            // $sampleIds = [];

            // foreach ($shipments2 as $lab) {

            //     if ($lab->round_name == "round 20") {
            //         // Log::info($lab);
            //     }
            //     if (array_key_exists($lab->id, $payload)) {
            //         if (!array_key_exists($lab->sample_id, $sampleIds)) {
            //             $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];
            //             $sampleIds[$lab->sample_id] = 1;
            //         }
            //     } else {

            //         if (!array_key_exists($lab->sample_id, $sampleIds)) {
            //             $sampleIds[$lab->sample_id] = 1;
            //             $payload[$lab->id] = [];
            //             $payload[$lab->id]['samples'] = [];
            //             $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];

            //             $payload[$lab->id]['test_instructions'] = $lab->test_instructions;
            //             $payload[$lab->id]['id'] = $lab->id;
            //             $payload[$lab->id]['pt_shipements_id'] = $lab->pt_shipements_id;
            //             $payload[$lab->id]['start_date'] = $lab->start_date;
            //             $payload[$lab->id]['code'] = $lab->code;
            //             $payload[$lab->id]['end_date'] = $lab->end_date;
            //             $payload[$lab->id]['round_name'] = $lab->round_name;
            //             $payload[$lab->id]['submission_id'] = $lab->submission_id;
            //             $payload[$lab->id]['is_readiness_answered'] = $lab->is_readiness_answered;
            //             $payload[$lab->id]['readiness_id'] = $lab->readiness_id;
            //             $payload[$lab->id]['readiness_approval_id'] = $lab->readiness_approval_id;
            //         }
            //     }
            // }

            // return $payload;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not fetch the samples ' . $ex->getMessage()], 500);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could fetch samples: ' . $ex->getMessage()], 500);
        }
    }
    /////

    public function getShipmentResponsesById(Request $request)
    {
        $user = Auth::user();
        try {

            $shipmentsResponses = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('laboratories', 'ptsubmissions.lab_id', '=', 'laboratories.id')
                ->join('users', 'ptsubmissions.user_id', '=', 'users.id')
                ->leftJoin('resource_files', 'ptsubmissions.pt_submission_file_id', '=', 'resource_files.id')
                ->where('pt_shipements.id', $request->id)
                ->get([
                    "pt_shipements.id",
                    "pt_shipements.start_date",
                    "pt_shipements.code",
                    "resource_files.path as pt_submission_file_path",
                    "resource_files.id as pt_submission_file_id",
                    "resource_files.name as pt_submission_file_name",
                    "pt_shipements.end_date",
                    "pt_shipements.round_name as name",
                    "laboratories.id as lab_id",
                    "users.name as fname",
                    "users.second_name as sname",
                    "laboratories.phone_number",
                    "laboratories.lab_name",
                    "laboratories.email",
                    "ptsubmissions.id as ptsubmission_id",
                    "ptsubmissions.created_at",
                    "ptsubmissions.updated_at",
                ]);

            return $shipmentsResponses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch ptsubmissions list: ' . $ex->getMessage()], 500);
        }
    }


    public function getShipmentResponseReport($id,  $is_participant)
    {
        $user = Auth::user();
        try {

            $shipmentsResponses = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->join('pt_panels', 'pt_panels.id', '=', 'laboratory_pt_shipement.pt_panel_id')
                ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id')
                ////
                ->join('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'ptsubmissions.id')
                ->join('laboratories', 'ptsubmissions.lab_id', '=', 'laboratories.id')
                ->join('users', 'ptsubmissions.user_id', '=', 'users.id');

            if ($is_participant == 1) {
                $shipmentsResponses =
                    $shipmentsResponses
                    ->where('ptsubmissions.user_id', $user->id)
                    ->where('ptsubmissions.pt_shipements_id', $id);
                // ->where('ptsubmissions.lab_id', $user->laboratory_id)
                // ->where('ptsubmissions.id', $id);
            } else {
                $shipmentsResponses =
                    $shipmentsResponses->where('ptsubmissions.id', $id);
                // ->where('ptsubmissions.pt_shipements_id', $id);
            }

            $shipmentsResponses = $shipmentsResponses->get([
                "pt_shipements.id",
                "pt_shipements.created_at as shipment_date",
                "pt_shipements.code",
                "pt_shipements.end_date",
                "pt_shipements.pass_mark",
                "pt_shipements.round_name as name",
                "laboratories.id as lab_id",
                "users.name as fname",
                "users.second_name as sname",
                "laboratories.phone_number",
                "laboratories.lab_name",
                "laboratories.email",
                "ptsubmissions.id as ptsubmission_id",
                "ptsubmissions.created_at as _first_submission_date",
                "ptsubmissions.updated_at  as update_submission_date",
                "ptsubmissions.testing_date",
                "ptsubmissions.kit_expiry_date",
                "ptsubmissions.kit_date_received",
                "ptsubmissions.pt_lot_no",
            ]);

            //  one
            $shipmentsRefResult = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->join('pt_panels', 'pt_panels.id', '=', 'laboratory_pt_shipement.pt_panel_id')
                ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id');

            if ($is_participant == 1) {
                $shipmentsRefResult = $shipmentsRefResult->where('ptsubmissions.pt_shipements_id', $id);
            } else {
                $shipmentsRefResult = $shipmentsRefResult->where('ptsubmissions.id', $id);
            }

            $shipmentsRefResult = $shipmentsRefResult->get([
                "pt_samples.reference_result as reference_result",
                "pt_samples.name as sample_name",
                "pt_panels.id as ref_panel_id",
                "pt_panels.name as ref_panel_name",
                "pt_shipements.round_name as round_name"
            ]);


            //  two
            $shipmentsResponsesRlt = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->leftJoin('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'ptsubmissions.id')
                ->join('pt_panels', 'pt_panels.id', '=', 'ptsubmissions.pt_panel_id')
                ->join('pt_samples', 'pt_samples.id', '=', 'pt_submission_results.sample_id');


            if ($is_participant == 1) {
                $shipmentsResponsesRlt = $shipmentsResponsesRlt
                    ->where('ptsubmissions.user_id', $user->id)
                    // ->where('ptsubmissions.lab_id', $user->laboratory_id)
                    ->where('ptsubmissions.pt_shipements_id', $id);
            } else {
                $shipmentsResponsesRlt = $shipmentsResponsesRlt->where('ptsubmissions.id', $id);
            }

            $shipmentsResponsesRlt = $shipmentsResponsesRlt->get([
                "pt_submission_results.interpretation as result_interpretation",
                "pt_submission_results.control_line as control_line",
                "pt_submission_results.verification_line as verification_line",
                "pt_submission_results.longterm_line as longterm_line",
                "ptsubmissions.pt_panel_id as panel_id",
                "pt_samples.name as sample_name"
            ]);


            $dataPayload = [];
            // Log::info("\r\n\r\n<--------------------------------------");
            // Log::info("shipmentsRefResult::::  " . json_encode($shipmentsRefResult));
            // Log::info("shipmentsResponsesRlt::::  " . json_encode($shipmentsResponsesRlt));
            // Log::info("--------------------------------------/>\r\n\r\n");

            if ($shipmentsResponsesRlt) {
                foreach ($shipmentsResponsesRlt as $rslt) {
                    // find the reference result
                    $refResult = $shipmentsRefResult->where('ref_panel_id', $rslt->panel_id)->where('sample_name', $rslt->sample_name)->first();
                    if ($refResult) {
                        $data = [];
                        $data['sample_name'] = $refResult->sample_name;
                        $data['reference_result'] = $refResult->reference_result;
                        $data['control_line'] = $rslt->control_line ?? null;
                        $data['verification_line'] = $rslt->verification_line ?? null;
                        $data['longterm_line'] = $rslt->longterm_line ?? null;
                        $data['result_interpretation'] = $rslt->result_interpretation;
                        $dataPayload[] = $data;
                    }
                }
            } else {
                $dataPayload = [];
            }

            return [
                'metadata' => $shipmentsResponses, "results" => $dataPayload
            ];
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch report data: ' . $ex->getMessage()], 500);
        }
    }


    public function getUserSampleResponseResult(Request $request)
    {
        // 7777777777777
        $user = Auth::user();
        $id = $request->id;
        try {

            $shipmentsResponses = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->join('pt_panels', 'pt_panels.id', '=', 'laboratory_pt_shipement.pt_panel_id')
                ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id')
                ////
                ->join('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'ptsubmissions.id')
                ->join('laboratories', 'ptsubmissions.lab_id', '=', 'laboratories.id')
                ->join('users', 'ptsubmissions.user_id', '=', 'users.id');

            $shipmentsResponses =
                $shipmentsResponses->where('ptsubmissions.id', $id);

            $shipmentsResponses = $shipmentsResponses->get([
                "pt_shipements.id",
                "pt_shipements.created_at as shipment_date",
                "pt_shipements.code as shipment_code",
                "pt_shipements.end_date",
                "pt_shipements.pass_mark",
                "pt_shipements.round_name as round_name",
                "laboratories.id as lab_id",
                "users.name as first_name",
                "users.second_name as surname",
                "laboratories.phone_number",
                "laboratories.lab_name",
                "laboratories.email as lab_email",
                "ptsubmissions.id as ptsubmission_id",
                "ptsubmissions.created_at as submission_date",
                "ptsubmissions.updated_at  as updated_at",
                "ptsubmissions.testing_date",
                "ptsubmissions.kit_expiry_date",
                "ptsubmissions.kit_date_received",
                "ptsubmissions.pt_lot_no",
                "ptsubmissions.qa_responses as survey_responses",
            ]);

            //  one
            $shipmentsRefResult = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->join('pt_panels', 'pt_panels.id', '=', 'laboratory_pt_shipement.pt_panel_id')
                ->join('survey_questions', 'survey_questions.shipment_id', '=', 'pt_shipements.id')
                ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id');

            $shipmentsRefResult = $shipmentsRefResult->where('ptsubmissions.id', $id);

            $shipmentsRefResult = $shipmentsRefResult->get([
                "pt_samples.reference_result as reference_result",
                "pt_samples.name as sample_name",
                "pt_panels.id as ref_panel_id",
                "pt_panels.name as ref_panel_name",
                "pt_shipements.round_name as round_name"
            ]);


            //  two
            $shipmentsResponsesRlt = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->leftJoin('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'ptsubmissions.id')
                ->join('pt_panels', 'pt_panels.id', '=', 'ptsubmissions.pt_panel_id')
                ->join('pt_samples', 'pt_samples.id', '=', 'pt_submission_results.sample_id');


            $shipmentsResponsesRlt = $shipmentsResponsesRlt->where('ptsubmissions.id', $id);

            $shipmentsResponsesRlt = $shipmentsResponsesRlt->get([
                "pt_submission_results.interpretation as result_interpretation",
                "pt_submission_results.control_line as control_line",
                "pt_submission_results.verification_line as verification_line",
                "pt_submission_results.longterm_line as longterm_line",
                "ptsubmissions.pt_panel_id as panel_id",
                "pt_samples.name as sample_name",
                "ptsubmissions.id as submission_id",
            ]);

            foreach ($shipmentsResponses as $key => $value) {
                $shipmentsResponses[$key]->survey_responses = json_decode($value->survey_responses);

                foreach ($shipmentsResponses[$key]->survey_responses as $key1 => $value1) {
                    $shipmentsResponses[$key]->survey_responses[$key1]->question = SurveyQuestion::find($value1->question_id)->question;
                }
            }



            return [
                'shipmentsResponses' => $shipmentsResponses, 'sample_results' => $shipmentsResponsesRlt, 'reference_results' => $shipmentsRefResult
            ];
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch report data: ' . $ex->getMessage()], 500);
        }
        // 7777777777777
    }
}
