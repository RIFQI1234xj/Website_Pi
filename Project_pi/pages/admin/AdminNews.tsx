import React, { useState, useRef } from 'react';
import { useNews, NewsItem } from '../../hooks/useNews';
import { getImageUrl, setImageFallback } from '../../lib/api';
import { Edit, Trash2, Plus, Search, Loader2, X, AlertTriangle, UploadCloud, ImageIcon, XCircle, LayoutGrid, List } from 'lucide-react';

const categoryColor: Record<string, string> = {
  Prestasi: 'bg-amber-50 text-amber-700 border-amber-200',
  Kegiatan: 'bg-blue-50 text-blue-700 border-blue-200',
  Pengumuman: 'bg-rose-50 text-rose-700 border-rose-200',
  'Artikel Islami': 'bg-purple-50 text-purple-700 border-purple-200',
};

const emptyForm = { title: '', category: 'Kegiatan', excerpt: '', content: '', author: 'Admin', date: '' };

const bulanID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const formatKeTanggalID = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('-')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const d = parseInt(parts[2], 10);
    const m = parseInt(parts[1], 10);
    const y = parts[0];
    if (m >= 1 && m <= 12) return `${d} ${bulanID[m - 1]} ${y}`;
  }
  return dateStr;
};

const parseDariTanggalID = (dateStr: string) => {
  if (!dateStr || !dateStr.includes(' ')) return dateStr;
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const d = parts[0].padStart(2, '0');
    const mIndex = bulanID.findIndex(b => b.toLowerCase() === parts[1].toLowerCase());
    const y = parts[2];
    if (mIndex !== -1) {
      const m = String(mIndex + 1).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }
  return dateStr;
};

interface ExistingPhoto {
  name: string;
  src: string;
}

export const AdminNews: React.FC = () => {
  const { news, loading, createNews, updateNews, deleteNews } = useNews();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [view, setView] = useState<'grid'|'list'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  const previewPhotos = React.useMemo(
    () => [
      ...existingPhotos.map((photo) => ({ ...photo, isNew: false })),
      ...photoPreviews.map((src, index) => ({ src, name: photoFiles[index]?.name || src, isNew: true })),
    ],
    [existingPhotos, photoFiles, photoPreviews]
  );

  const resetPhotos = () => {
    photoPreviews.forEach((preview) => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    });
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setExistingPhotos([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearSelectedNewPhotos = () => {
    photoPreviews.forEach((preview) => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    });
    setPhotoFiles([]);
    setPhotoPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeExistingPhoto = (name: string) => {
    setExistingPhotos((prev) => prev.filter((photo) => photo.name !== name));
  };

  const removeNewPhoto = (indexToRemove: number) => {
    setPhotoPreviews((prev) => {
      const next = [...prev];
      const [removedPreview] = next.splice(indexToRemove, 1);
      if (removedPreview?.startsWith('blob:')) URL.revokeObjectURL(removedPreview);
      return next;
    });
    setPhotoFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const pickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const invalidFile = files.find((file) => !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type));
    if (invalidFile) {
      alert('Semua file harus berformat JPG/PNG.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    resetPhotos();
    setShowModal(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id);
    
    // Parse format Indonesia (DD Bulan YYYY) atau DD-MM-YYYY kembali ke YYYY-MM-DD
    let parsedDate = item.date;
    if (parsedDate) {
      if (parsedDate.includes(' ')) {
        parsedDate = parseDariTanggalID(parsedDate);
      } else if (parsedDate.includes('-')) {
        const parts = parsedDate.split('-');
        if (parts.length === 3 && parts[2].length === 4) {
          parsedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      } else if (parsedDate.includes('/')) {
        const parts = parsedDate.split('/');
        if (parts.length === 3 && parts[2].length === 4) {
          parsedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
    }
    
    setForm({ title: item.title, category: item.category, excerpt: item.excerpt, content: item.content || '', author: item.author, date: parsedDate });
    resetPhotos();
    const albumPhotos = item.photos && item.photos.length > 0
      ? item.photos.map((photo) => ({ name: photo, src: getImageUrl(photo) }))
      : item.image
        ? [{ name: item.image, src: getImageUrl(item.image) }]
        : [];
    setExistingPhotos(albumPhotos);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('category', form.category);
      
      // Auto-generate excerpt dari konten (120 karakter pertama)
      const generatedExcerpt = form.content.substring(0, 120).trim() + (form.content.length > 120 ? '...' : '');
      fd.append('excerpt', generatedExcerpt);
      
      fd.append('content', form.content);
      fd.append('author', form.author);
      
      // Ubah format YYYY-MM-DD menjadi standar Indonesia (contoh: 12 Oktober 2024)
      const dateToSave = formatKeTanggalID(form.date);
      fd.append('date', dateToSave);
      
      photoFiles.forEach((file) => fd.append('photos[]', file));

      if (editingId) {
        if (existingPhotos.length + photoFiles.length === 0) {
          alert('Berita harus memiliki minimal 1 foto.');
          setSubmitting(false);
          return;
        }
        fd.append('sync_existing_photos', '1');
        existingPhotos.forEach((photo) => fd.append('retained_photos[]', photo.name));
        await updateNews(editingId, fd);
      } else {
        if (photoFiles.length === 0) { alert('Pilih foto untuk berita.'); setSubmitting(false); return; }
        await createNews(fd);
      }
      setShowModal(false);
      setForm(emptyForm);
      resetPhotos();
    } catch (err) {
      alert('Gagal menyimpan: ' + (err as any).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try { await deleteNews(id); setDeleteConfirm(null); } catch (err) { alert('Gagal menghapus: ' + (err as any).message); }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Manajemen Berita</h1>
          <p className="text-slate-500 text-sm mt-1.5">Kelola publikasi, pengumuman, dan berita prestasi sekolah.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium text-sm shadow-sm shadow-teal-600/20 active:scale-95">
          <Plus className="w-4 h-4" /> Tambah Berita Baru
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari judul atau kategori berita..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all" />
          </div>
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 self-end sm:self-auto">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /><span className="ml-3 text-slate-500">Memuat data berita...</span></div>
        ) : view === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr><th className="px-6 py-4">Informasi Berita</th><th className="px-6 py-4">Kategori</th><th className="px-6 py-4">Tanggal Rilis</th><th className="px-6 py-4 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400 text-sm">Tidak ada berita ditemukan.</td></tr>
                ) : filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                  <tr key={item.id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={getImageUrl(item.image)} alt={item.title} className="w-16 h-12 rounded-lg object-cover shadow-sm border border-slate-100 flex-shrink-0"
                          onError={(e) => { setImageFallback(e.currentTarget, item.title); }} />
                        <div className="max-w-xs sm:max-w-md">
                          <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-teal-700 transition-colors whitespace-normal">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1 whitespace-normal">{item.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${categoryColor[item.category] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>{item.category}</span>
                    </td>
                    <td className="px-6 py-4"><div className="text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-md inline-block border border-slate-100">{item.date}</div></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 transition-opacity">
                        <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 text-sm">Tidak ada berita ditemukan.</div>
            ) : filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => setImageFallback(e.currentTarget, item.title)} />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                    {item.date}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${categoryColor[item.category] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>{item.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{item.excerpt}</p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-medium text-slate-400">{item.author}</span>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-800">{Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}</span> - <span className="font-semibold text-slate-800">{Math.min(filtered.length, currentPage * itemsPerPage)}</span> dari <span className="font-semibold text-slate-800">{filtered.length}</span> Berita
          </div>
          {filtered.length > itemsPerPage && (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.ceil(filtered.length / itemsPerPage) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${currentPage === idx + 1 ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filtered.length / itemsPerPage), prev + 1))} 
                disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" placeholder="Masukkan judul berita..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white">
                    <option>Kegiatan</option><option>Pengumuman</option><option>Prestasi</option><option>Artikel Islami</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal</label>
                  <div className="relative w-full">
                    {/* Tampilan Visual Kustom (Standar Indonesia) */}
                    <div className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white flex items-center justify-between text-slate-700">
                      <span>{form.date ? formatKeTanggalID(form.date) : 'Hari / Bulan / Tahun'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                      </svg>
                    </div>
                    {/* Input Kalender Asli */}
                    <input 
                      type="date" 
                      value={form.date} 
                      onChange={(e) => setForm({ ...form, date: e.target.value })} 
                      onClick={(e) => {
                        try {
                          if ('showPicker' in HTMLInputElement.prototype) {
                            (e.target as HTMLInputElement).showPicker();
                          }
                        } catch (err) {}
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Berita</label>
                <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" multiple className="hidden" onChange={pickFiles}/>
                {previewPhotos.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {previewPhotos.map((preview, index) => (
                        <div key={`${preview.src}-${index}`} className="relative group rounded-xl overflow-hidden border border-slate-200">
                          <img src={preview.src} alt={`Preview ${index + 1}`} className="w-full h-32 object-contain bg-slate-50"/>
                          <div className="absolute top-2 left-2 bg-teal-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">{index === 0 ? 'Cover' : `Foto ${index + 1}`}</div>
                          <div className={`absolute top-2 right-12 text-white text-[10px] font-bold px-2 py-1 rounded-full ${preview.isNew ? 'bg-amber-500' : 'bg-slate-700/80'}`}>{preview.isNew ? 'Baru' : 'Tersimpan'}</div>
                          <button onClick={() => preview.isNew ? removeNewPhoto(index - existingPhotos.length) : removeExistingPhoto(preview.name)} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full shadow hover:bg-rose-600">
                            <X className="w-3.5 h-3.5"/>
                          </button>
                          {preview.isNew && photoFiles[index - existingPhotos.length] && (
                            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 truncate">
                              <ImageIcon className="w-3 h-3 shrink-0"/><span className="truncate">{photoFiles[index - existingPhotos.length].name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 gap-4">
                      <p className="text-xs text-slate-500">{editingId ? (photoFiles.length > 0 ? `${photoFiles.length} foto baru akan ditambahkan. Anda juga bisa menghapus foto tertentu.` : `${existingPhotos.length} foto tersimpan. Pilih file lagi untuk menambahkan, atau klik ikon silang pada foto untuk menghapusnya.`) : `${photoFiles.length || previewPhotos.length} foto dipilih. Foto pertama akan menjadi cover.`}</p>
                      {photoFiles.length > 0 && <button onClick={clearSelectedNewPhotos} className="p-2 bg-white text-rose-500 rounded-lg border border-slate-200 hover:bg-rose-50 shrink-0"><XCircle className="w-5 h-5"/></button>}
                    </div>
                    <div className="flex justify-start">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100">
                        <Plus className="w-4 h-4"/> Tambah Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <label onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all group">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-teal-500 mb-2"/>
                    <span className="text-sm font-medium text-slate-500 group-hover:text-teal-600">{editingId ? 'Klik untuk tambah foto baru' : 'Klik untuk pilih banyak foto'}</span>
                    <span className="text-[10px] text-slate-400 mt-1">JPG, JPEG, PNG • Maks 2MB per file</span>
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konten Berita</label>
                <textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-y min-h-[150px]" placeholder="Isi lengkap berita..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />} {editingId ? 'Simpan Perubahan' : 'Tambah Berita'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-7 h-7 text-rose-500" /></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Berita?</h3>
            <p className="text-sm text-slate-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
