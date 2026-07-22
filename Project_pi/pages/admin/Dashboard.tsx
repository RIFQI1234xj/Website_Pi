import React, { useMemo } from 'react';
import {
  Users, FileText, Image, Loader2, Award, PlusCircle, Settings, Camera, PenTool, LayoutDashboard
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';
import { useTeachers } from '../../hooks/useTeachers';
import { useGallery } from '../../hooks/useGallery';
import { usePrograms } from '../../hooks/usePrograms';
import { usePpdbStatus } from '../../hooks/usePpdbStatus';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

// --- Sub Components ---
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  colorFrom: string;
  colorTo: string;
  iconBg: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, change, positive, colorFrom, colorTo, iconBg, loading }) => (
  <div className={`relative bg-white rounded-2xl p-5 shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 group`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${colorFrom} ${colorTo} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        {loading ? (
          <div className="flex items-center gap-2 mt-2">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            <span className="text-sm text-slate-400">Memuat...</span>
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${positive ? 'text-teal-600' : 'text-rose-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${positive ? 'bg-teal-500' : 'bg-rose-500'}`}></span>
                {change}
            </div>
          </>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm border border-white/50`}>
        <Icon className="w-5 h-5 opacity-90" />
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Dashboard ---
export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { news, loading: newsLoading } = useNews();
  const { teachers, loading: teachersLoading } = useTeachers();
  const { galleries, loading: galleriesLoading } = useGallery();
  const { programs, loading: programsLoading } = usePrograms();
  const { ppdbStatus } = usePpdbStatus();

  // Hitung distribusi kategori berita secara dinamis
  const newsPerCategoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    news.forEach((item) => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, total]) => ({ name, total }));
  }, [news]);

  // Hitung distribusi kategori galeri secara dinamis
  const galleriesPerCategoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    galleries.forEach((item) => {
      const cat = item.category || 'Lainnya';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, total]) => ({ name, total }));
  }, [galleries]);

  const activeProgramsCount = programs.filter(p => p.is_active !== false).length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">

      {/* Welcome Banner */}
      <div className="relative bg-teal-900 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-lg border border-teal-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-teal-400/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-gradient-to-tr from-teal-500/20 to-transparent rounded-full translate-y-1/2 blur-2xl" />
        <div className="relative z-10">
          <p className="text-teal-200 text-sm font-medium mb-1.5 flex items-center gap-2">
            Selamat Datang Kembali <span className="animate-wave inline-block origin-bottom-right">👋</span>
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Admin MI Al-Hasani</h2>
          <p className="text-teal-100/80 text-sm max-w-lg">
            Tahun Ajaran {ppdbStatus?.tahun_ajaran || '2024/2025'} • Semester Genap — Ringkasan performa dan pembaruan sistem hari ini.
          </p>
        </div>
      </div>

      {/* Stat Cards - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Users} label="Data Guru" value={String(teachers.length)} change={`${teachers.length} guru terdaftar`}
          positive={true} colorFrom="from-teal-400" colorTo="to-teal-600"
          iconBg="bg-teal-100 text-teal-700" loading={teachersLoading}
        />
        <StatCard
          icon={FileText} label="Berita & Artikel" value={String(news.length)} change={`${news.length} artikel aktif`}
          positive={true} colorFrom="from-indigo-400" colorTo="to-indigo-600"
          iconBg="bg-indigo-100 text-indigo-700" loading={newsLoading}
        />
        <StatCard
          icon={Image} label="Album Galeri" value={String(galleries.length)} change={`${galleries.length} foto terunggah`}
          positive={true} colorFrom="from-amber-400" colorTo="to-amber-600"
          iconBg="bg-amber-100 text-amber-700" loading={galleriesLoading}
        />
        <StatCard
          icon={Award} label="Program Sekolah" value={String(programs.length)} change={`${activeProgramsCount} program aktif`}
          positive={true} colorFrom="from-blue-400" colorTo="to-blue-600"
          iconBg="bg-blue-100 text-blue-700" loading={programsLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Distribusi Konten */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-8">
          
          {/* Distribusi Berita */}
          <div>
            <div className="mb-6">
              <h3 className="font-bold text-slate-800">Distribusi Konten Berita & Artikel</h3>
              <p className="text-xs text-slate-500 mt-1">Berdasarkan kategori artikel tayang di website</p>
            </div>
            {newsLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              </div>
            ) : newsPerCategoryData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-6 h-auto md:h-48">
                <div className="w-full md:w-1/2 h-48 min-w-0 min-h-0 relative">
                  <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie
                        data={newsPerCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="total"
                        stroke="none"
                      >
                        {newsPerCategoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                  {newsPerCategoryData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500 uppercase font-semibold truncate">{item.name}</p>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.total} Artikel</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-400 py-10 text-sm">Belum ada data berita & artikel.</p>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Distribusi Galeri */}
          <div>
            <div className="mb-6">
              <h3 className="font-bold text-slate-800">Distribusi Album Galeri</h3>
              <p className="text-xs text-slate-500 mt-1">Berdasarkan kategori foto dokumentasi</p>
            </div>
            {galleriesLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            ) : galleriesPerCategoryData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-6 h-auto md:h-48">
                <div className="w-full md:w-1/2 h-48 min-w-0 min-h-0 relative">
                  <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie
                        data={galleriesPerCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="total"
                        stroke="none"
                      >
                        {galleriesPerCategoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                  {galleriesPerCategoryData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[(i + 2) % COLORS.length] }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500 uppercase font-semibold truncate">{item.name}</p>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.total} Foto</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-400 py-10 text-sm">Belum ada foto galeri.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};