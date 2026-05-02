import React, { useState } from 'react';
import { GALLERY_DATA } from '../../constants';
import { Plus, Trash2, Edit, Search, LayoutGrid, List } from 'lucide-react';

const categoryColor: Record<string, string> = {
  Acara: 'bg-blue-100 text-blue-700',
  Kegiatan: 'bg-emerald-100 text-emerald-700',
  Prestasi: 'bg-amber-100 text-amber-700',
  Ekskul: 'bg-purple-100 text-purple-700',
  Religi: 'bg-teal-100 text-teal-700',
};

export const AdminGallery: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const filtered = GALLERY_DATA.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-gray-400">{GALLERY_DATA.length} foto tersimpan dalam galeri</p>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-600 shadow-sm hover:shadow-md transition-all text-sm font-semibold">
          <Plus size={16} />
          Upload Foto
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul atau kategori foto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 gap-2">
                  <button className="p-1.5 rounded-lg bg-white/90 text-emerald-700 hover:bg-white shadow transition"><Edit size={14} /></button>
                  <button className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white shadow transition"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                <span className={`mt-1 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${categoryColor[item.category] ?? 'bg-gray-100 text-gray-500'}`}>
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Foto</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.title} className="w-14 h-10 object-cover rounded-lg shadow-sm" />
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor[item.category] ?? 'bg-gray-100 text-gray-500'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><Edit size={15} /></button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
