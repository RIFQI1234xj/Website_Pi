import { useState, useEffect, FC } from 'react';
import { Maximize2, Loader2, Images } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { apiFetch, getImageUrl, isDummyImageSource, setImageFallback } from '../lib/api';

// Struktur data yang dikirim dari Laravel
interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  photos: string[] | null;
  description: string | null;
}

export const Gallery: FC = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const hasil = await apiFetch('/galleries');
        if (hasil.success) {
          setGalleries(hasil.data);
        }
      } catch (err) {
        console.error('Error ambil data galeri:', err);
        setError('Galeri kegiatan belum dapat dimuat saat ini.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Daftar kategori untuk tombol filter
  const categories = ['All', 'Religi', 'Kegiatan', 'Prestasi', 'Ekskul', 'Acara'];
  
  // Logika Filter Data
  const filteredData = activeFilter === 'All' 
    ? galleries 
    : galleries.filter(item => item.category === activeFilter);

  // --- MODAL LOGIC ---

  const getPhotos = (item: GalleryItem): string[] => {
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      const validPhotos = item.photos.filter((photo) => !isDummyImageSource(photo));
      if (validPhotos.length > 0) {
        return validPhotos.map((photo) => getImageUrl(photo));
      }
    }

    return item.image ? [getImageUrl(item.image)] : [];
  };



  return (
    <div className="bg-gray-50 min-h-screen font-poppins pb-20">
      <SEO title="Galeri" />
      {/* Header Halaman */}
      <AnimatedSection animation="fade" className="bg-teal-700 pt-32 pb-16 text-center text-white">
        <h1 className="font-serif text-4xl font-bold mb-4">Galeri Kegiatan</h1>
        <p className="text-teal-200 px-4">Dokumentasi momen berharga keluarga besar MI Al-Hasani</p>
      </AnimatedSection>

      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Tombol Filter Kategori */}
        <AnimatedSection animation="slideUp" className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setVisibleCount(6);
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === cat 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-teal-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </AnimatedSection>

        {/* Grid Galeri */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <Skeleton className="h-64 w-full rounded-none" />
                <div className="p-5 flex flex-col grow">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
            <p className="font-semibold text-gray-800 mb-2">Galeri Belum Bisa Dimuat</p>
            <p>{error}</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.slice(0, visibleCount).map((item, index) => {
              const photoCount = getPhotos(item).length;
              return (
                <AnimatedSection 
                  key={item.id} 
                  animation="scaleUp"
                  delay={index * 0.05}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  onClick={() => navigate('/galeri/' + item.id)}
                >
                  {/* Area Gambar dengan efek hover */}
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                      onError={(e) => {
                        setImageFallback(e.currentTarget, `Galeri ${item.title}`);
                      }}
                    />
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex flex-col items-center text-white">
                        <Maximize2 className="scale-50 group-hover:scale-100 transition-transform duration-300 mb-2" size={32} />
                        {photoCount > 0 && (
                          <span className="text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Images size={14} />
                            {photoCount} Foto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Teks di Bawah Gambar */}
                  <div className="p-5 flex flex-col grow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-teal-600 uppercase bg-teal-50 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      {photoCount > 0 && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Images size={12} /> {photoCount}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mt-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-auto pt-4 flex items-center">
                      Klik untuk melihat album foto
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
            <p>Tidak ada galeri untuk kategori ini.</p>
          </div>
        )}

        {/* Tombol Load More */}
        {!isLoading && !error && filteredData.length > visibleCount && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3 rounded-xl border-2 border-teal-600 text-teal-700 font-semibold hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Muat Lebih Banyak...
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
