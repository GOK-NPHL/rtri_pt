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
        return $this->hasMany('App\PtSample');
    }

    //lots
    public function lots()
    {
        return $this->hasMany('App\Lot');
    }

    //shipments
    public function ptshipment()
    {
        return $this->belongsTo('App\PtShipement');
    }
}
