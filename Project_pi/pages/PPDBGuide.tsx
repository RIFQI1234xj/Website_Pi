import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle2, Upload, ClipboardList,
  Download, X, BookOpen, Shield, Square,
  ArrowRight, GraduationCap, UserCheck
} from 'lucide-react';
import { PPDBStatusModal } from '../components/ppdb/PPDBStatusModal';
import { SEO } from '../components/SEO';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { getImageUrl } from '../lib/api';

interface PPDBGuideProps {
  setPage?: (page: any) => void;
}

export const PPDBGuide: React.FC<PPDBGuideProps> = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isAlurOpen, setIsAlurOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isPpdbOpen, setIsPpdbOpen] = useState<boolean>(true);
  const { settings } = useSchoolSettings();

  // Close modal on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBrochureOpen(false);
        setIsAlurOpen(false);
      }
    };
    if (isBrochureOpen || isAlurOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isBrochureOpen, isAlurOpen]);

  const steps = [
    {
      number: '01',
      icon: BookOpen,
      title: 'Baca Panduan',
      desc: 'Baca informasi persyaratan dan alur pendaftaran di halaman ini.',
    },
    {
      number: '02',
      icon: ClipboardList,
      title: 'Isi Formulir',
      desc: 'Lengkapi data calon siswa, data orang tua, dan upload dokumen.',
    },
    {
      number: '03',
      icon: Upload,
      title: 'Upload Dokumen',
      desc: 'Siapkan Kartu Keluarga (KK) dan Akta Kelahiran dalam format JPG/PNG/PDF (maks 2MB).',
    },
    {
      number: '04',
      icon: CheckCircle2,
      title: 'Dapatkan No. Registrasi',
      desc: 'Setelah submit, Anda akan mendapatkan nomor registrasi unik sebagai bukti pendaftaran.',
    },
  ];

  const generalRequirements = [
    'Berusia minimal 6 tahun pada tanggal 1 Juli tahun ajaran baru (pengecualian 5 tahun 6 bulan dengan surat rekomendasi psikolog/kepala sekolah asal).',
    'Sehat secara jasmani maupun rohani.',
    'Bersedia mengikuti seluruh tahapan seleksi (jika ada) dan mematuhi tata tertib MI Al-Hasani.',
  ];
  const documents = [
    {
      name: 'Kartu Keluarga (KK)',
      desc: 'Scan/foto kartu keluarga yang masih berlaku',
      format: 'JPG, PNG, atau PDF',
      maxSize: 'Maks. 2MB',
    },
    {
      name: 'Akta Kelahiran',
      desc: 'Scan/foto akta kelahiran calon peserta didik',
      format: 'JPG, PNG, atau PDF',
      maxSize: 'Maks. 2MB',
    },
    {
      name: 'KTP Orang Tua',
      desc: 'Scan/foto KTP orang tua / wali murid',
      format: 'JPG, PNG, atau PDF',
      maxSize: 'Maks. 2MB',
    },
    {
      name: 'Ijazah TK / PAUD (Opsional)',
      desc: 'Scan/foto ijazah bagi yang telah lulus TK/PAUD',
      format: 'JPG, PNG, atau PDF',
      maxSize: 'Maks. 2MB',
    },
  ];

  const brochureImages = settings?.brochure_images || [];
  const primaryBrochure = brochureImages.length > 0 ? getImageUrl(brochureImages[0]) : '/logo.png';
  const downloadUrl = primaryBrochure.replace('/api/media/', '/api/media/download/');
  const isPdf = primaryBrochure.toLowerCase().endsWith('.pdf');

  const handleDownloadAll = async () => {
    for (let i = 0; i < brochureImages.length; i++) {
      const filename = brochureImages[i];
      const url = getImageUrl(filename).replace('/api/media/', '/api/media/download/');
      
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
        }, 1000);
      } catch (err) {
        window.open(url, '_blank');
      }

      // Delay between starting downloads
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-20 font-poppins relative">
      <SEO title="PPDB (Pendaftaran Siswa Baru)" />
      
      {/* Background Decorative Pattern */}
      <PPDBStatusModal onStatusChange={setIsPpdbOpen} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-700 to-teal-800 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
          {/* Geometric patterns */}
          <svg className="absolute top-10 right-10 w-32 h-32 text-white/5" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Penerimaan Peserta
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                Didik Baru (PPDB)
              </span>
            </h1>
            <p className="text-lg md:text-xl text-teal-100/80 max-w-2xl mx-auto">
              MI Al-Hasani membuka pendaftaran siswa baru. Mari bergabung
              dalam keluarga besar MI Al-Hasani untuk pendidikan yang berkualitas dan Islami.
            </p>
          </motion.div>

        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Main Content - Grid & CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Visual Preview Cards */}
        {/* 3D Brochure Showcase Banner */}
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-teal-800 via-teal-900 to-emerald-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative mb-16 border border-teal-700/50">
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="flex flex-col md:flex-row items-center relative z-10">
            {/* Left: Copywriting */}
            <div className="w-full md:w-1/2 p-10 md:p-16 text-center md:text-left flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-700/50 text-teal-200 border border-teal-600/50 w-fit mx-auto md:mx-0 mb-6 text-sm font-semibold shadow-inner">
                <BookOpen size={16} /> Dokumen Resmi
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-serif">
                Pelajari Brosur <span className="text-yellow-400">MI Al-Hasani</span>
              </h2>
              <p className="text-teal-100/90 text-lg mb-10 leading-relaxed font-medium">
                Temukan informasi lebih detail mengenai program unggulan, ekstrakurikuler, dan fasilitas terbaik yang kami sediakan untuk mencetak generasi Qur'ani.
              </p>
              
              <button
                onClick={() => setIsBrochureOpen(true)}
                className="group inline-flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-teal-950 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-yellow-400/30 hover:-translate-y-1 w-full md:w-fit text-lg"
              >
                <BookOpen size={22} />
                Lihat Brosur Sekarang
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right: Floating 3D Brochure */}
            <div className="w-full md:w-1/2 p-10 pt-0 md:pt-10 flex justify-center items-center" style={{ perspective: '1200px' }}>
              <button
                onClick={() => setIsBrochureOpen(true)}
                className="relative group transition-all duration-500 hover:scale-105 cursor-pointer z-20"
                style={{
                  transform: 'rotateY(-15deg) rotateX(8deg) rotateZ(-3deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 3D Drop Shadow */}
                <div className="absolute inset-0 bg-black/50 blur-3xl translate-y-8 -translate-x-8 rounded-2xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Image Container */}
                <div className="relative border-[8px] border-white rounded-2xl overflow-hidden shadow-2xl bg-white w-64 md:w-72 lg:w-80 group-hover:border-teal-50 transition-colors duration-300">
                  {!isPdf ? (
                    <img 
                      src={primaryBrochure} 
                      alt="Brosur Sekolah" 
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[1/1.4] bg-gray-100 flex flex-col items-center justify-center">
                      <FileText size={64} className="text-teal-600 mb-2" />
                      <span className="text-sm font-bold text-gray-500">PDF Brosur</span>
                    </div>
                  )}
                  {/* Glass Reflection Animation */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] ease-in-out"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Alur & Persetujuan */}
        <div className="max-w-3xl mx-auto flex flex-col gap-8 mb-8">
          {/* Alur Pendaftaran Premium Card */}
          <button
            onClick={() => setIsAlurOpen(true)}
            className="relative h-64 rounded-3xl overflow-hidden shadow-lg group cursor-pointer border border-teal-600 block w-full text-center"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 z-0" />
            
            {/* Abstract Patterns */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl" />
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 rounded-full bg-teal-500/30 backdrop-blur-md border border-teal-400/50 flex items-center justify-center text-white mb-4 group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ClipboardList size={32} />
              </div>
              <h3 className="font-bold text-white text-2xl tracking-wide mb-2 group-hover:-translate-y-2 transition-transform duration-300">
                ALUR & PERSYARATAN PPDB
              </h3>
              <p className="text-teal-100 text-base font-medium opacity-80 group-hover:opacity-100 transition-all duration-300">
                Pelajari langkah pendaftaran selengkapnya di sini
              </p>
            </div>
          </button>

          {/* Agreement & CTA */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-teal-50 via-white to-ivory-100 border-2 border-teal-200/60 shadow-sm w-full">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
              <Shield size={22} className="text-teal-600" />
              Persetujuan Pendaftaran
            </h3>

            <button
              onClick={() => setAgreed(!agreed)}
              className="flex items-start gap-4 text-left w-full group cursor-pointer p-4 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-teal-100"
            >
              <div className="flex-shrink-0 mt-1">
                {agreed ? (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md scale-110 transition-transform">
                    <CheckCircle2 size={18} className="text-white" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg border-2 border-gray-300 group-hover:border-teal-400 transition-colors flex items-center justify-center">
                    <Square size={14} className="text-transparent" />
                  </div>
                )}
              </div>
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                Saya telah membaca dan memahami <strong className="text-teal-700">persyaratan dokumen</strong> serta{' '}
                <strong className="text-teal-700">alur pendaftaran</strong> yang berlaku.
                Saya menyatakan bahwa data yang akan saya berikan adalah benar dan dapat dipertanggungjawabkan.
              </p>
            </button>

            <button
              onClick={() => {
                if (agreed && isPpdbOpen) navigate('/ppdb/daftar');
              }}
              disabled={!agreed || !isPpdbOpen}
              className={`mt-6 w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                agreed && isPpdbOpen
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-xl shadow-teal-600/30 hover:shadow-2xl hover:shadow-teal-600/40 hover:-translate-y-1 cursor-pointer'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <ClipboardList size={24} />
              {isPpdbOpen ? 'Mulai Isi Formulir Pendaftaran' : 'Pendaftaran Ditutup'}
              {isPpdbOpen && <ArrowRight size={22} className={agreed ? 'animate-bounce-x' : ''} />}
            </button>
          </div>
        </div>
      </section>

      {/* Brochure Modal â€” Ultra Clean */}
      <AnimatePresence>
        {isBrochureOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md"
            onClick={() => setIsBrochureOpen(false)}
          >
            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl flex flex-col gap-4 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {brochureImages.length > 0 ? (
                brochureImages.map((filename, idx) => {
                  const url = getImageUrl(filename);
                  const isItemPdf = filename.toLowerCase().endsWith('.pdf');
                  return isItemPdf ? (
                    <div key={idx} className="w-full h-[65vh] bg-gray-100 flex items-center justify-center relative rounded-xl overflow-hidden shrink-0 group">
                      <iframe 
                        src={url} 
                        className="w-full h-full border-none"
                        title={`Brosur PPDB ${idx + 1}`}
                      />
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const downloadUrl = url.replace('/api/media/', '/api/media/download/');
                          try {
                            const res = await fetch(downloadUrl);
                            const blob = await res.blob();
                            const blobUrl = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = blobUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(() => {
                              document.body.removeChild(a);
                              window.URL.revokeObjectURL(blobUrl);
                            }, 1000);
                          } catch (err) {
                            window.open(downloadUrl, '_blank');
                          }
                        }}
                        className="absolute top-4 right-6 bg-black/40 hover:bg-teal-600 text-white p-2.5 rounded-full backdrop-blur-sm transition-colors shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        title={`Unduh PDF ${idx + 1}`}
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  ) : (
                    <div key={idx} className="relative rounded-xl overflow-hidden shrink-0 group">
                      <img
                        src={url}
                        alt={`Brosur MI Al-Hasani ${idx + 1}`}
                        className="w-full h-auto block"
                        onError={() => setImgError(true)}
                      />
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const downloadUrl = url.replace('/api/media/', '/api/media/download/');
                          try {
                            const res = await fetch(downloadUrl);
                            const blob = await res.blob();
                            const blobUrl = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = blobUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(() => {
                              document.body.removeChild(a);
                              window.URL.revokeObjectURL(blobUrl);
                            }, 1000);
                          } catch (err) {
                            window.open(downloadUrl, '_blank');
                          }
                        }}
                        className="absolute top-4 right-4 bg-black/40 hover:bg-teal-600 text-white p-2.5 rounded-full backdrop-blur-sm transition-colors shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        title={`Unduh Brosur ${idx + 1}`}
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  );
                })
              ) : !imgError ? (
                <img
                  src={primaryBrochure}
                  alt="Brosur MI Al-Hasani"
                  className="w-full h-auto block rounded-xl shrink-0"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 rounded-2xl flex flex-col items-center justify-center text-white p-12">
                  <GraduationCap size={56} className="text-yellow-400 mb-5" />
                  <h3 className="text-2xl font-bold mb-1">MI AL-HASANI</h3>
                  <p className="text-teal-200 text-sm">Brosur PPDB 2026/2027</p>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="flex items-center gap-3 mt-5"
              onClick={(e) => e.stopPropagation()}
            >
              {brochureImages.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  <Download size={15} />
                  {brochureImages.length > 1 ? 'Unduh Semua Brosur' : 'Unduh Brosur'}
                </button>
              )}              <button
                onClick={() => setIsBrochureOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm"
              >
                <X size={15} />
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alur Pendaftaran Modal */}
      <AnimatePresence>
        {isAlurOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md"
            onClick={() => setIsAlurOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-900">Alur & Persyaratan</h3>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                  <ClipboardList size={18} />
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="font-bold text-teal-700 text-sm mb-4 flex items-center gap-2 border-b border-teal-100 pb-2">
                  <UserCheck size={16} /> Syarat Umum Pendaftaran
                </h4>
                <ul className="space-y-3">
                  {generalRequirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <div className="mt-0.5 flex-shrink-0 text-teal-500">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h4 className="font-bold text-teal-700 text-sm mb-4 flex items-center gap-2 border-b border-teal-100 pb-2">
                  <Upload size={16} /> Persyaratan Dokumen
                </h4>
                <div className="space-y-4">
                  {documents.map((doc, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <h4 className="font-bold text-gray-900 text-sm">{doc.name}</h4>
                      <p className="text-gray-500 text-xs mt-1 mb-3">{doc.desc}</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-medium text-gray-600">
                          {doc.format}
                        </span>
                        <span className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-medium text-gray-600">
                          {doc.maxSize}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-teal-700 text-sm mb-4 flex items-center gap-2 border-b border-teal-100 pb-2">
                  <ClipboardList size={16} /> Alur Pendaftaran
                </h4>
                <div className="space-y-6">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="text-gray-400 font-bold text-sm mt-0.5">{step.number}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-5"
            >
              <button
                onClick={() => setIsAlurOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm"
              >
                <X size={15} />
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS for bounce-x animation */}
      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

