<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PtShipement extends Model
{
    protected $fillable = [
        'name',
        'round_name',
        'code',
        'start_date',
        'end_date',
        'test_instructions',
        'pass_mark',
        // 'readiness_id', // change to panel
        'ptpanel_id',

    ];

    protected $softDelete = true;

    public function laboratories()
    {
        return $this->belongsToMany('App\Laboratory');
    }

    //panels
    public function ptpanel()
    {
        // return $this->belongsTo(PtPanel::class);
        $ptpanel = PtPanel::find($this->ptpanel_id);
        return $ptpanel;
    }

}
