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
                "lot_date_received" => $submission["qcLotReceivedDate"],
                "kit_expiry_date" => $submission["kitExpiryDate"],
                "kit_lot_no" => $submission["kitLotNo"],
                "name_of_test" => $submission["nameOfTest"],
                "qc_lot_no" => $submission["qcLotNumber"],
                "lab_id" => $submission["labId"],
                "user_id" => $submission["userId"],
                "sample_reconstituion_date" => $submission["qcReconstituionDate"],
                "sample_type" => $submission["sampleType"],
                "tester_name" => $submission["testerName"],
                "test_justification" => $submission["testJustification"],
                "qc_tested" => $submission["isQCTested"],
                "not_test_reason" => $submission["qcNotTestedReason"],
                "other_not_tested_reason" => $submission["qcNotTestedOtherReason"],

            ]);

            $submissionModel->save();
            $submissionId = $submissionModel->id;

            // $qcLtResult = new PtSubmissionResult([
            //     "control_line" => $submission["resultLongterm"]["c"],
            //     "verification_line" => $submission["resultLongterm"]["v"],
            //     "interpretation" => $submission["qcLongtermIntepreation"],
            //     "longterm_line" => $submission["resultLongterm"]["lt"],
            //     "qcsubmission_id" => $submissionId,
            //     "type" => "longterm"
            // ]);
            // $qcLtResult->save();

            // $qcNegativeResult = new PtSubmissionResult([
            //     "control_line" => $submission["resultNegative"]["c"],
            //     "verification_line" => $submission["resultNegative"]["v"],
            //     "interpretation" => $submission["qcNegativeIntepreation"],
            //     "longterm_line" => $submission["resultNegative"]["lt"],
            //     "qcsubmission_id" => $submissionId,
            //     "type" => "negative"

            // ]);
            // $qcNegativeResult->save();

            // $qcRecentResult = new PtSubmissionResult([

            //     "control_line" => $submission["resultRecent"]["c"],
            //     "verification_line" => $submission["resultRecent"]["v"],
            //     "interpretation" => $submission["qcRecentIntepreation"],
            //     "longterm_line" => $submission["resultRecent"]["lt"],
            //     "qcsubmission_id" => $submissionId,
            //     "type" => "recent"
            // ]);
            // $qcRecentResult->save();

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
