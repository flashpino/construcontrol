<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Obra;
use App\Models\Registro;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->query('period');
        $queryBuilder = Registro::query();

        if ($period === 'hoje') {
            $queryBuilder->whereDate('data', now()->toDateString());
        } elseif ($period === 'semana') {
            $queryBuilder->where('data', '>=', now()->subDays(7));
        } elseif ($period === 'mes') {
            $queryBuilder->where('data', '>=', now()->subDays(30));
        }

        $totalObrasAtivas = Obra::where('status', 'ativa')->count();
        
        $totalRegistros = (clone $queryBuilder)->count();
        
        $registrosPorStatus = (clone $queryBuilder)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        $obrasMaisAtivas = (clone $queryBuilder)
            ->join('obras', 'registros.obra_id', '=', 'obras.id')
            ->select('obras.titulo_da_obra', DB::raw('count(registros.id) as count'))
            ->groupBy('obras.id', 'obras.titulo_da_obra')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        $usuariosMaisAtivos = (clone $queryBuilder)
            ->join('users', 'registros.usuario_id', '=', 'users.id')
            ->select('users.username', DB::raw('count(registros.id) as count'))
            ->groupBy('users.id', 'users.username')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        $problemasReportados = (clone $queryBuilder)
            ->whereNotNull('problemas_observacoes')
            ->where('problemas_observacoes', '!=', '')
            ->count();

        $acaoComplementarCount = (clone $queryBuilder)
            ->where('acao_complementar', 1)
            ->count();

        $data = [
            'totalObrasAtivas' => $totalObrasAtivas,
            'totalRegistros' => $totalRegistros,
            'registrosPorStatus' => $registrosPorStatus,
            'obrasMaisAtivas' => $obrasMaisAtivas,
            'usuariosMaisAtivos' => $usuariosMaisAtivos,
            'problemasReportados' => $problemasReportados,
            'taxaAcaoComplementar' => $totalRegistros > 0 ? ($acaoComplementarCount / $totalRegistros) * 100 : 0
        ];

        // Se for uma requisição de atualização via API/Inertia
        if ($request->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('Dashboard', [
            'dashboardData' => $data,
            'period' => $period ?: 'total'
        ]);
    }
}
