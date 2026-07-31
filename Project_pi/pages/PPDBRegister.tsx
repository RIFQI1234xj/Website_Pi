import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, Loader2, AlertCircle,
  GraduationCap, ArrowLeft, User, CheckCircle2, LogIn,
} from 'lucide-react';
import { ppdbRegister } from '../lib/api';
import { SEO } from '../components/SEO';

interface PPDBRegisterProps {
  onRegisterSuccess: () => void;
}

export const PPDBRegister: React.FC<PPDBRegisterProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [nik, setNik] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordMatch = password && passwordConfirm && password === passwordConfirm;
  const passwordMismatch = password && passwordConfirm && password !== passwordConfirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nik.length !== 16) {
      setError('NIK harus terdiri dari 16 digit angka.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ppdbRegister(nik, username, name, password, passwordConfirm);
      setSuccess(true);
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal membuat akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <SEO
        title="Daftar Akun Pendaftar PPDB — MI Al-Hasani"
        description="Buat akun pendaftar PPDB MI Al-Hasani untuk mengisi formulir pendaftaran siswa baru."
      />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/ppdb/login')}
          className="flex items-center gap-2 text-teal-300/70 hover:text-teal-200 text-sm font-medium mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Sudah punya akun? Login di sini
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-teal-600/20 border border-yellow-400/20 backdrop-blur-sm mb-5 shadow-xl">
            <GraduationCap size={40} className="text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Buat Akun Pendaftar
          </h1>
          <p className="text-teal-300/80 text-sm leading-relaxed">
            Buat akun untuk mendaftar PPDB<br />
            <span className="font-semibold text-teal-200">MI Al-Hasani</span>
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* NIK */}
            <div>
              <label className="block text-sm font-semibold text-teal-200 mb-2">
                NIK Calon Siswa <span className="text-teal-500 font-normal">(16 digit)</span>
              </label>
              <div className="relative group">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="ppdb-register-nik"
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="16 digit Nomor Induk Kependudukan"
                  required
                  maxLength={16}
                  minLength={16}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-teal-600 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-semibold text-teal-200 mb-2">
                Nama Lengkap Calon Siswa
              </label>
              <div className="relative group">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="ppdb-register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s\.\']/g, ''))}
                  placeholder="Nama lengkap sesuai KK/Akta"
                  required
                  pattern="^[a-zA-Z\s\.\']+$"
                  title="Nama hanya boleh berisi huruf, spasi, titik, dan tanda kutip"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-teal-600 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-teal-200 mb-2">
                Username
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="ppdb-register-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="Misal: budi2023"
                  required
                  title="Username hanya boleh berisi huruf kecil, angka, dan underscore"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-teal-600 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-teal-200 mb-2">
                Password <span className="text-teal-500 font-normal">(min. 8 karakter)</span>
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="ppdb-register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-teal-600 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-teal-500 hover:text-teal-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-sm font-semibold text-teal-200 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="ppdb-register-password-confirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-11 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-teal-600 text-sm focus:outline-none focus:ring-2 transition-all ${
                    passwordMismatch
                      ? 'border-rose-500/50 focus:ring-rose-400/30'
                      : passwordMatch
                      ? 'border-emerald-500/50 focus:ring-emerald-400/30'
                      : 'border-white/10 focus:ring-yellow-400/50 focus:border-yellow-400/50'
                  } focus:bg-white/10`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {passwordMatch && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="p-1 text-teal-500 hover:text-teal-300 transition-colors"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {passwordMismatch && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle size={11} /> Password tidak cocok
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="ppdb-register-submit"
              type="submit"
              disabled={loading || !!passwordMismatch}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-900 font-bold text-sm rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Membuat Akun...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Buat Akun
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-3">
            <p className="text-teal-400 text-sm">
              Sudah punya akun pendaftar?
            </p>
            <button
              id="ppdb-goto-login"
              onClick={() => navigate('/ppdb/login')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-400/20 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 transition-all text-sm font-semibold w-full justify-center"
            >
              <LogIn size={16} />
              Masuk / Login
            </button>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-teal-600 text-xs mt-6"
        >
          © {new Date().getFullYear()} MI Al-Hasani • Portal PPDB
        </motion.p>
      </div>
    </div>
  );
};
