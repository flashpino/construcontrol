<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcaoComplementar extends Model
{
    protected $table = 'acoes_complementares';
    
    protected $fillable = [
        'nome',
        'status'
    ];
}
