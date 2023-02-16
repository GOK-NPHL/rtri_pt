<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePTSubmissionEvaluationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pt_submission_evaluations', function (Blueprint $table) {
            $table->id();
            $table->integer('shipment_id');
            $table->integer('submission_id');
            $table->integer('panel_id');
            $table->integer('user_id');
            $table->integer('lab_id');
            $table->json('sample_evaluations');
            $table->integer('score');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pt_submission_evaluations');
    }
}
