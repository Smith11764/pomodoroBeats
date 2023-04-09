<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/tasks/user', [TaskApiController::class, 'getAuthenticatedUserTasks']);
    Route::post('/tasks', [TaskApiController::class, 'store']);
    Route::put('/tasks/{task}/update_check', [TaskApiController::class, 'updateCheck']);
    Route::put('/tasks/{task}/update_order', [TaskApiController::class, 'updateOrder']);
    Route::delete('/tasks/{task}', [TaskApiController::class, 'destroy']);
});
