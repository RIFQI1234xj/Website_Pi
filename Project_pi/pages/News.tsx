import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, User, Loader2, ArrowRight, Search, Filter, Grid, Activity, Megaphone, Trophy, BookOpen } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { apiFetch, getImageUrl, setImageFallback } from '../lib/api';

// 1. Definisi Interface
interface NewsItem {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  author: string;
  date: string;
}

interface NewsProps {
  navigateToNewsDetail: (id: number) => void;
}

export const News: React.FC<NewsProps> = ({ navigateToNewsDetail }) => {
  // 2. State Utama
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  
  // State untuk Pencarian dan Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // 3. Daftar Kategori Statis dengan Ikon
  const categories = [
    { name: "Semua", icon: Grid },
    { name: "Kegiatan", icon: Activity },
    { name: "Pengumuman", icon: Megaphone },
    { name: "Prestasi", icon: Trophy },
    { name: "Artikel Islami", icon: BookOpen }
  ];

  // 4. Proses Ambil Data (Fetching)
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const hasil = await apiFetch('/news');
        if (hasil.success) {
          setNews(hasil.data);
        }
      } catch (err) {
        console.error('Error ambil data:', err);
        setError('Berita belum dapat dimuat saat ini. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 5. Fungsi Filter Data Berdasarkan Search & Kategori
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [news, searchTerm, selectedCategory]);

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-20 font-poppins">
      <SEO title="Berita & Artikel" />
      {/* Header Halaman */}
      <AnimatedSection animation="fade" className="bg-teal-700 py-20 text-center text-white relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-64 h-64 bg-white rounded-full absolute -top-10 -left-10 filter blur-3xl"></div>
          <div className="w-96 h-96 bg-yellow-400 rounded-full absolute -bottom-20 -right-20 filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Berita & Artikel</h1>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-teal-100 text-lg md:text-xl">
            Ikuti update terbaru seputar kegiatan, informasi, dan prestasi membanggakan dari MI Al-Hasani
          </p>
        </div>
      </AnimatedSection>

      {/* Container Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Fitur Search & Filter Bar */}
        <AnimatedSection animation="slideUp" delay={0.1} className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-gray-200/50 p-5 mb-12 border border-white">
          <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
            
            {/* Search Bar */}
            <div className="relative w-full lg:max-w-xs group shrink-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Cari berita atau artikel..."
                className="w-full pl-11 pr-4 py-3 bg-gray-100/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(6);
                }}
              />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-10 bg-gray-200 shrink-0"></div>

            {/* Filter Kategori */}
            <div className="w-full flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-gray-500 font-medium text-sm shrink-0">
                <Filter size={16} />
              </div>
              <div className="flex flex-wrap gap-2.5 w-full">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setVisibleCount(6);
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                        isSelected 
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 border border-teal-500' 
                          : 'bg-white text-gray-600 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 hover:text-teal-700 shadow-sm hover:shadow'
                      }`}
                    >
                      <Icon size={16} className={isSelected ? 'text-teal-100' : 'text-gray-500'} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <Skeleton className="h-56 w-full rounded-none" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-7 w-full mb-2" />
                  <Skeleton className="h-7 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <AnimatedSection animation="fade" className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone size={32} className="text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Berita Belum Bisa Dimuat</h3>
            <p className="text-gray-500 max-w-lg mx-auto">{error}</p>
          </AnimatedSection>
        ) : (
          <>
            {/* Grid Berita Utama */}
            {filteredNews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredNews.slice(0, visibleCount).map((item, index) => (
                  <AnimatedSection 
                    key={item.id} 
                    animation="slideUp" 
                    delay={(index % 3) * 0.1} 
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col group cursor-pointer transition-all duration-500 transform hover:-translate-y-1"
                    onClick={() => navigateToNewsDetail(item.id)}
                  >
                    {/* Gambar dengan Badge Kanan Atas */}
                    <div className="h-56 w-full relative overflow-hidden bg-gray-200">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          setImageFallback(e.currentTarget, item.title);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Badge Kategori Kanan Atas */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-yellow-400 text-teal-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Konten Kartu */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Metadata: Tanggal & Penulis */}
                      <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
                        <span className="flex items-center"><Calendar size={13} className="mr-1" /> {item.date}</span>
                        <span className="flex items-center"><User size={13} className="mr-1" /> {item.author}</span>
                      </div>
                      
                      {/* Judul & Ringkasan */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {item.excerpt}
                      </p>
                      
                      {/* Tombol Bawah */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-teal-600 font-bold text-sm flex items-center group-hover:text-teal-800 transition-colors">
                          Baca Selengkapnya <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>


                {/* Tombol Load More */}
                {!isLoading && !error && filteredNews.length > visibleCount && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-8 py-3 rounded-xl border-2 border-teal-600 text-teal-700 font-semibold hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      Muat Lebih Banyak...
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State jika tidak ada berita yang cocok dengan filter */
              <AnimatedSection animation="fade" className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Berita Tidak Ditemukan</h3>
                <p className="text-gray-500">Maaf, kami tidak dapat menemukan berita dengan kata kunci "{searchTerm}" atau di kategori tersebut.</p>
                <button 
                  onClick={() => { 
                    setSearchTerm(''); 
                    setSelectedCategory('Semua'); 
                    setVisibleCount(6);
                  }}
                  className="mt-6 px-6 py-2.5 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition"
                >
                  Reset Filter
                </button>
              </AnimatedSection>
            )}
          </>
        )}
      </div>
    </div>
  );
};
