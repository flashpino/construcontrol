<?php

namespace App\Http\Controllers;

use App\Models\StatusOpcao;
use App\Models\User;
use Inertia\Inertia;

class ConfiguracoesController extends Controller
{
    public function index()
    {
        return Inertia::render('Configuracoes', [
            'statusOpcoes' => StatusOpcao::all(),
            'usuarios' => User::all(),
            'acoesComplementares' => \App\Models\AcaoComplementar::all()
        ]);
    }
}
