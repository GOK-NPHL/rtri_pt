<?php

namespace App\Http\Controllers;

use App\PtPanel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class PtPanelController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin', ['except' => ['signOut', 'adminLogin', 'doLogin']]);
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
            $panel->sample_count = count($panel->ptsamples());
            $panel->shipment = $panel->ptshipment();
        }
        return response()->json($panels);
    }
    public function getPanelParticipants(Request $request)
    {
        $panels = PtPanel::where('deleted_at', null)->get();
        foreach ($panels as $panel) {
            $panel->lots = $panel->lots();
            $panel->participants = [];
            foreach ($panel->lots as $lot) {
                $lot->participants = $lot->participants();
                $panel->participants = array_merge($panel->participants, $lot->participants);
            }
        }
        return response()->json($panels);
    }
    public function getPanel(Request $request)
    {
        $panel = PtPanel::where('id', $request->id)->first();
        $panel->samples = $panel->ptsamples() ?? [];
        return response()->json($panel);
    }
    public function createPanel(Request $request)
    {
        $panel = PtPanel::create([
            'name' => $request->name,
            'readiness_id' => $request->readiness_id,
            'lots' => $request->lots,
            'created_by' => FacadesAuth::user()->id,
        ]);
        return response()->json($panel);
    }
    public function updatePanel(Request $request)
    {
        $panel = PtPanel::where('id', $request->id)->first();
        $panel->name = $request->name;
        $panel->readiness_id = $request->readiness_id;
        $panel->lots = $request->lots;
        $panel->save();
        return response()->json($panel);
    }
    public function deletePanel(Request $request)
    {
        $panel = PtPanel::where('id', $request->id)->first();
        $panel->delete();
        return response()->json($panel);
    }
}
