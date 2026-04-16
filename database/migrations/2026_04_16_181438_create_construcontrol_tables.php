<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('obras', function (Blueprint $table) {
            $table->id();
            $table->text('titulo_da_obra');
            $table->enum('status', ['ativa', 'inativa'])->default('ativa');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('status_opcoes', function (Blueprint $table) {
            $table->id();
            $table->string('nome')->unique();
            $table->string('cor', 50)->default('#64748b');
            $table->timestamps();
        });

        Schema::create('registros', function (Blueprint $table) {
            $table->id();
            $table->foreignId('obra_id')->constrained('obras');
            $table->foreignId('usuario_id')->constrained('users');
            $table->date('data');
            $table->text('status');
            $table->text('descricao_atividade');
            $table->text('problemas_observacoes')->nullable();
            $table->boolean('acao_complementar')->default(false);
            $table->text('descricao_acao_complementar')->nullable();
            $table->timestamps();
        });

        Schema::create('fotos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registro_id')->constrained('registros')->onDelete('cascade');
            $table->text('caminho_arquivo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fotos');
        Schema::dropIfExists('registros');
        Schema::dropIfExists('status_opcoes');
        Schema::dropIfExists('obras');
    }
};
