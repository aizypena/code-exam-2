<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'role_name' => 'required|string|max:255|unique:roles,role_name',
            'description' => 'nullable|string',
        ]);

        $role = Role::create([
            'role_name' => $request->role_name,
            'description' => $request->description,
        ]);

        return response()->json($role, 201);
    }

    public function show(Role $role)
    {
        return response()->json($role);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'role_name' => 'required|string|max:255|unique:roles,role_name,' . $role->id,
            'description' => 'nullable|string',
        ]);

        $role->update([
            'role_name' => $request->role_name,
            'description' => $request->description,
        ]);

        return response()->json($role);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }
}
