<?php

namespace App\Http\Controllers\Service;

use App\County;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;

class CommonsController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:sanctum');
    }

    public function getCounties()
    {

        try {
            return County::all();
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting counties: ' . $ex->getMessage()], 500);
        }
    }
}
