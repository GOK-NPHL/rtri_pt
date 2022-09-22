<?php

namespace App\Http\Controllers;

use App\Laboratory;
use App\Lot;
use App\PtPanel;
use App\PtSample;
use App\Readiness;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class PtPanelController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:admin', ['except' => ['signOut', 'adminLogin', 'doLogin']]);
    }
    // crud pages
    public function index()
    {
        return view('user.pt.panels.index');
    }

    public function show()
    {
        return view('user.pt.panels.show');
    }

    public function create()
    {
        return view('user.pt.panels.create', [
            'user' => FacadesAuth::user(),
        ]);
    }

    public function edit()
    {
        return view('user.pt.panels.edit');
    }

    // crud actions
    public function getPanels(Request $request)
    {
        $panels = PtPanel::where('deleted_at', null)->get();
        foreach ($panels as $panel) {
            // get lots
            $lots = $panel->lots;
            $lotsArray = [];
            foreach ($lots as $lot) {
                $lt = Lot::find($lot);
                if ($lt) {
                    $lotsArray[] = [
                        'name' => $lt->name,
                        'participants' => count($lt->participants()),
                    ];
                }
            }
            $panel->lots = $lotsArray;
            $panel->readiness = Readiness::find($panel->readiness_id);
        }
        return response()->json($panels);
    }
    public function getPanelsByReadiness(Request $request)
    {
        $panels = PtPanel::where('readiness_id', $request->readiness_id, 'deleted_at', null)->get();
        foreach ($panels as $panel) {
            // get lots
            $lots = $panel->lots;
            $lotsArray = [];
            foreach ($lots as $lot) {
                $lt = Lot::find($lot);
                if ($lt) {
                    $lotsArray[] = [
                        'name' => $lt->name,
                        'participants' => count($lt->participants()),
                    ];
                }
            }
            $panel->lots = $lotsArray;
            $panel->readiness = Readiness::find($panel->readiness_id);
        }
        return response()->json($panels);
    }
    public function getPanel(Request $request)
    {
        $panel = PtPanel::where('id', $request->id)->first();
        if ($panel) {
            $panel->participants = [];
            $panelots = [];
            foreach ($panel->lots() as $lot) {
                $lt = $lot;
                if ($lt) {
                    //participants
                    $pcps = [];
                    $lp = $lt->participants();
                    foreach ($lp as $p) {
                        $pcps[] = [
                            'id' => $p['id'],
                            'name' => $p['name'],
                            'email' => $p['email'],
                            'lab_id' => $p['laboratory_id'],
                            'lab_name' => Laboratory::find($p['laboratory_id'])->lab_name,
                            'mfl_code' => Laboratory::find($p['laboratory_id'])->mfl_code,
                        ];
                    }
                    $panelots[] = [
                        'id' => $lt->id,
                        'name' => $lt->name,
                        'participants' => $pcps,
                    ];
                    //readiness
                    $panel->readiness = Readiness::find($lt->readiness_id);
                }
            }
            $panel->lots = $panelots;
        }
        $panel->samples = $panel->ptsamples() ?? [];
        return response()->json($panel);
    }
    public function createPanel(Request $request)
    {
        try {
            $panel = PtPanel::where('name', $request->name)->get();
            if (count($panel) > 0) {
                return response()->json(['Message' => 'Error creating Panel. Panel with this name already exists '], 500);
            }
            $panel = PtPanel::create([
                'name' => $request->name,
                'readiness_id' => $request->readiness_id,
                'lots' => $request->lot_ids ?? $request->lots ?? [],
            ]);
            // Save samples
            foreach ($request->samples as $sample) {
                $ptSample = new PtSample();
                $ptSample->name = $sample['name'];
                $ptSample->reference_result = $sample['reference_result'];
                $ptSample->ptpanel()->associate($panel);
                $ptSample->save();
            }

            // Save laboratiories
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the panel ' . $ex->getMessage()], 500);
        }
    }

    public function updatePanel(Request $request)
    {
        $panel = PtPanel::where('id', $request->id)->first();
        //////////
        if ($panel) {

            $panel->name = $request->name;
            $panel->readiness_id = $request->readiness_id;
            $panel->lots = $request->lot_ids ?? $request->lots ?? [];
            // Save samples if any
            if ($request->samples && count($request->samples) > 0) {
                foreach ($request->samples as $sample) {
                    // check if sample id is set
                    if (isset($sample['id'])) {
                        $ptSample = PtSample::where('id', $sample['id'])->first();
                        if ($ptSample) {
                            if ($sample['deleted'] == 1) {
                                $ptSample->delete();
                            } else {
                                $ptSample->name = $sample['name'];
                                $ptSample->reference_result = $sample['reference_result'];
                                $ptSample->save();
                            }
                        }
                    } else {
                        $ptSample = new PtSample();
                        $ptSample->name = $sample['name'];
                        $ptSample->reference_result = $sample['reference_result'];
                        $ptSample->ptpanel()->associate($panel);
                        $ptSample->save();
                    }
                }
            }
            $panel->save();
            return response()->json(['Message' => 'Updated successfully'], 200);
        } else {
            return response()->json(['Message' => 'Could not find the panel '], 500);
        }
        //////////
        $panel->save();
        return response()->json($panel);
    }
    public function deletePanel(Request $request)
    {
        $panel = PtPanel::where('id', $request->id)->first();
        $pid = $panel->id;
        // delete samples
        $samples = PtSample::where('ptpanel_id', $pid)->get();
        foreach ($samples as $sample) {
            $sample->delete();
        }
        $panel->delete();
        return response()->json($panel);
    }
}
