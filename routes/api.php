<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ColumnController;
use App\Http\Controllers\Api\CardController;



Route::apiResource('columns', ColumnController::class);
Route::post('boards/reorder-columns', [ColumnController::class, 'reorder']);
Route::apiResource('cards', CardController::class)->only(['show','store','update','destroy']);

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', [\App\Http\Controllers\AuthController::class,'getUser']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    });

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);