import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Book, Trophy, Loader2, ImageOff } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { apiFetch, getImageUrl, setImageFallback } from '../lib/api';

interface ProgramData {
  id: number;
  title: string;      // Sesuai dengan migration Laravel-mu
  category: string;
  description: string;
  image: string | null;
  images?: string[];
  is_active?: boolean;
}

const normalizeCategory = (value: string) => value.trim().toLowerCase();

export const Programs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('keagamaan');
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const hasil = await apiFetch('/programs');
        if (hasil.success) {
          setPrograms(hasil.data);
        }
      } catch (error) {
        console.error('Gagal mengambil data program:', error);
        setError('Program sekolah belum dapat dimuat saat ini.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = useMemo(
    () =>
      programs.filter(
        (prog) =>
          prog.is_active !== false &&
          normalizeCategory(prog.category) === normalizeCategory(activeTab)
      ),
    [activeTab, programs]
  );

  return (
    <div className="bg-white animate-fade-in min-h-screen">
      {/* Hero Section */}
      <AnimatedSection animation="fade" className="bg-teal-700 pt-32 pb-16 text-center text-white">
        <h1 className="font-serif text-4xl font-bold mb-4">Program Sekolah</h1>
        <p className="text-teal-200">Kegiatan unggulan pembentuk karakter siswa MI Al-Hasani</p>
      </AnimatedSection>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigasi Tab */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab('keagamaan')}
            className={`px-6 py-3 rounded-full font-bold flex items-center transition ${activeTab === 'keagamaan' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
          >
            <Sun size={18} className="mr-2" /> Keagamaan
          </button>
          
          <button 
            onClick={() => setActiveTab('akademik')}
            className={`px-6 py-3 rounded-full font-bold flex items-center transition ${activeTab === 'akademik' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
          >
            <Book size={18} className="mr-2" /> Akademik
          </button>

          <button 
            onClick={() => setActiveTab('ekstrakurikuler')}
            className={`px-6 py-3 rounded-full font-bold flex items-center transition ${activeTab === 'ekstrakurikuler' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
          >
            <Trophy size={18} className="mr-2" /> Ekstrakurikuler
          </button>
        </div>

        {/* Konten Program */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-teal-600">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="text-lg font-medium">Memuat data program...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
            <ImageOff size={48} className="mx-auto mb-4 text-rose-300" />
            <p className="font-semibold text-gray-700 mb-2">Program Belum Bisa Dimuat</p>
            <p>{error}</p>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPrograms.map((prog, index) => (
              <AnimatedSection key={prog.id} animation="slideUp" delay={index * 0.1} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                {/* Render gambar jika ada, jika tidak pakai placeholder warna hijau saja */}
                {prog.image ? (
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={getImageUrl(prog.image)} 
                      alt={prog.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500 cursor-pointer"
                      onClick={() => navigate(`/program/${prog.id}`)}
                      onError={(e) => {
                        setImageFallback(e.currentTarget, `Program ${prog.title}`);
                      }}
                    />
                    {prog.images && prog.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-medium pointer-events-none">
                        1/{prog.images.length}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-56 bg-teal-50 flex items-center justify-center">
                    <Book size={48} className="text-teal-200" />
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow">
                  <h4 
                    className="text-xl font-bold text-teal-900 mb-3 cursor-pointer hover:text-teal-700 transition-colors"
                    onClick={() => navigate(`/program/${prog.id}`)}
                  >
                    {prog.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                    {prog.description}
                  </p>
                  <button 
                    onClick={() => navigate(`/program/${prog.id}`)}
                    className="mt-auto text-left text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    Selengkapnya &rarr;
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <ImageOff size={48} className="mx-auto mb-4" />
            <p>Belum ada data program untuk kategori ini.</p>
          </div>
        )}
      </div>


    </div>
  );
};
