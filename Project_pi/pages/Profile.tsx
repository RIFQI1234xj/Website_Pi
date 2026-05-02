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
  Map,
  Info,
  Loader2
} from 'lucide-react';

interface ProfileProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ activeTab, setActiveTab }) => {
  
  // State untuk menyimpan data guru dari database
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState<boolean>(true);

  // Mengambil data Guru dari API Laravel
  useEffect(() => {
    setIsLoadingTeachers(true);
    fetch('http://127.0.0.1:8000/api/teachers')
      .then(response => response.json())
      .then(hasil => {
        if (hasil.success) {
          // Sesuaikan format data dari database dengan tipe data React
          const formattedTeachers = hasil.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            role: item.role,
            subject: item.subject,
            // Mengarahkan ke folder public/images tempat kamu menyimpan foto
            image: `/images/${item.image}` 
          }));
          setTeachersData(formattedTeachers);
        }
      })
      .catch(error => console.error("Gagal mengambil data guru: ", error))
      .finally(() => setIsLoadingTeachers(false));
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
    <div className="bg-gray-50 min-h-screen animate-fade-in">
      
      {/* ================= IDENTITAS SECTION ================= */}
      <section id="identitas" className="relative w-full bg-[#0f4c3a] pt-32 pb-32 px-4 text-center text-white shadow-md">
          <div className="absolute inset-0 overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-emerald-50 mb-4 cursor-default">
                  <Building size={14} className="text-emerald-200" /> Profil Institusi
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-3 tracking-tight">Identitas Sekolah</h2>
              <p className="text-emerald-100/80 text-sm md:text-base font-medium max-w-2xl mx-auto">Profil lengkap MI Al-Hasani</p>
              <div className="mt-8 flex flex-col items-center gap-2 text-[10px] text-emerald-200/60 uppercase tracking-widest font-semibold animate-bounce">
                  <span>Scroll untuk melanjutkan</span>
                  <ArrowDown size={14} />
              </div>
          </div>
      </section>

      {/* ================= IDENTITAS CARD ================= */}
      <div className="max-w-5xl mx-auto px-4 relative z-20 -mt-20 mb-24">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-[#115e59] p-6 flex items-center gap-5 border-b border-[#0f4c3a]">
                  <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-sm shadow-inner">
                      <Building size={28} className="text-white/90" />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">MI Al-Hasani</h3>
                      <p className="text-xs text-emerald-100/80 font-mono mt-1.5 tracking-wide">NPSN: 60706775</p>
                  </div>
              </div>

              <div className="p-8 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                      <div className="space-y-8">
                          <div className="flex gap-5 group">
                              <div className="text-[#115e59] mt-1 shrink-0"><User size={20} strokeWidth={2} /></div>
                              <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">KEPALA SEKOLAH</p>
                                  <p className="font-bold text-gray-800 text-base md:text-lg leading-tight">Eneng Heti Nurhayati, S.Pd.I</p>
                              </div>
                          </div>
                          <div className="flex gap-5 group">
                              <div className="text-[#115e59] mt-1 shrink-0"><Phone size={20} strokeWidth={2} /></div>
                              <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">KONTAK</p>
                                  <p className="font-bold text-gray-800 text-base md:text-lg leading-tight mb-0.5">(0251) 8256657</p>
                              </div>
                          </div>
                           <div className="flex gap-5 group">
                              <div className="text-[#115e59] mt-1 shrink-0"><Mail size={20} strokeWidth={2} /></div>
                              <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">EMAIL & WEBSITE</p>
                                  <p className="font-bold text-gray-800 text-base md:text-lg leading-tight mb-0.5">misalhasani@gmail.com</p>
                                  <a href="#" className="text-xs text-[#115e59] font-bold hover:underline block mt-1">https://mialhasani.sch.id</a>
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-5 h-full">
                          <div className="text-[#115e59] mt-1 shrink-0"><MapPin size={20} strokeWidth={2} /></div>
                          <div className="flex flex-col h-full w-full">
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">ALAMAT LENGKAP</p>
                              <p className="text-gray-700 leading-relaxed text-sm font-medium mb-6 border-l-2 border-gray-100 pl-4">
                                Jl. Kp. Babakansirna 02/02<br/>
                                Ds. Jogjogan, Kec. Cisarua<br/>
                                Kab. Bogor, Jawa Barat<br/>
                                Kode Pos: 16750
                              </p>
                              <div className="mt-auto">
                                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded border border-[#115e59] text-[#115e59] text-xs font-bold hover:bg-[#115e59] hover:text-white transition-all duration-300 uppercase tracking-wide">
                                    <Map size={14}/> Lihat di Peta
                                </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  <hr className="my-10 border-gray-100" />
                  <div>
                      <div className="flex items-center gap-2 mb-5 text-[#115e59] font-bold text-sm uppercase tracking-wide">
                           <Info size={18} /> Informasi Tambahan
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div className="bg-gray-50 p-5 rounded border border-gray-100 hover:border-emerald-200 transition-colors">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">STATUS SEKOLAH</p>
                              <p className="font-bold text-gray-800 text-lg">Swasta</p>
                          </div>
                          <div className="bg-gray-50 p-5 rounded border border-gray-100 hover:border-emerald-200 transition-colors">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">AKREDITASI</p>
                              <p className="font-bold text-gray-800 text-lg">B</p>
                          </div>
                          <div className="bg-gray-50 p-5 rounded border border-gray-100 hover:border-emerald-200 transition-colors">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">TAHUN BERDIRI</p>
                              <p className="font-bold text-gray-800 text-lg">1995</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* ================= SEJARAH SECTION ================= */}
      <section id="sejarah" className="relative w-full bg-[#0f4c3a] py-24 px-4 text-center text-white shadow-md scroll-mt-0">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-emerald-50 mb-4 cursor-default">
                  <History size={14} className="text-emerald-200" /> Latar Belakang
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-3 tracking-tight">Sejarah & Visi Misi</h2>
                <p className="text-emerald-100/80 text-sm md:text-base font-medium max-w-2xl mx-auto">Jejak Perjalanan Pendidikan dari Masa ke Masa</p>
            </div>
      </section>

      {/* ================= SEJARAH CARD ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
         <div className="-mt-16 relative z-10 bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 mb-24">
                <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed text-justify mb-12">
                      <p className="mb-6 first-letter:text-6xl first-letter:font-bold first-letter:text-emerald-800 first-letter:mr-4 first-letter:float-left first-letter:leading-none">
                          Berdiri sejak tahun 1995, MI Al-Hasani didirikan oleh Yayasan Pendidikan Islam dengan tujuan menyediakan pendidikan dasar berkualitas yang mengintegrasikan kurikulum nasional dengan nilai-nilai keislaman yang kaffah. 
                      </p>
                      <p className="mb-4">
                          Bermula dari sebuah bangunan sederhana dengan tiga ruang kelas dan puluhan siswa, kini MI Al-Hasani telah berkembang pesat menjadi salah satu madrasah favorit di wilayah ini. Dukungan masyarakat dan dedikasi para pendiri menjadi fondasi kuat bagi kemajuan sekolah.
                      </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-8 border-t-4 border-emerald-600 shadow-lg transform hover:-translate-y-1 transition duration-300 flex flex-col">
                      <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center justify-center border-b pb-4">
                          <Target className="mr-2 text-emerald-600" /> Visi
                      </h3>
                      <div className="flex-grow flex items-center justify-center">
                        <p className="text-center text-gray-800 text-xl italic font-serif font-medium leading-relaxed px-4">
                            "Terwujudnya peserta didik yang beriman, cerdas, terampil, dan berwawasan lingkungan."
                        </p>
                      </div>
                  </div>
                  <div className="bg-white rounded-xl p-8 border-t-4 border-yellow-500 shadow-lg transform hover:-translate-y-1 transition duration-300">
                      <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center justify-center border-b pb-4">
                          <CheckCircle className="mr-2 text-yellow-500" /> Misi
                      </h3>
                      <ul className="space-y-4 text-gray-700">
                          <li className="flex items-start">
                              <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 shadow-sm">1</span>
                              <span className="leading-relaxed pt-1">Menanamkan keimanan dan ketakwaan melalui pengamalan ajaran Islam sehari-hari.</span>
                          </li>
                          <li className="flex items-start">
                              <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 shadow-sm">2</span>
                              <span className="leading-relaxed pt-1">Melaksanakan pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan.</span>
                          </li>
                          <li className="flex items-start">
                              <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 shadow-sm">3</span>
                              <span className="leading-relaxed pt-1">Mengembangkan bakat dan minat siswa melalui kegiatan ekstrakurikuler yang beragam.</span>
                          </li>
                      </ul>
                  </div>
              </div>
         </div>
      </div>

        {/* ================= GURU SECTION ================= */}
        <section id="guru" className="relative w-full bg-[#0f4c3a] py-24 px-4 text-center text-white shadow-md scroll-mt-0">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-emerald-50 mb-4 cursor-default">
                  <Users size={14} className="text-emerald-200" /> SDM Unggul
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-2 tracking-tight">Guru & Staff</h2>
                <p className="text-emerald-100/80 text-sm md:text-base font-medium max-w-2xl mx-auto">Pendidik Profesional dan Berdedikasi</p>
            </div>
        </section>

        {/* ================= GURU CONTENT (Dinamis dari Database) ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
           <div className="-mt-16 relative z-10 mb-24">
               <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 min-h-[300px]">
                   
                   {/* Indikator Loading */}
                   {isLoadingTeachers ? (
                      <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
                         <Loader2 size={48} className="animate-spin mb-4" />
                         <p className="text-lg font-medium">Memuat data guru dari server...</p>
                      </div>
                   ) : teachersData.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                          {teachersData.map((teacher) => (
                              <div key={teacher.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group h-full">
                                  <div className="w-32 h-32 rounded-full overflow-hidden mb-5 border-4 border-gray-50 shadow-inner relative">
                                      <img 
                                          src={teacher.image} 
                                          alt={teacher.name} 
                                          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500 filter grayscale group-hover:grayscale-0" 
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://picsum.photos/200/200?blur=2';
                                          }}
                                      />
                                  </div>
                                  <h4 className="font-bold text-gray-800 text-lg mb-1 leading-snug">{teacher.name}</h4>
                                  <p className="text-emerald-600 font-bold text-sm mb-2">{teacher.role}</p>
                                  {teacher.subject && (
                                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{teacher.subject}</p>
                                  )}
                              </div>
                          ))}
                      </div>
                   ) : (
                      <div className="text-center py-20 text-gray-500">
                          <Users size={48} className="mx-auto mb-4 text-gray-300" />
                          <p>Data guru belum tersedia.</p>
                      </div>
                   )}

               </div>
            </div>
        </div>

        {/* ================= FASILITAS SECTION ================= */}
        <section id="fasilitas" className="relative w-full bg-[#0f4c3a] py-24 px-4 text-center text-white shadow-md scroll-mt-0">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-emerald-50 mb-4 cursor-default">
                  <Monitor size={14} className="text-emerald-200" /> Infrastruktur
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-2 tracking-tight">Sarana & Prasarana</h2>
                <p className="text-emerald-100/80 text-sm md:text-base font-medium max-w-2xl mx-auto">Fasilitas Penunjang Pembelajaran Modern</p>
            </div>
        </section>

        {/* ================= FASILITAS CARD ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
           <div className="-mt-16 relative z-10">
               <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((fas, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 hover:border-emerald-400 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group h-full">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <fas.icon size={36} />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-xl mb-3">{fas.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{fas.desc}</p>
                            </div>
                        ))}
                    </div>
               </div>
            </div>
        </div>

    </div>
  );
};