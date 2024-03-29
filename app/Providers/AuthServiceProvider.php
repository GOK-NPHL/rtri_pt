<?php

namespace App\Providers;

use App\Services\SystemAuthorities;
use App\User;
use App\UserRole;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define(SystemAuthorities::$authorities['view_pt_component'], function ($user) {
            $curUser = Auth::user();
            if ($curUser->has_pt_access == 1) {
                return true;
            } else {
                return false;
            }
        });

        Gate::define(SystemAuthorities::$authorities['view_qc_component'], function ($user) {
            $curUser = Auth::user();
            if ($curUser->has_qc_access == 1) {
                return true;
            } else {
                return false;
            }
        });

        // lab manager
        Gate::define(SystemAuthorities::$authorities['lab_manager'], function ($user) {
            $curUser = Auth::user();
            $lab_mgr_role = UserRole::where('slug', 'like', '%lab_manager%')->first()->id;
            // check if roles array in user table contains lab manager role
            // if (in_array($lab_mgr_role, json_decode($curUser->roles))) {
            $useroles = $curUser->roles;
            if (is_string($useroles)) {
                $useroles = json_decode($useroles);
            }
            if (isset($useroles) && in_array($lab_mgr_role, $useroles)) {
                return true;
            } else {
                return false;
            }
        });

        //participant
        Gate::define(SystemAuthorities::$authorities['participant'], function ($user) {
            $curUser = Auth::user();
            $participant_role = UserRole::where('slug', 'like', '%participant%')->first()->id;
            // check if roles array in user table contains participant role
            // if (in_array($participant_role, json_decode($curUser->roles))) {
            $useroles = $curUser->roles;
            if (is_string($useroles)) {
                $useroles = json_decode($useroles);
            }
            if (isset($useroles) && in_array($participant_role, $useroles)) {
                return true;
            } else {
                return false;
            }
        });

        //admin
        Gate::define(SystemAuthorities::$authorities['administrator'], function ($user) {
            $curUser = Auth::user();
            $admin_role = UserRole::where('slug', 'administrator')->first()->id;
            // check if roles array in user table contains admin role
            // if (in_array($admin_role, json_decode($curUser->roles))) {
            $useroles = $curUser->roles;
            if (is_string($useroles)) {
                $useroles = json_decode($useroles);
            }
            if (isset($useroles) && in_array($admin_role, $useroles)) {
                return true;
            } else {
                return false;
            }
        });

        //guest
        Gate::define(SystemAuthorities::$authorities['guest'], function ($user) {
            $curUser = Auth::user();
            $guest_role = UserRole::where('slug', 'guest')->first()->id;
            // check if roles array in user table contains guest role
            // if (in_array($guest_role, json_decode($curUser->roles))) {
            $useroles = $curUser->roles;
            if (is_string($useroles)) {
                $useroles = json_decode($useroles);
            }
            if (in_array(isset($useroles) && $guest_role, $useroles)) {
                return true;
            } else {
                return false;
            }
        });

        Gate::define(SystemAuthorities::$authorities['view_log_book_report'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['view_log_book_report']);
        });
        Gate::define(SystemAuthorities::$authorities['edit_user'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['edit_user']);
        });
        Gate::define(SystemAuthorities::$authorities['edit_role'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['edit_role']);
        });
        Gate::define(SystemAuthorities::$authorities['edit_orgunit'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['edit_orgunit']);
        });
        Gate::define(SystemAuthorities::$authorities['delete_user'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['delete_user']);
        });
        Gate::define(SystemAuthorities::$authorities['delete_role'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['delete_role']);
        });
        Gate::define(SystemAuthorities::$authorities['delete_orgunit'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['delete_orgunit']);
        });
        Gate::define(SystemAuthorities::$authorities['add_user'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['add_user']);
        });
        Gate::define(SystemAuthorities::$authorities['add_role'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['add_role']);
        });
        Gate::define(SystemAuthorities::$authorities['add_orgunit'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['add_orgunit']);
        });
        Gate::define(SystemAuthorities::$authorities['view_system_settings'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['view_system_settings']);
        });
        Gate::define(SystemAuthorities::$authorities['view_reports'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['view_reports']);
        });
        Gate::define(SystemAuthorities::$authorities['view_dashboard'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['view_dashboard']);
        });
        Gate::define(SystemAuthorities::$authorities['data_backup'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['data_backup']);
        });
        Gate::define(SystemAuthorities::$authorities['view_user'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['view_user']);
        });
        Gate::define(SystemAuthorities::$authorities['view_role'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['view_role']);
        });
        Gate::define(SystemAuthorities::$authorities['view_spi_report'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['view_spi_report']);
        });
        Gate::define(SystemAuthorities::$authorities['upload_new_orgunit_structure'], function ($user) {
            return $this->runAthurizationQuery(SystemAuthorities::$authorities['upload_new_orgunit_structure']);
        });
    }

    private function runAthurizationQuery($authority)
    {
        $curUser = Auth::user();
        $user = User::select(
            "users.id as id"
        )->join('roles', 'roles.id', '=', 'users.role_id')
            ->join('authority_role', 'roles.id', '=', 'authority_role.role_id')
            ->join('authorities', 'authorities.id', '=', 'authority_role.authority_id')
            ->where('authorities.name', $authority)
            ->where('users.id', $curUser->id)
            ->get();
        if (count($user) != 0) {
            return true;
        } else {
            return false;
        }
    }
}
