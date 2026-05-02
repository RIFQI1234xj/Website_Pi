import React, { useState, useEffect, useCallback } from 'react';
import { Maximize2, X, Loader2, ChevronLeft, ChevronRight, Images } from 'lucide-react';

// Struktur data yang dikirim dari Laravel
interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  photos: string[] | null;
  description: string | null;
}

export const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);

  // Mengambil data dari API Laravel
  useEffect(() => {
    setIsLoading(true);
    fetch('http://127.0.0.1:8000/api/galleries')
      .then(res => res.json())
      .then(hasil => {
        if (hasil.success) {
          setGalleries(hasil.data);
        }
      })
      .catch(err => console.error("Error ambil data galeri:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Daftar kategori untuk tombol filter
  const categories = ['All', 'Religi', 'Kegiatan', 'Prestasi', 'Ekskul', 'Acara'];
  
  // Logika Filter Data
  const filteredData = activeFilter === 'All' 
    ? galleries 
    : galleries.filter(item => item.category === activeFilter);

  // --- MODAL LOGIC ---

  // Mendapatkan daftar foto: cover image selalu jadi slide pertama, diikuti foto-foto album
  const getPhotos = (item: GalleryItem): string[] => {
    const coverImage = `/images/${item.image}`;
    
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
      // Cover image sebagai urutan pertama, lalu foto-foto album dari database
      return [coverImage, ...item.photos];
    }
    // Fallback: jika belum ada photos array, tampilkan cover image saja
    return [coverImage];
  };

  // Buka modal dengan animasi
  const openModal = (item: GalleryItem) => {
    setSelectedGallery(item);
    setCurrentSlide(0);
    setIsModalVisible(true);
    // Trigger animasi masuk setelah render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsModalAnimating(true);
      });
    });
  };

  // Tutup modal dengan animasi
  const closeModal = () => {
    setIsModalAnimating(false);
    // Tunggu animasi keluar selesai, lalu hapus dari DOM
    setTimeout(() => {
      setIsModalVisible(false);
      setSelectedGallery(null);
      setCurrentSlide(0);
    }, 300);
  };

  // Navigasi slider
  const photos = selectedGallery ? getPhotos(selectedGallery) : [];
  
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isModalVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalVisible, nextSlide, prevSlide]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalVisible]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Header Section */}
      <div className="bg-emerald-800 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Galeri Kegiatan</h1>
        <p className="text-emerald-200 px-4">Dokumentasi momen berharga keluarga besar MI Al-Hasani</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Tombol Filter Kategori */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === cat 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Galeri */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((item) => {
              const photoCount = item.photos && Array.isArray(item.photos) ? item.photos.length : 0;
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl shadow-sm overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  onClick={() => openModal(item)}
                >
                  {/* Area Gambar dengan efek hover */}
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <img 
                      src={`/images/${item.image}`} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/600/400?blur=2'; }}
                    />
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
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
                      <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded">
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
            Belum ada foto untuk kategori ini.
          </div>
        )}
      </div>

      {/* ======== MODAL CAROUSEL ======== */}
      {isModalVisible && selectedGallery && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
            isModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/85 backdrop-blur-md transition-all duration-300 ${
              isModalAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeModal}
          ></div>

          {/* Tombol Tutup (X) */}
          <button 
            onClick={closeModal} 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 text-white/70 hover:text-white transition bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Counter Foto */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 text-white/80 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            {currentSlide + 1} / {photos.length}
          </div>

          {/* Modal Content Container */}
          <div 
            className={`relative w-full max-w-6xl mx-4 flex flex-col items-center transition-all duration-300 ${
              isModalAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
            }`}
          >
            {/* === SLIDER AREA === */}
            <div className="relative w-full aspect-[16/10] md:aspect-[16/9] max-h-[70vh] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
              {/* Slides */}
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentSlide 
                      ? 'opacity-100 scale-100' 
                      : index < currentSlide 
                        ? 'opacity-0 scale-95 -translate-x-8' 
                        : 'opacity-0 scale-95 translate-x-8'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`${selectedGallery.title} - Foto ${index + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/gallery${selectedGallery.id}-${index}/800/600`; 
                    }}
                  />
                </div>
              ))}

              {/* Gradient overlay di bawah untuk readability */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

              {/* Tombol Prev */}
              {photos.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-md text-white rounded-full p-3 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Tombol Next */}
              {photos.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-md text-white rounded-full p-3 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* === INFO BAR (di bawah gambar) === */}
            <div className="w-full mt-5 flex flex-col items-center gap-4">
              
              {/* Dot Indicators */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 h-2.5 bg-emerald-400'
                          : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Judul & Deskripsi */}
              <div className="text-center max-w-2xl px-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase bg-emerald-400/10 px-3 py-1 rounded-full">
                    {selectedGallery.category}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">
                  {selectedGallery.title}
                </h2>
                {selectedGallery.description && (
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                    {selectedGallery.description}
                  </p>
                )}
              </div>

              {/* Thumbnail strip */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-full px-4 pb-2 scrollbar-thin">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                        index === currentSlide
                          ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-400/20'
                          : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { 
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/thumb${selectedGallery.id}-${index}/200/150`; 
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};