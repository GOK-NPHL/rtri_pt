<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;

class SystemAuthorities
{
    public static $authorities = [
        'view_qc_component' => 'view_qc_component',
        'view_pt_component' => 'view_pt_component',
        'view_log_book_report' => 'view_log_book_report',
        'edit_user' => 'edit_user',
        'view_user'=>'view_user',
        'view_role' => 'view_role',
        'edit_role' => 'edit_role',
        'edit_orgunit' => 'edit_orgunit',
        'delete_user' => 'delete_user',
        'delete_role' => 'delete_role',
        'delete_orgunit' => 'delete_orgunit',
        'add_user' => 'add_user',
        'add_role' => 'add_role',
        'add_orgunit' => 'add_orgunit',
        'view_system_settings' => 'view_system_settings',
        'view_reports' => 'view_reports',
        'view_dashboard' => 'view_dashboard',
        'data_backup' => 'data_backup',
        'view_spi_report'=>'view_spi_report',
        'upload_new_orgunit_structure'=>'upload_new_orgunit_structure',
        
        'lab_manager' => 'lab_manager',
        'participant' => 'participant',
        'administrator' =>  'administrator',
        'guest' => 'guest',
    ];

    public static $roles = [
        'super_admin' => 'super_admin',
        'admin' => 'admin',
        'lab_manager' => 'lab_manager',
        'participant' => 'participant',
    ];
}
