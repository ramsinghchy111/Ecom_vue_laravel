<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
Schema::create('cards', function (Blueprint $table) {
    $table->id();
    $table->foreignId('column_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('first_name')->nullable();
    $table->string('last_name')->nullable();
    $table->string('telephone')->nullable();
    $table->string('email')->nullable();
    $table->text('address')->nullable();
    $table->decimal('lead_value', 12, 2)->default(0);
    $table->unsignedBigInteger('assigned_to')->nullable();
    $table->string('company_name')->nullable();
    $table->string('street')->nullable();
    $table->string('city')->nullable();
    $table->string('state')->nullable();
    $table->string('zip')->nullable();
    $table->string('country')->nullable();
    $table->json('websites')->nullable(); // store as JSON array
    $table->integer('order')->default(0);  // card position within column
    $table->timestamps();

    $table->foreign('assigned_to')->references('id')->on('users');
});
Schema::create('columns', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->integer('order')->default(0);
    $table->timestamps();
});

    }

    public function down() {
        Schema::dropIfExists('cards');
    }
};
