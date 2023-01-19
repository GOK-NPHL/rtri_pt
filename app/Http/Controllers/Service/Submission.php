<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\PtSubmissionResult;
use App\ptsubmission as SubmissionModel;
use App\ResourceFiles;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Submission extends Controller
{



    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function createSubmission(Request $request)
    {
        try {
            $submission = $request->submission;
            // $submission = json_decode($request->input('submission'), true);
            // // Log::info("Submission::" . json_encode($submission));
            // if (!$submission) {
            //     return response()->json([
            //         'status' => 'error',
            //         'message' => 'Invalid submission',
            //     ], 400);
            // }
            $file_id = null;
            // save file and get id
            if ($request->hasFile('file')) {
                Log::info("Submission with file::" . json_encode($submission));
                $file = $request->file('file');
                $banned_files = ['exe', 'sh', 'bat', 'php', 'go', 'js', 'py', 'rb', 'pl', 'sh', 'c', 'cpp', 'java', 'cs', 'html', 'css', 'json', 'xml', 'sql', 'dmg', null, 'bin', 'jar', 'ts', 'cpp'];
                $name = $file->getClientOriginalName();
                // make name unique
                $new_name = uniqid() . '_' . $name;
                // strip, lowercase, and clean file name
                $new_name = strtolower(str_replace([' ', '-'], '_', $new_name));
                $extension = $file->getClientOriginalExtension();
                if (in_array($extension, $banned_files)) {
                    Log::info("Submission file NOT Saved:: BAD_FILE_TYPE");
                    return response()->json([
                        'status' => 'error',
                        'message' => 'File type not allowed',
                    ])->status(400);
                }
                $path = storage_path('submissions/' . $new_name);
                $file->move(storage_path('submissions'), $new_name);
                $file = new ResourceFiles();
                $file->name = $new_name;
                $file->path = $path;
                $file->type = mime_content_type($path); //$file->getMimeType();
                $file->size = filesize($path); //$file->getSize();
                $file->is_public = false;
                $file->is_ptfile = true;
                $file->save();
                $file_id = $file->id;

                if (!$file_id) {
                    Log::info("Submission file NOT Saved::" . json_encode($submission));
                    return response()->json([
                        'status' => 'error',
                        'message' => 'File could not be saved',
                    ])->status(400);
                }
            }else{
                Log::info("Submission without file::" . json_encode($submission));
            }
            // else{
            $submissionModel = new SubmissionModel([
                "testing_date" => $submission["testingDate"],
                "kit_date_received" => $submission["kitReceivedDate"],
                "lot_date_received" => $submission["ptLotReceivedDate"],
                "kit_expiry_date" => $submission["kitExpiryDate"],
                "kit_lot_no" => $submission["kitLotNo"],
                "name_of_test" => $submission["nameOfTest"],
                "pt_lot_no" => $submission["ptLotNumber"],
                "lab_id" => $submission["labId"],
                "user_id" => $submission["userId"],
                "sample_reconstituion_date" => $submission["ptReconstituionDate"],
                "sample_type" => $submission["sampleType"],
                "tester_name" => $submission["testerName"],
                "test_justification" => $submission["testJustification"],
                "pt_tested" => $submission["isPTTested"],
                "not_test_reason" => $submission["ptNotTestedReason"],
                "other_not_tested_reason" => $submission["otherComments"] ? $submission["otherComments"] : $submission["ptNotTestedOtherReason"],
                "pt_shipements_id" => $submission["ptShipementId"],
                "pt_panel_id" => $submission["ptPanelId"],
                "pt_submission_file_id" => $file_id,
                "qa_responses" => $submission["qa_responses"],
            ]);

            Log::info('-----------------------Submission saved : '.json_encode($submissionModel));

            $submissionModel->save();
            $submissionId = $submissionModel->id;

            foreach ($submission["samples"] as $key => $val) {

                $ptLtResult = new PtSubmissionResult([
                    "control_line" => $val["visual"]["c"],
                    "verification_line" => $val["visual"]["v"],
                    "interpretation" => $val["interpretation"],
                    "longterm_line" => $val["visual"]["lt"],
                    "interpretation" => $val["interpretation"],
                    "ptsubmission_id" => $submissionId,
                    "sample_id" => $key
                ]);
                $ptLtResult->save();
            }
            // }
            // else {
            //     return response()->json([
            //         'status' => 'error',
            //         'message' => 'No file provided',
            //     ])->status(400);
            // }

            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save sumbmission: ' . $ex->getMessage()], 500);
        }
    }

    public function getSubmissions()
    {

        try {
            return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }

    public function getSubmissionById(Request $request)
    {

        $user = Auth::user();
        // try {

        $submission = SubmissionModel::select(
            'ptsubmissions.id',
            'ptsubmissions.testing_date',
            'ptsubmissions.name_of_test',
            'ptsubmissions.kit_lot_no',
            'ptsubmissions.kit_date_received',
            'ptsubmissions.kit_expiry_date',
            'ptsubmissions.pt_lot_no',
            'ptsubmissions.lot_date_received',
            'ptsubmissions.sample_reconstituion_date',
            'ptsubmissions.user_id',
            'ptsubmissions.sample_type',
            'ptsubmissions.tester_name',
            'ptsubmissions.test_justification',
            'ptsubmissions.pt_tested',
            'ptsubmissions.pt_panel_id',
            'ptsubmissions.not_test_reason',
            'ptsubmissions.other_not_tested_reason',
            'ptsubmissions.pt_submission_file_id',
            'laboratories.email',
            'ptsubmissions.lab_id',
            'laboratories.lab_name',
            'laboratories.mfl_code',
            'pt_shipements.test_instructions',

        )->join('laboratories', 'laboratories.id', '=', 'ptsubmissions.lab_id')
            ->join('pt_shipements', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
            ->where('ptsubmissions.lab_id', '=', $user->laboratory_id)
            ->where('ptsubmissions.id', '=', $request->id)
            ->get();

        if ($submission->count() > 0) {
            $submission[0]->file = ResourceFiles::find($submission[0]->pt_submission_file_id);
        }

        $submissionResults = DB::table('pt_submission_results')
            ->select('sample_id', 'control_line', 'verification_line', 'longterm_line', 'interpretation')
            ->where('ptsubmission_id', $request->id)
            ->get();

        $payload = ['data' => $submission[0], 'test_results' => $submissionResults];

        return $payload;
        // return SubmissionModel::all();
        // } catch (Exception $ex) {
        //     return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        // }
    }


    public function updateSubmission(Request $request)
    {

        try {
            $submission = $request->submission;

            $submissionModel = SubmissionModel::find($submission['id']);

            $submissionModel->testing_date = $submission["testingDate"];
            $submissionModel->kit_date_received = $submission["kitReceivedDate"];
            $submissionModel->lot_date_received = $submission["ptLotReceivedDate"];
            $submissionModel->kit_expiry_date = $submission["kitExpiryDate"];
            $submissionModel->kit_lot_no = $submission["kitLotNo"];
            $submissionModel->name_of_test = $submission["nameOfTest"];
            $submissionModel->pt_lot_no = $submission["ptLotNumber"];
            $submissionModel->lab_id = $submission["labId"];
            $submissionModel->user_id = $submission["userId"];
            $submissionModel->sample_reconstituion_date = $submission["ptReconstituionDate"];
            $submissionModel->sample_type = $submission["sampleType"];
            $submissionModel->tester_name = $submission["testerName"];
            $submissionModel->test_justification = $submission["testJustification"];
            $submissionModel->pt_tested = $submission["isPTTested"];
            $submissionModel->not_test_reason = $submission["ptNotTestedReason"];
            // $submissionModel->other_not_tested_reason = $submission["ptNotTestedOtherReason"] ?? $submission["otherComments"];
            $submissionModel->not_test_reason = $submission["otherComments"] ? $submission["otherComments"] : $submission["ptNotTestedOtherReason"];
            $submissionModel->pt_shipements_id = $submission["ptShipementId"];
            $submissionModel->pt_panel_id = $submission["ptPanelId"];
            $submissionModel->qa_responses = $submission["qa_responses"];

            $submissionModel->save();

            DB::table('pt_submission_results')->where('ptsubmission_id', $submission['id'])->delete();

            foreach ($submission["samples"] as $key => $val) {

                $ptLtResult = new PtSubmissionResult([
                    "control_line" => $val["visual"]["c"] ?? null,
                    "verification_line" => $val["visual"]["v"] ?? null,
                    "longterm_line" => $val["visual"]["lt"] ?? null,
                    "interpretation" => $val["interpretation"],
                    "ptsubmission_id" =>  $submission['id'],
                    "sample_id" => $key
                ]);
                $ptLtResult->save();
            }

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save sumbmission: ' . $ex->getMessage()], 500);
        }
    }
}
