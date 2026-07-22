import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { BookOpen, Users, ArrowRight, ChevronLeft, ChevronRight, Sun, Quote, Loader2 } from 'lucide-react';
import { useScrollObserver } from '../hooks/useScrollObserver';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { apiFetch, getFallbackImage, getImageUrl, setImageFallback } from '../lib/api';
import { useSchoolSettings } from '../hooks/useSchoolSettings';

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

interface FeaturedProgram {
  id: number;
  title: string;
  description: string;
  image: string | null;
  is_active?: boolean;
}

export const Home: React.FC<HomeProps> = ({ setPage, navigateToNewsDetail }) => {
  const { settings, loading: isSettingsLoading } = useSchoolSettings();
  const [latestNews, setLatestNews] = useState<LatestNewsItem[]>([]);
  const [isLoadingLatestNews, setIsLoadingLatestNews] = useState(true);
  const [latestNewsError, setLatestNewsError] = useState<string | null>(null);
  const [featuredProgram, setFeaturedProgram] = useState<FeaturedProgram | null>(null);
  const [isLoadingFeaturedProgram, setIsLoadingFeaturedProgram] = useState(true);
  const [featuredProgramError, setFeaturedProgramError] = useState<string | null>(null);
  const [principalError, setPrincipalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProgram = async () => {
      setIsLoadingFeaturedProgram(true);
      setFeaturedProgramError(null);

      try {
        const hasil = await apiFetch('/programs');
        if (hasil.success) {
          const activePrograms = hasil.data.filter(
            (item: FeaturedProgram) => item.is_active !== false
          );
          setFeaturedProgram(activePrograms[0] ?? null);
        }
      } catch (err) {
        console.error('Error ambil data program:', err);
        setFeaturedProgramError('Program unggulan belum dapat dimuat saat ini.');
      } finally {
        setIsLoadingFeaturedProgram(false);
      }
    };

    fetchFeaturedProgram();
  }, []);

  // Fetch berita terbaru dari API
  useEffect(() => {
    const fetchLatestNews = async () => {
      setIsLoadingLatestNews(true);
      setLatestNewsError(null);

      try {
        const hasil = await apiFetch('/news');
        if (hasil.success) {
          setLatestNews(hasil.data);
        }
      } catch (err) {
        console.error('Error ambil berita terbaru:', err);
        setLatestNewsError('Berita terbaru belum dapat dimuat saat ini.');
      } finally {
        setIsLoadingLatestNews(false);
      }
    };

    fetchLatestNews();
  }, []);
  // Initialize Scroll Observer for animations
  useScrollObserver();

  // State untuk mengontrol slide gambar aktif
  const [currentSlide, setCurrentSlide] = useState(0);

  // State untuk slider berita terbaru
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [isHoveringNews, setIsHoveringNews] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);

  // State untuk data Kepala Sekolah
  const [principal, setPrincipal] = useState<PrincipalData | null>(null);

  // Daftar gambar background slider
  const heroImages = (settings.hero_images?.length ? settings.hero_images : [
    'galeri-prestasi.jpg',
    'galeri-maulid.jpg',
    'galeri-shalat.jpg',
  ]).map(getImageUrl);

  // Efek untuk mengganti slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Efek untuk handle resize layar pada slider berita
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else {
        setItemsPerView(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Efek untuk auto-scroll berita terbaru
  useEffect(() => {
    if (isHoveringNews || latestNews.length === 0) return;

    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => {
        const maxIndex = Math.max(0, latestNews.length - itemsPerView);
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isHoveringNews, latestNews.length, itemsPerView]);

  // Efek untuk mengambil data Kepala Sekolah dari Backend
  useEffect(() => {
    const fetchPrincipal = async () => {
      setPrincipalError(null);

      try {
        const hasil = await apiFetch('/principal');
        if (hasil.success) {
          setPrincipal(hasil.data);
        }
      } catch (err) {
        console.error('Error ambil data kepsek:', err);
        setPrincipalError('Sambutan kepala sekolah belum dapat dimuat saat ini.');
      }
    };

    fetchPrincipal();
  }, []);

  return (
    <div className="overflow-hidden">
      <SEO title="Beranda" />
      <section className="relative min-h-[85vh] pt-20 md:pt-28 flex items-center justify-center text-center text-white bg-teal-900 overflow-hidden">
        {isSettingsLoading ? (
           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-teal-700 text-teal-100">
             <Loader2 size={48} className="animate-spin text-teal-400 mb-4" />
             <p className="text-sm font-semibold tracking-widest uppercase animate-pulse">Memuat Beranda...</p>
           </div>
         ) : (
           <>
              {/* Container Gambar Slider */}
             <div className="absolute inset-0 z-0">
               {heroImages.map((img, index) => (
                 <div
                   key={img + index}
                   className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                     index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                   }`}
                 >
                   <img 
                     src={img} 
                     alt={`Slide ${index + 1}`} 
                     className="w-full h-full object-cover object-[center_80%]"
                     onError={(e) => {
                       setImageFallback(e.currentTarget, `Slide ${index + 1} Error`);
                     }}
                  />
                </div>
              ))}
              
              {/* Overlay Gelap & Gradient (Tetap di atas gambar) */}
              <div className="absolute inset-0 bg-black/45 z-20 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-teal-900/50 via-transparent to-teal-700/50 z-20 pointer-events-none"></div>
            </div>
            
            {/* Content Hero */}
            <AnimatedSection animation="slideUp" className="relative z-10 px-4 max-w-5xl mx-auto">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg tracking-tight">
                {settings.welcome_title || 'Selamat Datang di'} <br />{' '}
                <span className="text-yellow-400">{settings.welcome_highlight || 'MI AL-HASANI'}</span>
              </h1>
              <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
              
              <p className="text-lg md:text-2xl font-medium mb-1 drop-shadow-md text-gray-100 max-w-3xl mx-auto">
                {settings.welcome_tagline_1 || 'Tempat di Mana Ilmu Pengetahuan'}
              </p>
              <p className="text-lg md:text-2xl font-medium mb-1 drop-shadow-md text-gray-100 max-w-3xl mx-auto">
                {settings.welcome_tagline_2 || 'dan'}
              </p>
              <p className="text-lg md:text-2xl font-medium mb-10 drop-shadow-md text-gray-100 max-w-3xl mx-auto">
                {settings.welcome_tagline_3 || 'Nilai - Nilai Islami Berpadu'}
              </p>
            
              <div className="flex justify-center gap-4 flex-wrap">
                <button 
                  onClick={() => setPage(Page.PROFILE)}
                  className="bg-yellow-400 text-teal-900 font-bold py-3.5 px-8 rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg border-2 border-yellow-400"
                >
                  Profil Sekolah
                </button>
                <button 
                  onClick={() => setPage(Page.PPDB)}
                  className="bg-transparent text-white font-bold py-3.5 px-8 rounded-full hover:bg-white/20 transition-all border-2 border-white backdrop-blur-sm"
                >
                  PPDB
                </button>
              </div>
            </AnimatedSection>
          </>
        )}
      </section>
            {/* Headmaster Welcome - Dynamic Design */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Jika data masih loading atau server mati, tampilkan animasi berputar */}
          {!principal && !principalError ? (
            <div className="flex flex-col items-center justify-center py-20 text-teal-600">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="text-sm font-medium">Memuat Sambutan...</p>
            </div>
          ) : principalError ? (
            <div className="text-center py-16 px-6 border border-teal-100 rounded-3xl bg-teal-50/60 text-teal-900">
              <p className="text-lg font-semibold mb-2">Sambutan Belum Tersedia</p>
              <p className="text-sm text-teal-700">{principalError}</p>
            </div>
          ) : (
            
            /* Jika data berhasil diambil, tampilkan konten */
            <>
              <AnimatedSection animation="slideUp" className="text-center mb-20">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-teal-900 inline-block relative pb-4">
                    Sambutan Kepala Sekolah
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-teal-500 rounded-full"></span>
                </h2>
              </AnimatedSection>

              <AnimatedSection animation="slideUp" delay={0.2} className="relative mt-16">
                  {/* Profile Image - Centered Absolute */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex justify-center items-end">
                          <img 
                              src={getImageUrl(principal.image)} 
                              alt={principal.name} 
                              className="w-full h-full object-contain object-bottom scale-[1.15] origin-bottom"
                              onError={(e) => {
                                setImageFallback(e.currentTarget, principal.name);
                              }}
                          />
                      </div>
                  </div>

                  {/* Card Container */}
                  <div className="bg-white border border-teal-300 rounded-3xl pt-24 pb-12 px-8 md:px-16 shadow-lg relative">
                      {/* Quote Icon */}
                      <div className="absolute right-6 top-20 opacity-10 text-teal-600 hidden md:block">
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
              </AnimatedSection>
            </>
          )}

        </div>
      </section>

      {/* Highlights - Reveal Animation */}
      <section className="py-20 bg-ivory-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade" className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-teal-900">Kenapa Memilih Kami?</h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Kami menyediakan lingkungan pendidikan yang holistik untuk mendukung tumbuh kembang anak secara optimal.</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection animation="slideUp" delay={0.1} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-teal-600">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 shadow-inner">
                <Sun size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Lingkungan Asri</h3>
              <p className="text-gray-600 text-center leading-relaxed">Suasana belajar yang hijau, bersih, dan nyaman mendukung konsentrasi siswa dalam menuntut ilmu.</p>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={0.2} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-yellow-400">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 shadow-inner">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Guru Kompeten</h3>
              <p className="text-gray-600 text-center leading-relaxed">Tenaga pendidik profesional, berpengalaman, dan berdedikasi tinggi dalam membimbing setiap siswa.</p>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={0.3} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-teal-600">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 shadow-inner">
                <BookOpen size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Pembiasaan Ibadah</h3>
              <p className="text-gray-600 text-center leading-relaxed">Rutin Shalat Dhuha dan Zhuhur berjamaah serta program Tahfidz Juz 30 untuk karakter Islami.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>
          
      {/* Flagship Program Snippet - Reveal Animation */}
     
      <section className="py-24 bg-teal-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-white absolute -top-20 -left-20 filter blur-3xl"></div>
            <div className="w-[500px] h-[500px] rounded-full bg-yellow-500 absolute -bottom-32 -right-32 filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* LOGIKA PENGECEKAN: Jika data sudah masuk, tampilkan. Jika belum, tampilkan teks loading */}
            {isLoadingFeaturedProgram ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="md:w-1/2 w-full">
                      <Skeleton className="w-24 h-6 rounded-full mb-4" />
                      <Skeleton className="h-10 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-4/5 mb-6" />
                      <Skeleton className="h-10 w-40 rounded-full" />
                  </div>
                  <div className="md:w-1/2 w-full">
                      <Skeleton className="rounded-3xl w-full h-[400px]" />
                  </div>
              </div>
            ) : featuredProgramError ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-xl font-semibold text-white mb-2">Program Unggulan Belum Tersedia</p>
                <p className="text-emerald-100">{featuredProgramError}</p>
              </div>
            ) : featuredProgram ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <AnimatedSection animation="slideLeft" className="md:w-1/2">
                      <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-bold mb-4 border border-yellow-400/30">PROGRAM</div>
                      
                      {/* 1. Judul Dinamis */}
                      <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
                          {featuredProgram.title}
                      </h2>
                      
                      {/* 2. Deskripsi Dinamis */}
                      <p className="text-emerald-100 text-lg mb-8 leading-relaxed line-clamp-4">
                          {featuredProgram.description}
                      </p>
                      
                      <button 
                        onClick={() => setPage(Page.PROGRAMS)}
                        className="group inline-flex items-center bg-yellow-400 text-teal-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition shadow-lg"
                      >
                          Selengkapnya tentang Program <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition" />
                      </button>
                  </AnimatedSection>
                  <AnimatedSection animation="slideRight" delay={0.2} className="md:w-5/12">
                      <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400 rounded-2xl transform translate-x-4 translate-y-4"></div>
                          
                          {/* 3. Gambar Dinamis dari Folder Storage Laravel */}
                          <img 
                        src={
                          featuredProgram?.image 
                            ? getImageUrl(featuredProgram.image) 
                            : getFallbackImage('Program Unggulan')
                        } 
                        alt={featuredProgram?.title || "Program MI Al-Hasani"} 
                        className="relative z-10 rounded-2xl shadow-2xl border-4 border-teal-600 w-full h-[350px] object-cover bg-white" 
                        
                        // Pengaman jika file di folder tersebut tidak ditemukan
                        onError={(e) => { 
                          setImageFallback(e.currentTarget, featuredProgram?.title || 'Program Unggulan');
                        }}
                      />
                      </div>
                  </AnimatedSection>
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-xl font-semibold text-white mb-2">Belum Ada Program Unggulan</p>
                <p className="text-emerald-100">Silakan tambahkan atau aktifkan program dari dashboard admin.</p>
              </div>
            )}
        </div>
      </section>

      {/* Latest News - Reveal Animation */}
      <section className="py-24 bg-ivory-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade" className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-gray-900">Artikel & Berita</h2>
            <p className="text-gray-500 mt-2">Ikuti update terbaru seputar kegiatan dan informasi sekolah</p>
            <div className="w-16 h-1 bg-teal-500 mx-auto mt-4 rounded"></div>
          </AnimatedSection>

          <div 
            className="overflow-hidden relative -mx-4 px-4 py-4"
            onMouseEnter={() => setIsHoveringNews(true)}
            onMouseLeave={() => setIsHoveringNews(false)}
          >
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeNewsIndex * (100 / itemsPerView)}%)` }}
            >
              {!isLoadingLatestNews && !latestNewsError && latestNews.length > 0 ? latestNews.map((news, index) => {
                const isCenter = itemsPerView === 3 ? index === activeNewsIndex + 1 : index === activeNewsIndex;
                return (
                <div key={news.id} className="shrink-0 w-full md:w-1/3 px-4 py-6">
                  <AnimatedSection animation="slideUp" delay={index * 0.1} className={`bg-white rounded-2xl overflow-hidden transition-all duration-500 flex flex-col h-full border border-gray-100 ${isCenter ? 'shadow-xl scale-105 z-10 relative' : 'shadow-sm scale-95 opacity-80 hover:opacity-100'}`}>
                    <div className="h-56 overflow-hidden relative">
                      <img 
                        src={getImageUrl(news.image)}
                        alt={news.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          setImageFallback(e.currentTarget, news.title);
                        }}
                      />
                      {/* Badge category at bottom-left corner of the image */}
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="text-xs font-bold px-4 py-1.5 rounded-full shadow-md bg-white/95 text-gray-800 backdrop-blur-sm">
                          {news.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs text-gray-500 mb-3 flex items-center">
                        <span>{news.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-snug">
                        {news.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                        {news.excerpt}
                      </p>
                      <button onClick={() => navigateToNewsDetail(news.id)} className="text-teal-600 font-bold text-sm hover:text-teal-800 transition mt-auto flex items-center">
                        Selengkapnya <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </AnimatedSection>
                </div>
              )}) : isLoadingLatestNews ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-none w-80 md:w-96 scroll-snap-align-start px-2">
                      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full p-0">
                        <Skeleton className="h-48 w-full rounded-none" />
                        <div className="p-6 flex flex-col flex-grow">
                          <Skeleton className="w-1/3 h-4 mb-3" />
                          <Skeleton className="w-full h-6 mb-3" />
                          <Skeleton className="w-3/4 h-6 mb-4" />
                          <Skeleton className="w-full h-4 mb-2" />
                          <Skeleton className="w-5/6 h-4 mb-4" />
                          <Skeleton className="w-1/2 h-4 mt-auto" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : latestNewsError ? (
                <div className="w-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                  <p className="font-semibold text-gray-800 mb-2">Berita Belum Bisa Dimuat</p>
                  <p>{latestNewsError}</p>
                </div>
              ) : (
                <div className="w-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                  <p className="font-semibold text-gray-800 mb-2">Belum Ada Berita</p>
                  <p>Konten berita terbaru akan tampil di sini setelah dipublikasikan.</p>
                </div>
              )}
            </div>
            
            {/* Slider Controls */}
            {!isLoadingLatestNews && !latestNewsError && latestNews.length > 0 && (
              <div className="flex flex-col items-center mt-12 space-y-6">
                {/* Dots */}
                <div className="flex space-x-3">
                  {Array.from({ length: Math.max(1, latestNews.length - itemsPerView + 1) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveNewsIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        activeNewsIndex === idx ? 'bg-teal-500' : 'bg-gray-200 hover:bg-teal-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Buttons Row */}
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => setActiveNewsIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeNewsIndex === 0}
                    className="flex items-center px-5 py-2.5 rounded-full bg-white text-teal-600 font-semibold shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.1)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} className="mr-1" /> Sebelumnya
                  </button>
                  <button 
                    onClick={() => setPage(Page.NEWS)}
                    className="flex items-center px-8 py-3 rounded-full bg-teal-600 text-white font-bold shadow-md hover:bg-teal-700 transition-all duration-300"
                  >
                    Lihat Semua Berita
                  </button>
                  <button 
                    onClick={() => {
                      const maxIndex = Math.max(0, latestNews.length - itemsPerView);
                      setActiveNewsIndex(prev => Math.min(maxIndex, prev + 1));
                    }}
                    disabled={activeNewsIndex >= Math.max(0, latestNews.length - itemsPerView)}
                    className="flex items-center px-5 py-2.5 rounded-full bg-white text-teal-600 font-semibold shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.1)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya <ChevronRight size={20} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
