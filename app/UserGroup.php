<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    protected $fillable = [
        "name",
        "roles",
    ];

    protected $table = "user_groups";
    protected $softDelete = true;
}
