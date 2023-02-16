<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePtShipementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pt_shipements', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('round_name');
            $table->string('code');
            $table->date('start_date')->nullable();
            $table->date('end_date');
            $table->longText('test_instructions')->nullable();
            $table->integer('readiness_id');
            $table->integer('pass_mark');
            $table->json('ptpanel_ids');
            $table->string('status')->default('created');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pt_shipements');
    }
}
