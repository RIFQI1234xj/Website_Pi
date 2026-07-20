import React, { useEffect, useMemo, useState } from 'react';
import {
  Save,
  School,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Hash,
  BadgeCheck,
  Calendar,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  UploadCloud,
  ImageIcon,
  X,
  FileText,
} from 'lucide-react';
import { useSchoolSettings } from '../../hooks/useSchoolSettings';
import { DEFAULT_SCHOOL_SETTINGS, SchoolSettings } from '../../lib/schoolSettings';
import { getImageUrl, setImageFallback } from '../../lib/api';

type InputFieldProps = {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    <div className="relative group">
      <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors pointer-events-none" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-slate-50 hover:bg-white focus:bg-white"
      />
    </div>
  </div>
);

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  rows = 4,
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-slate-50 hover:bg-white focus:bg-white resize-y"
    />
  </div>
);

type FormState = {
  school_name: string;
  npsn: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  website: string;
  address: string;
  postal_code: string;
  school_status: string;
  accreditation: string;
  established_year: string;
  welcome_title: string;
  welcome_highlight: string;
  welcome_tagline_1: string;
  welcome_tagline_2: string;
  welcome_tagline_3: string;
  map_embed_url: string;
  map_link: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
};

const toFormState = (settings: SchoolSettings): FormState => ({
  school_name: settings.school_name || '',
  npsn: settings.npsn || '',
  email: settings.email || '',
  phone: settings.phone || '',
  whatsapp_number: settings.whatsapp_number || '',
  website: settings.website || '',
  address: settings.address || '',
  postal_code: settings.postal_code || '',
  school_status: settings.school_status || '',
  accreditation: settings.accreditation || '',
  established_year: settings.established_year ? String(settings.established_year) : '',
  welcome_title: settings.welcome_title || '',
  welcome_highlight: settings.welcome_highlight || '',
  welcome_tagline_1: settings.welcome_tagline_1 || '',
  welcome_tagline_2: settings.welcome_tagline_2 || '',
  welcome_tagline_3: settings.welcome_tagline_3 || '',
  map_embed_url: settings.map_embed_url || '',
  map_link: settings.map_link || '',
  facebook_url: settings.facebook_url || '',
  instagram_url: settings.instagram_url || '',
  youtube_url: settings.youtube_url || '',
  twitter_url: settings.twitter_url || '',
});

export const AdminSettings: React.FC = () => {
  const { settings, loading, error, updateSchoolSettings } = useSchoolSettings();
  const [form, setForm] = useState<FormState>(toFormState(DEFAULT_SCHOOL_SETTINGS));
  const [retainedHeroImages, setRetainedHeroImages] = useState<string[]>(DEFAULT_SCHOOL_SETTINGS.hero_images);
  const [newHeroImages, setNewHeroImages] = useState<File[]>([]);
  const [retainedBrochureImages, setRetainedBrochureImages] = useState<string[]>(DEFAULT_SCHOOL_SETTINGS.brochure_images || []);
  const [newBrochureImages, setNewBrochureImages] = useState<File[]>([]);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isDirty || submitting) return;
    setForm(toFormState(settings));
    setRetainedHeroImages(settings.hero_images || DEFAULT_SCHOOL_SETTINGS.hero_images);
    setNewHeroImages([]);
    setRetainedBrochureImages(settings.brochure_images || DEFAULT_SCHOOL_SETTINGS.brochure_images || []);
    setNewBrochureImages([]);
  }, [settings, isDirty, submitting]);

  const hasSocialLinks = useMemo(
    () => [form.facebook_url, form.instagram_url, form.youtube_url, form.twitter_url].some(Boolean),
    [form.facebook_url, form.instagram_url, form.youtube_url, form.twitter_url]
  );

  const setField = (field: keyof FormState, value: string) => {
    setIsDirty(true);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addHeroImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files).filter((file) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
    );
    if (incoming.length === 0) return;
    setIsDirty(true);
    setNewHeroImages((prev) => [...prev, ...incoming]);
  };

  const removeRetainedHeroImage = (filename: string) => {
    setIsDirty(true);
    setRetainedHeroImages((prev) => prev.filter((item) => item !== filename));
  };

  const removeNewHeroImage = (index: number) => {
    setIsDirty(true);
    setNewHeroImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addBrochureImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files).filter((file) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)
    );
    if (incoming.length === 0) return;
    setIsDirty(true);
    setNewBrochureImages((prev) => [...prev, ...incoming]);
  };

  const removeRetainedBrochureImage = (filename: string) => {
    setIsDirty(true);
    setRetainedBrochureImages((prev) => prev.filter((item) => item !== filename));
  };

  const removeNewBrochureImage = (index: number) => {
    setIsDirty(true);
    setNewBrochureImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSubmitting(true);
    setSaved(false);
    setSubmitError(null);

    try {
      const fd = new FormData();
      fd.append('school_name', form.school_name);
      fd.append('npsn', form.npsn || '');
      fd.append('email', form.email || '');
      fd.append('phone', form.phone || '');
      fd.append('whatsapp_number', form.whatsapp_number || '');
      fd.append('website', form.website || '');
      fd.append('address', form.address || '');
      fd.append('postal_code', form.postal_code || '');
      fd.append('school_status', form.school_status || '');
      fd.append('accreditation', form.accreditation || '');
      fd.append('established_year', form.established_year || '');
      fd.append('welcome_title', form.welcome_title || '');
      fd.append('welcome_highlight', form.welcome_highlight || '');
      fd.append('welcome_tagline_1', form.welcome_tagline_1 || '');
      fd.append('welcome_tagline_2', form.welcome_tagline_2 || '');
      fd.append('welcome_tagline_3', form.welcome_tagline_3 || '');
      fd.append('map_embed_url', form.map_embed_url || '');
      fd.append('map_link', form.map_link || '');
      fd.append('facebook_url', form.facebook_url || '');
      fd.append('instagram_url', form.instagram_url || '');
      fd.append('youtube_url', form.youtube_url || '');
      fd.append('twitter_url', form.twitter_url || '');

      retainedHeroImages.forEach((filename) => {
        fd.append('retained_hero_images[]', filename);
      });

      newHeroImages.forEach((file) => {
        fd.append('hero_images[]', file);
      });

      retainedBrochureImages.forEach((filename) => {
        fd.append('retained_brochure_images[]', filename);
      });

      newBrochureImages.forEach((file) => {
        fd.append('brochure_images[]', file);
      });

      await updateSchoolSettings(fd);
      setIsDirty(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal menyimpan pengaturan sekolah.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-teal-600">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-sm font-medium">Memuat pengaturan sekolah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Pengaturan Sekolah</h1>
        <p className="text-slate-500 text-sm mt-1.5">
          Kelola identitas sekolah yang tampil di halaman profil, kontak, footer, dan tautan publik.
        </p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-4 py-3 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Pengaturan berhasil dimuat memakai data terakhir yang tersedia. Detail error: {error}</span>
        </div>
      )}

      {saved && (
        <div className="bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-teal-500" />
          Pengaturan sekolah berhasil disimpan dan siap tampil di halaman publik.
        </div>
      )}

      {submitError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <School className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Profil Institusi</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Nama Sekolah" icon={School} value={form.school_name} onChange={(value) => setField('school_name', value)} />
              <InputField label="NPSN" icon={Hash} value={form.npsn} onChange={(value) => setField('npsn', value)} />
              <InputField label="Email Resmi" icon={Mail} value={form.email} onChange={(value) => setField('email', value)} type="email" />
              <InputField label="No. Telepon" icon={Phone} value={form.phone} onChange={(value) => setField('phone', value)} />
              <InputField label="WhatsApp" icon={Phone} value={form.whatsapp_number} onChange={(value) => setField('whatsapp_number', value)} placeholder="62812xxxx" />
              <InputField label="Website" icon={Globe} value={form.website} onChange={(value) => setField('website', value)} placeholder="https://..." />
              <InputField label="Status Sekolah" icon={BadgeCheck} value={form.school_status} onChange={(value) => setField('school_status', value)} />
              <InputField label="Akreditasi" icon={BadgeCheck} value={form.accreditation} onChange={(value) => setField('accreditation', value)} />
              <InputField label="Tahun Berdiri" icon={Calendar} value={form.established_year} onChange={(value) => setField('established_year', value)} type="number" />
              <InputField label="Kode Pos" icon={MapPin} value={form.postal_code} onChange={(value) => setField('postal_code', value)} />
            </div>
            <TextAreaField label="Alamat Lengkap" value={form.address} onChange={(value) => setField('address', value)} rows={5} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Beranda (Selamat Datang)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Judul" icon={School} value={form.welcome_title} onChange={(value) => setField('welcome_title', value)} placeholder="Selamat Datang di" />
              <InputField label="Teks Sorotan" icon={BadgeCheck} value={form.welcome_highlight} onChange={(value) => setField('welcome_highlight', value)} placeholder="MI AL-HASANI" />
              <InputField label="Kalimat 1" icon={Globe} value={form.welcome_tagline_1} onChange={(value) => setField('welcome_tagline_1', value)} placeholder="Tempat di mana..." />
              <InputField label="Kalimat 2" icon={Globe} value={form.welcome_tagline_2} onChange={(value) => setField('welcome_tagline_2', value)} placeholder="dan" />
              <InputField label="Kalimat 3" icon={Globe} value={form.welcome_tagline_3} onChange={(value) => setField('welcome_tagline_3', value)} placeholder="Nilai - nilai islami..." />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Foto Slider Beranda</p>
                  <p className="text-xs text-slate-500">Upload JPG/PNG/WEBP. Foto yang dipilih akan tampil di slider bagian atas.</p>
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 cursor-pointer active:scale-95 transition-all">
                  <UploadCloud className="w-4 h-4" />
                  Tambah Foto
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    className="hidden"
                    onChange={(e) => addHeroImages(e.target.files)}
                  />
                </label>
              </div>

              {(retainedHeroImages.length > 0 || newHeroImages.length > 0) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {retainedHeroImages.map((filename) => (
                    <div key={filename} className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={getImageUrl(filename)}
                        alt={filename}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          setImageFallback(e.currentTarget, 'Hero');
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeRetainedHeroImage(filename)}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-600 shadow-sm"
                        title="Hapus dari slider"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {newHeroImages.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="relative rounded-xl overflow-hidden border border-teal-200 bg-teal-50/30">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewHeroImage(index)}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-600 shadow-sm"
                        title="Batalkan upload"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                  Belum ada foto slider. Klik Tambah Foto untuk upload.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Brosur PPDB</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Gambar Brosur Sekolah</p>
                  <p className="text-xs text-slate-500 mt-1">Upload gambar brosur dalam format JPG, PNG, WEBP, atau PDF. Gambar ini akan tampil di halaman Panduan PPDB.</p>
                </div>
                
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 cursor-pointer active:scale-95 transition-all shadow-sm whitespace-nowrap">
                  <UploadCloud className="w-4 h-4" />
                  Tambah Brosur
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => addBrochureImages(e.target.files)}
                  />
                </label>
              </div>

              {(retainedBrochureImages.length > 0 || newBrochureImages.length > 0) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                  {retainedBrochureImages.map((filename) => (
                    <div key={filename} className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      {filename.endsWith('.pdf') ? (
                        <div className="w-full h-24 bg-slate-100 flex flex-col items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-500">PDF</span>
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(filename)}
                          alt={filename}
                          className="w-full h-24 object-cover"
                          onError={(e) => {
                            setImageFallback(e.currentTarget, 'Brosur');
                          }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeRetainedBrochureImage(filename)}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-600 shadow-sm"
                        title="Hapus brosur"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {newBrochureImages.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="relative rounded-xl overflow-hidden border border-teal-200 bg-teal-50/30">
                      {file.type === 'application/pdf' ? (
                        <div className="w-full h-24 bg-slate-100 flex flex-col items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-500">PDF</span>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewBrochureImage(index)}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-600 shadow-sm"
                        title="Batalkan upload"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500 mt-3">
                  Belum ada brosur. Klik Tambah Brosur untuk upload.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Peta & Tautan Publik</h3>
            </div>
            <TextAreaField label="URL Embed Google Maps" value={form.map_embed_url} onChange={(value) => setField('map_embed_url', value)} placeholder="https://maps.google.com/maps?q=..." rows={4} />
            <InputField label="Link Google Maps" icon={Globe} value={form.map_link} onChange={(value) => setField('map_link', value)} placeholder="https://maps.google.com/?q=..." />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Instagram className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Media Sosial</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Facebook" icon={Facebook} value={form.facebook_url} onChange={(value) => setField('facebook_url', value)} placeholder="https://facebook.com/..." />
              <InputField label="Instagram" icon={Instagram} value={form.instagram_url} onChange={(value) => setField('instagram_url', value)} placeholder="https://instagram.com/..." />
              <InputField label="YouTube" icon={Youtube} value={form.youtube_url} onChange={(value) => setField('youtube_url', value)} placeholder="https://youtube.com/..." />
              <InputField label="Twitter / X" icon={Twitter} value={form.twitter_url} onChange={(value) => setField('twitter_url', value)} placeholder="https://x.com/..." />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Ringkasan Sinkronisasi</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>Perubahan di halaman ini akan dipakai oleh:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5" /> Halaman `Beranda` untuk ucapan selamat datang & slider foto</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5" /> Halaman `Profil` untuk identitas sekolah</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5" /> Halaman `Kontak` untuk email, WhatsApp, alamat, dan peta</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5" /> `Footer` untuk kontak, media sosial, dan lokasi</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Status Data</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Website:</span> {form.website || 'Belum diisi'}</p>
              <p><span className="font-semibold text-slate-800">WhatsApp:</span> {form.whatsapp_number || 'Belum diisi'}</p>
              <p><span className="font-semibold text-slate-800">Media sosial:</span> {hasSocialLinks ? 'Sudah terisi sebagian' : 'Belum ada link aktif'}</p>
              <p><span className="font-semibold text-slate-800">Slider beranda:</span> {retainedHeroImages.length + newHeroImages.length} foto</p>
              <p><span className="font-semibold text-slate-800">Peta:</span> {form.map_embed_url || form.map_link ? 'Sudah tersedia' : 'Belum diisi'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
            <p className="text-sm text-slate-600">Pastikan data sudah benar sebelum menyimpan karena perubahan akan tampil langsung di website publik.</p>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 shadow-sm shadow-teal-600/20 transition-all font-semibold active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {submitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
