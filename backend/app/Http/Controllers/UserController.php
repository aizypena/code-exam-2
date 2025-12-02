<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255|unique:users,full_name',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
        ]);

        return response()->json($user->load('role'), 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load('role'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'full_name' => 'required|string|max:255|unique:users,full_name,' . $user->id,
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $user->full_name = $request->full_name;
        $user->email = $request->email;
        $user->role_id = $request->role_id;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json($user->load('role'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
