<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Foto extends Model
{
    protected $fillable = ['registro_id', 'caminho_arquivo'];

    public function registro()
    {
        return $this->belongsTo(Registro::class);
    }
}
