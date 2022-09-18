<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PtSample extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'reference_result',
        // 'ptshipment_id', // change to panel
        'ptpanel_id',

    ];

    public function ptpanel()
    {
        return $this->belongsTo(PtPanel::class); //'App\PtShipement');
    }
}
