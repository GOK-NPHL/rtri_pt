<?php

use App\ReadinessQuestion;
use Illuminate\Database\Seeder;

class DefaultReadinessQnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $defaultQn = array(
            'readiness_id' => 0,
            'question' => 'Is the laboratory ready for this round?',
            'answer_options' => 'Yes,No',
            'answer_type' => 'list',
            'qustion_position' => 1,
            'is_required' => 1,
            'is_default' => 1,
            'qustion_type' => 'question',
        );

        // insert default question
        ReadinessQuestion::create($defaultQn);
    }
}
