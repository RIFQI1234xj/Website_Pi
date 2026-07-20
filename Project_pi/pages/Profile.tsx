import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import { 
  Building, 
  BookOpen, 
  Monitor, 
  HeartPulse, 
  Coffee, 
  Trophy, 
  MapPin, 
  CheckCircle,
  History,
  Target,
  Users,
  ArrowDown,
  User,
  Phone,
  Mail,
  Info,
  Loader2
} from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { apiFetch, getImageUrl, setImageFallback } from '../lib/api';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { ensureUrl, getAddressWithPostalCode } from '../lib/schoolSettings';

const isTeacherActive = (teacher: Teacher) => {
    if (teacher.is_active === false || teacher.is_active === 0 || String(teacher.is_active) === '0' || String(teacher.is_active) === 'false') {
        return false;
    }
    return true;
};

const getTeacherInitialsAvatar = (name: string): string => {
  const cleanName = name
    .replace(/(S\.Pd\.I|S\.Pd|S\.Ag|M\.Pd|Drs\.|Dr\.|Hj\.|H\.)/g, '')
    .trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2 
    ? `${parts[0][0]}${parts[1][0]}` 
    : parts[0] ? parts[0].slice(0, 2) : 'GA';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f766e" />
        <stop offset="100%" stop-color="#115e59" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" rx="150" fill="url(#avatarGrad)" />
    <circle cx="150" cy="115" r="55" fill="rgba(255, 255, 255, 0.22)" />
    <path d="M 50,260 C 50,195 95,180 150,180 C 205,180 250,195 250,260 Z" fill="rgba(255, 255, 255, 0.22)" />
    <text x="50%" y="46%" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="68" font-weight="700" letter-spacing="2">${initials.toUpperCase()}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

interface ProfileProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ activeTab }) => {
  const { settings } = useSchoolSettings();
  
  // State untuk menyimpan data guru dari database
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState<boolean>(true);
  const [teachersError, setTeachersError] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showAllTeachers, setShowAllTeachers] = useState<boolean>(false);

  // Mengambil data Guru dari API Laravel
  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoadingTeachers(true);
      setTeachersError(null);

      try {
        const hasil = await apiFetch('/teachers');
        if (hasil.success) {
          const formattedTeachers = hasil.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            role: item.role,
            subject: item.subject,
            image: getImageUrl(item.image),
            is_active: item.is_active,
          }));
          setTeachersData(formattedTeachers);
        }
      } catch (error) {
        console.error('Gagal mengambil data guru:', error);
        setTeachersError('Data guru belum dapat dimuat saat ini.');
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  const facilities = [
    { name: "Gedung Representatif", icon: Building, desc: "Gedung sekolah 2 lantai dengan arsitektur modern dan lingkungan asri." },
    { name: "Masjid Sekolah", icon: Building, desc: "Pusat kegiatan ibadah siswa, shalat Dhuha dan Zhuhur berjamaah." },
    { name: "Perpustakaan", icon: BookOpen, desc: "Koleksi buku lengkap, nyaman untuk membaca dan belajar mandiri." },
    { name: "Lab Komputer", icon: Monitor, desc: "Dilengkapi komputer spesifikasi terbaru dan akses internet untuk ANBK." },
    { name: "UKS", icon: HeartPulse, desc: "Ruang kesehatan dengan peralatan P3K lengkap dan tempat istirahat." },
    { name: "Kantin Sehat", icon: Coffee, desc: "Menyediakan jajanan sehat, halal, dan higienis bagi warga sekolah." },
    { name: "Lapangan Serbaguna", icon: Trophy, desc: "Lapangan luas untuk upacara, olahraga, dan kegiatan ekstrakurikuler." },
  ];

  // Auto-scroll saat pindah tab dari Navbar
  useEffect(() => {
    if (activeTab) {
      const element = document.getElementById(activeTab);
      if (element) {
        setTimeout(() => {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [activeTab]);

  return (
    <div className="bg-ivory-50 min-h-screen animate-fade-in">
      
      {/* ================= IDENTITAS SECTION ================= */}
      <section id="identitas" className="relative w-full bg-teal-700 pt-32 pb-32 px-4 text-center text-white shadow-md">
          <div className="absolute inset-0 overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          <AnimatedSection animation="slideUp" className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-teal-50 mb-4 cursor-default">
                  <Building size={14} className="text-teal-200" /> Profil Institusi
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-3 tracking-tight">Identitas Sekolah</h2>
              <p className="text-teal-100/80 text-sm md:text-base font-medium max-w-2xl mx-auto">Profil lengkap MI Al-Hasani</p>
              <div className="mt-8 flex flex-col items-center gap-2 text-[10px] text-teal-200/60 uppercase tracking-widest font-semibold animate-bounce">
                  <span>Scroll untuk melanjutkan</span>
                  <ArrowDown size={14} />
              </div>
          </AnimatedSection>
      </section>

      {/* ================= IDENTITAS CARD ================= */}
      <AnimatedSection animation="slideUp" delay={0.2} className="max-w-5xl mx-auto px-4 relative z-20 -mt-20 mb-24">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-teal-600 p-6 flex items-center gap-5 border-b border-teal-700">
                  <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-sm shadow-inner">
                      <Building size={28} className="text-white/90" />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{settings.school_name}</h3>
                      <p className="text-xs text-teal-100/80 font-mono mt-1.5 tracking-wide">NPSN: {settings.npsn || '-'}</p>
                  </div>
              </div>

              <div className="p-8 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                      <div className="space-y-8">
                          <div className="flex gap-5 group">
                              <div className="text-teal-600 mt-1 shrink-0"><User size={20} strokeWidth={2} /></div>
                              <div>
                                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">KEPALA SEKOLAH</p>
                                  <p className="font-bold text-gray-800 text-base md:text-lg leading-tight">Eneng Heti Nurhayati, S.Pd.I</p>
                              </div>
                          </div>
                          <div className="flex gap-5 group">
                              <div className="text-teal-600 mt-1 shrink-0"><Phone size={20} strokeWidth={2} /></div>
                              <div>
                                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">KONTAK</p>
                                  <p className="font-bold text-gray-800 text-base md:text-lg leading-tight mb-0.5">{settings.phone || 'Belum tersedia'}</p>
                              </div>
                          </div>
                           <div className="flex gap-5 group">
                              <div className="text-teal-600 mt-1 shrink-0"><Mail size={20} strokeWidth={2} /></div>
                              <div>
                                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">EMAIL & WEBSITE</p>
                                  <p className="font-bold text-gray-800 text-base md:text-lg leading-tight mb-0.5">{settings.email || 'Belum tersedia'}</p>
                                  {settings.website ? (
                                    <a
                                      href={ensureUrl(settings.website) || undefined}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs text-teal-600 font-bold hover:underline block mt-1"
                                    >
                                      {settings.website}
                                    </a>
                                  ) : (
                                    <p className="text-xs text-gray-500 font-medium block mt-1">Website belum tersedia.</p>
                                  )}
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-5 h-full">
                          <div className="text-teal-600 mt-1 shrink-0"><MapPin size={20} strokeWidth={2} /></div>
                          <div className="flex flex-col h-full w-full">
                              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">ALAMAT LENGKAP</p>
                              <p className="text-gray-700 leading-relaxed text-sm font-medium mb-6 border-l-2 border-gray-100 pl-4 whitespace-pre-line">
                                {getAddressWithPostalCode(settings)}
                              </p>
                          </div>
                      </div>
                  </div>

                  <hr className="my-10 border-gray-100" />
                  <div>
                      <div className="flex items-center gap-2 mb-5 text-teal-600 font-bold text-sm uppercase tracking-wide">
                           <Info size={18} /> Informasi Tambahan
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div className="bg-gray-50 p-5 rounded border border-gray-100 hover:border-teal-200 transition-colors">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">STATUS SEKOLAH</p>
                              <p className="font-bold text-gray-800 text-lg">{settings.school_status || '-'}</p>
                          </div>
                          <div className="bg-gray-50 p-5 rounded border border-gray-100 hover:border-teal-200 transition-colors">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">AKREDITASI</p>
                              <p className="font-bold text-gray-800 text-lg">{settings.accreditation || '-'}</p>
                          </div>
                          <div className="bg-gray-50 p-5 rounded border border-gray-100 hover:border-teal-200 transition-colors">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">TAHUN BERDIRI</p>
                              <p className="font-bold text-gray-800 text-lg">{settings.established_year || '-'}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </AnimatedSection>

      {/* ================= SEJARAH SECTION ================= */}
      <section id="sejarah" className="relative w-full bg-teal-700 py-24 px-4 text-center text-white shadow-md scroll-mt-0">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>
            <AnimatedSection animation="slideUp" className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-teal-50 mb-4 cursor-default">
                  <History size={14} className="text-teal-200" /> Latar Belakang
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-3 tracking-tight">Sejarah & Visi Misi</h2>
                <p className="text-teal-100/80 text-sm md:text-base font-medium max-w-2xl mx-auto">Jejak Perjalanan Pendidikan dari Masa ke Masa</p>
            </AnimatedSection>
      </section>

      {/* ================= SEJARAH CARD ================= */}
      <AnimatedSection animation="slideUp" delay={0.2} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
         <div className="-mt-16 relative z-10 bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 mb-24">
                <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed text-justify mb-12">
                      <p className="mb-6 first-letter:text-6xl first-letter:font-bold first-letter:text-teal-800 first-letter:mr-4 first-letter:float-left first-letter:leading-none">
                          Berdiri sejak tahun 1995, MI Al-Hasani didirikan oleh Yayasan Pendidikan Islam dengan tujuan menyediakan pendidikan dasar berkualitas yang mengintegrasikan kurikulum nasional dengan nilai-nilai keislaman yang kaffah. 
                      </p>
                      <p className="mb-4">
                          Bermula dari sebuah bangunan sederhana dengan tiga ruang kelas dan puluhan siswa, kini MI Al-Hasani telah berkembang pesat menjadi salah satu madrasah favorit di wilayah ini. Dukungan masyarakat dan dedikasi para pendiri menjadi fondasi kuat bagi kemajuan sekolah.
                      </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-8 border-t-4 border-teal-600 shadow-lg transform hover:-translate-y-1 transition duration-300 flex flex-col">
                      <h3 className="text-2xl font-bold text-teal-800 mb-6 flex items-center justify-center border-b pb-4">
                          <Target className="mr-2 text-teal-600" /> Visi
                      </h3>
                      <div className="flex-grow flex items-center justify-center">
                        <p className="text-center text-gray-800 text-xl italic font-serif font-medium leading-relaxed px-4">
                            "Terwujudnya peserta didik yang beriman, cerdas, terampil, dan berwawasan lingkungan."
                        </p>
                      </div>
                  </div>
                  <div className="bg-white rounded-xl p-8 border-t-4 border-yellow-400 shadow-lg transform hover:-translate-y-1 transition duration-300">
                      <h3 className="text-2xl font-bold text-teal-800 mb-6 flex items-center justify-center border-b pb-4">
                          <CheckCircle className="mr-2 text-yellow-400" /> Misi
                      </h3>
                      <ul className="space-y-4 text-gray-700">
                          <li className="flex items-start">
                              <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 shadow-sm">1</span>
                              <span className="leading-relaxed pt-1">Menanamkan keimanan dan ketakwaan melalui pengamalan ajaran Islam sehari-hari.</span>
                          </li>
                          <li className="flex items-start">
                              <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 shadow-sm">2</span>
                              <span className="leading-relaxed pt-1">Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan.</span>
                          </li>
                          <li className="flex items-start">
                              <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 shadow-sm">3</span>
                              <span className="leading-relaxed pt-1">Mengembangkan bakat dan minat siswa melalui kegiatan ekstrakurikuler yang beragam.</span>
                          </li>
                      </ul>
                  </div>
              </div>
         </div>
      </AnimatedSection>

        {/* ================= GURU SECTION ================= */}
        <section id="guru" className="relative w-full bg-teal-700 py-24 px-4 text-center text-white shadow-md scroll-mt-0">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2"></div>
            </div>
            <AnimatedSection animation="slideUp" className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-teal-50 mb-4 cursor-default">
                  <Users size={14} className="text-teal-200" /> SDM Unggul
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-2 tracking-tight">Guru & Staff</h2>
                <p className="text-teal-100/80 text-sm md:text-base font-medium max-w-2xl mx-auto">Pendidik Profesional dan Berdedikasi</p>
            </AnimatedSection>
        </section>

        {/* ================= GURU CONTENT (Dinamis dari Database) ================= */}
        <AnimatedSection animation="slideUp" delay={0.2} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
           <div className="-mt-16 relative z-10 mb-24">
               <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 min-h-[300px]">
                   
                   {/* Indikator Loading */}
                   {isLoadingTeachers ? (
                      <div className="flex flex-col items-center justify-center py-20 text-teal-600">
                         <Loader2 size={48} className="animate-spin mb-4" />
                         <p className="text-lg font-medium">Memuat data guru dari server...</p>
                      </div>
                   ) : teachersError ? (
                      <div className="text-center py-20 text-gray-500">
                          <Users size={48} className="mx-auto mb-4 text-gray-300" />
                          <p className="font-semibold text-gray-700 mb-2">Data Guru Belum Bisa Dimuat</p>
                          <p>{teachersError}</p>
                      </div>
                   ) : teachersData.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                                {(showAllTeachers ? teachersData : teachersData.slice(0, 6)).map((teacher, index) => {
                                const isPlaceholder = !teacher.image || teacher.image.includes('galeri-') || teacher.image.includes('picsum.photos');
                                const initialAvatar = getTeacherInitialsAvatar(teacher.name);
                                const photoSrc = isPlaceholder ? initialAvatar : teacher.image;

                                return (
                                    <AnimatedSection 
                                        key={teacher.id} 
                                        animation="slideUp" 
                                        delay={index * 0.08} 
                                        className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col items-center text-center pb-6 cursor-pointer"
                                        onClick={() => setSelectedTeacher(teacher)}
                                    >
                                        {/* Light blue header with Aktif/Tidak Aktif badge */}
                                        <div className="w-full h-28 bg-[#e6f0fa] relative">
                                            {isTeacherActive(teacher) ? (
                                                <span className="absolute top-3 right-3 px-3 py-1 bg-[#22c55e] text-white text-[11px] font-bold rounded-full shadow-sm tracking-wide">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="absolute top-3 right-3 px-3 py-1 bg-[#ef4444] text-white text-[11px] font-bold rounded-full shadow-sm tracking-wide">
                                                    Tidak Aktif
                                                </span>
                                            )}
                                        </div>

                                        {/* Overlapping Floating Avatar Circle */}
                                        <div className="-mt-14 mb-3 relative z-10">
                                            <div className="w-28 h-28 rounded-full p-[3px] bg-white shadow-sm mx-auto group-hover:scale-105 transition-transform duration-300">
                                                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative">
                                                    <img 
                                                        src={photoSrc} 
                                                        alt={teacher.name} 
                                                        className="w-full h-full object-cover object-top" 
                                                        onError={(e) => {
                                                            e.currentTarget.src = initialAvatar;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Teacher Details */}
                                        <div className="px-5 flex flex-col items-center flex-1 justify-between w-full">
                                            <div>
                                                <h4 className="font-bold text-[#334155] text-lg mb-1 leading-snug tracking-tight">{teacher.name}</h4>
                                                <div className="my-1">
                                                    {teacher.subject && (
                                                        <span className="text-[#3b82f6] text-sm font-medium">
                                                            {teacher.subject}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                className="mt-4 px-6 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-bold rounded-full transition-colors w-max"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTeacher(teacher);
                                                }}
                                            >
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </AnimatedSection>
                                );
                            })}
                            </div>
                            
                            {/* Tombol Lihat Semua Guru */}
                            {teachersData.length > 6 && (
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={() => setShowAllTeachers(!showAllTeachers)}
                                        className="px-8 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm flex items-center gap-2"
                                    >
                                        {showAllTeachers ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Guru (${teachersData.length})`}
                                    </button>
                                </div>
                            )}
                        </>
                   ) : (
                      <div className="text-center py-20 text-gray-500">
                          <Users size={48} className="mx-auto mb-4 text-gray-300" />
                          <p>Data guru belum tersedia.</p>
                      </div>
                   )}

               </div>
            </div>
        </AnimatedSection>

        {/* ================= FASILITAS SECTION ================= */}
        <section id="fasilitas" className="relative w-full bg-teal-700 py-24 px-4 text-center text-white shadow-md scroll-mt-0">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-0 left-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>
            <AnimatedSection animation="slideUp" className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-teal-50 mb-4 cursor-default">
                  <Monitor size={14} className="text-teal-200" /> Infrastruktur
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-2 tracking-tight">Sarana & Prasarana</h2>
                <p className="text-teal-100/80 text-sm md:text-base font-medium max-w-2xl mx-auto">Fasilitas Penunjang Pembelajaran Modern</p>
            </AnimatedSection>
        </section>

        {/* ================= FASILITAS CARD ================= */}
        <AnimatedSection animation="slideUp" delay={0.2} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
           <div className="-mt-16 relative z-10">
               <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((fas, idx) => (
                            <AnimatedSection key={idx} animation="slideUp" delay={idx * 0.1} className="bg-white border border-gray-100 hover:border-teal-400 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group h-full">
                                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <fas.icon size={36} />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-xl mb-3">{fas.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{fas.desc}</p>
                            </AnimatedSection>
                        ))}
                    </div>
               </div>
            </div>
        </AnimatedSection>

        {/* ================= TEACHER MODAL ================= */}
        {selectedTeacher && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTeacher(null)}>
                <div 
                    className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedTeacher(null)} 
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur border border-slate-100 text-slate-400 hover:text-slate-600 rounded-full shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>

                    {/* Modal Left Panel (Details) */}
                    <div className="p-8 md:w-1/2 flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-100">
                                <img 
                                    src={!selectedTeacher.image || selectedTeacher.image.includes('galeri-') || selectedTeacher.image.includes('picsum.photos') ? getTeacherInitialsAvatar(selectedTeacher.name) : selectedTeacher.image} 
                                    alt={selectedTeacher.name} 
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => e.currentTarget.src = getTeacherInitialsAvatar(selectedTeacher.name)}
                                />
                            </div>
                            <div>
                                                <h3 className="font-bold text-[#1e293b] text-lg leading-tight mb-0.5">{selectedTeacher.name}</h3>
                                                <p className={`text-sm font-semibold ${isTeacherActive(selectedTeacher) ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                                    Status: {isTeacherActive(selectedTeacher) ? 'Aktif' : 'Tidak Aktif'}
                                                </p>
                                            </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-4 uppercase">Informasi Pribadi</h4>
                        
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                                <span className="text-slate-500">Jenis Kelamin</span>
                                <span className="text-slate-700 font-medium">{selectedTeacher.name.includes('S.Pd.I') || selectedTeacher.name.includes('S.Ag') || selectedTeacher.name.includes('Aminah') || selectedTeacher.name.includes('Wati') || selectedTeacher.name.includes('Sartika') || selectedTeacher.name.includes('Nurhayati') ? 'Perempuan' : 'Laki-laki'}</span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                                                <span className="text-slate-500">Status</span>
                                                <span className={isTeacherActive(selectedTeacher) ? 'text-[#16a34a] font-bold' : 'text-[#dc2626] font-bold'}>
                                                    {isTeacherActive(selectedTeacher) ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                                <span className="text-slate-500">Jabatan</span>
                                <span className="text-slate-700 font-medium">{selectedTeacher.role}</span>
                            </div>
                            {selectedTeacher.subject && (
                                <div className="grid grid-cols-[120px_1fr] gap-2">
                                    <span className="text-slate-500">Mapel</span>
                                    <span className="text-slate-700 font-medium">{selectedTeacher.subject}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal Right Panel (Large Photo) */}
                    <div className="bg-slate-50 p-8 md:w-1/2 flex flex-col items-center justify-center border-l border-slate-100">
                        <div className="w-full aspect-[3/4] max-w-[220px] rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100">
                            <img 
                                src={!selectedTeacher.image || selectedTeacher.image.includes('galeri-') || selectedTeacher.image.includes('picsum.photos') ? getTeacherInitialsAvatar(selectedTeacher.name) : selectedTeacher.image} 
                                alt={selectedTeacher.name} 
                                className="w-full h-full object-cover object-top"
                                onError={(e) => e.currentTarget.src = getTeacherInitialsAvatar(selectedTeacher.name)}
                            />
                        </div>
                        <div className={`mt-5 px-6 py-1.5 text-sm font-bold rounded-full shadow-sm ${isTeacherActive(selectedTeacher) ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                            Status: {isTeacherActive(selectedTeacher) ? 'Aktif' : 'Tidak Aktif'}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
