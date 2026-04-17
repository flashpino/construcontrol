<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registros', function (Blueprint $table) {
            $table->string('status_acao_complementar')->nullable()->after('descricao_acao_complementar');
            $table->text('observacoes_acao_complementar')->nullable()->after('status_acao_complementar');
        });
    }

    public function down(): void
    {
        Schema::table('registros', function (Blueprint $table) {
            $table->dropColumn(['status_acao_complementar', 'observacoes_acao_complementar']);
        });
    }
};
