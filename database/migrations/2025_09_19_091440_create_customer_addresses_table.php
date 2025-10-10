<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->id();

            $table->string('type', 25);
            $table->string('address1', 255);
            $table->string('address2', 255);
            $table->string('city', 255);
            $table->string('state', 25)->nullable();
            $table->string('zipcode', 25);

            // create the column first (must match countries.code exactly)
            $table->string('country_code', 3);

            // create customer_id column and FK to customers.id
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();

            // then add FK for country_code -> countries.code
            $table->foreign('country_code')->references('code')->on('countries');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_addresses');
    }
};
