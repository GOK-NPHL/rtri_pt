<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = [
        'name', 'slug', 'is_active'
    ];

    //roles with this permission
    public function roles()
    {
        return $this->belongsToMany(UserRole::class, 'role_permission');
    }
}
