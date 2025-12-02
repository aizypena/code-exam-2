<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Get role IDs
        $adminRole = DB::table('roles')->where('role_name', 'Admin')->first();
        $customerRole = DB::table('roles')->where('role_name', 'Customer')->first();

        DB::table('users')->insert([
            [
                'full_name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'full_name' => 'Customer User',
                'email' => 'customer@example.com',
                'password' => Hash::make('password123'),
                'role_id' => $customerRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}