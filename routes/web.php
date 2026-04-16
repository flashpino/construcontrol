<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ObraController;
use App\Http\Controllers\RegistroController;
use App\Http\Controllers\StatusOpcaoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ConfiguracoesController;
use App\Http\Controllers\ProfileController;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('obras', ObraController::class);
    Route::resource('registros', RegistroController::class);
    
    Route::middleware('admin')->group(function () {
        Route::get('/configuracoes', [ConfiguracoesController::class, 'index'])->name('configuracoes.index');
        Route::resource('users', UserController::class);
        Route::resource('status-opcoes', StatusOpcaoController::class)->parameters([
            'status-opcoes' => 'statusOpcao'
        ]);
    });
    
    Route::prefix('api')->group(function () {
        Route::get('/status', [StatusOpcaoController::class, 'index']);
        Route::post('/status', [StatusOpcaoController::class, 'store']);
        Route::delete('/status/{statusOpcao}', [StatusOpcaoController::class, 'destroy']);
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
