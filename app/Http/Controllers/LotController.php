<?php

namespace App\Http\Controllers;

use App\Laboratory;
use App\Lot;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class LotController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin', ['except' => ['signOut', 'adminLogin', 'doLogin']]);
    }
    // crud pages
    public function index()
    {
        return view('user.pt.lots.index');
    }

    public function show()
    {
        return view('user.pt.lots.show');
    }

    public function show_participants()
    {
        return view('user.pt.lots.index_participants');
    }

    public function create()
    {
        return view('user.pt.lots.create', [
            'user' => FacadesAuth::user(),
        ]);
    }

    public function edit()
    {
        return view('user.pt.lots.edit');
    }

    // crud actions
    public function getLots(Request $request)
    {
        $lots = Lot::where('deleted_at', null)->get();
        foreach ($lots as $lot) {
            $lot->participant_count = count($lot->participants());
            $lot->shipment = $lot->shipment();
        }
        return response()->json($lots);
    }
    public function getLot(Request $request)
    {
        $lot = Lot::where('id', $request->id)->first();
        return response()->json($lot);
    }
    public function getLotByShipmentId(Request $request)
    {
        $lot = Lot::where('shipment_id', $request->shipment_id)->first();
        return response()->json($lot);
    }
    public function getLotParticipants(Request $request)
    {
        // $lot = Lot::where('id', $request->id)->first();
        // $participants = $lot->participants();
        // foreach ($participants as $usr) {
        //     // dd($usr['laboratory_id']);
        //     if($usr['laboratory_id']){
        //         $usr['lab'] = Laboratory::where('id', $usr['laboratory_id'])->first();
        //     }else{
        //         $usr['lab'] = null;
        //     }
        // }
        // return response()->json($participants);

        $lot = Lot::where('id', $request->id)->first();
        $ending_ids = explode(",", $request->ending_ids);

        $participants = [];
        foreach ($ending_ids as $ending_id) {
            $participant = User::select('users.*', 
            'laboratories.institute_name', 'laboratories.lab_name',  'laboratories.facility_level', 'laboratories.mfl_code'
            )
                ->join('laboratories', 'users.laboratory_id', '=', 'laboratories.id')
                ->where('users.id', 'like', '%' . $ending_id);
            if ($participant) {
                // array_push($participants, $participant);
                $participants = array_merge($participants, $participant->get()->toArray());
            }
        }
        return response()->json($participants);
    }
    public function createLot(Request $request)
    {
        $lot = Lot::create([
            'name' => $request->name,
            'shipment_id' => $request->shipment_id,
            // 'lot' => $request->lot,
            'ending_ids' => $request->ending_ids,
            'created_by' => $request->created_by ?? Auth::user()->id,
        ]);
        return response()->json($lot);
    }

    public function updateLot(Request $request)
    {
        $lot = Lot::where('id', $request->id)->first();
        if ($lot) {
            $lot->name = $request->name;
            $lot->shipment_id = $request->shipment_id;
            // $lot->lot = $request->lot;
            $lot->ending_ids = $request->ending_ids;
            $lot->created_by = $request->created_by;
            $lot->save();
            return response()->json($lot);
        } else {
            return response()->json(['message' => 'Lot not found.'], 404);
        }
    }

    public function deleteLot(Request $request)
    {
        $lot = Lot::where('id', $request->id)->first();
        if ($lot) {
            $lot->delete();
            return response()->json(['message' => 'Lot deleted.']);
        } else {
            return response()->json(['message' => 'Lot not found.'], 404);
        }
    }
}
