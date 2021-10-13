<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PTAdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

        $this->middleware('auth:admin');
    }

    public function ptShipment()
    {
        return view('user.pt.shipment.pt_shipment');
    }

    public function editShipment()
    {
        return view('user.pt.shipment.edit_shipment');
    }

    public function listReadiness()
    {
        return view('user.pt.readiness.list_readiness');
    }

    public function addReadiness()
    {
        return view('user.pt.readiness.add_readiness');
    }

    public function editReadiness()
    {
        return view('user.pt.readiness.edit_readiness');
    }

    public function getReadinessResponse()
    {
        return view('user.pt.readiness.readiness_responses');
    }
}
