<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Obra extends Model
{
    use SoftDeletes;

    protected $fillable = ['titulo_da_obra', 'status'];

    public function registros()
    {
        return $this->hasMany(Registro::class);
    }
}
