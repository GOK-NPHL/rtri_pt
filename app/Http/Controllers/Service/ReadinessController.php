<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Readiness;
use App\ReadinessAnswer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReadinessController extends Controller
{

    public function getReadinessSurvey(Request $request)
    {
        $user = Auth::user();
        try {

            // $readinesses = Readiness::select(

            $readinesses =   DB::table("readinesses")->distinct(
                // "readinesses.id",
                // "readinesses.start_date",
                // "readinesses.end_date",
                // "readinesses.name",
                // "readinesses.admin_id",
                // "readiness_answers.readiness_id as aswered_id"
            )

                // "readiness_questions.question",
                // "readiness_questions.answer_options",
                // "readiness_questions.answer_type",
                // "readiness_questions.qustion_position",
                // "readiness_questions.qustion_type",

                ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
                ->leftJoin('readiness_answers', 'readinesses.id', '=', 'readiness_answers.readiness_id')
                // ->join('readiness_questions', 'readiness_questions.readiness_id', '=', 'readinesses.id')
                ->where('users.id', $user->id)
                ->orderBy('readinesses.created_at', 'Desc')
                ->get([
                    "readinesses.id",
                    "readinesses.start_date",
                    "readinesses.end_date",
                    "readinesses.name",
                    "readinesses.admin_id",
                    "readiness_answers.readiness_id as aswered_id",
                    "readinesses.created_at"
                ]);

            return $readinesses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function getReadinessSurveyById(Request $request)
    {
        $user = Auth::user();
        try {

            $readinesses = Readiness::select(
                "readinesses.id",
                "readinesses.start_date",
                "readinesses.end_date",
                "readinesses.name",
                "readinesses.admin_id",
                "laboratories.id as lab_id",
                "readiness_questions.id as question_id",
                "readiness_questions.question",
                "readiness_questions.answer_options",
                "readiness_questions.answer_type",
                "readiness_questions.qustion_position",
                "readiness_questions.qustion_type",

            )->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                ->join('readiness_questions', 'readiness_questions.readiness_id', '=', 'readinesses.id')
                ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
                ->where('readinesses.id', $request->id)
                ->where('users.id', $user->id)
                ->get();

            return $readinesses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function saveSurveyAnswers(Request $request)
    {
        try {
            //$request->survey['questionsAnswerMap']
            $user = Auth::user();

            foreach ($request->survey['questionsAnswerMap']  as $key => $value) {
                $readinessAswers = ReadinessAnswer::create([
                    'question_id' => $key,
                    'answer' => $value,
                    'laboratory_id' => $request->survey['lab_id'],
                    'user_id' => $user->id,
                    'readiness_id' =>  $request->survey['readiness_id']
                ]);
                $readinessAswers->save();
            }

            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }
}
