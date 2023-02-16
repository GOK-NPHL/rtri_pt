<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PTSubmissionEvaluation extends Model
{
    protected $fillable = [
        "shipment_id",
        "submission_id",
        "panel_id",
        "user_id",
        "lab_id",
        "sample_evaluations",
        "score"
    ];

    protected $casts = [
        'sample_evaluations' => 'array',
    ];

    protected $table = "pt_submission_evaluations";
}
