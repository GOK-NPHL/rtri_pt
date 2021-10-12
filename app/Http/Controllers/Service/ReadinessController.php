<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Readiness;
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

            $readinesses = Readiness::select(
                "readinesses.id",
                "readinesses.start_date",
                "readinesses.end_date",
                "readinesses.name",
                "readinesses.admin_id",
                "readiness_answers.readiness_id as aswered_id"
                // "readiness_questions.question",
                // "readiness_questions.answer_options",
                // "readiness_questions.answer_type",
                // "readiness_questions.qustion_position",
                // "readiness_questions.qustion_type",

            )->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
                ->leftJoin('readiness_answers', 'readinesses.id', '=', 'readiness_answers.readiness_id')
                // ->join('readiness_questions', 'readiness_questions.readiness_id', '=', 'readinesses.id')
                ->where('users.id', $user->id)
                ->orderBy('readinesses.created_at', 'Desc')
                ->get();

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
}
