import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, GraduationCap, ArrowLeft, UserPlus, User, KeyRound, CheckCircle2 } from 'lucide-react';
import { ppdbLogin, ppdbResetPassword } from '../lib/api';
import { SEO } from '../components/SEO';

interface PPDBLoginProps {
  onLoginSuccess: () => void;
}

export const PPDBLogin: React.FC<PPDBLoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset Password States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetNik, setResetNik] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await ppdbLogin(username, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Username atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNik.length !== 16) {
      setResetError('NIK harus terdiri dari 16 digit angka.');
      return;
    }
    if (resetPassword !== resetPasswordConfirm) {
      setResetError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    setResetSuccess(null);

    try {
      const res = await ppdbResetPassword(resetUsername, resetNik, resetPassword, resetPasswordConfirm);
      setResetSuccess(res.message || 'Kata sandi berhasil diperbarui.');
      setTimeout(() => {
        setShowResetModal(false);
        setResetUsername('');
        setResetNik('');
        setResetPassword('');
        setResetPasswordConfirm('');
        setResetSuccess(null);
      }, 3000);
    } catch (err: any) {
      setResetError(err.message || 'Gagal mereset kata sandi.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <SEO
        title="Login Pendaftar PPDB — MI Al-Hasani"
        description="Masuk ke akun pendaftar PPDB MI Al-Hasani untuk mengisi formulir pendaftaran."
      />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-600/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
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
          onClick={() => navigate('/ppdb')}
          className="flex items-center gap-2 text-teal-300/70 hover:text-teal-200 text-sm font-medium mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Panduan PPDB
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/30 to-teal-700/30 border border-teal-400/30 backdrop-blur-sm mb-5 shadow-xl">
            <GraduationCap size={40} className="text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Masuk Akun Pendaftar
          </h1>
          <p className="text-teal-300/80 text-sm leading-relaxed">
            Masuk untuk melanjutkan pendaftaran PPDB<br />
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
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-teal-200 mb-2">
                Username
              </label>
              <div className="relative group">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="ppdb-login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="Masukkan username"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-teal-600 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-teal-200">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowResetModal(true)}
                  className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  id="ppdb-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

            {/* Submit */}
            <button
              id="ppdb-login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-900 font-bold text-sm rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-3">
            <p className="text-teal-400 text-sm">
              Belum punya akun pendaftar?
            </p>
            <button
              id="ppdb-goto-register"
              onClick={() => navigate('/ppdb/register')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-400/20 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 transition-all text-sm font-semibold w-full justify-center"
            >
              <UserPlus size={16} />
              Daftar Akun Baru
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

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => !resetLoading && setShowResetModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Reset Kata Sandi</h3>
                  <p className="text-slate-400 text-xs">Masukkan Username dan NIK Calon Siswa</p>
                </div>
              </div>

              {resetSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <h4 className="text-white font-bold mb-2">Berhasil!</h4>
                  <p className="text-slate-400 text-sm">{resetSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {resetError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      {resetError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={resetUsername}
                        onChange={(e) => setResetUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Username terdaftar"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">NIK Calon Siswa</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        maxLength={16}
                        minLength={16}
                        value={resetNik}
                        onChange={(e) => setResetNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="16 digit NIK"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Kata Sandi Baru</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showResetPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Minimal 8 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(!showResetPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showResetPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Konfirmasi Kata Sandi</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showResetPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={resetPasswordConfirm}
                        onChange={(e) => setResetPasswordConfirm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Ulangi kata sandi baru"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(false)}
                      disabled={resetLoading}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {resetLoading ? <Loader2 size={16} className="animate-spin" /> : 'Reset Sandi'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
