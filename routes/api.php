<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TaskController;

Route::apiResource('tasks', TaskController::class);
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', [\App\Http\Controllers\AuthController::class,'getUser']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    });

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

