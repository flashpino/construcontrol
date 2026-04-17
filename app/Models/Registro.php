<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    protected $fillable = [
        'obra_id',
        'usuario_id',
        'data',
        'status',
        'descricao_atividade',
        'problemas_observacoes',
        'acao_complementar',
        'descricao_acao_complementar',
        'status_acao_complementar',
        'observacoes_acao_complementar',
    ];

    public function obra()
    {
        return $this->belongsTo(Obra::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function fotos()
    {
        return $this->hasMany(Foto::class);
    }
}
