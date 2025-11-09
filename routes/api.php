<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\CardController;

Route::get('/columns', [ColumnController::class, 'index']);
Route::post('/columns', [ColumnController::class, 'store']);

Route::get('/columns/{column}/cards', [CardController::class, 'index']);
Route::post('/columns/{column}/cards', [CardController::class, 'store']);
Route::put('/cards/{card}', [CardController::class, 'update']);
Route::delete('/cards/{card}', [CardController::class, 'destroy']);


Route::apiResource('tasks', TaskController::class);
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', [\App\Http\Controllers\AuthController::class,'getUser']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    });

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

