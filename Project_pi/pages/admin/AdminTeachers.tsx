import React, { useState } from 'react';
import { TEACHERS } from '../../constants';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export const AdminTeachers: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = TEACHERS.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-gray-400">{TEACHERS.length} tenaga pendidik terdaftar</p>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-600 shadow-sm transition-all text-sm font-semibold">
          <Plus size={16} /> Tambah Guru
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari nama atau jabatan..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <img src={teacher.image} alt={teacher.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
              </div>
            </div>
            <div className="pt-9 pb-4 px-4 text-center">
              <h4 className="text-sm font-bold text-gray-800 leading-tight mb-0.5">{teacher.name}</h4>
              <p className="text-xs text-emerald-600 font-semibold">{teacher.role}</p>
              {teacher.subject && (
                <span className="mt-2 inline-block text-[10px] font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{teacher.subject}</span>
              )}
            </div>
            <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2">
              <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                <Edit size={12} /> Edit
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                <Trash2 size={12} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
