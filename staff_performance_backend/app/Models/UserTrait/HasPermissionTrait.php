<?php
namespace App\Models\UserTrait;

use App\Models\Role;

trait HasPermissionTrait {

    //check if has role
    public function hasRole($roles)
    {
        foreach ($roles as $role)
        {
            if($this->role()->get()->contains('slug', $role))
            {
                return true;
            }
        }

        return false;
    }

    //role relation
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }
}
