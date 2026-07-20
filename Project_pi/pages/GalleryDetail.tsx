import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Images, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { AnimatedSection } from '../components/AnimatedSection';
import { apiFetch, getImageUrl, setImageFallback, isDummyImageSource } from '../lib/api';

// Interface untuk data gallery lengkap
interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  photos: string[] | null;
  description: string | null;
}

export const GalleryDetail: React.FC = () => {
  const { galleryId: galleryIdParam } = useParams<{ galleryId: string }>();
  const [gallery, setGallery] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const galleryId = galleryIdParam ? Number(galleryIdParam) : NaN;

  useEffect(() => {
    if (!Number.isFinite(galleryId)) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch semua galeri dan cari ID nya
    apiFetch(`/galleries`)
      .then((result) => {
        if (result.success) {
          const item = result.data.find((g: GalleryItem) => g.id === galleryId);
          if (item) {
            setGallery(item);
          } else {
            setIsError(true);
          }
        } else {
          setIsError(true);
        }
      })
      .catch((err) => {
        console.error("Error mengambil detail galeri:", err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [galleryId]);

  const getPhotos = (item: GalleryItem): string[] => {
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      const validPhotos = item.photos.filter((photo) => !isDummyImageSource(photo));
      if (validPhotos.length > 0) {
        return validPhotos.map((photo) => getImageUrl(photo));
      }
    }
    return item.image ? [getImageUrl(item.image)] : [];
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="bg-ivory-50 min-h-screen">
        <div className="bg-teal-700 pt-32 pb-16 text-center text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-teal-600/50 rounded w-64 mx-auto mb-4"></div>
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
  if (isError || !gallery) {
    return (
      <div className="bg-ivory-50 min-h-screen">
        <div className="bg-teal-700 pt-32 pb-16 text-center text-white">
          <h1 className="font-serif text-4xl font-bold mb-4">Galeri Tidak Ditemukan</h1>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <Images size={64} className="text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Galeri yang Anda cari mungkin sudah dihapus atau alamatnya salah.
            </p>
            <Link
              to="/galeri"
              className="inline-flex items-center bg-teal-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:-translate-y-0.5"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Galeri
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const photos = getPhotos(gallery);

  return (
    <div className="bg-ivory-50 min-h-screen pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="slideUp" delay={0.1}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10">
            <Link
              to="/galeri"
              className="inline-flex items-center text-gray-500 hover:text-teal-700 transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft size={16} className="mr-2" />
              Kembali ke Daftar Galeri
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold tracking-widest text-teal-600 uppercase bg-teal-50 px-3 py-1 rounded-full">
                {gallery.category}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
              {gallery.title}
            </h1>

            <div className="w-full h-1 bg-teal-500 mb-8 rounded-full"></div>

            {/* Slider Gambar */}
            {photos.length > 0 && (
              <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100 mb-6 group flex items-center justify-center min-h-[200px]">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${gallery.title} - Foto ${index + 1}`}
                    className={`w-full h-auto max-h-[80vh] object-contain transition-opacity duration-500 ease-in-out ${
                      index === currentSlide ? 'relative opacity-100 z-10 block' : 'absolute top-0 left-0 opacity-0 z-0 pointer-events-none'
                    }`}
                    onError={(e) => setImageFallback(e.currentTarget, gallery.title)}
                  />
                ))}

                {/* Tombol Navigasi Slider */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.preventDefault(); setCurrentSlide(prev => (prev - 1 + photos.length) % photos.length); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); setCurrentSlide(prev => (prev + 1) % photos.length); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <ChevronRight size={28} />
                    </button>
                    
                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                      {photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                           className={`rounded-full transition-all duration-300 shadow-md ${
                            index === currentSlide ? 'w-8 h-2.5 bg-teal-500' : 'w-2.5 h-2.5 bg-white/70 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-thin">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentSlide ? 'border-teal-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => setImageFallback(e.currentTarget, `Thumbnail ${gallery.title}`)}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Deskripsi Foto/Galeri */}
            {gallery.description && (
              <div className="text-gray-800 text-lg leading-relaxed mt-8 text-justify">
                {gallery.description.split(/\n\n|\n/).filter(p => p.trim() !== '').map((paragraph, index) => (
                  <p key={index} className="mb-6">{paragraph.trim()}</p>
                ))}
              </div>
            )}

            {/* Share & Action Bar */}
            <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest text-teal-600 uppercase bg-teal-50 px-3 py-1 rounded-full">
                  {gallery.category}
                </span>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: gallery.title,
                      text: gallery.description || `Lihat galeri foto: ${gallery.title}`,
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
                Bagikan Galeri
              </button>
            </div>

          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};
