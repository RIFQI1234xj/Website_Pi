import React from 'react';
import { Page } from '../../types';
import {
  Bell, Search, Menu, ChevronRight, Home
} from 'lucide-react';

const pageTitles: Partial<Record<Page, { title: string; breadcrumb: string[] }>> = {
  [Page.ADMIN_DASHBOARD]: { title: 'Dashboard', breadcrumb: ['Admin', 'Dashboard'] },
  [Page.ADMIN_NEWS]: { title: 'Manajemen Berita', breadcrumb: ['Admin', 'Konten', 'Berita'] },
  [Page.ADMIN_GALLERY]: { title: 'Manajemen Galeri', breadcrumb: ['Admin', 'Konten', 'Galeri'] },
  [Page.ADMIN_TEACHERS]: { title: 'Data Guru', breadcrumb: ['Admin', 'Data Sekolah', 'Guru'] },
  [Page.ADMIN_SETTINGS]: { title: 'Pengaturan', breadcrumb: ['Admin', 'Sistem', 'Pengaturan'] },
};

interface AdminTopNavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  collapsed: boolean;
}

export const AdminTopNavbar: React.FC<AdminTopNavbarProps> = ({ currentPage, setPage, collapsed }) => {
  const meta = pageTitles[currentPage] ?? { title: 'Admin', breadcrumb: ['Admin'] };
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
              <span className={i === meta.breadcrumb.length - 1 ? 'text-emerald-600 font-semibold' : ''}>{crumb}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-lg font-bold text-gray-800 leading-tight">{meta.title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Date */}
        <span className="hidden lg:block text-xs text-gray-400 border-r border-gray-200 pr-3">{dateStr}</span>

        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-8 pr-4 py-1.5 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:border-emerald-400 focus:bg-white transition-all w-44"
          />
        </div>

        {/* Notif */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-emerald-950 font-bold text-sm shadow">
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
