<?php

use App\UserRole;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([

            UserSeed::class,
            CountrySeeder::class,
            DefaultReadinessQnSeeder::class,
            PermissionSeeder::class,
            UserRoleSeeder::class,
            LaboratorySeeder::class,
        ]);
    }
}
