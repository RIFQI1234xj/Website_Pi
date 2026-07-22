import React, { useState, useRef } from 'react';
import { useTeachers, TeacherItem } from '../../hooks/useTeachers';
import { getImageUrl, setImageFallback } from '../../lib/api';
import { Search, Plus, Edit, Trash2, Loader2, X, AlertTriangle, UploadCloud, ImageIcon, XCircle, LayoutGrid, List } from 'lucide-react';

const emptyForm = { name: '', role: '', order: 0, subject: '', is_active: true };

export const AdminTeachers: React.FC = () => {
  const { teachers, loading, createTeacher, updateTeacher, deleteTeacher } = useTeachers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [view, setView] = useState<'grid'|'list'>('list');
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => a.id - b.id);

  const handleAlphabeticChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const alphabeticOnly = event.target.value.replace(/[^a-zA-Z\s.,'-]/g, '');
    setForm({ ...form, [field]: alphabeticOnly });
  };

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && ['image/jpeg','image/jpg','image/png'].includes(f.type)) {
      setImageFile(f); setImagePreview(URL.createObjectURL(f));
    } else if (f) alert('Format harus JPG/PNG.');
  };
  const clearFile = () => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value=''; };

  const openCreate = () => { setEditingId(null); setForm(emptyForm); clearFile(); setShowModal(true); };
  const openEdit = (t: TeacherItem) => {
    setEditingId(t.id); setForm({name:t.name,role:t.role,order:t.order,subject:t.subject||'',is_active:t.is_active!==false});
    setImageFile(null); setImagePreview(t.image?getImageUrl(t.image):null); setShowModal(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name',form.name); fd.append('role',form.role);
      fd.append('order',String(form.order)); fd.append('subject',form.subject); fd.append('is_active',form.is_active?'1':'0');
      if (imageFile) fd.append('image', imageFile);
      if (editingId) await updateTeacher(editingId, fd);
      else { if (!imageFile){alert('Pilih foto.');setSubmitting(false);return;} await createTeacher(fd); }
      setShowModal(false); clearFile();
    } catch(e){alert('Gagal: '+(e as any).message);} finally{setSubmitting(false);}
  };
  const handleDelete = async (id:number) => { try{await deleteTeacher(id);setDeleteConfirm(null);}catch(e){alert('Gagal: '+(e as any).message);} };

  // Shared upload UI component
  const ImageUploadArea = ({preview,file,onClear,inputRef,onPick,shape='rounded-xl',h='h-32'}:{preview:string|null,file:File|null,onClear:()=>void,inputRef:React.RefObject<HTMLInputElement>,onPick:(e:React.ChangeEvent<HTMLInputElement>)=>void,shape?:string,h?:string}) => (
    preview ? (
      <div className={`relative group ${shape} overflow-hidden border border-slate-200 ${h} mx-auto`}>
        <img src={preview} alt="Preview" className="w-full h-full object-contain bg-slate-50 rounded-xl" />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
          <button onClick={onClear} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600" title="Hapus Foto"><XCircle className="w-5 h-5" /></button>
        </div>
        {file && <div className="absolute bottom-1 left-1 right-1 bg-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full text-center truncate flex items-center gap-1 justify-center"><ImageIcon className="w-2.5 h-2.5"/>{file.name}</div>}
      </div>
    ) : (
      <label className={`flex flex-col items-center justify-center w-full ${h} border-2 border-dashed border-slate-300 ${shape} cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all group`}>
        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-teal-500 mb-2" />
        <span className="text-sm font-medium text-slate-500 group-hover:text-teal-600">Klik untuk pilih foto</span>
        <span className="text-[10px] text-slate-400 mt-1">JPG, JPEG, PNG • Maks 2MB</span>
        <input ref={inputRef as any} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={onPick}/>
      </label>
    )
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Manajemen Data Guru</h1><p className="text-slate-500 text-sm mt-1.5">Kelola informasi profil dan mata pelajaran staf pengajar.</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm shadow-sm active:scale-95"><Plus className="w-4 h-4"/>Tambah Guru Baru</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
            <input type="text" placeholder="Cari nama, peran, atau mapel..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"/>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 self-end sm:self-auto">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
        {loading?(<div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-500"/><span className="ml-3 text-slate-500">Memuat...</span></div>) : view === 'list' ? (
          <div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-600 whitespace-nowrap"><thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider"><tr><th className="px-6 py-4">Profil</th><th className="px-6 py-4">ID</th><th className="px-6 py-4">Jabatan</th><th className="px-6 py-4">Mapel</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{filtered.map(t=>(
            <tr key={t.id} className="hover:bg-teal-50/30 group">
              <td className="px-6 py-4"><div className="flex items-center gap-4"><img src={getImageUrl(t.image)} alt={t.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" onError={(e)=>{setImageFallback(e.currentTarget, t.name)}}/><div><p className="font-semibold text-slate-800">{t.name}</p></div></div></td>
              <td className="px-6 py-4"><span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">{String(t.id).padStart(5,'0')}</span></td>
              <td className="px-6 py-4"><div className="font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md inline-block border border-slate-100">{t.role}</div></td>
            <td className="px-6 py-4">{t.subject?<span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">{t.subject}</span>:<span className="text-slate-400 italic text-xs">-</span>}</td>
            <td className="px-6 py-4">
              {t.is_active !== false ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-teal-50 text-teal-700 border-teal-200"><span className="w-1.5 h-1.5 rounded-full mr-2 bg-teal-500 inline-block"/>Aktif</span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-200"><span className="w-1.5 h-1.5 rounded-full mr-2 bg-rose-500 inline-block"/>Tidak Aktif</span>
              )}
            </td>
            <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-1"><button onClick={()=>openEdit(t)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit className="w-4 h-4"/></button><button onClick={()=>setDeleteConfirm(t.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button></div></td></tr>
          ))}{filtered.length===0&&<tr><td colSpan={6} className="p-8 text-center text-slate-500">Tidak ditemukan.</td></tr>}</tbody></table></div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-slate-50">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 text-sm">Tidak ada data guru ditemukan.</div>
            ) : filtered.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col items-center text-center p-6">
                <div className="w-24 h-24 mb-4 relative">
                  <img src={getImageUrl(t.image)} alt={t.name} className="w-full h-full object-cover rounded-full border-4 border-slate-50 shadow-sm group-hover:scale-105 transition-transform duration-300" onError={(e)=>{setImageFallback(e.currentTarget, t.name)}} />
                  <div className="absolute bottom-0 right-0">
                    {t.is_active !== false ? (
                      <div className="w-4 h-4 bg-teal-500 border-2 border-white rounded-full shadow-sm" title="Aktif"></div>
                    ) : (
                      <div className="w-4 h-4 bg-rose-500 border-2 border-white rounded-full shadow-sm" title="Tidak Aktif"></div>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-teal-600 transition-colors">{t.name}</h3>
                <div className="font-medium text-slate-500 text-xs mb-2 bg-slate-100 px-2 py-0.5 rounded-full">{t.role}</div>
                {t.subject && <div className="text-indigo-600 text-[11px] font-semibold bg-indigo-50 px-2 py-1 rounded-md mb-4 line-clamp-1 border border-indigo-100/50 w-full">{t.subject}</div>}
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 mt-auto w-full">
                  <button onClick={()=>openEdit(t)} className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-semibold transition-colors"><Edit className="w-3.5 h-3.5"/> Edit</button>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <button onClick={()=>setDeleteConfirm(t.id)} className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"><Trash2 className="w-3.5 h-3.5"/> Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="p-4 border-t border-slate-100 text-sm text-slate-500 bg-slate-50/50">Menampilkan <span className="font-semibold text-slate-800">{filtered.length}</span> dari <span className="font-semibold text-slate-800">{teachers.length}</span> Guru</div>
      </div>

      {showModal&&(<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"><div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><h3 className="text-lg font-bold text-slate-800">{editingId?'Edit Data Guru':'Tambah Guru Baru'}</h3><button onClick={()=>setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5"/></button></div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label><input type="text" value={form.name} onChange={handleAlphabeticChange('name')} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" placeholder="Nama lengkap..."/></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Jabatan</label><input type="text" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" placeholder="Guru Kelas 1"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Mata Pelajaran</label><input type="text" value={form.subject} onChange={handleAlphabeticChange('subject')} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" placeholder="Matematika"/></div></div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status Guru</label>
            <select 
              value={form.is_active ? 'aktif' : 'tidak_aktif'} 
              onChange={e => setForm({...form, is_active: e.target.value === 'aktif'})}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
            >
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
            </select>
          </div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Profil</label><ImageUploadArea preview={imagePreview} file={imageFile} onClear={clearFile} inputRef={fileRef as any} onPick={pickFile} h="h-48"/></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50"><button onClick={()=>setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600">Batal</button><button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">{submitting&&<Loader2 className="w-4 h-4 animate-spin"/>}{editingId?'Simpan':'Tambah Guru'}</button></div>
      </div></div>)}

      {deleteConfirm!==null&&(<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"><div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center"><div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-7 h-7 text-rose-500"/></div><h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Data Guru?</h3><p className="text-sm text-slate-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p><div className="flex items-center justify-center gap-3"><button onClick={()=>setDeleteConfirm(null)} className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Batal</button><button onClick={()=>handleDelete(deleteConfirm)} className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm">Hapus</button></div></div></div>)}
    </div>
  );
};
