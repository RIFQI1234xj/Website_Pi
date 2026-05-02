import React, { useState, useEffect } from 'react';
import { Calendar, User, Loader2, ArrowRight } from 'lucide-react';

// 1. Definisi Interface (Sudah Benar)
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
  
  // 3. Daftar Kategori untuk Sidebar (Kunci untuk angka otomatis)
  const categories = ["Kegiatan", "Pengumuman", "Prestasi", "Artikel Islami"];

  // 4. Proses Ambil Data (Fetching)
  useEffect(() => {
    setIsLoading(true);
    fetch('http://127.0.0.1:8000/api/news')
      .then((res) => res.json())
      .then((hasil) => {
        // PERHATIAN: Pastikan di Laravel kamu mengirim return response()->json(['success' => true, 'data' => $news]);
        if (hasil.success) {
          console.log("DATA ASLI DARI LARAVEL:", hasil.data);
          setNews(hasil.data); 
        }
      })
      .catch((err) => console.error("Error ambil data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // --- LANJUT KE BAGIAN RETURN (TAMPILAN) ---

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-emerald-800 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Berita Terbaru</h1>
        <p className="text-emerald-200">Informasi terkini seputar kegiatan dan prestasi MI Al-Hasani</p>
      </div>

      {/* Container Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* KOLOM KIRI: Daftar Berita Utama */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
          ) : news.length > 0 ? (
            news.map((item) => (
              // PERBAIKAN UKURAN: Card dikunci tingginya (md:h-64) agar foto tidak memanjang ke bawah
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition h-auto md:h-64">
                
                {/* Bagian Gambar */}
                <div className="w-full md:w-2/5 h-56 md:h-full shrink-0 relative bg-gray-100">
                  <img 
                    src={`/images/${item.image}`} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?blur=2'; }}
                  />
                </div>

                {/* Bagian Teks */}
                <div className="p-6 w-full md:w-3/5 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-3">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {item.date}</span>
                    <span className="flex items-center"><User size={14} className="mr-1" /> {item.author}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
                      {item.category}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    <button 
                      onClick={() => navigateToNewsDetail(item.id)}
                      className="text-emerald-600 font-medium text-sm flex items-center hover:text-emerald-700 transition group"
                    >
                      Baca Selengkapnya <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
              Belum ada berita yang dipublikasikan.
            </div>
          )}
        </div>

        {/* KOLOM KANAN: Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Widget Kategori */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Kategori</h3>
           <ul className="space-y-3">
  {categories.map((cat) => (
    <li 
      key={cat} 
      className="flex justify-between items-center text-gray-600 text-sm hover:text-emerald-600 cursor-pointer group transition-all"
    >
      {/* Nama Kategori */}
      <span className="group-hover:translate-x-1 transition-transform duration-200">
        {cat}
      </span> 

      {/* Angka Otomatis: Menghitung jumlah berita berdasarkan kategori */}
      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
        {
          // Logika: Filter array 'news', cari yang kategorinya cocok, lalu hitung jumlahnya
          news.filter((item) => item.category === cat).length
        }
      </span>
    </li>
  ))}
</ul>
          </div>

          {/* Widget Berita Populer */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Berita Populer</h3>
            <div className="space-y-4">
              {news.slice(0, 2).map((item) => (
                <div 
                  key={`pop-${item.id}`} 
                  className="flex gap-3 items-center group cursor-pointer"
                  onClick={() => navigateToNewsDetail(item.id)}
                >
                  <div className="w-16 h-16 shrink-0 relative bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={`/images/${item.image}`} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 transition"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/100/100?blur=2'; }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};