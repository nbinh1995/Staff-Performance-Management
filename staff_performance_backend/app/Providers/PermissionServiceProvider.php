<?php

namespace App\Providers;

use App\Models\Role;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class PermissionServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        try{
            Role::get()->map(function ($role) {
                Gate::define($role->slug, function ($user) use ($role){
                    return $user->hasRole($role);
                });
            });
        }
        catch (\Exception $e)
        {
            report($e);
            return false;
        }
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
