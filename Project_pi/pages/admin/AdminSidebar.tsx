import React, { useState } from 'react';
import { Page } from '../../types';
import {
  LayoutDashboard, Users, FileText, Image,
  LogOut, GraduationCap, Settings, BookOpen, Award,
  ChevronLeft, ChevronRight, School, UserCheck, ClipboardList
} from 'lucide-react';

interface AdminSidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onLogout?: () => void;
}

const menuGroups = [
  {
    group: 'Utama',
    items: [
      { label: 'Dashboard', value: Page.ADMIN_DASHBOARD, icon: LayoutDashboard },
    ],
  },
  {
    group: 'Konten',
    items: [
      { label: 'Berita & Artikel', value: Page.ADMIN_NEWS, icon: FileText },
      { label: 'Galeri Foto', value: Page.ADMIN_GALLERY, icon: Image },
    ],
  },
  {
    group: 'Data Sekolah',
    items: [
      { label: 'Profil Pimpinan', value: Page.ADMIN_PRINCIPAL, icon: UserCheck },
      { label: 'Program Sekolah', value: Page.ADMIN_PROGRAMS, icon: Award },
      { label: 'Data Guru', value: Page.ADMIN_TEACHERS, icon: Users },
      { label: 'PPDB Online', value: Page.ADMIN_PPDB, icon: ClipboardList },
    ],
  },
  {
    group: 'Sistem',
    items: [
      { label: 'Pengaturan', value: Page.ADMIN_SETTINGS, icon: Settings },
    ],
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPage, setPage, collapsed, setCollapsed, onLogout }) => {
  return (
    <aside
      className={`${collapsed ? '-translate-x-full md:translate-x-0 md:w-[72px]' : 'translate-x-0 w-64'} bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 text-white min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-teal-800/60 ${collapsed ? 'justify-center px-2' : 'px-5'} transition-all duration-300`}>
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden whitespace-nowrap">
            <p className="font-bold text-sm text-white leading-tight">MI Al-Hasani</p>
            <p className="text-[10px] text-teal-400 font-medium tracking-wide">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Profile Badge */}
      {!collapsed && (
        <div className="mx-3 my-3 p-3 rounded-xl bg-teal-800/40 border border-teal-700/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0 text-teal-950 font-bold text-sm shadow">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white leading-tight truncate">Admin Sekolah</p>
            <span className="text-[10px] font-medium text-teal-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
              Online
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
        {menuGroups.map((group) => (
          <div key={group.group} className="mb-1">
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-500 px-3 pt-3 pb-1">
                {group.group}
              </p>
            )}
            {collapsed && <div className="border-t border-teal-800/40 my-2 mx-2" />}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.value;
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setPage(item.value)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 group
                        ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                        ${isActive
                          ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-900/40'
                          : 'text-teal-300 hover:bg-teal-800/50 hover:text-white'
                        }`}
                    >
                      <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-teal-400 group-hover:text-white'} transition-colors`} />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                      {isActive && !collapsed && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className={`p-3 border-t border-teal-800/60 space-y-2`}>
        <button
          onClick={() => onLogout ? onLogout() : setPage(Page.HOME)}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-teal-600 hover:bg-teal-500 border-2 border-teal-950 flex items-center justify-center shadow-lg transition-colors z-30"
      >
        {collapsed ? <ChevronRight size={12} className="text-white" /> : <ChevronLeft size={12} className="text-white" />}
      </button>
    </aside>
  );
};