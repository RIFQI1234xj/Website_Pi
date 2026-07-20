import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Loader2, Share2, BookOpen } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Page } from '../types';
import { AnimatedSection } from '../components/AnimatedSection';
import { apiFetch, getImageUrl, setImageFallback } from '../lib/api';

// Interface untuk data berita lengkap
interface NewsDetailItem {
  id: number;
  title: string;
  category: string;
  image: string;
  photos?: string[];
  excerpt: string;
  content: string | null;
  author: string;
  date: string;
}

interface NewsDetailProps {
  setPage: (page: Page) => void;
  navigateToNewsDetail: (id: number) => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = () => {
  const { newsId: newsIdParam } = useParams<{ newsId: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const newsId = newsIdParam ? Number(newsIdParam) : NaN;

  useEffect(() => {
    if (!Number.isFinite(newsId)) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch detail berita
    apiFetch(`/news/${newsId}`)
      .then((detailResult) => {
        if (detailResult.success) {
          setNews(detailResult.data);
        } else {
          setIsError(true);
        }
      })
      .catch((err) => {
        console.error("Error mengambil detail berita:", err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [newsId]);

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
      <div className="bg-ivory-50 min-h-screen">
        <div className="bg-teal-700 pt-32 pb-16 text-center text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-teal-600/50 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-teal-600/30 rounded w-96 mx-auto"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-teal-600" size={48} />
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError || !news) {
    return (
      <div className="bg-ivory-50 min-h-screen">
        <div className="bg-teal-700 pt-32 pb-16 text-center text-white">
          <h1 className="font-serif text-4xl font-bold mb-4">Berita Tidak Ditemukan</h1>
          <p className="text-teal-200">Maaf, berita yang Anda cari tidak tersedia.</p>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <BookOpen size={64} className="text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Berita yang Anda cari mungkin sudah dihapus atau alamatnya salah. 
              Silakan kembali ke halaman daftar berita.
            </p>
            <Link
              to="/berita"
              className="inline-flex items-center bg-teal-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Daftar Berita
            </Link>
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
    <div className="bg-ivory-50 min-h-screen pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="slideUp" delay={0.1}>
            {/* Card Artikel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10">
              
              {/* Back Button */}
              <Link
                to="/berita"
                className="inline-flex items-center text-gray-500 hover:text-teal-700 transition-colors mb-6 text-sm font-medium"
              >
                <ArrowLeft size={16} className="mr-2" />
                Kembali ke Daftar Berita
              </Link>

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
                {news.title}
              </h1>

              {/* Separator */}
              <div className="w-full h-1 bg-teal-500 mb-4 rounded-full"></div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-xs sm:text-sm mb-8 font-medium">
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1.5" />
                  {news.date}
                </span>
                <span className="flex items-center">
                  <User size={14} className="mr-1.5" />
                  {news.author}
                </span>
              </div>

              {/* Image Gallery */}
              {news.photos && news.photos.length > 1 ? (
                <div className="mb-8 space-y-4">
                  <div className="rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={getImageUrl(news.photos[0])}
                      alt={news.title}
                      className="w-full h-auto max-h-[500px] object-contain bg-slate-50 rounded-xl"
                      onError={(e)=>{setImageFallback(e.currentTarget, news.title)}}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {news.photos.slice(1).map((photo, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden shadow-sm aspect-video bg-slate-100">
                        <img
                          src={getImageUrl(photo)}
                          alt={`${news.title} ${idx + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e)=>{setImageFallback(e.currentTarget, news.title)}}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden mb-8 shadow-sm">
                  <img
                    src={getImageUrl(news.image)}
                    alt={news.title}
                    className="w-full h-auto max-h-[500px] object-contain bg-slate-50 rounded-xl"
                    onError={(e)=>{setImageFallback(e.currentTarget, news.title)}}
                  />
                </div>
              )}

              {/* Body Konten */}
              <div className="text-gray-800">
                {renderContent()}
              </div>

              {/* Share & Action Bar */}
              <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getCategoryStyle(news.category)}`}>
                    {news.category}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: news.title,
                        text: news.excerpt,
                        url: window.location.href,
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Tautan berhasil disalin ke clipboard!');
                    }
                  }}
                  className="flex items-center text-gray-500 hover:text-teal-600 transition-colors text-sm font-medium group"
                >
                  <Share2 size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                  Bagikan Berita
                </button>
              </div>
            </div>
          </AnimatedSection>
      </div>
    </div>
  );
};
