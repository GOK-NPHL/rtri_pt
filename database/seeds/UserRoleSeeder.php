<?php

use App\UserRole;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = array(
            array(
                'name' => 'Guest',
                'slug' => 'guest',
                'is_active' => true,
                'permissions' => json_encode([])
            ),
            array(
                'name' => 'Lab Administrator',
                'is_active' => true,
                'slug' => 'lab_administrator',
                'permissions' => json_encode([
                    'add_user',
                    'edit_user',
                    'delete_user',
                    'view_user',
                    'edit_laboratory',
                    'view_laboratory',
                    'view_readiness',
                    'make_readiness_submission',
                    'view_shipment',
                    'make_shipment_submission',
                ]),
            ),
            array(
                'name' => 'Participant',
                'is_active' => true,
                'slug' => 'participant',
                'permissions' => json_encode([
                    'view_laboratory',
                    'view_readiness',
                    'make_readiness_submission',
                    'view_shipment',
                    'make_shipment_submission',
                ]),
            ),
            array(
                'name' => 'Administrator',
                'is_active' => true,
                'slug' => 'administrator',
                'permissions' => json_encode([
                    'add_user',
                    'edit_user',
                    'delete_user',
                    'view_user',
                    'add_role',
                    'edit_role',
                    'delete_role',
                    'view_role',
                    'add_permission',
                    'edit_permission',
                    'delete_permission',
                    'view_permission',
                    'add_laboratory',
                    'edit_laboratory',
                    'delete_laboratory',
                    'view_laboratory',
                    'view_readiness',
                    'make_readiness_submission',
                    'view_shipment',
                    'make_shipment_submission',
                ]),
            ),
        );

        // insert roles
        foreach ($roles as $role) {
            // insert role
            UserRole::create($role);
        }
    }
}
