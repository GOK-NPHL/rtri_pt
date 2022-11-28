<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Laboratory;
use App\Lot;
use App\Readiness;
use App\ReadinessApproval;
use App\ReadinessQuestion;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PTReadinessController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth:admin');
    }

    public function saveReadiness(Request $request)
    {
        try {
            $user = Auth::user();

            $checklist = Readiness::where('name', $request->readiness['name'])->get();
            if (count($checklist) > 0) {
                return response()->json(['Message' => 'Error during creating Checklist. Checklist name already exist '], 500);
            }

            $readiness = Readiness::create([
                'name' => $request->readiness['name'],
                'start_date' => $request->readiness['start_date'],
                'end_date' => $request->readiness['end_date'],
                'ask_default_qn' => $request->ask_default_qn ?? $request->readiness['ask_default_qn'] ?? 0,
                'admin_id' => $user->id
            ]);

            // Save questions
            foreach ($request->readiness['readiness_questions'] as $questionItem) {
                if ($questionItem != null) {
                    $readinessQuestion = new ReadinessQuestion();
                    $readinessQuestion->question = $questionItem['question'];
                    $readinessQuestion->answer_options = $questionItem['answer_options'];
                    $readinessQuestion->answer_type = $questionItem['answer_type'];
                    $readinessQuestion->qustion_position = $questionItem['qustion_position'];
                    $readinessQuestion->qustion_type = $questionItem['qustion_type'];
                    $readinessQuestion->is_required = $questionItem['is_required'];
                    $readinessQuestion->is_default = false;
                    // $readiness->readinessQuestion()->associate($readinessQuestion);
                    $readinessQuestion->readiness()->associate($readiness);
                    $readinessQuestion->save();
                }
            }

            // Save laboratiories
            $readiness->laboratories()->attach($request->readiness['participants']);

            // Save lots
            //////////////


            // // create lots with the participants
            // step 1: get all the participants
            $participants = [];
            foreach ($request->readiness['participants'] as $participant) {
                $lab = Laboratory::find($participant);
                $lab_participants = $lab->participants();
                foreach ($lab_participants as $lab_participant) {
                    $participants[] = [
                        'user_id' => $lab_participant->id,
                        'user_name' => $lab_participant->name . ' - ' . $lab_participant->second_name,
                        'lab_id' => $lab->id,
                        'lab_name' => $lab->lab_name,
                    ];
                }
            }
            // dd(json_encode($participants));

            // step 2: randomize the order of the participants
            $randomized_participants = $participants;
            shuffle($randomized_participants);
            // dd(json_encode($randomized_participants));

            // divide the participants into groups
            // the groups have to be as equal as possible
            // the number of groups is the no_lots in the readiness
            $groups = [];
            $no_lots = $request->readiness['no_lots'];
            $group_size = ceil(count($randomized_participants) / $no_lots);
            $group = [];
            $group_count = 0;
            foreach ($randomized_participants as $participant) {
                $group[] = $participant;
                if (count($group) == $group_size) {
                    $groups[] = $group;
                    $group = [];
                    $group_count++;
                }
            }
            if (count($group) > 0) {
                $groups[] = $group;
            }

            // step 3: create the lots
            foreach ($groups as $key => $group) {
                try {
                    $lot = new Lot();
                    $lot->name = "Lot " . ($key + 1) . " ( Readiness: " . $readiness->name . " )";
                    // pluck the user ids from the group
                    $user_ids = array_column($group, 'user_id');
                    $lot->participant_ids = json_encode($user_ids);
                    $lot->readiness_id = $readiness->id;
                    $lot->created_by = $user->id;
                    $lot->save();
                } catch (Exception $e) {
                    Log::error($e->getMessage());
                    return response()->json(['Message' => 'Error during creating Checklist Lots' . $e->getMessage()], 500);
                }
            }
            //////////////

            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    // get default readiness questions
    public function getDefaultReadinessQuestions(Request $request)
    {
        try {
            $readinessQuestions = ReadinessQuestion::where('is_default', 1)->get();
            return $readinessQuestions;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not fetch default readiness questions ' . $ex->getMessage()], 500);
        }
    }


    public function editReadiness(Request $request)
    {
        try {

            $user = Auth::user();
            $checklist = Readiness::find($request->readiness['id']);

            $checklist->name = $request->readiness['name'];
            $checklist->start_date = $request->readiness['start_date'];
            $checklist->end_date = $request->readiness['end_date'];
            $checklist->ask_default_qn = $request->readiness['ask_default_qn'] ?? 0;
            $checklist->admin_id = $user->id;
            $checklist->save();

            // Save questions
            foreach ($request->readiness['readiness_questions'] as $questionItem) {
                $readinessQuestion = null;

                if (empty($questionItem['id'])) {
                    $readinessQuestion = new ReadinessQuestion();
                } else {
                    $readinessQuestion = ReadinessQuestion::find($questionItem['id']);
                }

                if ($questionItem['delete_status'] == 1) {

                    try {
                        DB::table('readiness_questions')->where('id', $questionItem['id'])->delete();
                    } catch (Exception $ex) {
                        Log::error($ex);
                    }
                } else {
                    $readinessQuestion->question = $questionItem['question'];
                    $readinessQuestion->answer_options = $questionItem['answer_options'];
                    $readinessQuestion->answer_type = $questionItem['answer_type'];
                    $readinessQuestion->qustion_position = $questionItem['qustion_position'];
                    $readinessQuestion->qustion_type = $questionItem['qustion_type'];
                    $readinessQuestion->is_required = $questionItem['is_required'];
                    $readinessQuestion->is_default = false;

                    $readinessQuestion->readiness()->associate($checklist);

                    $readinessQuestion->save();
                }
            }

            // Save laboratiories
            DB::table('laboratory_readiness')->where('readiness_id', $request->readiness['id'])->delete();
            $checklist->laboratories()->attach($request->readiness['participants']);
            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    public function getReadiness(Request $request)
    {
        try {

            $readinesses = Readiness::select(
                "readinesses.id",
                "readinesses.name",
                "readinesses.updated_at as last_update",
                "readinesses.ask_default_qn",
                "readinesses.end_date",
                "admins.name as created_by",
                DB::raw('count(*) as participant_count')
            )->join('admins', 'admins.id', '=', 'readinesses.admin_id')
                ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                ->groupBy('laboratory_readiness.readiness_id')
                ->orderBy('last_update', 'DESC')
                ->get();

            return $readinesses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipmentReadiness(Request $request)
    {
        try {
            $include_submitted = (isset($request->get_all) || $request->get_all == 1) ? true : false;
            // SELECT readiness_id FROM rtript.pt_shipements where readiness_id is not null
            if ($include_submitted) {
                $readinesses = Readiness::select(
                    "readinesses.id",
                    "readinesses.name",
                    "readinesses.updated_at as last_update",
                    "readinesses.ask_default_qn",
                    "admins.name as created_by",
                )->join('admins', 'admins.id', '=', 'readinesses.admin_id')
                    ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                    ->groupBy('laboratory_readiness.readiness_id')
                    ->orderBy('last_update', 'DESC')
                    ->get();
            } else {
                $readinesses = Readiness::select(
                    "readinesses.id",
                    "readinesses.name",
                    "readinesses.updated_at as last_update",
                    "readinesses.ask_default_qn",
                    "admins.name as created_by",
                )->join('admins', 'admins.id', '=', 'readinesses.admin_id')
                    ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                    ->whereNotIn(
                        'readinesses.id',
                        DB::table('pt_shipements')->select('readiness_id')->whereNotNull('readiness_id')->get()->pluck('readiness_id')->toArray()
                    )
                    ->groupBy('laboratory_readiness.readiness_id')
                    ->orderBy('last_update', 'DESC')
                    ->get();
            }

            return $readinesses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }


    public function getReadinessById(Request $request)
    {
        try {

            $readinessQuestions = DB::table('readiness_questions')
                ->select('readiness_questions.id', 'question', 'answer_options', 'answer_type', 'qustion_position', 'qustion_type', 'is_required', 'is_default')
                ->join('readinesses', 'readiness_questions.readiness_id', '=', 'readinesses.id')
                ->where('readinesses.id', $request->id)
                ->get();

            $labs = Laboratory::select(
                "laboratories.id",
                //  "laboratories.lab_name",
            )
                ->join('laboratory_readiness', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
                ->where('laboratory_readiness.readiness_id', $request->id)
                ->get();

            $labIds = [];
            foreach ($labs as $lab) {
                $labIds[] = $lab->id;
            }

            $readiness = Readiness::select(
                "readinesses.id",
                "readinesses.name",
                "readinesses.start_date",
                "readinesses.end_date",
                "readinesses.ask_default_qn",
            )
                ->where('readinesses.id', $request->id)
                ->get();

            $lots = Lot::where('readiness_id', $request->id)->get();

            $response = [];
            $response['readiness'] = $readiness;
            $response['labs'] = $labIds;
            $response['participants'] = [];
            foreach ($labs as $lab) {
                $laboratory = Laboratory::find($lab->id);
                if ($laboratory) {
                    $lab_staff = $laboratory->participants();
                    $response['participants'][] = [
                        'id' => $laboratory->id,
                        'name' => $laboratory->lab_name,
                        'staff' => $lab_staff
                    ];
                }
            }
            $response['questions'] = $readinessQuestions;
            $response['lots'] = $lots;

            $envelop = [];
            $envelop['payload'] = $response;

            return $envelop;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness: ' . $ex->getMessage()], 500);
        }
    }

    public function approveReadinessAnswer(Request $request)
    {
        try {

            $user = Auth::user();

            $readinessAswers = ReadinessApproval::updateOrCreate(

                [
                    'lab_id' => $request->lab_id,
                    'readiness_id' =>  $request->readiness_id

                ],
                [
                    'lab_id' => $request->lab_id,
                    'readiness_id' =>  $request->readiness_id,
                    'admin_id' => $user->id,
                    'approved' => 1
                ]

            );

            return response()->json(['Message' => 'Approval success'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not Approval success request:  ' . $ex->getMessage()], 500);
        }
    }
}
