<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReadinessController extends Controller
{

    public function getReadinessSurvey(Request $request)
    {

        try {

            $readinessesWithLabId = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(*) as participant_count')
            )->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
                ->groupBy(
                    "pt_shipements.id",
                    'pt_shipements.round_name',
                    'pt_shipements.readiness_id',
                    "pt_shipements.updated_at",
                    "pt_shipements.pass_mark",
                    "pt_shipements.code",
                );

            $readinessesWithNullLabId = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(*) as participant_count')
            )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->groupBy('laboratory_pt_shipement.pt_shipement_id');


            $finalQuery = $readinessesWithLabId->union($readinessesWithNullLabId)->orderBy('last_update', 'desc')->get();

            return $finalQuery;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }
}
