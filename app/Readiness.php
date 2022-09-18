<?php

namespace App;

use Carbon\Carbon;
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
        "answer",
        "ask_default_qn",
    ];

    public function getCreatedAtAttribute($value)
    {
        $date = Carbon::parse($value);
        return $date->format('Y-m-d');
    }
    public function getUpdatedAtAttribute($value)
    {
        $date = Carbon::parse($value);
        return $date->format('Y-m-d');
    }

    public function laboratories()
    {
        return $this->belongsToMany('App\Laboratory');
    }

    public function participants()
    {
        $labs = $this->laboratories;
        $participants = [];
        foreach ($labs as $lab) {
            $participants = array_merge($participants, $lab->personel->toArray());
        }
        return $participants;
    }

    public function readinessQuestion()
    {
        return $this->hasMany('App\ReadinessQuestion');
    }
}
