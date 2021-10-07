<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\PtSubmissionResult;
use App\ptsubmission as SubmissionModel;
use Exception;
use Illuminate\Http\Request;
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
            Log::info("=========>> Submission data");
            Log::info($request->submission);
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

            // $ptLtResult = new PtSubmissionResult([
            //     "control_line" => $submission["resultLongterm"]["c"],
            //     "verification_line" => $submission["resultLongterm"]["v"],
            //     "interpretation" => $submission["ptLongtermIntepreation"],
            //     "longterm_line" => $submission["resultLongterm"]["lt"],
            //     "ptsubmission_id" => $submissionId,
            //     "type" => "longterm"
            // ]);
            // $ptLtResult->save();

            // $ptNegativeResult = new PtSubmissionResult([
            //     "control_line" => $submission["resultNegative"]["c"],
            //     "verification_line" => $submission["resultNegative"]["v"],
            //     "interpretation" => $submission["ptNegativeIntepreation"],
            //     "longterm_line" => $submission["resultNegative"]["lt"],
            //     "ptsubmission_id" => $submissionId,
            //     "type" => "negative"

            // ]);
            // $ptNegativeResult->save();

            // $ptRecentResult = new PtSubmissionResult([

            //     "control_line" => $submission["resultRecent"]["c"],
            //     "verification_line" => $submission["resultRecent"]["v"],
            //     "interpretation" => $submission["ptRecentIntepreation"],
            //     "longterm_line" => $submission["resultRecent"]["lt"],
            //     "ptsubmission_id" => $submissionId,
            //     "type" => "recent"
            // ]);
            // $ptRecentResult->save();

            // $this->saveNegativeRepeats($submission, $submissionId);
            // $this->saveRecentRepeats($submission, $submissionId);
            // $this->saveLongtermRepeats($submission, $submissionId);

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
}
