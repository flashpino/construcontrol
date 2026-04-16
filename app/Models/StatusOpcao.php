<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatusOpcao extends Model
{
    protected $table = 'status_opcoes';
    protected $fillable = ['nome', 'cor'];
}
