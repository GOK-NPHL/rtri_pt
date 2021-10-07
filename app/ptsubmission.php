<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ptsubmission extends Model
{
    protected $fillable = [
        "testing_date",
        "kit_date_received",
        "lot_date_received",
        "kit_expiry_date",
        "kit_lot_no",
        "result_lt_control_line",
        "result_lt_verification_line",
        "result_lt_longterm_line",
        "result_recent_control_line",
        "result_recent_verification_line",
        "result_recent_longterm_line",
        "result_negative_control_line",
        "result_negative_verification_line",
        "result_negative_longterm_line",
        "interpretation_longterm",
        "interpretation_recent",
        "interpretation_negative",
        "name_of_test",
        "qc_lot_no",
        "sample_reconstituion_date",
        "test_justification",
        "qc_tested",
        "not_test_reason",
        "other_not_tested_reason",
        "lab_id",
        "user_id",
        "sample_type",
        "tester_name"
    ];
}
