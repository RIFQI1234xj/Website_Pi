import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, ArrowRight, Loader2, Tag, Share2, BookOpen } from 'lucide-react';
import { Page } from '../types';

// Interface untuk data berita lengkap
interface NewsDetailItem {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string | null;
  author: string;
  date: string;
}

interface NewsDetailProps {
  newsId: number | null;
  setPage: (page: Page) => void;
  setNewsId: (id: number) => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ newsId, setPage, setNewsId }) => {
  const [news, setNews] = useState<NewsDetailItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsDetailItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!newsId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch detail berita
    Promise.all([
      fetch(`http://127.0.0.1:8000/api/news/${newsId}`).then(res => res.json()),
      fetch(`http://127.0.0.1:8000/api/news/${newsId}/related`).then(res => res.json()),
    ])
      .then(([detailResult, relatedResult]) => {
        if (detailResult.success) {
          setNews(detailResult.data);
        } else {
          setIsError(true);
        }
        if (relatedResult.success) {
          setRelatedNews(relatedResult.data);
        }
      })
      .catch((err) => {
        console.error("Error mengambil detail berita:", err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [newsId]);

  // Handler navigasi ke berita terkait
  const handleRelatedClick = (id: number) => {
    setNewsId(id);
  };

  // Fungsi untuk mendapatkan warna badge kategori
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Prestasi':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Kegiatan':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pengumuman':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Artikel Islami':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-emerald-800 py-16 text-center text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-emerald-700/50 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-emerald-700/30 rounded w-96 mx-auto"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError || !news) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-emerald-800 py-16 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Berita Tidak Ditemukan</h1>
          <p className="text-emerald-200">Maaf, berita yang Anda cari tidak tersedia.</p>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <BookOpen size={64} className="text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Berita yang Anda cari mungkin sudah dihapus atau alamatnya salah. 
              Silakan kembali ke halaman daftar berita.
            </p>
            <button
              onClick={() => setPage(Page.NEWS)}
              className="inline-flex items-center bg-emerald-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Daftar Berita
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- CONTENT RENDER ---
  // Render konten berita: jika ada content, tampilkan. Jika tidak, tampilkan excerpt.
  const renderContent = () => {
    const contentText = news.content || news.excerpt;
    
    // Split paragraf berdasarkan newline
    const paragraphs = contentText.split(/\n\n|\n/).filter(p => p.trim() !== '');

    return paragraphs.map((paragraph, index) => (
      <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section dengan Gambar Background */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`/images/${news.image}`}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/1200/600?blur=2';
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/70 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-end h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Back Button */}
          <button
            onClick={() => setPage(Page.NEWS)}
            className="absolute top-6 left-4 sm:left-6 lg:left-8 flex items-center text-white/80 hover:text-white transition-colors duration-200 group bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali</span>
          </button>

          {/* Category Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${getCategoryStyle(news.category)}`}>
              <Tag size={14} className="mr-1.5" />
              {news.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            {news.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Calendar size={14} className="mr-2" />
              {news.date}
            </span>
            <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <User size={14} className="mr-2" />
              {news.author}
            </span>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Kolom Kiri: Artikel */}
          <article className="flex-1 min-w-0">
            {/* Card Artikel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Excerpt sebagai Lead Paragraph */}
              <div className="border-l-4 border-emerald-500 bg-emerald-50/50 px-6 py-5 mx-6 mt-8 rounded-r-xl">
                <p className="text-emerald-800 text-lg font-medium italic leading-relaxed">
                  {news.excerpt}
                </p>
              </div>

              {/* Body Konten */}
              <div className="px-6 md:px-10 py-8">
                {renderContent()}
              </div>

              {/* Share & Action Bar */}
              <div className="border-t border-gray-100 px-6 md:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getCategoryStyle(news.category)}`}>
                    {news.category}
                  </span>
                  <span className="text-gray-400 text-sm">{news.date}</span>
                </div>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: news.title,
                        text: news.excerpt,
                      });
                    }
                  }}
                  className="flex items-center text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium group"
                >
                  <Share2 size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                  Bagikan Berita
                </button>
              </div>
            </div>

            {/* Tombol Kembali (bawah) */}
            <div className="mt-8">
              <button
                onClick={() => setPage(Page.NEWS)}
                className="inline-flex items-center text-emerald-700 font-semibold hover:text-emerald-900 transition-colors group"
              >
                <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Lihat Semua Berita
              </button>
            </div>
          </article>

          {/* Kolom Kanan: Sidebar - Berita Terkait */}
          {relatedNews.length > 0 && (
            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="font-bold text-lg text-gray-900 mb-1">Berita Terkait</h3>
                <p className="text-xs text-gray-400 mb-5">Berita lain dari kategori <span className="font-semibold text-emerald-600">{news.category}</span></p>
                
                <div className="space-y-5">
                  {relatedNews.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer"
                      onClick={() => handleRelatedClick(item.id)}
                    >
                      <div className="flex gap-4 items-start">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                          <img
                            src={`/images/${item.image}`}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://picsum.photos/100/100?blur=2';
                            }}
                          />
                        </div>
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-1.5">
                            {item.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-400 gap-2">
                            <Calendar size={12} />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="border-b border-gray-100 mt-4 group-last:border-0"></div>
                    </div>
                  ))}
                </div>

                {/* CTA ke halaman berita */}
                <button
                  onClick={() => setPage(Page.NEWS)}
                  className="mt-6 w-full inline-flex items-center justify-center text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-3 rounded-xl transition-colors"
                >
                  Lihat Semua Berita
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
