import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { BookOpen, Users, ArrowRight, Sun, Quote, Loader2 } from 'lucide-react';
import { useScrollObserver } from '../hooks/useScrollObserver';

interface HomeProps {
  setPage: (page: Page) => void;
  navigateToNewsDetail: (id: number) => void;
}

// 1. Definisikan interface sesuai struktur data dari Laravel
interface PrincipalData {
  name: string;
  role: string;
  image: string;
  message: string;
}

// Interface untuk item berita dari API
interface LatestNewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  author: string;
}

export const Home: React.FC<HomeProps> = ({ setPage, navigateToNewsDetail }) => {
  const [latestNews, setLatestNews] = useState<LatestNewsItem[]>([]);
  const [featuredProgram, setFeaturedProgram] = useState<any>(null);
  useEffect(() => {
  fetch('http://127.0.0.1:8000/api/programs') 
    .then((res) => res.json())
    .then((hasil) => {
      // *** TAMBAHKAN BARIS INI ***
      console.log("Cek API Programs:", hasil); 

      if (hasil.success && hasil.data.length > 0) {
        setFeaturedProgram(hasil.data[0]); 
      }
    })
    .catch((err) => console.error("Error ambil data program:", err));
}, []);

  // Fetch berita terbaru dari API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/news/latest')
      .then((res) => res.json())
      .then((hasil) => {
        if (hasil.success) {
          setLatestNews(hasil.data);
        }
      })
      .catch((err) => console.error("Error ambil berita terbaru:", err));
  }, []);
  // Initialize Scroll Observer for animations
  useScrollObserver();

  // State untuk mengontrol slide gambar aktif
  const [currentSlide, setCurrentSlide] = useState(0);

  // State untuk data Kepala Sekolah
  const [principal, setPrincipal] = useState<PrincipalData | null>(null);

  // Daftar gambar background slider
  const heroImages = [
    "https://picsum.photos/1920/1080?random=1",   // Gambar 1
    "https://picsum.photos/1920/1080?random=15",  // Gambar 2
    "https://picsum.photos/1920/1080?random=25"   // Gambar 3
  ];

  // Efek untuk mengganti slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Efek untuk mengambil data Kepala Sekolah dari Backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/principal')
      .then((res) => res.json())
      .then((hasil) => {
        if (hasil.success) {
          setPrincipal(hasil.data);
        }
      })
      .catch((err) => console.error("Error ambil data kepsek:", err));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Slider Background */}
      <section className="relative h-[650px] flex items-center justify-center text-center text-white">
        {/* Container Gambar Slider */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={img} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-cover transform scale-105"
              />
            </div>
          ))}
          
          {/* Overlay Gelap & Gradient (Tetap di atas gambar) */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-emerald-900/40"></div>
        </div>
        
        {/* Content Hero */}
        <div className="relative z-10 px-4 max-w-5xl mx-auto reveal active">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg tracking-tight">
            Selamat Datang di <br/> <span className="text-yellow-400">MI AL-HASANI</span>
          </h1>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
          
          <p className="text-lg md:text-2xl font-medium mb-1 drop-shadow-md text-gray-100 max-w-3xl mx-auto">
            Tempat di Mana Ilmu Pengetahuan 
          </p>
          <p className="text-lg md:text-2xl font-medium mb-1 drop-shadow-md text-gray-100 max-w-3xl mx-auto">      
            dan 
          </p>
           <p className="text-lg md:text-2xl font-medium mb-10 drop-shadow-md text-gray-100 max-w-3xl mx-auto">      
            Nilai - Nilai Islami Berpadu
          </p>
        
          <div className="flex justify-center gap-4 flex-wrap">
            <button 
              onClick={() => setPage(Page.PROFILE)}
              className="bg-yellow-500 text-emerald-900 font-bold py-3.5 px-8 rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg border-2 border-yellow-500"
            >
              Profil Sekolah
            </button>
            <button 
              onClick={() => setPage(Page.PROGRAMS)}
              className="bg-transparent text-white font-bold py-3.5 px-8 rounded-full hover:bg-white/20 transition-all border-2 border-white backdrop-blur-sm"
            >
              Program Unggulan
            </button>
          </div>
        </div>
      </section>
      

      {/* Headmaster Welcome - Dynamic Design */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Jika data masih loading atau server mati, tampilkan animasi berputar */}
          {!principal ? (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="text-sm font-medium">Memuat Sambutan...</p>
            </div>
          ) : (
            
            /* Jika data berhasil diambil, tampilkan konten */
            <>
              <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 inline-block relative pb-4">
                      Sambutan Kepala Sekolah
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-emerald-500 rounded-full"></span>
                  </h2>
              </div>

              <div className="relative mt-16">
                  {/* Profile Image - Centered Absolute */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                          <img 
                              src={`/images/${principal.image}`} 
                              alt={principal.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/500?random=2'; }}
                          />
                      </div>
                  </div>

                  {/* Card Container */}
                  <div className="bg-white border border-emerald-400 rounded-3xl pt-24 pb-12 px-8 md:px-16 shadow-lg relative">
                      {/* Quote Icon */}
                      <div className="absolute right-6 top-20 opacity-10 text-emerald-600 hidden md:block">
                          <Quote size={120} />
                      </div>

                      <div className="relative z-10 text-gray-600 leading-relaxed text-lg space-y-4">
                          {principal.message.split('\n\n').map((paragraph, index) => (
                            <p 
                              key={index} 
                              className={index === 0 || index === principal.message.split('\n\n').length - 1 ? "font-medium text-gray-800" : ""}
                            >
                              {paragraph}
                            </p>
                          ))}
                      </div>

                      <div className="mt-10 pt-8 border-t border-gray-100">
                          <h4 className="text-xl font-bold text-gray-900">{principal.name}</h4>
                          <p className="text-gray-500 font-medium">{principal.role}</p>
                      </div>
                  </div>
              </div>
            </>
          )}

        </div>
      </section>

      {/* Highlights - Reveal Animation */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl font-bold text-emerald-900">Kenapa Memilih Kami?</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mt-4 rounded"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Kami menyediakan lingkungan pendidikan yang holistik untuk mendukung tumbuh kembang anak secara optimal.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-emerald-600 reveal">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
                <Sun size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Lingkungan Asri</h3>
              <p className="text-gray-600 text-center leading-relaxed">Suasana belajar yang hijau, bersih, dan nyaman mendukung konsentrasi siswa dalam menuntut ilmu.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-yellow-500 reveal">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 shadow-inner">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Guru Kompeten</h3>
              <p className="text-gray-600 text-center leading-relaxed">Tenaga pendidik profesional, berpengalaman, dan berdedikasi tinggi dalam membimbing setiap siswa.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-emerald-600 reveal">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
                <BookOpen size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Pembiasaan Ibadah</h3>
              <p className="text-gray-600 text-center leading-relaxed">Rutin Shalat Dhuha dan Zhuhur berjamaah serta program Tahfidz Juz 30 untuk karakter Islami.</p>
            </div>
          </div>
        </div>
      </section>
          
     {/* Flagship Program Snippet - Reveal Animation */}
     
      <section className="py-24 bg-emerald-900 text-white relative overflow-hidden reveal">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-white absolute -top-20 -left-20 filter blur-3xl"></div>
            <div className="w-[500px] h-[500px] rounded-full bg-yellow-500 absolute -bottom-32 -right-32 filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* LOGIKA PENGECEKAN: Jika data sudah masuk, tampilkan. Jika belum, tampilkan teks loading */}
            {featuredProgram ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="md:w-1/2">
                      <div className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold mb-4 border border-yellow-500/30">PROGRAM UNGGULAN</div>
                      
                      {/* 1. Judul Dinamis */}
                      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                          {featuredProgram.title}
                      </h2>
                      
                      {/* 2. Deskripsi Dinamis */}
                      <p className="text-emerald-100 text-lg mb-8 leading-relaxed whitespace-pre-line">
                          {featuredProgram.description}
                      </p>
                      
                      <button 
                        onClick={() => setPage(Page.PROGRAMS)}
                        className="group inline-flex items-center bg-yellow-500 text-emerald-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition shadow-lg"
                      >
                          Selengkapnya tentang Program <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition" />
                      </button>
                  </div>
                  <div className="md:w-5/12">
                      <div className="relative">
                          <div className="absolute inset-0 bg-yellow-500 rounded-2xl transform translate-x-4 translate-y-4"></div>
                          
                          {/* 3. Gambar Dinamis dari Folder Storage Laravel */}
                          <img 
                        src={
                          featuredProgram?.image 
                            ? `/images/${featuredProgram.image}` 
                            : "https://picsum.photos/600/400?random=3"
                        } 
                        alt={featuredProgram?.title || "Program MI Al-Hasani"} 
                        className="relative z-10 rounded-2xl shadow-2xl border-4 border-emerald-700 w-full h-[350px] object-cover bg-white" 
                        
                        // Pengaman jika file di folder tersebut tidak ditemukan
                        onError={(e) => { 
                          (e.target as HTMLImageElement).src = 'https://picsum.photos/600/400?random=10'; 
                        }}
                      />
                      </div>
                  </div>
              </div>
            ) : (
              // Tampilan sementara selagi menunggu balasan dari Laravel
              <div className="text-center py-20 animate-pulse">
                <p className="text-emerald-200 text-lg">Memuat program unggulan...</p>
              </div>
            )}
        </div>
      </section>

      {/* Latest News - Reveal Animation */}
      <section className="py-24 bg-gray-50 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-emerald-900">Berita Terbaru</h2>
              <div className="w-20 h-1 bg-yellow-500 mt-3 rounded"></div>
            </div>
            <button 
              onClick={() => setPage(Page.NEWS)}
              className="hidden md:flex items-center text-emerald-700 font-bold hover:text-emerald-900 transition"
            >
              Lihat Semua Berita <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.length > 0 ? latestNews.map((news) => (
              <div key={news.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                      news.category === 'Prestasi' ? 'text-white bg-blue-600' :
                      news.category === 'Kegiatan' ? 'text-white bg-emerald-600' :
                      'text-emerald-900 bg-yellow-400'
                    }`}>{news.category}</span>
                  </div>
                  <img 
                    src={`/images/${news.image}`}
                    alt={news.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/600/400?random=' + news.id; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-gray-400 mb-3 flex items-center">
                    <span>{news.date}</span>
                    <span className="mx-2">•</span>
                    <span>Oleh {news.author}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-emerald-700 transition leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                    {news.excerpt}
                  </p>
                  <button onClick={() => navigateToNewsDetail(news.id)} className="text-emerald-600 font-bold text-sm hover:text-emerald-800 flex items-center mt-auto group">
                    Baca Selengkapnya <ArrowRight size={14} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-400">
                <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                <p>Memuat berita terbaru...</p>
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center md:hidden">
             <button 
              onClick={() => setPage(Page.NEWS)}
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition"
            >
              Lihat Semua Berita
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};