<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LaboratorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = array(
            array(
                // 'id' => 0,
                'institute_name' => 'NPHL',
                'email' => 'admin@nphl.go.ke',
                'lab_name' => 'NPHL Test Lab',
                'mfl_code' => 0000001,
                'phone_number' => '0712345678',
                'is_active' => true,
                'facility_level' => 5,
                'county' => 1
            ),
            array(
                // 'id' => 1,
                'institute_name' => 'NPHL 2',
                'email' => 'admin2@nphl.go.ke',
                'lab_name' => 'NPHL Test Lab 2',
                'mfl_code' => 0000002,
                'phone_number' => '0712345679',
                'is_active' => true,
                'facility_level' => 5,
                'county' => 1
            ),
        );

        foreach ($data as $lab) {
            DB::table('laboratories')->insert($lab);
        }

    }
}
