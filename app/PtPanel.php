<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PtPanel extends Model
{
    protected $fillable = [
        'name',
        // 'shipment_id',
        // 'readiness_id',
        'lots',
        // 'created_by',
    ];

    protected $softDelete = true;

    protected $casts = [
        'lots' => 'array',
    ];

    // public function readiness()
    // {
    //     return $this->belongsTo('App\Readiness');
    // }

    // samples
    public function ptsamples()
    {
        $samples = $this->hasMany(PtSample::class, 'ptpanel_id')->get();
        return $samples;
    }

    //lots
    public function lots()
    {
        $lots = Lot::whereIn('id', $this->lots)->get();
        return $lots;
    }

    //participants
    public function participants()
    {
        $lots = $this->lots();
        $participants = [];
        foreach ($lots as $lot) {
            $participants = array_merge($participants, $lot->participants());
        }
        return $participants;
    }

    //shipments
    public function ptshipment()
    {
        return $this->belongsTo('App\PtShipement');
    }

    public function laboratories()
    {
        return $this->belongsToMany('App\Laboratory');
    }
}
