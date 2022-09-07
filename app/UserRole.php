<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    protected $fillable = [
        "name",
        "authorities",
    ];

    protected $table = "user_roles";
    protected $softDelete = true;
}