<?php

use App\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = array(
            array(
                'name' => 'Add User',
                'slug' => 'add_user',
                'is_active' => true,
            ),
            array(
                'name' => 'Edit User',
                'slug' => 'edit_user',
                'is_active' => true,
            ),
            array(
                'name' => 'Delete User',
                'slug' => 'delete_user',
                'is_active' => true,
            ),
            array(
                'name' => 'View User',
                'slug' => 'view_user',
                'is_active' => true,
            ),
            array(
                'name' => 'Add Role',
                'slug' => 'add_role',
                'is_active' => true,
            ),
            array(
                'name' => 'Edit Role',
                'slug' => 'edit_role',
                'is_active' => true,
            ),
            array(
                'name' => 'Delete Role',
                'slug' => 'delete_role',
                'is_active' => true,
            ),
            array(
                'name' => 'View Role',
                'slug' => 'view_role',
                'is_active' => true,
            ),
            array(
                'name' => 'Add Permission',
                'slug' => 'add_permission',
                'is_active' => true,
            ),
            array(
                'name' => 'Edit Permission',
                'slug' => 'edit_permission',
                'is_active' => true,
            ),
            array(
                'name' => 'Delete Permission',
                'slug' => 'delete_permission',
                'is_active' => true,
            ),
            array(
                'name' => 'View Permission',
                'slug' => 'view_permission',
                'is_active' => true,
            ),
            array(
                'name' => 'Add User Group',
                'slug' => 'add_user_group',
                'is_active' => true,
            ),
            array(
                'name' => 'Edit User Group',
                'slug' => 'edit_user_group',
                'is_active' => true,
            ),
            array(
                'name' => 'Delete User Group',
                'slug' => 'delete_user_group',
                'is_active' => true,
            ),
            array(
                'name' => 'View User Group',
                'slug' => 'view_user_group',
                'is_active' => true,
            ),
            array(
                'name' => 'Add Laboratory',
                'slug' => 'add_laboratory',
                'is_active' => true,
            ),
            array(
                'name' => 'Edit Laboratory',
                'slug' => 'edit_laboratory',
                'is_active' => true,
            ),
            array(
                'name' => 'Delete Laboratory',
                'slug' => 'delete_laboratory',
                'is_active' => true,
            ),
            array(
                'name' => 'View Laboratory',
                'slug' => 'view_laboratory',
                'is_active' => true,
            ),
            array(
                'name' => 'Add Readiness Assessment',
                'slug' => 'add_readiness',
                'is_active' => true,
            ),
            array(
                'name' => 'Edit Readiness Assessment',
                'slug' => 'edit_readiness',
                'is_active' => true,
            ),
            array(
                'name' => 'Delete Readiness Assessment',
                'slug' => 'delete_readiness',
                'is_active' => true,
            ),
            array(
                'name' => 'View Readiness Assessment',
                'slug' => 'view_readiness',
                'is_active' => true,
            ),
            array(
                'name' => 'Make Readiness Assessment Submission',
                'slug' => 'make_readiness_submission',
                'is_active' => true,
            ),
            array(
                'name' => 'View Readiness Assessment Submission',
                'slug' => 'view_readiness_submission',
                'is_active' => true,
            ),
            array(
                'name' => 'Approve Readiness Assessment Submission',
                'slug' => 'approve_readiness_submission',
                'is_active' => true,
            ),
            array(
                'name' => 'Add Shipment',
                'slug' => 'add_shipment',
                'is_active' => true,
            ),
            array(
                'name' => 'Edit Shipment',
                'slug' => 'edit_shipment',
                'is_active' => true,
            ),
            array(
                'name' => 'Delete Shipment',
                'slug' => 'delete_shipment',
                'is_active' => true,
            ),
            array(
                'name' => 'View Shipment',
                'slug' => 'view_shipment',
                'is_active' => true,
            ),
            array(
                'name' => 'Make Shipment Submission',
                'slug' => 'make_shipment_submission',
                'is_active' => true,
            ),
            array(
                'name' => 'View Shipment Submission',
                'slug' => 'view_shipment_submission',
                'is_active' => true,
            ),
            array(
                'name' => 'Approve Shipment Submission',
                'slug' => 'approve_shipment_submission',
                'is_active' => true,
            ),
            array(
                'name' => 'Add Participant Lot',
                'slug' => 'add_participant_lot',
                'is_active' => true,
            ),
            array(
                'name' => 'Edit Participant Lot',
                'slug' => 'edit_participant_lot',
                'is_active' => true,
            ),
            array(
                'name' => 'Delete Participant Lot',
                'slug' => 'delete_participant_lot',
                'is_active' => true,
            ),
            array(
                'name' => 'View Participant Lot',
                'slug' => 'view_participant_lot',
                'is_active' => true,
            )
        );

        // insert permissions
        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
