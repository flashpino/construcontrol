<?php

namespace App\Http\Controllers;

use App\Models\Registro;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcaoComplementarController extends Controller
{
    public function index()
    {
        $registros = Registro::with(['obra', 'usuario'])
            ->where('acao_complementar', true)
            ->latest('data')
            ->get();

        return Inertia::render('AcoesComplementares', [
            'registros_com_acoes' => $registros
        ]);
    }

    public function update(Request $request, Registro $registro)
    {
        $validated = $request->validate([
            'status_acao_complementar' => 'nullable|string|max:100',
            'observacoes_acao_complementar' => 'nullable|string',
        ]);

        $registro->update($validated);

        return redirect()->back()->with('success', 'Ação complementar atualizada!');
    }

    public function destroy(Registro $registro)
    {
        $registro->update([
            'acao_complementar' => false,
            'descricao_acao_complementar' => null,
            'status_acao_complementar' => null,
            'observacoes_acao_complementar' => null,
        ]);

        return redirect()->back()->with('success', 'Ação complementar removida.');
    }
}
