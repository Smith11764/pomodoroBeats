<?php

use App\Http\Controllers\PomodoroController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [PomodoroController::class, 'index'])
->middleware(['auth'])->name('pomodoro');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('register', [RegisteredUserController::class, 'create'])
    ->name('register');
require __DIR__ . '/auth.php';
