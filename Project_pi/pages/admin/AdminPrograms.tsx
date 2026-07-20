import React, { useState, useRef } from 'react';
import { usePrograms, ProgramItem } from '../../hooks/usePrograms';
import { getFallbackImage, getImageUrl, setImageFallback } from '../../lib/api';
import { Plus, Search, Edit, Trash2, BookOpen, Clock, Calendar, CheckCircle2, XCircle as XCircleIcon, X, Loader2, AlertTriangle, UploadCloud, ImageIcon, XCircle } from 'lucide-react';

const emptyForm = { title:'', description:'', category:'Keagamaan', schedule:'', is_active:true };

export const AdminPrograms: React.FC = () => {
  const { programs, loading, createProgram, updateProgram, deleteProgram } = usePrograms();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number|null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [keptExistingImages, setKeptExistingImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number|null>(null);
  const [selectedImage, setSelectedImage] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = programs.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => ['image/jpeg','image/jpg','image/png'].includes(f.type));
    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
    } else if (files.length > 0) {
      alert('Format harus JPG/PNG.');
    }
    if (fileRef.current) fileRef.current.value = '';
  };
  const clearFile = () => { setImageFiles([]); setImagePreviews([]); setKeptExistingImages([]); if (fileRef.current) fileRef.current.value = ''; };

  const removeImage = (index: number) => {
    if (index < keptExistingImages.length) {
      setKeptExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - keptExistingImages.length;
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const openCreate = () => { setEditingId(null); setForm(emptyForm); clearFile(); setShowModal(true); };
  const openEdit = (p: ProgramItem) => {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description, category: p.category, schedule: p.schedule || '', is_active: p.is_active });
    const existing = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
    setKeptExistingImages(existing);
    setImageFiles([]);
    setImagePreviews(existing.map(img => getImageUrl(img)));
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title',form.title); fd.append('description',form.description); fd.append('category',form.category);
      fd.append('schedule',form.schedule); fd.append('is_active',form.is_active?'1':'0');
      imageFiles.forEach(f => fd.append('images[]', f));
      keptExistingImages.forEach(img => fd.append('existing_images[]', img));
      if(editingId) await updateProgram(editingId,fd);
      else await createProgram(fd);
      setShowModal(false); clearFile();
    } catch(e){alert('Gagal: '+(e as any).message);} finally{setSubmitting(false);}
  };
  const handleDelete = async (id:number) => { try{await deleteProgram(id);setDeleteConfirm(null);}catch(e){alert('Gagal: '+(e as any).message);} };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Program Sekolah</h1><p className="text-slate-500 text-sm mt-1.5">Kelola program unggulan, ekstrakurikuler, dan kegiatan akademik.</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm shadow-sm active:scale-95"><Plus className="w-4 h-4"/>Tambah Program</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100"><div className="relative w-full sm:max-w-md"><Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/><input type="text" placeholder="Cari program..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"/></div></div>

        {loading?(<div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-500"/><span className="ml-3 text-slate-500">Memuat...</span></div>):(
          <div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-600 whitespace-nowrap"><thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider"><tr><th className="px-6 py-4">Program</th><th className="px-6 py-4">Kategori</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{filtered.length===0?(<tr><td colSpan={4} className="text-center py-12 text-slate-400 text-sm">Tidak ditemukan.</td></tr>):filtered.map(p=>(
            <tr key={p.id} className="hover:bg-teal-50/30 group">
              <td className="px-6 py-4"><div className="flex items-center gap-4"><img src={p.image?getImageUrl(p.image):getFallbackImage(p.title)} alt={p.title} className="w-16 h-12 rounded-lg object-cover shadow-sm border border-slate-100 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage(p.image?getImageUrl(p.image):getFallbackImage(p.title))} onError={(e)=>{setImageFallback(e.currentTarget, p.title)}}/><div className="max-w-xs"><p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-teal-700 whitespace-normal">{p.title}</p><p className="text-xs text-slate-500 mt-1 line-clamp-1 whitespace-normal">{p.description}</p></div></div></td>
              <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-xs text-slate-500"><BookOpen className="w-3.5 h-3.5 text-slate-400"/>{p.category}</div></td>
              <td className="px-6 py-4">{p.is_active?<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200"><CheckCircle2 className="w-3.5 h-3.5"/>Aktif</span>:<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200"><XCircleIcon className="w-3.5 h-3.5"/>Nonaktif</span>}</td>
              <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-1"><button onClick={()=>openEdit(p)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Edit className="w-4 h-4"/></button><button onClick={()=>setDeleteConfirm(p.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button></div></td>
            </tr>
          ))}</tbody></table></div>
        )}
      </div>

      {showModal&&(<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"><div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><h3 className="text-lg font-bold text-slate-800">{editingId?'Edit Program':'Tambah Program'}</h3><button onClick={()=>setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5"/></button></div>
        <div className="p-6 overflow-y-auto space-y-5">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Program</label><input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Nama program..." className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"><option>Keagamaan</option><option>Akademik</option><option>Ekstrakurikuler</option><option>Umum</option></select></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={form.is_active?'Aktif':'Nonaktif'} onChange={e=>setForm({...form,is_active:e.target.value==='Aktif'})} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"><option>Aktif</option><option>Nonaktif</option></select></div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Program (Bisa lebih dari 1)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video">
                  <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <button onClick={() => removeImage(idx)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600"><XCircle className="w-4 h-4"/></button>
                  </div>
                  {idx >= keptExistingImages.length && imageFiles[idx - keptExistingImages.length] && (
                    <div className="absolute bottom-1 left-1 bg-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 truncate max-w-[90%]"><ImageIcon className="w-2.5 h-2.5 flex-shrink-0"/>{imageFiles[idx - keptExistingImages.length].name}</div>
                  )}
                </div>
              ))}
              <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all group">
                <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-teal-500 mb-1"/>
                <span className="text-[11px] font-medium text-slate-500 group-hover:text-teal-600">Tambah Foto</span>
                <input ref={fileRef} type="file" multiple accept=".jpg,.jpeg,.png" className="hidden" onChange={pickFile}/>
              </label>
            </div>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label><textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Deskripsi program..." className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"/></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50"><button onClick={()=>setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600">Batal</button><button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">{submitting&&<Loader2 className="w-4 h-4 animate-spin"/>}{editingId?'Simpan':'Simpan Program'}</button></div>
      </div></div>)}

      {deleteConfirm!==null&&(<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"><div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center"><div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-7 h-7 text-rose-500"/></div><h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Program?</h3><p className="text-sm text-slate-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p><div className="flex items-center justify-center gap-3"><button onClick={()=>setDeleteConfirm(null)} className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button><button onClick={()=>handleDelete(deleteConfirm)} className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm">Hapus</button></div></div></div>)}

      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full flex justify-center items-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X className="w-6 h-6"/></button>
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain bg-slate-900/50" />
          </div>
        </div>
      )}
    </div>
  );
};
