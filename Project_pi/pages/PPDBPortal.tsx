import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, ClipboardList, CheckCircle2, Clock,
  XCircle, ArrowRight, LogOut, User, BookOpen, AlertCircle,
  Loader2, FileText, Printer, Eye, Info, MessageCircle, X, Calendar, MapPin, Phone, Edit3, ClipboardCheck,
} from 'lucide-react';
import { ppdbApiFetch, ppdbLogout } from '../lib/api';
import { SEO } from '../components/SEO';

interface PPDBPortalProps {
  onLogout: () => void;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ApplicationData {
  registration_id: string;
  student_name: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  address: string;
  parent_name: string;
  whatsapp_number: string;
  tahun_ajaran: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  previous_school?: string;
  nisn?: string;
  father_name?: string;
  father_nik?: string;
  father_occupation?: string;
  father_education?: string;
  father_income?: string;
  mother_name?: string;
  mother_nik?: string;
  mother_occupation?: string;
  mother_education?: string;
  mother_income?: string;
  kk_file_name?: string;
  kk_file_data?: string;
  akta_file_name?: string;
  akta_file_data?: string;
  ktp_file_name?: string;
  ktp_file_data?: string;
  ijazah_file_name?: string;
  ijazah_file_data?: string;
}

const StatusBadge: React.FC<{ status: ApplicationData['status'] }> = ({ status }) => {
  const config = {
    pending: {
      icon: Clock,
      label: 'Menunggu Verifikasi',
      bg: 'bg-amber-500/15 border-amber-400/30',
      text: 'text-amber-300',
      iconColor: 'text-amber-400',
    },
    approved: {
      icon: CheckCircle2,
      label: 'Diterima',
      bg: 'bg-emerald-500/15 border-emerald-400/30',
      text: 'text-emerald-300',
      iconColor: 'text-emerald-400',
    },
    rejected: {
      icon: XCircle,
      label: 'Tidak Diterima',
      bg: 'bg-rose-500/15 border-rose-400/30',
      text: 'text-rose-300',
      iconColor: 'text-rose-400',
    },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${c.bg} ${c.text} text-sm font-semibold`}>
      <Icon size={16} className={c.iconColor} />
      {c.label}
    </div>
  );
};

export const PPDBPortal: React.FC<PPDBPortalProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [application, setApplication] = useState<ApplicationData | null | undefined>(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, appRes] = await Promise.all([
          ppdbApiFetch('/ppdb/me'),
          ppdbApiFetch('/ppdb/my-application'),
        ]);
        setUser(meRes.user);
        setApplication(appRes.data ?? null); // null = belum mendaftar
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await ppdbLogout();
    onLogout();
    navigate('/ppdb/login');
  };

  const firstName = user?.name?.split(' ')[0] || 'Pendaftar';
  const hasApplied = application !== null && application !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 relative overflow-x-hidden">
      <SEO
        title="Portal Pendaftar PPDB — MI Al-Hasani"
        description="Portal pendaftar PPDB MI Al-Hasani. Cek status dan kelola pendaftaran Anda."
      />

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400/8 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Navbar */}
      <div className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400/30 to-teal-500/30 border border-yellow-400/30 flex items-center justify-center">
              <GraduationCap size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Portal PPDB</p>
              <p className="text-teal-400 text-xs">MI Al-Hasani</p>
            </div>
          </div>

          <button
            id="ppdb-portal-logout"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-teal-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-teal-400 animate-spin mb-4" />
            <p className="text-teal-300 text-sm">Memuat data...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 flex items-start gap-3"
          >
            <AlertCircle className="text-rose-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-rose-300 font-semibold">Terjadi kesalahan</p>
              <p className="text-rose-400/80 text-sm mt-1">{error}</p>
              <button onClick={handleLogout} className="text-rose-300 text-sm underline mt-2">
                Kembali ke login
              </button>
            </div>
          </motion.div>
        )}

        {!loading && !error && (
          <>
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/30 to-teal-500/30 border border-yellow-400/20 flex items-center justify-center">
                  <User size={20} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-teal-400 text-xs font-medium">Selamat datang,</p>
                  <h1 className="text-white font-bold text-xl leading-tight">{user?.name}</h1>
                </div>
              </div>
              <p className="text-teal-400/70 text-sm mt-2 ml-13">{user?.email}</p>
            </motion.div>



            {/* Timeline Progress */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 overflow-hidden">
                <div className="flex items-center justify-between relative">
                  {/* Line behind steps */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full z-0"></div>
                  
                  {/* Step 1: Formulir */}
                  <div className="relative z-10 flex flex-col items-center gap-2 w-1/3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg ${
                      hasApplied ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-amber-500 shadow-amber-500/20'
                    }`}>
                      {hasApplied ? (
                        <CheckCircle2 size={14} className="text-white" />
                      ) : (
                        <Clock size={14} className="text-white animate-pulse" />
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold text-center ${
                      hasApplied ? 'text-emerald-400' : 'text-amber-400'
                    }`}>Isi Formulir</span>
                  </div>

                  {/* Step 2: Verifikasi */}
                  <div className="relative z-10 flex flex-col items-center gap-2 w-1/3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg ${
                      !hasApplied ? 'bg-slate-700 shadow-none' :
                      application?.status === 'pending' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
                    }`}>
                      {!hasApplied ? (
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                      ) : application?.status === 'pending' ? (
                        <Clock size={14} className="text-white animate-pulse" />
                      ) : (
                        <CheckCircle2 size={14} className="text-white" />
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold text-center ${
                      !hasApplied ? 'text-slate-500' :
                      application?.status === 'pending' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>Verifikasi</span>
                  </div>

                  {/* Step 3: Pengumuman */}
                  <div className="relative z-10 flex flex-col items-center gap-2 w-1/3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg ${
                      application?.status === 'approved' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                      application?.status === 'rejected' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-slate-700 shadow-none'
                    }`}>
                      {application?.status === 'approved' ? (
                        <CheckCircle2 size={14} className="text-white" />
                      ) : application?.status === 'rejected' ? (
                        <XCircle size={14} className="text-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold text-center ${
                      application?.status === 'approved' ? 'text-emerald-400' : 
                      application?.status === 'rejected' ? 'text-rose-400' : 'text-slate-500'
                    }`}>Pengumuman</span>
                  </div>
                  
                  {/* Active Line Overlays */}
                  <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                       style={{ 
                         width: !hasApplied ? '0%' : application?.status === 'pending' ? '50%' : '100%',
                         boxShadow: !hasApplied ? 'none' : '0 0 10px rgba(16, 185, 129, 0.5)'
                       }}>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-5"
            >
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <ClipboardList size={20} className="text-teal-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Status Pendaftaran</h2>
                  <p className="text-teal-400 text-xs">PPDB MI Al-Hasani</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-6">
                {/* Belum mendaftar */}
                {!hasApplied && (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-4">
                      <FileText size={32} className="text-teal-400/60" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">Belum Mendaftar</p>
                    <p className="text-teal-300/70 text-sm mb-6 leading-relaxed">
                      Kamu belum mengisi formulir pendaftaran.<br />
                      Klik tombol di bawah untuk mulai mendaftar.
                    </p>
                    <button
                      id="ppdb-portal-goto-form"
                      onClick={() => navigate('/ppdb/daftar')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-900 font-bold text-sm hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 hover:-translate-y-0.5"
                    >
                      <ClipboardList size={18} />
                      Isi Formulir Pendaftaran
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* Sudah mendaftar */}
                {hasApplied && application && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="text-teal-400 text-xs font-medium mb-1">Nomor Registrasi</p>
                        <p className="text-white font-bold text-xl font-mono tracking-wider">
                          {application.registration_id}
                        </p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-teal-400 text-xs mb-1">Nama Calon Siswa</p>
                        <p className="text-white font-semibold text-sm">{application.student_name}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-teal-400 text-xs mb-1">Tahun Ajaran</p>
                        <p className="text-white font-semibold text-sm">{application.tahun_ajaran}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 sm:col-span-2">
                        <p className="text-teal-400 text-xs mb-1">Tanggal Daftar</p>
                        <p className="text-white font-semibold text-sm">
                          {new Date(application.created_at).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Status message */}
                    {application.status === 'pending' && (
                      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
                        <Clock size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-300/90 text-sm leading-relaxed">
                          Pendaftaran kamu sedang dalam proses verifikasi oleh pihak sekolah. Harap tunggu dan pantau status di halaman ini.
                        </p>
                      </div>
                    )}
                    {application.status === 'approved' && (
                      <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4">
                        <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-emerald-300/90 text-sm leading-relaxed">
                          Selamat! Pendaftaran kamu telah <strong>diterima</strong>. Silakan hubungi pihak sekolah untuk informasi selanjutnya.
                        </p>
                      </div>
                    )}
                    {application.status === 'rejected' && (
                      <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-400/20 rounded-xl p-4">
                        <XCircle size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
                        <p className="text-rose-300/90 text-sm leading-relaxed">
                          Mohon maaf, pendaftaran kamu belum dapat diterima. Silakan hubungi pihak sekolah untuk informasi lebih lanjut.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-white/10 mt-6 flex flex-col sm:flex-row justify-end gap-3">
                      {application.status === 'pending' && (
                        <button
                          onClick={() => navigate('/ppdb/daftar?edit=true')}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 hover:text-white transition-all font-semibold text-sm border border-yellow-500/30"
                        >
                          <Edit3 size={16} />
                          Edit Formulir
                        </button>
                      )}
                      <button
                        onClick={() => setShowDetailsModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-teal-300 hover:bg-white/10 hover:text-white transition-all font-semibold text-sm border border-white/10"
                      >
                        <Eye size={16} />
                        Lihat Detail Formulir
                      </button>
                      {application.status === 'approved' && (
                        <button
                          onClick={() => {
                            window.scrollTo(0, 0);
                            setTimeout(() => window.print(), 100);
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 hover:text-white transition-all font-semibold text-sm border border-teal-500/30"
                        >
                          <Printer size={16} />
                          Cetak Bukti Pendaftaran
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Informasi Penting Box */}
            {hasApplied && application && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-gradient-to-r from-teal-900/40 to-teal-800/40 backdrop-blur-xl rounded-2xl border border-teal-500/20 p-5 mb-8"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info size={16} className="text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-teal-300 font-bold text-sm mb-1">Informasi Penting & Langkah Selanjutnya</h3>
                    <div className="text-teal-100/70 text-sm leading-relaxed space-y-2">
                      {application.status === 'pending' && (
                        <>
                          <p>1. Data Anda sedang diverifikasi. Proses ini memakan waktu 1-3 hari kerja.</p>
                          <p>2. Siapkan dokumen fisik (KK, Akta Kelahiran, KTP Orang Tua) di dalam map kuning.</p>
                          <p>3. Pantau terus halaman ini secara berkala untuk melihat hasil pengumuman pendaftaran.</p>
                        </>
                      )}
                      {application.status === 'approved' && (
                        <>
                          <p>1. Selamat, pendaftaran Anda telah diterima!</p>
                          <p>2. Silakan cetak bukti pendaftaran menggunakan tombol "Cetak Bukti Pendaftaran" di atas.</p>
                          <p>3. Bawa bukti cetak dan dokumen fisik ke sekolah untuk daftar ulang.</p>
                        </>
                      )}
                      {application.status === 'rejected' && (
                        <>
                          <p>1. Pendaftaran Anda tidak dapat kami terima pada gelombang ini.</p>
                          <p>2. Anda bisa mengambil kembali berkas fisik di ruang panitia PPDB.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Back to Guide */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center pb-10"
            >
              <button
                onClick={() => navigate('/ppdb')}
                className="inline-flex items-center gap-2 text-teal-400/70 hover:text-teal-300 text-sm transition-colors"
              >
                <BookOpen size={15} />
                Kembali ke Panduan PPDB
              </button>
            </motion.div>
          </>
        )}
      </div>

      {/* ===== PRINT AREA (HIDDEN ON SCREEN) ===== */}
      {hasApplied && application && (
        <div id="ppdb-print-area">
          <div className="print-receipt">
            {/* School Header */}
            <div className="print-header">
              <img src="/logo.png" alt="Logo MI Al-Hasani" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
              <div className="print-school-info">
                <h1>MI AL-HASANI</h1>
                <p>Cerdas, Berkarakter, Islami</p>
                <p className="print-address">Kp. Babakansirna RT 002/002, Jl. Jogjogan, Kec. Cisarua, Kabupaten Bogor</p>
              </div>
            </div>

            <div className="print-divider"></div>

            <h2 className="print-title">BUKTI PENDAFTARAN PESERTA DIDIK BARU</h2>
            <p className="print-subtitle">Tahun Ajaran {application.tahun_ajaran}</p>

            {/* Registration Number */}
            <div className="print-reg-box">
              <span className="print-reg-label">Nomor Registrasi</span>
              <span className="print-reg-number">{application.registration_id}</span>
            </div>

            {/* Applicant Details */}
            <table className="print-table">
              <tbody>
                <tr>
                  <td className="print-td-label">Nama Lengkap</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{application.student_name}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Tahun Ajaran</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{application.tahun_ajaran}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Tempat, Tanggal Lahir</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{application.birth_place}, {new Date(application.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Jenis Kelamin</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{application.gender}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Alamat Lengkap</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{application.address || '-'}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Nama Orang Tua/Wali</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{application.parent_name}</td>
                </tr>
            
                <tr>
                  <td className="print-td-label">No. WhatsApp</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{application.whatsapp_number}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Tanggal Daftar</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{new Date(application.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Status</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">
                    {application.status === 'pending' && 'Menunggu Verifikasi'}
                    {application.status === 'approved' && <span className="print-status-approved">DITERIMA ✓</span>}
                    {application.status === 'rejected' && 'Tidak Diterima'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Stamp Watermark */}
            {application.status === 'approved' && (
              <div className="print-stamp">DITERIMA</div>
            )}
            {application.status === 'rejected' && (
              <div className="print-stamp" style={{ color: '#ef4444', borderColor: '#ef4444' }}>DITOLAK</div>
            )}
            {application.status === 'pending' && (
              <div className="print-stamp" style={{ color: '#eab308', borderColor: '#eab308' }}>DIPROSES</div>
            )}

            {/* Footer */}
            <div className="print-footer">
              <div className="print-footer-left">
                <p>* Dokumen ini dicetak otomatis oleh sistem.</p>
                <p>* Harap dibawa beserta berkas asli (KK, Akta, dll) saat verifikasi fisik.</p>
                <p>Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="print-footer-right">
                <p>Kepala Sekolah,</p>
                <img src="/images/ttd.jpg" alt="Tanda Tangan Kepala Sekolah" style={{ width: '160px', height: '95px', objectFit: 'contain', margin: '-5px auto -15px auto' }} />
                <p className="print-signee" style={{ marginTop: '5px', fontWeight: 'bold', textDecoration: 'underline' }}>Eneng Heti Nurhayati, S.Pd.I</p>
                <p className="print-signee-role">NIP. 197804302007102002</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <a 
          href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB%20MI%20Al-Hasani,%20saya%20ingin%20bertanya..." 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all hover:-translate-y-1 group"
          title="Hubungi Panitia PPDB"
        >
          <MessageCircle size={24} />
          <span className="absolute right-16 bg-white text-slate-800 text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Hubungi Panitia
          </span>
        </a>
      </div>

      {/* Modal Detail Formulir */}
      {showDetailsModal && application && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-teal-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                  <FileText size={16} className="text-white" />
                </div>
                <h3 className="font-bold text-teal-900">Detail Formulir Pendaftaran</h3>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Seksi Info Pendaftaran */}
              <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">Nomor Pendaftaran</p>
                    <p className="text-lg font-bold text-teal-900">{application.registration_id || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">Status Pendaftaran</p>
                    <div className="mt-1">
                      {application.status === 'pending' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold border border-yellow-200">Menunggu Review</span>}
                      {application.status === 'approved' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">Diterima</span>}
                      {application.status === 'rejected' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold border border-red-200">Ditolak</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi Siswa */}
              <div>
                <h4 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <User size={16} /> Data Calon Siswa
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <p className="text-xs text-gray-500">Nama Lengkap</p>
                    <p className="text-sm font-semibold text-gray-800">{application.student_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Jenis Kelamin</p>
                    <p className="text-sm font-semibold text-gray-800">{application.gender || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Asal Sekolah (TK/RA)</p>
                    <p className="text-sm font-semibold text-gray-800">{application.previous_school || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">NISN</p>
                    <p className="text-sm font-semibold text-gray-800">{application.nisn || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tempat, Tanggal Lahir</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {application.birth_place || '-'}, {application.birth_date ? new Date(application.birth_date).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500">Alamat Lengkap</p>
                    <p className="text-sm font-semibold text-gray-800">{application.address || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Seksi Data Ayah */}
              <div>
                <h4 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <User size={16} /> Data Ayah Kandung
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <p className="text-xs text-gray-500">Nama Ayah</p>
                    <p className="text-sm font-semibold text-gray-800">{application.father_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">NIK Ayah</p>
                    <p className="text-sm font-semibold text-gray-800">{application.father_nik || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pekerjaan</p>
                    <p className="text-sm font-semibold text-gray-800">{application.father_occupation || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pendidikan Terakhir</p>
                    <p className="text-sm font-semibold text-gray-800">{application.father_education || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Penghasilan</p>
                    <p className="text-sm font-semibold text-gray-800">{application.father_income || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Seksi Data Ibu */}
              <div>
                <h4 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <User size={16} /> Data Ibu Kandung
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <p className="text-xs text-gray-500">Nama Ibu</p>
                    <p className="text-sm font-semibold text-gray-800">{application.mother_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">NIK Ibu</p>
                    <p className="text-sm font-semibold text-gray-800">{application.mother_nik || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pekerjaan</p>
                    <p className="text-sm font-semibold text-gray-800">{application.mother_occupation || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pendidikan Terakhir</p>
                    <p className="text-sm font-semibold text-gray-800">{application.mother_education || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Penghasilan</p>
                    <p className="text-sm font-semibold text-gray-800">{application.mother_income || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Seksi Kontak Wali */}
              <div>
                <h4 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Phone size={16} /> Kontak Wali (Utama)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <p className="text-xs text-gray-500">Nama Wali</p>
                    <p className="text-sm font-semibold text-gray-800">{application.parent_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">No. WhatsApp</p>
                    <p className="text-sm font-semibold text-gray-800">{application.whatsapp_number || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Seksi Berkas */}
              <div>
                <h4 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FileText size={16} /> Berkas Pendaftaran
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {application.kk_file_data ? (
                    <a href={application.kk_file_data} target="_blank" rel="noreferrer" className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-teal-50 transition-colors group hover:border-teal-300">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mr-3 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">Kartu Keluarga</p>
                        <p className="text-xs text-gray-500 truncate">{application.kk_file_name}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <p className="text-sm text-gray-400 italic">KK belum diunggah</p>
                    </div>
                  )}

                  {application.akta_file_data ? (
                    <a href={application.akta_file_data} target="_blank" rel="noreferrer" className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-teal-50 transition-colors group hover:border-teal-300">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mr-3 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">Akta Kelahiran</p>
                        <p className="text-xs text-gray-500 truncate">{application.akta_file_name}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <p className="text-sm text-gray-400 italic">Akta belum diunggah</p>
                    </div>
                  )}

                  {application.ktp_file_data ? (
                    <a href={application.ktp_file_data} target="_blank" rel="noreferrer" className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-teal-50 transition-colors group hover:border-teal-300">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mr-3 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">KTP Orang Tua</p>
                        <p className="text-xs text-gray-500 truncate">{application.ktp_file_name}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <p className="text-sm text-gray-400 italic">KTP belum diunggah</p>
                    </div>
                  )}

                  {application.ijazah_file_data ? (
                    <a href={application.ijazah_file_data} target="_blank" rel="noreferrer" className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-teal-50 transition-colors group hover:border-teal-300">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mr-3 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">Ijazah / SKL</p>
                        <p className="text-xs text-gray-500 truncate">{application.ijazah_file_name}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <p className="text-sm text-gray-400 italic">Ijazah belum diunggah</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
