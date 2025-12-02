<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            [
                'role_name' => 'Admin',
                'description' => 'Administrator with full access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_name' => 'Customer',
                'description' => 'Regular customer user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}