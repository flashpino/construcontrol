<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        \App\Models\User::create([
            'name' => 'Administrador',
            'username' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Default Status
        $statuses = [
            ['nome' => 'Concluído', 'cor' => '#4CAF50'],
            ['nome' => 'Em andamento', 'cor' => '#2196F3'],
            ['nome' => 'Planejado', 'cor' => '#FFC107'],
            ['nome' => 'Atrasado', 'cor' => '#F44336'],
            ['nome' => 'Pausado', 'cor' => '#9E9E9E'],
        ];

        foreach ($statuses as $status) {
            \App\Models\StatusOpcao::create($status);
        }
    }
}
