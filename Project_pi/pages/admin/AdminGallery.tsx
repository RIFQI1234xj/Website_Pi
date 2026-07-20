import React, { useMemo, useRef, useState } from 'react';
import { useGallery, GalleryItem } from '../../hooks/useGallery';
import { getImageUrl, setImageFallback } from '../../lib/api';
import { Plus, Trash2, Edit, Search, LayoutGrid, List, Loader2, X, AlertTriangle, UploadCloud, ImageIcon, Images, XCircle } from 'lucide-react';

const catColor: Record<string,string> = { Acara:'bg-blue-50 text-blue-700 border-blue-200', Kegiatan:'bg-teal-50 text-teal-700 border-teal-200', Prestasi:'bg-amber-50 text-amber-700 border-amber-200', Ekskul:'bg-purple-50 text-purple-700 border-purple-200', Religi:'bg-teal-50 text-teal-700 border-teal-200' };
const emptyForm = { title:'', category:'Kegiatan', description:'' };
type ExistingPhoto = { name: string; src: string };

export const AdminGallery: React.FC = () => {
  const { galleries, loading, createGallery, updateGallery, deleteGallery } = useGallery();
  const [view, setView] = useState<'grid'|'list'>('grid');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number|null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = galleries.filter(g => g.title.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase()));
  const previewPhotos = useMemo(
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
    if (fileRef.current) fileRef.current.value = '';
  };

  const clearSelectedNewPhotos = () => {
    photoPreviews.forEach((preview) => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    });
    setPhotoFiles([]);
    setPhotoPreviews([]);
    if (fileRef.current) fileRef.current.value = '';
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
    if (fileRef.current) fileRef.current.value = '';
  };

  const pickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const invalidFile = files.find((file) => !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type));
    if (invalidFile) {
      alert('Semua file harus berformat JPG/PNG.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const openCreate = () => { setEditingId(null); setForm(emptyForm); resetPhotos(); setShowModal(true); };
  const openEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setForm({title:item.title,category:item.category,description:item.description||''});
    resetPhotos();
    const albumPhotos = item.photos && item.photos.length > 0
      ? item.photos.map((photo) => ({ name: photo, src: getImageUrl(photo) }))
      : item.image
        ? [{ name: item.image, src: getImageUrl(item.image) }]
        : [];
    setExistingPhotos(albumPhotos);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); resetPhotos(); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title',form.title); fd.append('category',form.category); fd.append('description',form.description);
      photoFiles.forEach((file) => fd.append('photos[]', file));
      if(editingId) {
        if (existingPhotos.length + photoFiles.length === 0) {
          alert('Album harus memiliki minimal 1 foto.');
          setSubmitting(false);
          return;
        }
        fd.append('sync_existing_photos', '1');
        existingPhotos.forEach((photo) => fd.append('retained_photos[]', photo.name));
        await updateGallery(editingId,fd);
      }
      else { if(photoFiles.length===0){alert('Pilih minimal 1 foto.');setSubmitting(false);return;} await createGallery(fd); }
      closeModal();
    } catch(e){alert('Gagal: '+(e as any).message);} finally{setSubmitting(false);}
  };
  const handleDelete = async (id:number) => { try{await deleteGallery(id);setDeleteConfirm(null);}catch(e){alert('Gagal: '+(e as any).message);} };
  const getPhotoCount = (item: GalleryItem) => item.photos?.length || (item.image ? 1 : 0);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Manajemen Galeri</h1><p className="text-slate-500 text-sm mt-1.5">Kelola album foto acara, prestasi, dan kegiatan sekolah.</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm shadow-sm active:scale-95"><Plus className="w-4 h-4"/>Upload Album Baru</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md"><Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/><input type="text" placeholder="Cari judul atau kategori..." value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"/></div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button onClick={()=>setView('grid')} className={`p-2 rounded-lg ${view==='grid'?'bg-white shadow-sm text-teal-600':'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-4 h-4"/></button>
          <button onClick={()=>setView('list')} className={`p-2 rounded-lg ${view==='list'?'bg-white shadow-sm text-teal-600':'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4"/></button>
        </div>
      </div>

      {loading?(<div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-500"/><span className="ml-3 text-slate-500">Memuat...</span></div>):(
        <>
          {view==='grid'&&(<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(item=>(
              <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="relative overflow-hidden aspect-[4/3]"><img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e)=>{setImageFallback(e.currentTarget, item.title)}}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={()=>openEdit(item)} className="p-2.5 rounded-full bg-white/10 hover:bg-teal-500 text-white backdrop-blur-sm transition-colors transform translate-y-4 group-hover:translate-y-0"><Edit className="w-4 h-4"/></button>
                    <button onClick={()=>setDeleteConfirm(item.id)} className="p-2.5 rounded-full bg-white/10 hover:bg-rose-500 text-white backdrop-blur-sm transition-colors transform translate-y-4 group-hover:translate-y-0 delay-75"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-slate-100"><span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 border ${catColor[item.category]??'bg-slate-50 text-slate-500 border-slate-200'}`}>{item.category}</span><p className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</p><p className="mt-2 text-xs text-slate-400 flex items-center gap-1"><Images className="w-3.5 h-3.5"/>{getPhotoCount(item)} foto</p></div>
              </div>
            ))}{filtered.length===0&&<div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">Tidak ditemukan.</div>}
          </div>)}

          {view==='list'&&(<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-600 whitespace-nowrap"><thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider"><tr><th className="px-6 py-4">Foto & Judul</th><th className="px-6 py-4">Kategori</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(item=>(
            <tr key={item.id} className="hover:bg-teal-50/30 group"><td className="px-6 py-4"><div className="flex items-center gap-4"><img src={getImageUrl(item.image)} alt={item.title} className="w-16 h-12 object-cover rounded-lg shadow-sm border border-slate-100" onError={(e)=>{setImageFallback(e.currentTarget, item.title)}}/><p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700">{item.title}</p></div></td>
            <td className="px-6 py-4"><div className="flex items-center gap-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${catColor[item.category]??'bg-slate-50 text-slate-600 border-slate-200'}`}>{item.category}</span><span className="text-xs text-slate-400 flex items-center gap-1"><Images className="w-3.5 h-3.5"/>{getPhotoCount(item)} foto</span></div></td>
            <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"><button onClick={()=>openEdit(item)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Edit className="w-4 h-4"/></button><button onClick={()=>setDeleteConfirm(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button></div></td></tr>
          ))}{filtered.length===0&&<tr><td colSpan={3} className="p-8 text-center text-slate-500">Tidak ditemukan.</td></tr>}</tbody></table></div>
          </div>)}

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-800">{Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}</span> - <span className="font-semibold text-slate-800">{Math.min(filtered.length, currentPage * itemsPerPage)}</span> dari <span className="font-semibold text-slate-800">{filtered.length}</span> Album
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
        </>
      )}

      {showModal&&(<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"><div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><h3 className="text-lg font-bold text-slate-800">{editingId?'Edit Album':'Upload Album Baru'}</h3><button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5"/></button></div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Album</label><input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" placeholder="Judul album..."/></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"><option>Kegiatan</option><option>Acara</option><option>Prestasi</option><option>Ekskul</option><option>Religi</option></select></div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Album</label>
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" multiple className="hidden" onChange={pickFiles}/>
            {previewPhotos.length>0?(
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
                      {preview.isNew&&photoFiles[index - existingPhotos.length]&&<div className="absolute bottom-2 left-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 truncate"><ImageIcon className="w-3 h-3 shrink-0"/><span className="truncate">{photoFiles[index - existingPhotos.length].name}</span></div>}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 gap-4">
                  <p className="text-xs text-slate-500">{editingId ? (photoFiles.length > 0 ? `${photoFiles.length} foto baru akan ditambahkan. Anda juga bisa menghapus foto tertentu dari album sebelum menyimpan.` : `${existingPhotos.length} foto tersimpan. Pilih file lagi untuk menambahkan, atau klik ikon silang pada foto untuk menghapusnya dari album.`) : `${photoFiles.length || previewPhotos.length} foto dipilih. Foto pertama akan menjadi cover.`}</p>
                  {photoFiles.length > 0 && <button onClick={clearSelectedNewPhotos} className="p-2 bg-white text-rose-500 rounded-lg border border-slate-200 hover:bg-rose-50 shrink-0"><XCircle className="w-5 h-5"/></button>}
                </div>
                <div className="flex justify-start">
                  <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100">
                    <Plus className="w-4 h-4"/>
                    Tambah Foto
                  </button>
                </div>
              </div>
            ):(
              <label onClick={() => fileRef.current?.click()} className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all group"><UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-teal-500 mb-2"/><span className="text-sm font-medium text-slate-500 group-hover:text-teal-600">{editingId ? 'Klik untuk tambah foto baru' : 'Klik untuk pilih banyak foto'}</span><span className="text-[10px] text-slate-400 mt-1">JPG, JPEG, PNG • Maks 2MB per file</span></label>
            )}
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label><textarea rows={5} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-y min-h-[120px]" placeholder="Deskripsi singkat..."/></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50"><button onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-600">Batal</button><button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">{submitting&&<Loader2 className="w-4 h-4 animate-spin"/>}{editingId?'Simpan Album':'Upload Album'}</button></div>
      </div></div>)}

      {deleteConfirm!==null&&(<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"><div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center"><div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-7 h-7 text-rose-500"/></div><h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Album?</h3><p className="text-sm text-slate-500 mb-6">Semua foto dalam album ini akan ikut terhapus.</p><div className="flex items-center justify-center gap-3"><button onClick={()=>setDeleteConfirm(null)} className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button><button onClick={()=>handleDelete(deleteConfirm)} className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm">Hapus</button></div></div></div>)}
    </div>
  );
};
