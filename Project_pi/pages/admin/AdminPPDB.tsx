import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  ClipboardList, Search, CheckCircle2, XCircle, Clock, Users,
  MessageCircle, Printer, Eye, ChevronDown, ChevronRight, Filter, RefreshCw,
  Phone, User, Calendar, MapPin, FileText, AlertCircle, Trash2,
  Download, X, Settings, Save, Loader2
} from 'lucide-react';
import { PPDBApplicant, PPDBStatus } from '../../types';
import { apiFetch, API_BASE_URL } from '../../lib/api';

type StatusFilter = 'all' | PPDBStatus;

const STATUS_CONFIG: Record<PPDBStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending: { label: 'Menunggu', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock },
  approved: { label: 'Diterima', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', icon: CheckCircle2 },
  rejected: { label: 'Ditolak', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
};

const getCurrentAcademicYear = (date = new Date()): string => {
  const year = date.getFullYear();
  const startYear = date.getMonth() >= 6 ? year : year - 1;
  return `${startYear}/${startYear + 1}`;
};

export const AdminPPDB: React.FC = () => {
  const [applicants, setApplicants] = useState<PPDBApplicant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<PPDBApplicant | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [viewDoc, setViewDoc] = useState<{ url: string; name: string } | null>(null);
  const [printingApplicant, setPrintingApplicant] = useState<PPDBApplicant | null>(null);
  const [printingReport, setPrintingReport] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [waPromptApplicant, setWaPromptApplicant] = useState<PPDBApplicant | null>(null);
  const [waPromptReason, setWaPromptReason] = useState('Usia belum mencukupi / Kuota penuh');

  // PPDB Config States
  const [configTahunAjaran, setConfigTahunAjaran] = useState(getCurrentAcademicYear());
  const [configIsOpen, setConfigIsOpen] = useState(false);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [isConfigSaving, setIsConfigSaving] = useState(false);
  const [tahunAjaranFilter, setTahunAjaranFilter] = useState('all');

  // Load PPDB Config
  const loadConfig = async () => {
    setIsConfigLoading(true);
    try {
      const res = await apiFetch('/ppdb-status');
      if (res.status === 'success' && res.data) {
        setConfigTahunAjaran(getCurrentAcademicYear());
        setConfigIsOpen(res.data.is_open);
      }
    } catch (err) {
      console.error('Failed to load PPDB config', err);
      showToast('Gagal memuat konfigurasi PPDB', 'error');
    } finally {
      setIsConfigLoading(false);
    }
  };

  // Load data dari API backend
  const loadData = async () => {
    try {
      const res = await apiFetch('/applicants');
      if (res.status === 'success' && res.data) {
        // Map database fields back to frontend structure
        const mappedData = res.data.map((item: any) => ({
          id: item.registration_id,
          tahunAjaran: item.tahun_ajaran,
          studentName: item.student_name,
          birthPlace: item.birth_place,
          birthDate: item.birth_date,
          gender: item.gender,
          address: item.address,
          parentName: item.parent_name,
          whatsappNumber: item.whatsapp_number,
          kkFileName: item.kk_file_name || '',
          kkFileData: item.kk_file_data || '',
          aktaFileName: item.akta_file_name || '',
          aktaFileData: item.akta_file_data || '',
          ktpFileName: item.ktp_file_name || '',
          ktpFileData: item.ktp_file_data || '',
          ijazahFileName: item.ijazah_file_name || '',
          ijazahFileData: item.ijazah_file_data || '',
          status: item.status,
          submittedAt: item.created_at,
          dbId: item.id // Store the DB internal ID if needed for update/delete
        }));
        setApplicants(mappedData);
      }
    } catch (err) {
      console.error('Failed to load applicants', err);
      showToast('Gagal memuat data pendaftar', 'error');
    }
  };

  useEffect(() => {
    loadData();
    loadConfig();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Hapus saveData karena sudah pakai database

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Update applicant status ke API
  const updateStatus = async (id: string, status: PPDBStatus) => {
    try {
      // Cari applicant untuk mendapatkan DB ID
      const applicant = applicants.find(a => a.id === id);
      const dbId = (applicant as any)?.dbId || id;
      
      const res = await apiFetch(`/applicants/${dbId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.status === 'success') {
        const updated = applicants.map(a => a.id === id ? { ...a, status } : a);
        setApplicants(updated);
        const label = status === 'approved' ? 'diterima' : 'ditolak';
        showToast(`Pendaftar berhasil ${label}`, 'success');
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error('Failed to update status', error);
      showToast('Gagal memperbarui status', 'error');
    }
  };

  // Delete applicant via API
  const deleteApplicant = async (id: string) => {
    if (confirm('Hapus data pendaftar ini secara permanen?')) {
      try {
        const applicant = applicants.find(a => a.id === id);
        const dbId = (applicant as any)?.dbId || id;

        const res = await apiFetch(`/applicants/${dbId}`, {
          method: 'DELETE'
        });

        if (res.status === 'success') {
          const updated = applicants.filter(a => a.id !== id);
          setApplicants(updated);
          showToast('Data pendaftar berhasil dihapus', 'success');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        console.error('Failed to delete', error);
        showToast('Gagal menghapus data', 'error');
      }
    }
  };

  // Contact via WhatsApp
  const contactWhatsApp = (applicant: PPDBApplicant) => {
    if (applicant.status === 'rejected') {
      setWaPromptApplicant(applicant);
      setWaPromptReason('Usia belum mencukupi / Kuota penuh');
      return;
    }
    executeWhatsApp(applicant, '');
  };

  const executeWhatsApp = (applicant: PPDBApplicant, reason: string) => {
    let phone = applicant.whatsappNumber.replace(/[\s\-]/g, '');
    if (phone.startsWith('08')) phone = '62' + phone.slice(1);
    if (phone.startsWith('+')) phone = phone.slice(1);

    const statusText = applicant.status === 'approved' ? 'DITERIMA' :
                       applicant.status === 'rejected' ? 'BELUM DITERIMA' : 'SEDANG DIPROSES';

    let reasonText = '';
    if (applicant.status === 'rejected' && reason.trim() !== '') {
      reasonText = `\n- Alasan: ${reason.trim()}`;
    }

    const message = encodeURIComponent(
      `Assalamu'alaikum, Bapak/Ibu ${applicant.parentName}.\n\n` +
      `Terima kasih telah mendaftarkan *${applicant.studentName}* di MI Al-Hasani.\n\n` +
      `- No. Registrasi: *${applicant.id}*\n` +
      `- Status: *${statusText}*${reasonText}\n\n` +
      `Untuk informasi lebih lanjut, silakan menghubungi pihak sekolah.\n` +
      `Jazakumullahu khairan.`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // Print receipt
  const handlePrint = (applicant: PPDBApplicant) => {
    setPrintingApplicant(applicant);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleExportPdf = () => {
    setPrintingReport(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Save Config
  const saveConfig = async () => {
    setIsConfigSaving(true);
    try {
      const res = await apiFetch('/ppdb-status/update', {
        method: 'PUT',
        body: JSON.stringify({
          tahun_ajaran: configTahunAjaran,
          is_open: configIsOpen
        })
      });
      if (res.status === 'success') {
        showToast('Konfigurasi PPDB berhasil diperbarui!', 'success');
      } else {
        throw new Error('Gagal memperbarui');
      }
    } catch (err) {
      console.error('Failed to save PPDB config', err);
      showToast('Gagal menyimpan konfigurasi PPDB', 'error');
    } finally {
      setIsConfigSaving(false);
    }
  };

  // Filtered data
  const academicYears = useMemo(() => {
    const years = applicants
      .map((applicant) => applicant.tahunAjaran || configTahunAjaran)
      .filter((year, index, array) => array.indexOf(year) === index);

    return years.sort((a, b) => b.localeCompare(a));
  }, [applicants, configTahunAjaran]);

  const reportApplicants = useMemo(() => {
    if (tahunAjaranFilter === 'all') return applicants;
    return applicants.filter((applicant) => (applicant.tahunAjaran || configTahunAjaran) === tahunAjaranFilter);
  }, [applicants, configTahunAjaran, tahunAjaranFilter]);

  const reportStats = useMemo(() => {
    const total = reportApplicants.length;
    const pending = reportApplicants.filter((a) => a.status === 'pending').length;
    const approved = reportApplicants.filter((a) => a.status === 'approved').length;
    const rejected = reportApplicants.filter((a) => a.status === 'rejected').length;

    return { total, pending, approved, rejected };
  }, [reportApplicants]);

  const reportByYear = useMemo(() => {
    const grouped = applicants.reduce<Record<string, { total: number; pending: number; approved: number; rejected: number }>>((acc, applicant) => {
      const year = applicant.tahunAjaran || configTahunAjaran;
      if (!acc[year]) {
        acc[year] = { total: 0, pending: 0, approved: 0, rejected: 0 };
      }
      acc[year].total += 1;
      acc[year][applicant.status] += 1;
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  }, [applicants, configTahunAjaran]);

  const filtered = reportApplicants.filter(a => {
    const matchSearch = !searchQuery ||
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === 'pending').length,
    approved: applicants.filter(a => a.status === 'approved').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
  };

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatFullDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintingApplicant(null);
      setPrintingReport(false);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const escapeCsv = (value: string | number | null | undefined): string => {
    const text = value === null || value === undefined ? '' : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const exportAcademicYearReport = () => {
    const filterLabel = tahunAjaranFilter === 'all' ? 'Semua Tahun Ajaran' : tahunAjaranFilter;
    const lines: string[] = [];

    lines.push([
      'Laporan PPDB Berdasarkan Tahun Ajaran',
      `Filter: ${filterLabel}`,
      `Dicetak: ${new Date().toLocaleString('id-ID')}`,
    ].map(escapeCsv).join(','));
    lines.push('');
    lines.push(['Ringkasan Tahun Ajaran', 'Total', 'Menunggu', 'Diterima', 'Ditolak'].map(escapeCsv).join(','));

    if (reportByYear.length > 0) {
      reportByYear.forEach(([year, summary]) => {
        lines.push([
          year,
          summary.total,
          summary.pending,
          summary.approved,
          summary.rejected,
        ].map(escapeCsv).join(','));
      });
    } else {
      lines.push(['-', 0, 0, 0, 0].map(escapeCsv).join(','));
    }

    lines.push('');
    lines.push(['Detail Pendaftar', 'No. Registrasi', 'Tahun Ajaran', 'Nama Siswa', 'Orang Tua', 'WhatsApp', 'Status', 'Tanggal Daftar'].map(escapeCsv).join(','));

    if (filtered.length > 0) {
      filtered.forEach((applicant) => {
        lines.push([
          'Detail',
          applicant.id,
          applicant.tahunAjaran || configTahunAjaran,
          applicant.studentName,
          applicant.parentName,
          applicant.whatsappNumber,
          STATUS_CONFIG[applicant.status].label,
          formatFullDate(applicant.submittedAt),
        ].map(escapeCsv).join(','));
      });
    } else {
      lines.push(['-', '-', '-', '-', '-', '-', '-', '-'].map(escapeCsv).join(','));
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-ppdb-${tahunAjaranFilter === 'all' ? 'semua-tahun-ajaran' : tahunAjaranFilter.replace(/\//g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="p-6 space-y-6" data-no-print>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <ClipboardList size={20} className="text-white" />
              </div>
              PPDB Online
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-[52px]">Kelola pendaftaran peserta didik baru</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>

        {/* Config Panel */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-50 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">Konfigurasi Sistem PPDB</h2>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/50 p-1 rounded-xl">
              
              <div className="flex-1 flex flex-col sm:flex-row gap-5">
                {/* Tahun Ajaran */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun Ajaran</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={configTahunAjaran}
                      readOnly
                      disabled={isConfigLoading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-gray-50 text-gray-700 font-medium outline-none cursor-not-allowed"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                
                {/* Status Pendaftaran */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status Pendaftaran</label>
                  <button
                    type="button"
                    disabled={isConfigLoading}
                    onClick={() => setConfigIsOpen(!configIsOpen)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border transition-all ${
                      configIsOpen ? 'border-teal-200 bg-teal-50/50 hover:bg-teal-100/50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${configIsOpen ? 'bg-teal-500' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${configIsOpen ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <span className={`text-sm font-bold ${configIsOpen ? 'text-teal-700' : 'text-gray-500'}`}>
                      {configIsOpen ? 'Sistem Dibuka' : 'Sistem Ditutup'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto md:border-l border-gray-200 md:pl-6 md:py-1">
                <button
                  onClick={saveConfig}
                  disabled={isConfigSaving || isConfigLoading}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isConfigSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Simpan Perubahan
                </button>
              </div>
              
            </div>
            
            <p className="mt-4 text-[11px] text-gray-500 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-400 inline-block"></span>
              Tahun ajaran terisi otomatis. Pastikan status sistem <strong>dibuka</strong> untuk mengizinkan pendaftar baru masuk.
            </p>
          </div>
        </div>

        {/* Report by Academic Year */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Laporan Berdasarkan Tahun Ajaran</h2>
              <p className="text-sm text-gray-500 mt-1">Rekap pendaftar PPDB per tahun ajaran yang tersimpan di sistem.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-gray-400" />
              <select
                value={tahunAjaranFilter}
                onChange={(e) => setTahunAjaranFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all cursor-pointer bg-white"
              >
                <option value="all">Semua Tahun Ajaran</option>
                {academicYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="relative" ref={exportMenuRef}>
                <button
                  type="button"
                  onClick={() => setExportMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors shadow-sm"
                >
                  <Download size={16} /> Export
                  <ChevronDown size={16} className={`transition-transform duration-200 ${exportMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden z-30">
                    <button
                      type="button"
                      onClick={() => {
                        setExportMenuOpen(false);
                        exportAcademicYearReport();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                      <Download size={15} /> Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExportMenuOpen(false);
                        handleExportPdf();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 transition-colors border-t border-gray-100"
                    >
                      <Printer size={15} /> Export PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: reportStats.total, icon: Users, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
              { label: 'Menunggu', value: reportStats.pending, icon: Clock, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
              { label: 'Diterima', value: reportStats.approved, icon: CheckCircle2, gradient: 'from-teal-500 to-teal-600', shadow: 'shadow-teal-500/20' },
              { label: 'Ditolak', value: reportStats.rejected, icon: XCircle, gradient: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/20' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} flex-shrink-0`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-[10px]">Tahun Ajaran</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-[10px]">Total</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-[10px]">Menunggu</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-[10px]">Diterima</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-[10px]">Ditolak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {reportByYear.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      Belum ada data laporan.
                    </td>
                  </tr>
                ) : (
                  reportByYear.map(([year, summary]) => (
                    <tr key={year} className={tahunAjaranFilter !== 'all' && tahunAjaranFilter === year ? 'bg-teal-50/60' : ''}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{year}</td>
                      <td className="px-4 py-3 text-gray-700">{summary.total}</td>
                      <td className="px-4 py-3 text-amber-700">{summary.pending}</td>
                      <td className="px-4 py-3 text-teal-700">{summary.approved}</td>
                      <td className="px-4 py-3 text-red-700">{summary.rejected}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama siswa, orang tua, atau no. registrasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all cursor-pointer bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="approved">Diterima</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ClipboardList size={28} className="text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-700 mb-1">
                {applicants.length === 0 ? 'Belum ada pendaftar' : 'Tidak ditemukan'}
              </h3>
              <p className="text-sm text-gray-400">
                {applicants.length === 0
                  ? 'Data pendaftar akan muncul di sini setelah ada yang mendaftar melalui form PPDB.'
                  : 'Coba ubah kata kunci pencarian atau filter status.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                    <th className="whitespace-nowrap text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">No. Registrasi</th>
                    <th className="whitespace-nowrap text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                    <th className="whitespace-nowrap text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">TTL</th>
                    <th className="whitespace-nowrap text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Gender</th>
                    <th className="whitespace-nowrap text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Orang Tua</th>
                    <th className="whitespace-nowrap text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">WhatsApp</th>
                    <th className="whitespace-nowrap text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="whitespace-nowrap text-center px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((applicant) => {
                    const statusConf = STATUS_CONFIG[applicant.status];
                    const StatusIcon = statusConf.icon;
                    return (
                      <tr key={applicant.id} className="hover:bg-teal-50/30 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="whitespace-nowrap text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md border border-teal-200/60">
                            {applicant.id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-gray-900">{applicant.studentName}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden xl:table-cell">
                          <p className="text-xs text-gray-600">{applicant.birthPlace}, {formatDate(applicant.birthDate)}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <p className="text-xs text-gray-600">{applicant.gender}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-sm text-gray-700">{applicant.parentName}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <p className="text-sm text-gray-600 font-mono">{applicant.whatsappNumber}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusConf.color} ${statusConf.bg} border ${statusConf.border}`}>
                            <StatusIcon size={11} /> {statusConf.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                            {/* View Detail */}
                            <button
                              onClick={() => { setSelectedApplicant(applicant); setShowDetail(true); }}
                              title="Lihat Detail"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors border border-blue-200/60"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Approve */}
                            {applicant.status !== 'approved' && (
                              <button
                                onClick={() => updateStatus(applicant.id, 'approved')}
                                title="Terima"
                                className="w-8 h-8 rounded-lg bg-teal-50 hover:bg-teal-100 flex items-center justify-center text-teal-600 transition-colors border border-teal-200/60"
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}

                            {/* Reject */}
                            {applicant.status !== 'rejected' && (
                              <button
                                onClick={() => updateStatus(applicant.id, 'rejected')}
                                title="Tolak"
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors border border-red-200/60"
                              >
                                <XCircle size={14} />
                              </button>
                            )}

                            {/* Contact WA */}
                            <button
                              onClick={() => contactWhatsApp(applicant)}
                              title="Hubungi via WhatsApp"
                              className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors border border-green-200/60"
                            >
                              <MessageCircle size={14} />
                            </button>

                            {/* Print - only for approved */}
                            {applicant.status === 'approved' && (
                              <button
                                onClick={() => handlePrint(applicant)}
                                title="Cetak Bukti"
                                className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors border border-indigo-200/60"
                              >
                                <Printer size={14} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => deleteApplicant(applicant.id)}
                              title="Hapus"
                              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors border border-gray-200/60"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-no-print>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Eye size={18} className="text-teal-600" /> Detail Pendaftar
              </h3>
              <button onClick={() => setShowDetail(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Registration Number */}
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-teal-50 to-teal-50 border border-teal-200">
                <p className="text-xs text-teal-600 font-semibold mb-1">Nomor Registrasi</p>
                <p className="text-2xl font-bold text-teal-800 font-mono">{selectedApplicant.id}</p>
                <p className="mt-1 text-[11px] text-teal-700 font-semibold">Tahun Ajaran: {selectedApplicant.tahunAjaran || configTahunAjaran}</p>
                <div className="mt-2">
                  {(() => {
                    const conf = STATUS_CONFIG[selectedApplicant.status];
                    const Icon = conf.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${conf.color} ${conf.bg} border ${conf.border}`}>
                        <Icon size={12} /> {conf.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Student Info */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-teal-50 border-b border-gray-200">
                  <h4 className="font-bold text-teal-800 text-xs flex items-center gap-2"><User size={14} /> Data Siswa</h4>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <DetailRow label="Nama Lengkap" value={selectedApplicant.studentName} />
                  <DetailRow label="Tempat Lahir" value={selectedApplicant.birthPlace} />
                  <DetailRow label="Tanggal Lahir" value={formatFullDate(selectedApplicant.birthDate)} />
                  <DetailRow label="Jenis Kelamin" value={selectedApplicant.gender} />
                  <DetailRow label="Alamat Lengkap" value={selectedApplicant.address || '-'} />
                </div>
              </div>

              {/* Parent Info */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-blue-50 border-b border-gray-200">
                  <h4 className="font-bold text-blue-800 text-xs flex items-center gap-2"><Users size={14} /> Data Orang Tua</h4>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <DetailRow label="Nama Orang Tua" value={selectedApplicant.parentName} />
                  <DetailRow label="No. WhatsApp" value={selectedApplicant.whatsappNumber} />
                </div>
              </div>

              {/* Documents */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-purple-50 border-b border-gray-200">
                  <h4 className="font-bold text-purple-800 text-xs flex items-center gap-2"><FileText size={14} /> Dokumen</h4>
                </div>
                <div className="p-4 space-y-3">
                  <DocPreview label="Kartu Keluarga (KK)" fileName={selectedApplicant.kkFileName} data={selectedApplicant.kkFileData} onView={(url, name) => setViewDoc({ url, name })} />
                  <DocPreview label="Akta Kelahiran" fileName={selectedApplicant.aktaFileName} data={selectedApplicant.aktaFileData} onView={(url, name) => setViewDoc({ url, name })} />
                  <DocPreview label="KTP Orang Tua/Wali" fileName={selectedApplicant.ktpFileName} data={selectedApplicant.ktpFileData} onView={(url, name) => setViewDoc({ url, name })} />
                  <DocPreview label="Ijazah Terakhir" fileName={selectedApplicant.ijazahFileName} data={selectedApplicant.ijazahFileData} onView={(url, name) => setViewDoc({ url, name })} />
                </div>
              </div>

              {/* Submitted Date */}
              <div className="text-center text-[10px] text-gray-400">
                Didaftarkan pada: {formatFullDate(selectedApplicant.submittedAt)} — {new Date(selectedApplicant.submittedAt).toLocaleTimeString('id-ID')}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {selectedApplicant.status !== 'approved' && (
                  <button
                    onClick={() => { updateStatus(selectedApplicant.id, 'approved'); setShowDetail(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                  >
                    <CheckCircle2 size={16} /> Terima
                  </button>
                )}
                {selectedApplicant.status !== 'rejected' && (
                  <button
                    onClick={() => { updateStatus(selectedApplicant.id, 'rejected'); setShowDetail(false); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
                  >
                    <XCircle size={16} /> Tolak
                  </button>
                )}
                <button
                  onClick={() => contactWhatsApp(selectedApplicant)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
                >
                  <MessageCircle size={16} /> WA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Receipt Area - hidden on screen, visible only during print */}
      {printingApplicant && (
        <div id="ppdb-print-area" ref={printRef} className="print-only">
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

            <h2 className="print-title">BUKTI PENERIMAAN PESERTA DIDIK BARU</h2>
            <p className="print-subtitle">Tahun Ajaran {printingApplicant.tahunAjaran || configTahunAjaran}</p>

            {/* Registration Number */}
            <div className="print-reg-box">
              <span className="print-reg-label">Nomor Registrasi</span>
              <span className="print-reg-number">{printingApplicant.id}</span>
            </div>

            {/* Applicant Details */}
            <table className="print-table">
              <tbody>
                <tr>
                  <td className="print-td-label">Nama Lengkap</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{printingApplicant.studentName}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Tahun Ajaran</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{printingApplicant.tahunAjaran || configTahunAjaran}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Tempat, Tanggal Lahir</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{printingApplicant.birthPlace}, {formatFullDate(printingApplicant.birthDate)}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Jenis Kelamin</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{printingApplicant.gender}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Alamat Lengkap</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{printingApplicant.address || '-'}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Nama Orang Tua/Wali</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{printingApplicant.parentName}</td>
                </tr>
            
                <tr>
                  <td className="print-td-label">No. WhatsApp</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{printingApplicant.whatsappNumber}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Tanggal Daftar</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value">{formatFullDate(printingApplicant.submittedAt)}</td>
                </tr>
                <tr>
                  <td className="print-td-label">Status</td>
                  <td className="print-td-sep">:</td>
                  <td className="print-td-value print-status-approved">DITERIMA ✓</td>
                </tr>
              </tbody>
            </table>

            {/* Stamp Watermark */}
            <div className="print-stamp">DITERIMA</div>

            {/* Footer */}
            <div className="print-footer">
              <div className="print-footer-left">
                <p>Dokumen ini dicetak secara digital.</p>
                <p>Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="print-footer-right">
                <p>Kepala Sekolah,</p>
                <img src="/images/ttd.jpg" alt="Tanda Tangan Kepala Sekolah" style={{ width: '160px', height: '95px', objectFit: 'contain', margin: '-5px auto -15px auto', mixBlendMode: 'multiply', filter: 'contrast(1.2)' }} />
                <p className="print-signee" style={{ marginTop: '5px', fontWeight: 'bold', textDecoration: 'underline' }}>Eneng Heti Nurhayati, S.Pd.I</p>
                <p className="print-signee-role">NIP. 197804302007102002</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {printingReport && (
        <div id="ppdb-report-print-area" className="print-only">
          <div className="print-report">
            <div className="print-report-header">
              <div>
                <h1>Laporan PPDB Berdasarkan Tahun Ajaran</h1>
                <p>MI Al-Hasani</p>
              </div>
              <div className="print-report-meta">
                <p>Filter: {tahunAjaranFilter === 'all' ? 'Semua Tahun Ajaran' : tahunAjaranFilter}</p>
                <p>Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="print-divider"></div>

            <h2 className="print-report-section-title">Ringkasan Tahun Ajaran</h2>
            <table className="print-report-table">
              <thead>
                <tr>
                  <th>Tahun Ajaran</th>
                  <th>Total</th>
                  <th>Menunggu</th>
                  <th>Diterima</th>
                  <th>Ditolak</th>
                </tr>
              </thead>
              <tbody>
                {reportByYear.length > 0 ? reportByYear.map(([year, summary]) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>{summary.total}</td>
                    <td>{summary.pending}</td>
                    <td>{summary.approved}</td>
                    <td>{summary.rejected}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5}>Belum ada data laporan.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <h2 className="print-report-section-title print-report-spaced">Detail Pendaftar</h2>
            <table className="print-report-table">
              <thead>
                <tr>
                  <th>No. Registrasi</th>
                  <th>Tahun Ajaran</th>
                  <th>Nama Siswa</th>
                  <th>Orang Tua</th>
                  <th>WhatsApp</th>
                  <th>Status</th>
                  <th>Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>{applicant.id}</td>
                    <td>{applicant.tahunAjaran || configTahunAjaran}</td>
                    <td>{applicant.studentName}</td>
                    <td>{applicant.parentName}</td>
                    <td>{applicant.whatsappNumber}</td>
                    <td>{STATUS_CONFIG[applicant.status].label}</td>
                    <td>{formatFullDate(applicant.submittedAt)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7}>Belum ada data pendaftar pada filter ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" data-no-print>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-teal-600" /> {viewDoc.name}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={viewDoc.url}
                  download={viewDoc.name}
                  className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <Download size={16} /> Unduh
                </a>
                <button 
                  onClick={() => setViewDoc(null)} 
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-4">
              {viewDoc.url.startsWith('data:image') || viewDoc.url.match(/\.(jpg|jpeg|png)$/i) ? (
                <img src={viewDoc.url.startsWith('/') ? API_BASE_URL.replace('/api', '') + viewDoc.url : viewDoc.url} alt={viewDoc.name} className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
              ) : viewDoc.url.startsWith('data:application/pdf') || viewDoc.url.match(/\.pdf$/i) ? (
                <iframe src={viewDoc.url.startsWith('/') ? API_BASE_URL.replace('/api', '') + viewDoc.url : viewDoc.url} title={viewDoc.name} className="w-full h-full rounded-lg shadow-sm border-0 bg-white" />
              ) : (
                <div className="text-center">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">Format dokumen tidak dapat ditampilkan secara langsung.</p>
                  <p className="text-sm text-gray-400 mt-2">Silakan unduh dokumen untuk melihatnya.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WA Prompt Modal */}
      {waPromptApplicant && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" data-no-print>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-teal-50/30">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Kirim Pesan Penolakan</h3>
                <p className="text-xs text-gray-500">ke {waPromptApplicant.whatsappNumber}</p>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Alasan Penolakan (Opsional)</label>
              <textarea
                value={waPromptReason}
                onChange={(e) => setWaPromptReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all text-sm outline-none resize-none"
                placeholder="Misal: Kuota kelas telah terisi penuh..."
              />
              <p className="text-xs text-gray-500 mt-2 flex items-start gap-1.5">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>Alasan ini akan otomatis disisipkan ke dalam draf pesan WhatsApp. Kosongkan jika Anda tidak ingin memberikan alasan spesifik.</span>
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center gap-3 justify-end border-t border-gray-100">
              <button
                onClick={() => setWaPromptApplicant(null)}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors text-sm"
              >
                Batal
              </button>
              <a
                href={`https://wa.me/${waPromptApplicant.whatsappNumber.replace(/[\s\-]/g, '').replace(/^08/, '628').replace(/^\+/, '')}?text=${encodeURIComponent(
                  `Assalamu'alaikum, Bapak/Ibu ${waPromptApplicant.parentName}.\n\n` +
                  `Terima kasih telah mendaftarkan *${waPromptApplicant.studentName}* di MI Al-Hasani.\n\n` +
                  `- No. Registrasi: *${waPromptApplicant.id}*\n` +
                  `- Status: *BELUM DITERIMA*${waPromptReason.trim() ? `\n- Alasan: ${waPromptReason.trim()}` : ''}\n\n` +
                  `Untuk informasi lebih lanjut, silakan menghubungi pihak sekolah.\n` +
                  `Jazakumullahu khairan.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWaPromptApplicant(null)}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all text-sm flex items-center gap-2"
              >
                Lanjutkan ke WA <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-sm font-semibold transition-all animate-slide-up ${
          toast.type === 'success' ? 'bg-gradient-to-r from-teal-600 to-teal-600' : 'bg-gradient-to-r from-red-600 to-rose-600'
        }`} data-no-print>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }

        .print-only {
          display: none;
        }

        .print-report {
          padding: 24px;
          font-family: Arial, sans-serif;
          color: #111827;
        }

        .print-report-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .print-report-header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
        }

        .print-report-header p,
        .print-report-meta p {
          margin: 4px 0 0;
          font-size: 12px;
        }

        .print-report-meta {
          text-align: right;
        }

        .print-report-section-title {
          margin: 16px 0 8px;
          font-size: 14px;
          font-weight: 700;
        }

        .print-report-spaced {
          margin-top: 22px;
        }

        .print-report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }

        .print-report-table th,
        .print-report-table td {
          border: 1px solid #d1d5db;
          padding: 6px 8px;
          vertical-align: top;
          text-align: left;
        }

        .print-report-table th {
          background: #f3f4f6;
          font-weight: 700;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          body * {
            visibility: hidden;
          }

          .print-only,
          .print-only * {
            visibility: visible;
          }

          .print-only {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          .print-report {
            padding: 0;
          }

          .print-receipt {
            padding: 0;
          }
        }
      `}</style>
    </>
  );
};

// Helper components
const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);

const DocPreview: React.FC<{ label: string; fileName: string; data: string; onView: (url: string, name: string) => void }> = ({ label, fileName, data, onView }) => {
  if (!data) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200/80 opacity-60">
        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
          <FileText size={20} className="text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800">{label}</p>
          <p className="text-[10px] text-gray-500 truncate">Belum diunggah</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
      {data.startsWith('data:image') ? (
        <img src={data} alt={label} className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shadow-sm">
          <FileText size={20} className="text-red-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800">{label}</p>
        <p className="text-[10px] text-gray-500 truncate mt-0.5">{fileName}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(data, fileName)}
          title="Lihat Dokumen"
          className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center hover:bg-teal-100 transition-colors"
        >
          <Eye size={14} className="text-teal-600" />
        </button>
        <a
          href={data}
          download={fileName}
          title="Unduh Dokumen"
          className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
        >
          <Download size={14} className="text-blue-600" />
        </a>
      </div>
    </div>
  );
};

const formatFullDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};
