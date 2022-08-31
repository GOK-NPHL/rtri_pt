<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ResourceFiles extends Model
{
    protected $fillable = [
        "name",
        "path",
        "type",
        "size",
        "is_public",
        "is_ptfile"
    ];
}
