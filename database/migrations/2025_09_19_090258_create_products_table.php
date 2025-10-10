<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string(column:'title', length:200);
            $table->string(column:'slug', length:200);
            $table->string(column:'image')->nullable();
            $table->string(column:'image_mime')->nullable();
            $table->integer(column:'image_size')->nullable();
            $table->longText(column:'description')->nullable();
            $table->decimal(column:'price', total:10, places:2 )->default(0.00);
            $table->foreignIdFor(model: User::class, column:'created_by')->nullable();
            $table->foreignIdFor(model: User::class, column:'updated_by')->nullable();
            $table->softDeletes();
            $table->foreignIdFor(model: User::class, column:'deleted_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
