<?php

namespace App\Http\Controllers;

use App\Models\AcaoComplementar;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Registro;

class AcaoComplementarController extends Controller
{
    public function index()
    {
        $acoes = AcaoComplementar::all();
        $registros_com_acoes = Registro::with(['obra', 'usuario', 'fotos'])
            ->where('acao_complementar', true)
            ->latest('data')
            ->get();

        return Inertia::render('AcoesComplementares', [
            'acoes' => $acoes,
            'registros_com_acoes' => $registros_com_acoes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'status' => 'required|in:ativa,inativa'
        ]);

        AcaoComplementar::create($validated);

        return redirect()->back()->with('success', 'Ação complementar cadastrada com sucesso!');
    }

    public function update(Request $request, AcaoComplementar $acao_complementare)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'status' => 'required|in:ativa,inativa'
        ]);

        $acao_complementare->update($validated);

        return redirect()->back()->with('success', 'Ação complementar atualizada com sucesso!');
    }

    public function destroy(AcaoComplementar $acao_complementare)
    {
        $acao_complementare->delete();
        return redirect()->back()->with('success', 'Ação complementar removida!');
    }
}
