<?php

namespace App\Http\Controllers;

use App\Laboratory;
use App\Lot;
use App\PtPanel;
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
            // $lot->readiness = $lot->readiness();
            $lr = $lot->readiness();
            if($lr){
                $lot->readiness_name = $lr->name;
            }
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
        $participants = [];
        $lot = Lot::where('id', $request->id)->first();
        $pcpts = $lot->participants();

        // add laboratory info
        foreach ($pcpts as $pcpt) {
            if($pcpt['laboratory_id'] != null){
                $pc_lab = Laboratory::where('id', $pcpt['laboratory_id'])->first();
                if($pc_lab != null){
                    $pcpt['lab_name'] = $pc_lab->lab_name;
                    $pcpt['mfl_code'] = $pc_lab->mfl_code;
                }
            }
            $participants[] = $pcpt;
        }
        
        return response()->json($participants);
    }
    public function createLot(Request $request)
    {
        $lot = Lot::create([
            'name' => $request->name,
            'readiness_id' => $request->readiness_id,
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
            $lot->readiness_id = $request->readiness_id;
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
        $lotid = $lot->id;
        if ($lot) {
            // remove lot id from lots array in pt panels
            $panels = PtPanel::where('deleted_at', null)->get();
            foreach ($panels as $panel) {
                $lots = $panel->lots;
                if (in_array($lotid, $lots)) {
                    $newlots = [];
                    foreach ($lots as $lot) {
                        if ($lot != $lotid) {
                            $newlots[] = $lot;
                        }
                    }
                    $panel->lots = $newlots;
                    $panel->save();
                }
            }
            $lot->delete();
            return response()->json(['message' => 'Lot deleted.']);
        } else {
            return response()->json(['message' => 'Lot not found.'], 404);
        }
    }
}
