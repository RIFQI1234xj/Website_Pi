import React, { useState, useEffect } from 'react';
import { Sun, Book, Trophy, Loader2, ImageOff } from 'lucide-react';

interface ProgramData {
  id: number;
  title: string;      // Sesuai dengan migration Laravel-mu
  category: string;
  description: string;
  image: string | null;
}

export const Programs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('keagamaan'); // Sesuai kategori di Seeder
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Ambil data dari API Laravel
  useEffect(() => {
    setIsLoading(true);
    fetch('http://127.0.0.1:8000/api/programs')
      .then(response => response.json())
      .then(hasil => {
        if (hasil.success) {
          setPrograms(hasil.data);
        }
      })
      .catch(error => console.error("Gagal mengambil data program:", error))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter data berdasarkan tab yang diklik
  const filteredPrograms = programs.filter(prog => prog.category === activeTab);

  return (
    <div className="bg-white animate-fade-in">
      {/* Hero Section */}
      <div className="bg-emerald-800 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Program Sekolah</h1>
        <p className="text-emerald-200">Kegiatan unggulan pembentuk karakter siswa MI Al-Hasani</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigasi Tab - Pastikan ID sama dengan Category di Seeder */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab('keagamaan')}
            className={`px-6 py-3 rounded-full font-bold flex items-center transition ${activeTab === 'keagamaan' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
          >
            <Sun size={18} className="mr-2" /> Keagamaan
          </button>
          
          <button 
            onClick={() => setActiveTab('akademik')}
            className={`px-6 py-3 rounded-full font-bold flex items-center transition ${activeTab === 'akademik' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
          >
            <Book size={18} className="mr-2" /> Akademik
          </button>

          <button 
            onClick={() => setActiveTab('ekstrakurikuler')}
            className={`px-6 py-3 rounded-full font-bold flex items-center transition ${activeTab === 'ekstrakurikuler' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
          >
            <Trophy size={18} className="mr-2" /> Ekstrakurikuler
          </button>
        </div>

        {/* Konten Program */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="text-lg font-medium">Memuat data program...</p>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
            {filteredPrograms.map((prog) => (
              <div key={prog.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                {/* Render gambar jika ada, jika tidak pakai placeholder warna hijau saja */}
                {prog.image ? (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`/images/${prog.image}`} 
                      alt={prog.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?blur=2'; }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-emerald-50 flex items-center justify-center">
                    <Book size={48} className="text-emerald-200" />
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-bold text-emerald-900 mb-3">{prog.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {prog.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <ImageOff size={48} className="mx-auto mb-4" />
            <p>Belum ada data program untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};