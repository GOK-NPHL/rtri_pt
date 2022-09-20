<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Laboratory;
use App\Lot;
use App\PtPanel;
use App\PtSample;
use App\PtShipement;
use App\Readiness;
use App\ReadinessQuestion;
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
            $shipments = PtShipement::where('deleted_at', null)->get();
            foreach ($shipments as $shipment) {
                // get panels
                $panel = PtPanel::find($shipment->ptpanel_id);
                if ($panel) {
                    $shipment->panel = [
                        'id' => $panel->id,
                        'name' => $panel->name,
                        'participant_count' => count($panel->participants()),
                    ];
                }
            }
            return $shipments;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipmentById(Request $request)

    {

        try {
            $labIds = [];
            $shipment = PtShipement::find($request->id);
            if($shipment){
                $panel = PtPanel::find($shipment->ptpanel_id)->first();
                /////
                if($panel){
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
                /////
                //get participants
                // if (empty($shipment->readiness_id)) {
                //     $labs = PtShipement::select(
                //         "laboratory_pt_shipement.laboratory_id"
                //     )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                //         ->where('id', $request->id)
                //         ->get();
                //     $labIds = [];
                //     foreach ($labs as $lab) {
                //         $labIds[] = $lab->laboratory_id;
                //     }
                // }
    
                //get samples
                // $ptSamples = PtSample::select(
                //     "pt_samples.id",
                //     "name",
                //     "reference_result"
                // )->join('pt_shipements', 'pt_shipements.id', '=', 'pt_samples.ptshipment_id')
                //     ->where('pt_shipements.id', $request->id)
                //     ->get();
    
                $payload = [];
                $payload['shipment'] = $shipment;
                $payload['labs'] = $labIds;
                $payload['panel'] = $panel;
                $payload['samples'] = $panel->samples;
                return $payload;
            }else{
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

            if (empty($request->shipement['panel_id']) && count($request->shipement['selected']) == 0) {
                return response()->json(['Message' => 'Please select a panel for this shipment '], 500);
            }

            // $participantsList = [];

            // if (empty($request->shipement['readiness_id'] == true)) {

            //     $participantsList = $request->shipement['selected'];
            // }

            $shipment = PtShipement::create([
                'pass_mark' => $request->shipement['pass_mark'],
                'round_name' => $request->shipement['round'],
                'code' => $request->shipement['shipment_code'],
                'end_date' => $request->shipement['result_due_date'],
                'test_instructions' => $request->shipement['test_instructions'],
                'ptpanel_id' => (empty($request->shipement['panel_id']) ? null : $request->shipement['panel_id'])
                // 'readiness_id' => (empty($request->shipement['readiness_id']) ? null : $request->shipement['readiness_id'])
            ]);

            $panel = PtPanel::find($request->shipement['panel_id']);

            //save participants
            // $shipment->laboratories()->attach($participantsList); /// REMOVE THIS

            // attach panel //// NON-FUNCTIONAL
            // if ($panel && $shipment) {
            //     $shipment->ptpanel()->attach($request->shipement['panel_id']);
            // }

            // Save laboratiories
            // $readiness->laboratories()->attach($request->shipement['participants']);
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
            $shipments->test_instructions = $request->shipement['test_instructions'];
            $shipments->ptpanel_id = $request->shipement['panel_id'] ?? $request->shipement['ptpanel_id'];

            $shipments->save();

            // save participants
            // $shipments->laboratories()->sync($participantsList);

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    public function getUserSamples()
    {
        $user = Auth::user();
        $user_id = 1; // $user->id;

        try {

            $shipments = PtShipement::select( //when using labs
                "pt_shipements.id",
                "pt_shipements.id as pt_shipements_id",
                "pt_shipements.round_name",
                "pt_shipements.code",
                "pt_shipements.start_date",
                "pt_shipements.end_date",
                "pt_shipements.test_instructions",
                "pt_samples.id as sample_id",
                "pt_samples.name as sample_name",
                "ptsubmissions.id as submission_id",
                DB::raw("1 as is_readiness_answered"),
                DB::raw("null as readiness_id"),
                DB::raw("1 as readiness_approval_id")

            )
                ////
                ->leftJoin('pt_panels', 'readiness_id', '=', 'pt_panels.readiness_id')
                ////
                ->leftJoin('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
                ->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                //// ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
                ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id')
                ->join('laboratories', 'laboratory_pt_shipement.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
                ->where('users.id', $user_id);

            $shipments2 = PtShipement::select( //when using readiness
                "pt_shipements.id",
                "pt_shipements.id as pt_shipements_id",
                "pt_shipements.round_name",
                "pt_shipements.code",
                "pt_shipements.start_date",
                "pt_shipements.end_date",
                "pt_shipements.test_instructions",
                "pt_samples.id as sample_id",
                "pt_samples.name as sample_name",
                "ptsubmissions.id as submission_id",
                "readiness_answers.id as is_readiness_answered", //check if readiness for this shipment id filled
                //// "pt_shipements.readiness_id as readiness_id",
                "pt_panels.readiness_id as readiness_id",
                "readiness_approvals.id as readiness_approval_id"

            )
                ////
                ->leftJoin('pt_panels', 'readiness_id', '=', 'pt_panels.readiness_id')
                ////
                ->leftJoin('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
                //// ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
                ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_panels.readiness_id')
                ->leftJoin('readiness_answers',  'laboratory_readiness.readiness_id', '=',  'readiness_answers.readiness_id')
                ->leftJoin('readiness_approvals', 'readiness_answers.laboratory_id', '=',  'readiness_approvals.lab_id')
                //// ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
                ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id')
                ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')

                ->where('users.id', $user_id)
                ->union($shipments)
                // ->orderBy('pt_shipements.end_date')
                ->get();

            $payload = [];
            $sampleIds = [];

            foreach ($shipments2 as $lab) {

                if ($lab->round_name == "round 20") {
                    // Log::info($lab);
                }
                if (array_key_exists($lab->id, $payload)) {
                    if (!array_key_exists($lab->sample_id, $sampleIds)) {
                        $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];
                        $sampleIds[$lab->sample_id] = 1;
                    }
                } else {

                    if (!array_key_exists($lab->sample_id, $sampleIds)) {
                        $sampleIds[$lab->sample_id] = 1;
                        $payload[$lab->id] = [];
                        $payload[$lab->id]['samples'] = [];
                        $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];

                        $payload[$lab->id]['test_instructions'] = $lab->test_instructions;
                        $payload[$lab->id]['id'] = $lab->id;
                        $payload[$lab->id]['pt_shipements_id'] = $lab->pt_shipements_id;
                        $payload[$lab->id]['start_date'] = $lab->start_date;
                        $payload[$lab->id]['code'] = $lab->code;
                        $payload[$lab->id]['end_date'] = $lab->end_date;
                        $payload[$lab->id]['round_name'] = $lab->round_name;
                        $payload[$lab->id]['submission_id'] = $lab->submission_id;
                        $payload[$lab->id]['is_readiness_answered'] = $lab->is_readiness_answered;
                        $payload[$lab->id]['readiness_id'] = $lab->readiness_id;
                        $payload[$lab->id]['readiness_approval_id'] = $lab->readiness_approval_id;
                    }
                }
            }

            return $payload;
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
                ->join('resource_files', 'ptsubmissions.pt_submission_file_id', '=', 'resource_files.id')
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


    public function getShipmentResponseReport($id,  $is_part)
    {
        $user = Auth::user();
        try {

            $shipmentsResponses = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('pt_panels', 'pt_panels.id', '=', 'pt_shipements.ptpanel_id')
                ->join('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'ptsubmissions.id')
                ->join('laboratories', 'ptsubmissions.lab_id', '=', 'laboratories.id')
                ->join('users', 'ptsubmissions.user_id', '=', 'users.id');

            if ($is_part == 1) {
                $shipmentsResponses = $shipmentsResponses->where('ptsubmissions.lab_id', $user->laboratory_id)
                    ->where('ptsubmissions.pt_shipements_id', $id);
            } else {
                $shipmentsResponses = $shipmentsResponses->where('ptsubmissions.id', $id);
            }

            $shipmentsResponses = $shipmentsResponses->get([
                "pt_shipements.id",
                "pt_shipements.created_at as shipment_date",
                "pt_shipements.code",
                "pt_shipements.end_date",
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
                ->join('pt_panels', 'pt_panels.id', '=', 'pt_shipements.ptpanel_id')
                ->join('pt_samples', 'pt_samples.ptpanel_id', '=', 'pt_panels.id');

            $shipmentsRefResult = $shipmentsRefResult->get([
                "pt_samples.reference_result as reference_result",
                "pt_samples.name as sample_name"
            ]);


            //  two
            $shipmentsResponsesRlt = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->leftJoin('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'ptsubmissions.id')
                ->join('pt_samples', 'pt_samples.id', '=', 'pt_submission_results.sample_id');
            if ($is_part == 1) {
                $shipmentsResponsesRlt = $shipmentsResponsesRlt->where('ptsubmissions.lab_id', $user->laboratory_id)
                    ->where('ptsubmissions.pt_shipements_id', $id);
            } else {
                $shipmentsResponsesRlt = $shipmentsResponsesRlt->where('ptsubmissions.id', $id);
            }

            $shipmentsResponsesRlt = $shipmentsResponsesRlt->get([
                "pt_submission_results.interpretation as result_interpretation",
                "pt_submission_results.control_line as control_line",
                "pt_submission_results.verification_line as verification_line",
                "pt_submission_results.longterm_line as longterm_line",
                "pt_samples.name as sample_name"
            ]);


            $dataPayload = [];
            foreach ($shipmentsRefResult as $refRslt) {
                foreach ($shipmentsResponsesRlt as $rslt) {
                    if ($refRslt->sample_name == $rslt->sample_name) {
                        $data = [];
                        $data['result_interpretation'] = $rslt->result_interpretation;
                        $data['sample_name'] = $refRslt->sample_name;
                        $data['reference_result'] = $refRslt->reference_result;
                        $data['control_line'] = $rslt->control_line ?? null;
                        $data['verification_line'] = $rslt->verification_line ?? null;
                        $data['longterm_line'] = $rslt->longterm_line ?? null;
                        $dataPayload[] = $data;
                    }
                }
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
        return $this->geSamples($request->id);
    }
}
