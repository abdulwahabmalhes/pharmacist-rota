<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('daily_availabilities', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('pharmacist_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['Available', 'Off', 'Sick', 'Leave'])->default('Available');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['date', 'pharmacist_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_availabilities');
    }
};
