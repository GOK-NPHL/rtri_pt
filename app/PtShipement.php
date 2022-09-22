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
        'ptpanel_ids',

    ];

    protected $softDelete = true;

    protected $casts = [
        'ptpanel_ids' => 'array',
    ];

    public function laboratories()
    {
        return $this->belongsToMany('App\Laboratory');
    }

    //panels
    public function ptpanels()
    {
        // return $this->belongsTo(PtPanel::class);

        // $ptpanel = PtPanel::find($this->ptpanel_id);
        // return $ptpanel;

        $ptpanels = PtPanel::whereIn('id', $this->ptpanel_ids)->get();
        return $ptpanels;
    }

}
