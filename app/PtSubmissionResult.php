<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PtSubmissionResult extends Model
{
    protected $fillable = [
        "qcsubmission_id",
        "control_line",
        "verification_line",
        "longterm_line",
        "interpretation"
    ];
}
