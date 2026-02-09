<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('daily_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_plan_id')->constrained()->onDelete('cascade');
            $table->foreignId('pharmacist_id')->constrained()->onDelete('cascade');
            $table->foreignId('pharmacy_id')->constrained()->onDelete('cascade');
            $table->integer('slot_index');
            $table->time('planned_time')->nullable();
            $table->enum('status', ['Planned', 'Done', 'Skipped'])->default('Planned');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_plan_items');
    }
};
