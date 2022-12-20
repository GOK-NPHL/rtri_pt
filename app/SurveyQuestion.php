<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    protected $fillable = [
        "shipment_id",
        "question_type",
        "question",
        "question_options",
        "meta",
    ];

    protected $casts = [
        'question_options' => 'array',
        'meta' => 'array',
    ];


    protected $softDelete = true;

    public function shipment()
    {
        return $this->belongsTo('App\Shipment');
    }
}
