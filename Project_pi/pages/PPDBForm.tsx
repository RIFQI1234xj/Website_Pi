import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Users, Upload, CheckCircle2, ChevronRight, ChevronLeft,
  FileText, Calendar, MapPin, Phone, X, AlertCircle, Image,
  PartyPopper, ClipboardCheck, ArrowLeft, Trash2, File, Eye, Download, Lock
} from 'lucide-react';
import { PPDBApplicant, Gender } from '../types';
import { usePpdbStatus } from '../hooks/usePpdbStatus';
import { apiFetch } from '../lib/api';

type FormStep = 1 | 2 | 3 | 4;

interface FormData {
  studentName: string;
  birthPlace: string;
  birthDate: string;
  gender: Gender | '';
  address: string;
  parentName: string;
  whatsappNumber: string;
  kkFile: File | null;
  kkPreview: string;
  aktaFile: File | null;
  aktaPreview: string;
  ktpFile: File | null;
  ktpPreview: string;
  ijazahFile: File | null;
  ijazahPreview: string;
}

interface FormErrors {
  [key: string]: string;
}

const STEP_TITLES = [
  { step: 1, title: 'Data Siswa', icon: User, desc: 'Data Calon Peserta Didik' },
  { step: 2, title: 'Data Orang Tua', icon: Users, desc: 'Data Wali / Orang Tua' },
  { step: 3, title: 'Upload Dokumen', icon: Upload, desc: 'KK, Akta, KTP, dll' },
  { step: 4, title: 'Ringkasan', icon: ClipboardCheck, desc: 'Periksa & Kirim' },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_WHATSAPP_DIGITS = 14;

export const PPDBForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { ppdbStatus, loading } = usePpdbStatus();
  const isPpdbOpen = !loading && ppdbStatus ? ppdbStatus.is_open : true;
  const tahunAjaran = ppdbStatus?.tahun_ajaran || '2026/2027';
  const [registrationId, setRegistrationId] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [viewDoc, setViewDoc] = useState<{ url: string; name: string } | null>(null);
  const kkInputRef = useRef<HTMLInputElement>(null);
  const aktaInputRef = useRef<HTMLInputElement>(null);
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const ijazahInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    address: '',
    parentName: '',
    whatsappNumber: '',
    kkFile: null,
    kkPreview: '',
    aktaFile: null,
    aktaPreview: '',
    ktpFile: null,
    ktpPreview: '',
    ijazahFile: null,
    ijazahPreview: '',
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // --- Validation ---
  const validateStep = (step: FormStep): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.studentName.trim()) newErrors.studentName = 'Nama lengkap wajib diisi';
      if (!formData.birthPlace.trim()) newErrors.birthPlace = 'Tempat lahir wajib diisi';
      if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi';
      if (!formData.gender) newErrors.gender = 'Jenis kelamin wajib dipilih';
      if (!formData.address.trim()) newErrors.address = 'Alamat lengkap wajib diisi';
    }

    if (step === 2) {
      if (!formData.parentName.trim()) newErrors.parentName = 'Nama orang tua wajib diisi';
      if (!formData.whatsappNumber.trim()) {
        newErrors.whatsappNumber = 'Nomor WhatsApp wajib diisi';
      } else if (!/^(\+62|62|08)\d{8,12}$/.test(formData.whatsappNumber.replace(/[\s-]/g, ''))) {
        newErrors.whatsappNumber = 'Format nomor tidak valid (contoh: 08123456789)';
      }
    }

    if (step === 3) {
      if (!formData.kkFile) newErrors.kkFile = 'Dokumen KK wajib diunggah';
      if (!formData.aktaFile) newErrors.aktaFile = 'Dokumen Akta wajib diunggah';
      if (!formData.ktpFile) newErrors.ktpFile = 'Dokumen KTP Orang Tua wajib diunggah';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4) as FormStep);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1) as FormStep);
  };

  const handleWhatsAppChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, MAX_WHATSAPP_DIGITS);
    updateField('whatsappNumber', digitsOnly);
  };

  const handleLettersOnlyChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya izinkan huruf, spasi, tanda baca wajar (titik, koma, petik, strip)
    // Menghapus angka dan simbol aneh
    const lettersOnly = event.target.value.replace(/[^a-zA-Z\s.,'-]/g, '');
    updateField(field, lettersOnly);
  };

  // --- File handling ---
  const processFile = (file: File, type: 'kk' | 'akta' | 'ktp' | 'ijazah') => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, [`${type}File`]: 'Format file harus JPG, PNG, atau PDF' }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, [`${type}File`]: 'Ukuran file maks 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (type === 'kk') {
        updateField('kkFile', file);
        updateField('kkPreview', dataUrl);
      } else if (type === 'akta') {
        updateField('aktaFile', file);
        updateField('aktaPreview', dataUrl);
      } else if (type === 'ktp') {
        updateField('ktpFile', file);
        updateField('ktpPreview', dataUrl);
      } else {
        updateField('ijazahFile', file);
        updateField('ijazahPreview', dataUrl);
      }
    };
    reader.readAsDataURL(file);
    // Clear error
    setErrors(prev => {
      const next = { ...prev };
      delete next[`${type}File`];
      return next;
    });
  };

  const handleDrop = useCallback((e: React.DragEvent, type: 'kk' | 'akta' | 'ktp' | 'ijazah') => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file, type);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'kk' | 'akta' | 'ktp' | 'ijazah') => {
    const file = e.target.files?.[0];
    if (file) processFile(file, type);
  };

  const removeFile = (type: 'kk' | 'akta' | 'ktp' | 'ijazah') => {
    if (type === 'kk') {
      updateField('kkFile', null);
      updateField('kkPreview', '');
      if (kkInputRef.current) kkInputRef.current.value = '';
    } else if (type === 'akta') {
      updateField('aktaFile', null);
      updateField('aktaPreview', '');
      if (aktaInputRef.current) aktaInputRef.current.value = '';
    } else if (type === 'ktp') {
      updateField('ktpFile', null);
      updateField('ktpPreview', '');
      if (ktpInputRef.current) ktpInputRef.current.value = '';
    } else {
      updateField('ijazahFile', null);
      updateField('ijazahPreview', '');
      if (ijazahInputRef.current) ijazahInputRef.current.value = '';
    }
  };

  // --- Submit ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const res = await apiFetch('/ppdb/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: formData.studentName.trim(),
          birthPlace: formData.birthPlace.trim(),
          birthDate: formData.birthDate,
          gender: formData.gender,
          address: formData.address.trim(),
          parentName: formData.parentName.trim(),
          whatsappNumber: formData.whatsappNumber.trim(),
          kkFileName: formData.kkFile?.name || null,
          kkFileData: formData.kkPreview || null,
          aktaFileName: formData.aktaFile?.name || null,
          aktaFileData: formData.aktaPreview || null,
          ktpFileName: formData.ktpFile?.name || null,
          ktpFileData: formData.ktpPreview || null,
          ijazahFileName: formData.ijazahFile?.name || null,
          ijazahFileData: formData.ijazahPreview || null,
        }),
      });

      if (res.status === 'success' && res.data) {
        setRegistrationId(res.data.registration_id);
        setShowSuccess(true);
      } else {
        throw new Error(res.message || 'Gagal mengirim pendaftaran');
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.message || "Terjadi kesalahan. Mohon coba lagi dengan ukuran file dokumen yang lebih kecil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Slide animation variants ---
  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => { setDirection(1); handleNext(); };
  const goPrev = () => { setDirection(-1); handlePrev(); };

  // --- Render helpers ---
  const renderInput = (
    label: string,
    field: keyof FormData,
    icon: React.ReactNode,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        value={formData[field] as string}
        onChange={(e) => updateField(field, e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none text-sm bg-white
          ${errors[field]
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
            : 'border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
          }`}
        {...props}
      />
      {errors[field] && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} /> {errors[field]}
        </p>
      )}
    </div>
  );

  const renderFileUpload = (
    label: string,
    type: 'kk' | 'akta' | 'ktp' | 'ijazah',
    file: File | null,
    preview: string,
    inputRef: React.RefObject<HTMLInputElement | null>,
    isOptional?: boolean
  ) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <FileText size={15} className="text-teal-600" /> {label} {isOptional && <span className="text-xs text-gray-500 font-normal">(Opsional)</span>}
      </label>

      {file ? (
        <div className="relative rounded-xl border-2 border-teal-200 bg-teal-50/50 p-4">
          <div className="flex items-center gap-4">
            {file.type.startsWith('image/') && preview ? (
              <img src={preview} alt={file.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                <File size={24} className="text-red-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} className="text-teal-500" />
                <span className="text-xs text-teal-600 font-medium">File siap dikirim</span>
              </div>
            </div>
            <button
              onClick={() => removeFile(type)}
              className="w-9 h-9 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-500 transition-colors flex-shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={(e) => handleDrop(e, type)}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 group hover:border-teal-400 hover:bg-teal-50/30
            ${errors[`${type}File`] ? 'border-red-300 bg-red-50/20' : 'border-gray-300 bg-gray-50/50'}`}
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-100 flex items-center justify-center mb-3 group-hover:from-teal-200 group-hover:to-teal-200 transition-colors">
              <Upload size={24} className="text-teal-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Drag & drop file di sini
            </p>
            <p className="text-xs text-gray-500">
              atau <span className="text-teal-600 font-semibold underline">klik untuk browse</span>
            </p>
            <p className="text-[10px] text-gray-500 mt-2">JPG, PNG, PDF â€¢ Maks 2MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileInput(e, type)}
            className="hidden"
          />
        </div>
      )}
      {errors[`${type}File`] && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} /> {errors[`${type}File`]}
        </p>
      )}
    </div>
  );

  // --- Step content ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/60 mb-2">
              <p className="text-sm text-teal-800 flex items-center gap-2">
                <User size={16} className="text-teal-600" />
                <span className="font-semibold">Langkah 1:</span> Isi data calon peserta didik baru.
              </p>
            </div>
            {renderInput('Nama Lengkap Siswa', 'studentName', <User size={15} className="text-teal-600" />, { 
              placeholder: 'Masukkan nama lengkap', 
              type: 'text',
              onChange: handleLettersOnlyChange('studentName')
            })}
            {renderInput('Tempat Lahir', 'birthPlace', <MapPin size={15} className="text-teal-600" />, { 
              placeholder: 'Contoh: Bandung', 
              type: 'text',
              onChange: handleLettersOnlyChange('birthPlace')
            })}
            
            {/* Custom Date Input for Indonesian Format */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={15} className="text-teal-600" /> Tanggal Lahir
              </label>
              <div 
                className="relative cursor-pointer group" 
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                  if (input && input.showPicker) {
                    try { input.showPicker(); } catch (err) {}
                  }
                }}
              >
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateField('birthDate', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm bg-white flex items-center justify-between
                  ${errors.birthDate
                    ? 'border-red-300 ring-4 ring-red-100'
                    : 'border-gray-200 group-hover:border-teal-300'
                  }`}
                >
                  <span className={formData.birthDate ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                    {formData.birthDate 
                      ? formData.birthDate.split('-').reverse().join('/') 
                      : 'HH/BB/TTTT (Hari/Bulan/Tahun)'}
                  </span>
                  <Calendar size={16} className={formData.birthDate ? "text-teal-600" : "text-gray-500"} />
                </div>
              </div>
              {errors.birthDate && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.birthDate}
                </p>
              )}
            </div>

            {/* Gender Radio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users size={15} className="text-teal-600" /> Jenis Kelamin
              </label>
              <div className="flex gap-3">
                {(['Laki-laki', 'Perempuan'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateField('gender', g)}
                    className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200
                      ${formData.gender === g
                        ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm ring-2 ring-teal-100'
                        : 'border-gray-200 text-gray-500 hover:border-teal-300 hover:bg-teal-50/50'
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.gender}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={15} className="text-teal-600" /> Alamat Lengkap
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Masukkan alamat lengkap tempat tinggal"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none text-sm bg-white resize-none
                  ${errors.address
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
                  }`}
              />
              {errors.address && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.address}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/60 mb-2">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                <span className="font-semibold">Langkah 2:</span> Isi data orang tua / wali murid.
              </p>
            </div>
            {renderInput('Nama Orang Tua / Wali', 'parentName', <Users size={15} className="text-blue-600" />, { 
              placeholder: 'Masukkan nama lengkap orang tua', 
              type: 'text',
              onChange: handleLettersOnlyChange('parentName')
            })}
            {renderInput('Nomor WhatsApp', 'whatsappNumber', <Phone size={15} className="text-blue-600" />, {
              placeholder: '08123456789',
              type: 'tel',
              inputMode: 'numeric',
              maxLength: MAX_WHATSAPP_DIGITS,
              pattern: '[0-9]*',
              autoComplete: 'tel',
              onChange: handleWhatsAppChange,
            })}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/60">
              <p className="text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                Pastikan nomor WhatsApp aktif. Pihak sekolah akan menghubungi melalui WhatsApp untuk informasi selanjutnya.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200/60 mb-2">
              <p className="text-sm text-purple-800 flex items-center gap-2">
                <Upload size={16} className="text-purple-600" />
                <span className="font-semibold">Langkah 3:</span> Unggah dokumen persyaratan.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {renderFileUpload('Kartu Keluarga (KK)', 'kk', formData.kkFile, formData.kkPreview, kkInputRef)}
              {renderFileUpload('Akta Kelahiran', 'akta', formData.aktaFile, formData.aktaPreview, aktaInputRef)}
              {renderFileUpload('KTP Orang Tua', 'ktp', formData.ktpFile, formData.ktpPreview, ktpInputRef)}
              {renderFileUpload('Ijazah TK / PAUD', 'ijazah', formData.ijazahFile, formData.ijazahPreview, ijazahInputRef, true)}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/60 mb-2">
              <p className="text-sm text-teal-800 flex items-center gap-2">
                <ClipboardCheck size={16} className="text-teal-600" />
                <span className="font-semibold">Langkah 4:</span> Periksa kembali semua data sebelum mengirim.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="space-y-4">
              {/* Student Data */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-teal-50 border-b border-gray-200">
                  <h4 className="font-bold text-teal-800 text-sm flex items-center gap-2">
                    <User size={15} /> Data Calon Siswa
                  </h4>
                </div>
                <div className="p-4 space-y-2.5 bg-white">
                  <SummaryRow label="Nama Lengkap" value={formData.studentName} />
                  <SummaryRow label="Tempat, Tanggal Lahir" value={`${formData.birthPlace}, ${formatDate(formData.birthDate)}`} />
                  <SummaryRow label="Jenis Kelamin" value={formData.gender} />
                  <SummaryRow label="Alamat Lengkap" value={formData.address} />
                </div>
              </div>

              {/* Parent Data */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2">
                    <Users size={15} /> Data Orang Tua
                  </h4>
                </div>
                <div className="p-4 space-y-2.5 bg-white">
                  <SummaryRow label="Nama Orang Tua" value={formData.parentName} />
                  <SummaryRow label="No. WhatsApp" value={formData.whatsappNumber} />
                </div>
              </div>

              {/* Documents */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-200">
                  <h4 className="font-bold text-purple-800 text-sm flex items-center gap-2">
                    <FileText size={15} /> Dokumen
                  </h4>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  {/* Helper for rendering doc item */}
                  {[
                    { label: 'Kartu Keluarga (KK)', file: formData.kkFile, preview: formData.kkPreview },
                    { label: 'Akta Kelahiran', file: formData.aktaFile, preview: formData.aktaPreview },
                    { label: 'KTP Orang Tua', file: formData.ktpFile, preview: formData.ktpPreview },
                    { label: 'Ijazah TK / PAUD', file: formData.ijazahFile, preview: formData.ijazahPreview, optional: true },
                  ].map((doc, idx) => {
                    if (doc.optional && !doc.file) return null;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        {doc.file?.type.startsWith('image/') && doc.preview ? (
                          <img src={doc.preview} alt={doc.label} className="w-12 h-12 object-cover rounded-lg border" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"><File size={20} className="text-gray-500" /></div>
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-800">{doc.label}</p>
                          <p className="text-[10px] text-gray-500">{doc.file?.name}</p>
                        </div>
                        {doc.preview && (
                          <button
                            onClick={() => setViewDoc({ url: doc.preview, name: doc.file?.name || doc.label })}
                            className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center hover:bg-teal-100 transition-colors shrink-0"
                            title="Lihat Dokumen"
                          >
                            <Eye size={14} className="text-teal-600" />
                          </button>
                        )}
                        <CheckCircle2 size={16} className="text-teal-500 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 relative" id="registration-form-section">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-12">
          <button
            onClick={() => navigate('/ppdb')}
            className="flex items-center gap-2 text-teal-300 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Panduan
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Formulir Pendaftaran</h1>
          <p className="text-teal-200 text-sm">PPDB MI Al-Hasani - Tahun Ajaran 2026/2027</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            {STEP_TITLES.map((s, i) => {
              const Icon = s.icon;
              const isActive = currentStep === s.step;
              const isDone = currentStep > s.step;
              return (
                <React.Fragment key={s.step}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm
                      ${isDone
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-emerald-500/20'
                        : isActive
                          ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-emerald-600/30 ring-4 ring-teal-100'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={20} /> : <Icon size={18} />}
                    </div>
                    <span className={`text-[10px] font-semibold mt-2 text-center hidden sm:block
                      ${isActive ? 'text-teal-700' : isDone ? 'text-teal-600' : 'text-gray-500'}`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {i < STEP_TITLES.length - 1 && (
                    <div className={`flex-1 h-1 rounded-full mx-2 transition-all duration-500
                      ${currentStep > s.step ? 'bg-gradient-to-r from-teal-500 to-teal-500' : 'bg-gray-200'}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 relative">
        {!isPpdbOpen && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center m-4 sm:m-6 border border-gray-200 shadow-sm">
             <Lock size={48} className="text-gray-500 mb-4" />
             <p className="text-gray-600 font-bold text-lg">Formulir Pendaftaran Ditutup</p>
             <p className="text-sm text-gray-500 mt-2">Anda tidak dapat mengisi formulir saat ini.</p>
          </div>
        )}
        
        <div className={`bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 md:p-8 transition-opacity duration-300 ${!isPpdbOpen ? 'opacity-30 pointer-events-none select-none' : ''}`}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {currentStep > 1 ? (
              <button
                onClick={goPrev}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
                disabled={!isPpdbOpen}
              >
                <ChevronLeft size={18} /> Sebelumnya
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                disabled={!isPpdbOpen}
              >
                Selanjutnya <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-8 py-3.5 sm:py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-600/40 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mengirim...</span>
                  </div>
                ) : (
                  <>
                    <span>Kirim Pendaftaran</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Document View Modal */}
      {viewDoc && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setViewDoc(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 truncate w-full sm:w-auto">
                <FileText size={18} className="text-teal-600 flex-shrink-0" /> <span className="truncate">{viewDoc.name}</span>
              </h3>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => {
                    try {
                      if (viewDoc.url.startsWith('data:')) {
                        const arr = viewDoc.url.split(',');
                        const mime = arr[0].match(/:(.*?);/)?.[1] || '';
                        const bstr = atob(arr[1]);
                        let n = bstr.length;
                        const u8arr = new Uint8Array(n);
                        while (n--) {
                          u8arr[n] = bstr.charCodeAt(n);
                        }
                        const blob = new Blob([u8arr], { type: mime });
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = blobUrl;
                        a.download = viewDoc.name;
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                          document.body.removeChild(a);
                          URL.revokeObjectURL(blobUrl);
                        }, 100);
                      } else {
                        const a = document.createElement('a');
                        a.href = viewDoc.url;
                        a.download = viewDoc.name;
                        a.target = '_blank';
                        a.click();
                      }
                    } catch (e) {
                      const a = document.createElement('a');
                      a.href = viewDoc.url;
                      a.download = viewDoc.name;
                      a.target = '_blank';
                      a.click();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <Download size={16} /> Unduh
                </button>
                <button 
                  onClick={() => setViewDoc(null)} 
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center gap-2 text-gray-700 transition-colors text-sm font-semibold"
                >
                  <X size={16} /> Tutup
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-4">
              {viewDoc.url.startsWith('data:image') ? (
                <img src={viewDoc.url} alt={viewDoc.name} className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
              ) : viewDoc.url.startsWith('data:application/pdf') ? (
                <iframe src={viewDoc.url} title={viewDoc.name} className="w-full h-full rounded-lg shadow-sm border-0 bg-white" />
              ) : (
                <div className="text-center">
                  <FileText size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">Format dokumen tidak dapat ditampilkan secara langsung.</p>
                  <p className="text-sm text-gray-500 mt-2">Silakan unduh dokumen untuk melihatnya.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              {/* Confetti-like decorative elements */}
              <div className="relative">
                <div className="absolute -top-4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="absolute -top-2 right-1/3 w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="absolute top-0 right-1/4 w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                <div className="absolute -top-3 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
              </div>

              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-400/30">
                <PartyPopper size={36} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil! 🎉</h2>
              <p className="text-gray-500 text-sm mb-6">Data Anda telah berhasil dikirim.</p>

              <div className="bg-gradient-to-r from-teal-50 to-teal-50 border-2 border-teal-200 rounded-2xl p-5 mb-6">
                <p className="text-xs text-teal-600 font-semibold mb-1">Nomor Registrasi Anda</p>
                <p className="text-3xl font-bold text-teal-800 tracking-wider">{registrationId}</p>
                <p className="text-[10px] text-teal-500 mt-2">Simpan nomor ini sebagai bukti pendaftaran</p>
              </div>

              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Pihak sekolah akan menghubungi Anda melalui WhatsApp untuk informasi selanjutnya.
              </p>

              <button
                onClick={() => navigate('/ppdb')}
                className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all"
              >
                Kembali ke Halaman PPDB
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Helper Components ---
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
  </div>
);

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

