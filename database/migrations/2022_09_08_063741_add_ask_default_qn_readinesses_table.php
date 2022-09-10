<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAskDefaultQnReadinessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('readinesses', function (Blueprint $table) {
            $table->boolean('ask_default_qn')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('readinesses', function (Blueprint $table) {
            $table->dropColumn('ask_default_qn');
        });
    }
}
