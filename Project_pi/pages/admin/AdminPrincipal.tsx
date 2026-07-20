import React, { useState, useEffect, useRef } from 'react';
import { Save, UploadCloud, UserCircle, Briefcase, FileText, CheckCircle2, Loader2, AlertCircle, XCircle, ImageIcon } from 'lucide-react';
import { usePrincipal } from '../../hooks/usePrincipal';
import { getImageUrl } from '../../lib/api';

export const AdminPrincipal: React.FC = () => {
  const { principal, loading, error, updatePrincipal } = usePrincipal();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (principal) {
      setName(principal.name || '');
      setRole(principal.role || '');
      setMessage(principal.message || '');
      setImagePreview(principal.image ? getImageUrl(principal.image) : null);
    }
  }, [principal]);

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('role', role);
      fd.append('message', message);
      if (imageFile) fd.append('image', imageFile);
      await updatePrincipal(fd);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Gagal menyimpan data.');
    } finally { setSaving(false); }
  };

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && ['image/jpeg', 'image/jpg', 'image/png'].includes(f.type)) {
      setImageFile(f); setImagePreview(URL.createObjectURL(f));
    } else if (f) alert('Format harus JPG/PNG.');
  };
  const clearFile = () => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; };

  if (loading) return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 animate-spin text-teal-500" /><span className="ml-3 text-slate-500 font-medium">Memuat data pimpinan...</span>
    </div>
  );
  if (error) return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2"><AlertCircle className="w-5 h-5" />Gagal memuat data: {error}</div>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Profil & Sambutan Pimpinan</h1>
          <p className="text-slate-500 text-sm mt-1.5">Kelola informasi kepala sekolah dan teks sambutan resmi.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold text-sm shadow-sm disabled:opacity-50 active:scale-95">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan
        </button>
      </div>

      {saved && (<div className="bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 shadow-sm"><CheckCircle2 className="w-5 h-5 text-teal-500" />Profil berhasil diperbarui!</div>)}
      {saveError && (<div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2"><AlertCircle className="w-5 h-5 text-rose-500" />{saveError}</div>)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50"><UserCircle className="w-5 h-5 text-slate-500" /><h3 className="font-bold text-slate-800">Foto Profil Pimpinan</h3></div>
            <div className="p-6 flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 group mb-3">
                {imagePreview ? (
                  <img src={imagePreview} alt="Foto Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><UserCircle className="w-20 h-20" /></div>
                )}
                <label className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <UploadCloud className="w-8 h-8 mb-1" /><span className="text-xs font-semibold">Ubah Foto</span>
                  <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={pickFile} />
                </label>
              </div>
              {imageFile && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-teal-50 text-teal-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-teal-200 flex items-center gap-1 max-w-[180px] truncate"><ImageIcon className="w-3 h-3 flex-shrink-0" />{imageFile.name}</span>
                  <button onClick={clearFile} className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors" title="Hapus Foto"><XCircle className="w-4 h-4" /></button>
                </div>
              )}
              <p className="text-xs text-slate-500 text-center mt-3">Format: JPG, PNG. Rasio 1:1 (Persegi), maks 2MB.</p>
            </div>
          </div>

          {/* Identity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50"><Briefcase className="w-5 h-5 text-slate-500" /><h3 className="font-bold text-slate-800">Identitas Diri</h3></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap & Gelar</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Jabatan</label><input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white" /></div>
            </div>
          </div>
        </div>

        {/* Right Column - Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-slate-500" /><h3 className="font-bold text-slate-800">Teks Sambutan Resmi</h3></div>
              <span className="text-xs font-semibold px-2 py-1 bg-teal-50 text-teal-600 rounded border border-teal-100">Tampil di Beranda</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-sm text-slate-500 mb-4">Tuliskan pesan sambutan yang akan tampil di halaman publik website.</p>
              <div className="border border-slate-200 border-b-0 rounded-t-xl bg-slate-50 p-2 flex items-center gap-1">
                <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 font-bold w-8">B</button>
                <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 italic w-8">I</button>
                <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 underline w-8">U</button>
                <div className="w-px h-5 bg-slate-300 mx-1"></div>
                <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 text-xs font-semibold px-2">H1</button>
                <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 text-xs font-semibold px-2">H2</button>
              </div>
              <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full flex-1 min-h-[300px] p-4 bg-white border border-slate-200 rounded-b-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none leading-relaxed text-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
