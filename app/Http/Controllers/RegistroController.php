<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Foto;
use App\Models\Registro;
use App\Models\Obra;
use App\Models\StatusOpcao;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RegistroController extends Controller
{
    public function index(Request $request)
    {
        $query = Registro::with(['obra', 'usuario', 'fotos']);
        
        // Privacidade: Usuário só vê o dele, Admin vê tudo
        if (auth()->user()->role !== 'admin') {
            $query->where('usuario_id', auth()->id());
        }

        if ($request->obra_id) $query->where('obra_id', $request->obra_id);
        if ($request->usuario_id) $query->where('usuario_id', $request->usuario_id);
        if ($request->data_inicio) $query->where('data', '>=', $request->data_inicio);
        if ($request->data_fim) $query->where('data', '<=', $request->data_fim);
        if ($request->status) $query->where('status', $request->status);

        $registros = $query->latest('data')->latest()->get();

        return Inertia::render('Registros', [
            'registros' => $registros,
            'filters' => $request->all(['obra_id', 'usuario_id', 'data_inicio', 'data_fim', 'status']),
            'obras' => Obra::all(),
            'statusOpcoes' => StatusOpcao::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('NovoRegistro', [
            'obras' => Obra::where('status', 'ativa')->get(),
            'statusOpcoes' => StatusOpcao::all(),
            'acoesComplementares' => \App\Models\AcaoComplementar::where('status', 'ativa')->get()
        ]);
    }

    public function edit(Registro $registro)
    {
        // Trava de segurança: só o dono ou admin edita
        if (auth()->user()->role !== 'admin' && $registro->usuario_id !== auth()->id()) {
            abort(403);
        }

        $registro->load('fotos');
        return Inertia::render('NovoRegistro', [
            'registro' => $registro,
            'obras' => Obra::all(),
            'statusOpcoes' => StatusOpcao::all(),
            'acoesComplementares' => \App\Models\AcaoComplementar::where('status', 'ativa')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'obra_id' => 'required|exists:obras,id',
            'data' => 'required|date',
            'status' => 'required|string',
            'descricao_atividade' => 'required|string',
            'problemas_observacoes' => 'nullable|string',
            'acao_complementar' => 'required',
            'descricao_acao_complementar' => 'nullable|string',
            'fotos.*' => 'nullable|image|max:5120'
        ]);

        $validated['usuario_id'] = auth()->id();
        $validated['acao_complementar'] = filter_var($request->acao_complementar, FILTER_VALIDATE_BOOLEAN);

        $registro = Registro::create($validated);

        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $file) {
                $disk = 'registros';
                $path = $file->store('uploads', $disk);
                $registro->fotos()->create(['caminho_arquivo' => Storage::disk($disk)->url($path)]);
            }
        }

        return redirect()->route('registros.index')->with('success', 'Registro criado com sucesso');
    }

    public function update(Request $request, Registro $registro)
    {
        // Trava de segurança: só o dono ou admin atualiza
        if (auth()->user()->role !== 'admin' && $registro->usuario_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'obra_id' => 'required|exists:obras,id',
            'data' => 'required|date',
            'status' => 'required|string',
            'descricao_atividade' => 'required|string',
            'problemas_observacoes' => 'nullable|string',
            'acao_complementar' => 'required',
            'descricao_acao_complementar' => 'nullable|string',
            'fotos.*' => 'nullable|image|max:5120',
            'remove_fotos' => 'nullable|string' // Array of IDs as JSON
        ]);

        $validated['acao_complementar'] = filter_var($request->acao_complementar, FILTER_VALIDATE_BOOLEAN);

        $registro->update($validated);

        $disk = 'registros';

        // Remove photos
        if ($request->remove_fotos) {
            $ids = json_decode($request->remove_fotos);
            foreach ($ids as $id) {
                $foto = Foto::find($id);
                if ($foto) {
                    // Try to extract relative path from URL
                    $baseUrl = Storage::disk($disk)->url('');
                    $relativePath = str_replace($baseUrl, '', $foto->caminho_arquivo);
                    Storage::disk($disk)->delete($relativePath);
                    $foto->delete();
                }
            }
        }

        // Add new photos
        if ($request->hasFile('fotos')) {
            foreach ($request->file('fotos') as $file) {
                $path = $file->store('uploads', $disk);
                $registro->fotos()->create(['caminho_arquivo' => Storage::disk($disk)->url($path)]);
            }
        }

        return redirect()->route('registros.index')->with('success', 'Registro atualizado com sucesso');
    }

    public function destroy(Registro $registro)
    {
        // Admin or Owner check
        if (auth()->user()->role !== 'admin' && $registro->usuario_id !== auth()->id()) {
            abort(403);
        }

        $disk = 'registros';
        $baseUrl = Storage::disk($disk)->url('');

        foreach ($registro->fotos as $foto) {
            $relativePath = str_replace($baseUrl, '', $foto->caminho_arquivo);
            Storage::disk($disk)->delete($relativePath);
        }
        
        $registro->delete();
        return redirect()->back()->with('success', 'Registro excluído');
    }

    public function relatorios(Request $request)
    {
        // Apenas admin acessa relatórios
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('registros.index')->with('error', 'Acesso negado.');
        }

        $query = Registro::with(['obra', 'usuario', 'fotos']);
        
        if (auth()->user()->role !== 'admin') {
            $query->where('usuario_id', auth()->id());
        }

        if ($request->obra_id) $query->where('obra_id', $request->obra_id);
        if ($request->usuario_id) $query->where('usuario_id', $request->usuario_id);
        if ($request->data_inicio) $query->where('data', '>=', $request->data_inicio);
        if ($request->data_fim) $query->where('data', '<=', $request->data_fim);
        if ($request->status) $query->where('status', $request->status);

        $registros = $query->latest('data')->get();

        return Inertia::render('Relatorios', [
            'registros' => $registros,
            'filters' => $request->all(['obra_id', 'usuario_id', 'data_inicio', 'data_fim', 'status']),
            'obras' => Obra::all(),
            'usuarios' => \App\Models\User::all(),
            'statusOpcoes' => StatusOpcao::all()
        ]);
    }
}
