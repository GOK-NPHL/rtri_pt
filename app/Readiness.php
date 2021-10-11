<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use PhpOffice\PhpSpreadsheet\Reader\Xls\Style\FillPattern;

class Readiness extends Model
{
    protected $fillable = [
        "start_date",
        "end_date",
        "name",
        "admin_id",
        "readiness_id",
        "answer"
    ];

    public function laboratories()
    {
        return $this->belongsToMany('App\Laboratory');
    }

    public function readinessQuestion()
    {
        return $this->hasMany('App\ReadinessQuestion');
    }
}
