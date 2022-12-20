<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddQaArrayFieldPtsubmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ptsubmissions', function (Blueprint $table) {
            $table->json('qa_responses')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ptsubmissions', function (Blueprint $table) {
            $table->dropColumn('qa_responses');
        });
    }
}
