<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login Admin — hanya untuk user dengan role 'admin'
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Hanya role admin yang boleh masuk ke panel admin
        if ($user->role !== 'admin') {
            throw ValidationException::withMessages([
                'email' => ['Akun ini tidak memiliki akses admin.'],
            ]);
        }

        // Hapus token lama (agar hanya 1 token aktif)
        $user->tokens()->where('name', 'admin-token')->delete();

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => $user
        ], 200);
    }

    /**
     * Register Pendaftar PPDB — buat akun baru dengan role 'pendaftar'
     */
    public function ppdbRegister(Request $request)
    {
        $request->validate([
            'nik'                   => 'required|string|size:16|unique:users,nik',
            'username'              => 'required|string|max:255|unique:users,username',
            'name'                  => 'required|string|max:255|regex:/^[a-zA-Z\s\.\']+$/',
            'password'              => 'required|string|min:8|confirmed',
        ], [
            'nik.required'          => 'NIK wajib diisi.',
            'nik.size'              => 'NIK harus berisi 16 digit angka.',
            'nik.unique'            => 'NIK ini sudah terdaftar. Silakan login.',
            'username.required'     => 'Username wajib diisi.',
            'username.unique'       => 'Username ini sudah terdaftar. Silakan pilih username lain.',
            'name.required'         => 'Nama lengkap wajib diisi.',
            'name.regex'            => 'Nama lengkap hanya boleh berisi huruf, spasi, titik, dan tanda kutip.',
            'password.min'          => 'Password minimal 8 karakter.',
            'password.confirmed'    => 'Konfirmasi password tidak cocok.',
        ]);

        $user = User::create([
            'nik'      => $request->nik,
            'username' => $request->username,
            'name'     => $request->name,
            'password' => Hash::make($request->password),
            'role'     => 'pendaftar',
        ]);

        $token = $user->createToken('ppdb-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dibuat.',
            'token'   => $token,
            'user'    => $user
        ], 201);
    }

    /**
     * Reset Password PPDB menggunakan Email dan NIK
     */
    public function ppdbResetPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'nik'      => 'required|string|size:16',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'username.required'  => 'Username wajib diisi.',
            'nik.required'       => 'NIK wajib diisi.',
            'nik.size'           => 'NIK harus berisi 16 digit.',
            'password.required'  => 'Password baru wajib diisi.',
            'password.min'       => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $user = User::where('username', $request->username)
                    ->where('nik', $request->nik)
                    ->where('role', 'pendaftar')
                    ->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'username' => ['Kombinasi Username dan NIK tidak ditemukan.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kata sandi berhasil diperbarui. Silakan login.',
        ], 200);
    }

    /**
     * Login Pendaftar PPDB — hanya untuk user dengan role 'pendaftar'
     */
    public function ppdbLogin(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password salah.'],
            ]);
        }

        // Hanya pendaftar yang boleh login via endpoint ini
        if ($user->role !== 'pendaftar') {
            throw ValidationException::withMessages([
                'email' => ['Gunakan halaman login admin untuk akun ini.'],
            ]);
        }

        // Hapus token ppdb lama (agar hanya 1 token aktif)
        $user->tokens()->where('name', 'ppdb-token')->delete();

        $token = $user->createToken('ppdb-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => $user
        ], 200);
    }

    /**
     * Logout Admin — hapus token aktif
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ], 200);
    }

    /**
     * Logout Pendaftar PPDB — hapus token aktif
     */
    public function ppdbLogout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ], 200);
    }

    /**
     * Ambil data user yang sedang login (pendaftar)
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user'    => $request->user()
        ], 200);
    }
}
