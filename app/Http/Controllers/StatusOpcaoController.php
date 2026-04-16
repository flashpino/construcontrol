<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\StatusOpcao;

class StatusOpcaoController extends Controller
{
    public function index()
    {
        return response()->json(StatusOpcao::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|unique:status_opcoes',
            'cor' => 'required|string'
        ]);

        StatusOpcao::create($validated);

        return redirect()->back()->with('success', 'Status criado');
    }

    public function update(Request $request, StatusOpcao $statusOpcao)
    {
        $validated = $request->validate([
            'nome' => 'required|string|unique:status_opcoes,nome,' . $statusOpcao->id,
            'cor' => 'required|string'
        ]);

        $statusOpcao->update($validated);

        return redirect()->back()->with('success', 'Status atualizado');
    }

    public function destroy(StatusOpcao $statusOpcao)
    {
        $statusOpcao->delete();
        return redirect()->back()->with('success', 'Status excluído');
    }
}
