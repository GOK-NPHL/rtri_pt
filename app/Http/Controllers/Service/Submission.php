<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\PtSubmissionResult;
use App\ptsubmission as SubmissionModel;
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
                "other_not_tested_reason" => $submission["ptNotTestedOtherReason"],
                "pt_shipements_id" => $submission["ptShipementId"]

            ]);

            $submissionModel->save();
            $submissionId = $submissionModel->id;


            // if (count($submission["samples"]) > 0) {

            foreach ($submission["samples"] as $key => $val) {

                $ptLtResult = new PtSubmissionResult([
                    "control_line" => $val["visual"]["c"],
                    "verification_line" => $val["visual"]["v"],
                    "interpretation" => $val["interpretation"],
                    "longterm_line" => $val["visual"]["lt"],
                    "ptsubmission_id" => $submissionId,
                    "sample_id" => $key
                ]);
                $ptLtResult->save();
            }

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
        try {

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
                'ptsubmissions.not_test_reason',
                'ptsubmissions.other_not_tested_reason',
                'laboratories.email',
                'ptsubmissions.lab_id',
                'laboratories.lab_name',
                'laboratories.mfl_code'

            )->join('laboratories', 'laboratories.id', '=', 'ptsubmissions.lab_id')

                ->where('ptsubmissions.lab_id', '=', $user->laboratory_id)
                ->where('ptsubmissions.pt_shipements_id', '=', $request->id)
                ->get();


            $submissionResults = DB::table('pt_submission_results')
                ->select('sample_id', 'control_line', 'verification_line', 'longterm_line', 'interpretation')
                ->where('ptsubmission_id', $request->id)
                ->get();

            $payload = ['data' => $submission, 'test_results' => $submissionResults];

            return $payload;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }
}
