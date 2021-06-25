<?php

use Illuminate\Database\Seeder;
use App\User;

class UserSeed extends Seeder
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
                'name' => 'duncan',
                'email' => 'duncanndiithi@gmail.com',
                'password' => '$2y$10$wCyQ7j2mwl.NGD3brp1RSuCo3nIv9b1pDO4Cb8v0xjmfBshm93bGm',
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
                'user_type' => 'admin'
            ),
            array(
                'name' => 'duncan',
                'email' => 'duncanndiithi@yahoo.com',
                'password' => '$2y$10$wCyQ7j2mwl.NGD3brp1RSuCo3nIv9b1pDO4Cb8v0xjmfBshm93bGm',
                'created_at' => new \dateTime,
                'updated_at' => new \dateTime,
                'user_type' => 'participant'
            )

        );

        $authObj = new User();
        User::query()->truncate();
        $authObj->insert($data);
    }
}
