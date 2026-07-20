import React, { useState, useEffect, useRef } from 'react';
import { Page, PPDBApplicant } from '../../types';
import {
  Bell, Search, ChevronRight, Home, FileText, CheckCircle
} from 'lucide-react';
import { apiFetch } from '../../lib/api';

const pageTitles: Partial<Record<Page, { title: string; breadcrumb: string[] }>> = {
  [Page.ADMIN_DASHBOARD]: { title: 'Dashboard', breadcrumb: ['Admin', 'Dashboard'] },
  [Page.ADMIN_NEWS]: { title: 'Manajemen Berita & Artikel', breadcrumb: ['Admin', 'Konten', 'Berita & Artikel'] },
  [Page.ADMIN_GALLERY]: { title: 'Manajemen Galeri', breadcrumb: ['Admin', 'Konten', 'Galeri'] },
  [Page.ADMIN_TEACHERS]: { title: 'Data Guru', breadcrumb: ['Admin', 'Data Sekolah', 'Guru'] },
  [Page.ADMIN_PROGRAMS]: { title: 'Program Sekolah', breadcrumb: ['Admin', 'Data Sekolah', 'Program'] },
  [Page.ADMIN_PRINCIPAL]: { title: 'Profil Pimpinan', breadcrumb: ['Admin', 'Data Sekolah', 'Profil Pimpinan'] },
  [Page.ADMIN_SETTINGS]: { title: 'Pengaturan', breadcrumb: ['Admin', 'Sistem', 'Pengaturan'] },
  [Page.ADMIN_PPDB]: { title: 'Manajemen PPDB', breadcrumb: ['Admin', 'Pendaftaran', 'PPDB'] },
};

interface AdminTopNavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  collapsed: boolean;
}

export const AdminTopNavbar: React.FC<AdminTopNavbarProps> = ({ currentPage, setPage }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [pendingApplicants, setPendingApplicants] = useState<PPDBApplicant[]>([]);

  const meta = pageTitles[currentPage] ?? { title: 'Admin', breadcrumb: ['Admin'] };
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const loadNotifications = async () => {
    try {
      const res = await apiFetch('/applicants');
      if (res.status === 'success') {
        const apps: PPDBApplicant[] = res.data;
        setPendingApplicants(apps.filter(a => a.status === 'pending'));
      }
    } catch(e) {}
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);



  return (
    <header
      className={`h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between sticky top-0 z-10 shadow-sm transition-all duration-300`}
    >
      {/* Left: Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
          <Home size={11} />
          {meta.breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && <ChevronRight size={10} />}
              <span className={i === meta.breadcrumb.length - 1 ? 'text-teal-600 font-semibold' : ''}>{crumb}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Date */}
        <span className="hidden lg:block text-xs text-gray-400 font-medium">{dateStr}</span>



        {/* Notif */}
        <div className="relative">
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className={`relative p-2 rounded-lg transition-colors ${showNotif ? 'bg-teal-50' : 'hover:bg-gray-100'}`}
          >
            <Bell size={18} className={showNotif || pendingApplicants.length > 0 ? 'text-teal-600' : 'text-gray-500'} />
            {pendingApplicants.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">Notifikasi PPDB</h3>
                {pendingApplicants.length > 0 && (
                  <span className="text-[10px] font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-sm">{pendingApplicants.length} Baru</span>
                )}
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {pendingApplicants.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {pendingApplicants.map(app => (
                      <div 
                        key={app.id} 
                        onClick={() => { setPage(Page.ADMIN_PPDB); setShowNotif(false); }}
                        className="p-4 hover:bg-teal-50/50 cursor-pointer transition-colors flex gap-3 items-start"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">Pendaftar Baru</p>
                          <p className="text-xs text-gray-600 mt-0.5">Siswa <span className="font-semibold">{app.studentName}</span> baru saja mendaftar PPDB.</p>
                          <p className="text-[10px] text-gray-400 mt-1 font-mono">{app.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Belum ada pendaftar baru</p>
                    <p className="text-xs text-gray-400 mt-1">Semua pendaftar telah diproses.</p>
                  </div>
                )}
              </div>
              
              {pendingApplicants.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                  <button 
                    onClick={() => { setPage(Page.ADMIN_PPDB); setShowNotif(false); }}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    Lihat Semua di Halaman PPDB
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 lg:pl-4 lg:border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-teal-950 font-bold text-sm shadow">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-gray-700 leading-tight">Admin Sekolah</p>
            <p className="text-[10px] text-gray-400">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
