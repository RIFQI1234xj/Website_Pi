import React, { useState } from 'react';
import { NEWS_DATA } from '../../constants';
import { Edit, Trash2, Plus, Search, Filter, Eye, ChevronDown } from 'lucide-react';

const categoryColor: Record<string, string> = {
  Prestasi: 'bg-amber-100 text-amber-700 border border-amber-200',
  Kegiatan: 'bg-blue-100 text-blue-700 border border-blue-200',
  Pengumuman: 'bg-red-100 text-red-700 border border-red-200',
};

export const AdminNews: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = NEWS_DATA.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">Total: {NEWS_DATA.length} artikel tersimpan</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-600 shadow-sm hover:shadow-md transition-all text-sm font-semibold">
          <Plus size={16} />
          Tambah Berita
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari judul atau kategori berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
          <Filter size={15} />
          Filter
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Berita</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Preview">
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Edit">
                        <Edit size={15} />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Hapus">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Menampilkan {filtered.length} dari {NEWS_DATA.length} data</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition">Sebelumnya</button>
            <button className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">1</button>
            <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};