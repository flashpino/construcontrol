<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Obra;
use Inertia\Inertia;

class ObraController extends Controller
{
    public function index()
    {
        $obras = Obra::all();
        return Inertia::render('Obras', [
            'obras' => $obras
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo_da_obra' => 'required|string',
            'status' => 'nullable|string|in:ativa,inativa'
        ]);

        Obra::create($validated);

        return redirect()->back()->with('success', 'Obra criada com sucesso');
    }

    public function update(Request $request, Obra $obra)
    {
        $validated = $request->validate([
            'titulo_da_obra' => 'required|string',
            'status' => 'required|string|in:ativa,inativa'
        ]);

        $obra->update($validated);

        return redirect()->back()->with('success', 'Obra atualizada');
    }

    public function destroy(Obra $obra)
    {
        $obra->delete();
        return redirect()->back()->with('success', 'Obra excluída');
    }
}
