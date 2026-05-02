import React from 'react';
import {
  Users, FileText, Image, TrendingUp, MessageSquare, Calendar,
  ArrowUpRight, Eye, CheckCircle, Clock, AlertCircle, Mail
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// --- Dummy Data ---
const visitData = [
  { name: 'Jan', pengunjung: 420 }, { name: 'Feb', pengunjung: 380 },
  { name: 'Mar', pengunjung: 650 }, { name: 'Apr', pengunjung: 590 },
  { name: 'Mei', pengunjung: 810 }, { name: 'Jun', pengunjung: 760 },
  { name: 'Jul', pengunjung: 920 }, { name: 'Agu', pengunjung: 875 },
  { name: 'Sep', pengunjung: 1040 }, { name: 'Okt', pengunjung: 980 },
  { name: 'Nov', pengunjung: 1120 }, { name: 'Des', pengunjung: 1350 },
];

const newsPerCategoryData = [
  { name: 'Kegiatan', total: 12 },
  { name: 'Pengumuman', total: 8 },
  { name: 'Prestasi', total: 5 },
  { name: 'Lainnya', total: 3 },
];

const newsMonthlyData = [
  { name: 'Jan', berita: 2 }, { name: 'Feb', berita: 3 },
  { name: 'Mar', berita: 1 }, { name: 'Apr', berita: 4 },
  { name: 'Mei', berita: 5 }, { name: 'Jun', berita: 2 },
  { name: 'Jul', berita: 3 }, { name: 'Agu', berita: 4 },
  { name: 'Sep', berita: 6 }, { name: 'Okt', berita: 3 },
  { name: 'Nov', berita: 2 }, { name: 'Des', berita: 4 },
];

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

const recentActivities = [
  { icon: FileText, color: 'text-blue-500 bg-blue-50', action: 'Berita baru ditambahkan', detail: 'Siswa Juara Tahfidz Quran', time: '5 menit lalu', status: 'success' },
  { icon: Image, color: 'text-purple-500 bg-purple-50', action: 'Foto galeri diupload', detail: 'Album Maulid Nabi 2024', time: '1 jam lalu', status: 'success' },
  { icon: Users, color: 'text-emerald-500 bg-emerald-50', action: 'Data guru diperbarui', detail: 'Profil Budi Santoso, S.Pd', time: '3 jam lalu', status: 'info' },
  { icon: Mail, color: 'text-amber-500 bg-amber-50', action: 'Pesan kontak masuk', detail: 'Pertanyaan jadwal PPDB 2025', time: 'Kemarin', status: 'warning' },
  { icon: MessageSquare, color: 'text-red-500 bg-red-50', action: 'Pesan kontak masuk', detail: 'Pertanyaan pendaftaran online', time: 'Kemarin', status: 'pending' },
];

const upcomingEvents = [
  { name: 'Rapat Komite Sekolah', date: '5 Mei 2025', type: 'meeting' },
  { name: 'Ujian Tengah Semester', date: '12 Mei 2025', type: 'exam' },
  { name: 'Peringatan Isra Mi\'raj', date: '20 Mei 2025', type: 'event' },
  { name: 'Penerimaan Rapor', date: '31 Mei 2025', type: 'academic' },
];

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
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, change, positive, colorFrom, colorTo, iconBg }) => (
  <div className={`relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${colorFrom} ${colorTo} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
            {change} dari bulan lalu
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <Icon size={22} className="opacity-90" />
      </div>
    </div>
  </div>
);

const eventTypeStyle: Record<string, string> = {
  meeting: 'bg-blue-100 text-blue-700',
  exam: 'bg-red-100 text-red-700',
  event: 'bg-purple-100 text-purple-700',
  academic: 'bg-amber-100 text-amber-700',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-lg">
        <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
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
  return (
    <div className="p-6 space-y-6">

      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-emerald-200 text-sm font-medium mb-1">Selamat Datang Kembali 👋</p>
          <h2 className="text-2xl font-bold mb-1">Admin MI Al-Hasani</h2>
          <p className="text-emerald-100 text-sm">
            Tahun Ajaran 2024/2025 • Semester Genap — Semoga hari ini produktif!
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users} label="Tenaga Pendidik" value="14" change="+1 guru"
          positive={true} colorFrom="from-emerald-400" colorTo="to-emerald-600"
          iconBg="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={FileText} label="Berita Tayang" value="28" change="+3 artikel"
          positive={true} colorFrom="from-purple-400" colorTo="to-purple-600"
          iconBg="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={Image} label="Album Galeri" value="42" change="+5 foto"
          positive={true} colorFrom="from-amber-400" colorTo="to-amber-600"
          iconBg="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Area Chart - Pengunjung */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Statistik Pengunjung Website</h3>
              <p className="text-xs text-gray-400 mt-0.5">Jumlah kunjungan per bulan — 2024</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <TrendingUp size={12} />
              +22% YoY
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={visitData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="pengunjung" name="Pengunjung"
                stroke="#059669" strokeWidth={2.5} fill="url(#colorVisit)"
                dot={{ fill: '#059669', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Kategori Berita */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800">Kategori Berita</h3>
            <p className="text-xs text-gray-400 mt-0.5">Distribusi artikel berdasarkan kategori</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={newsPerCategoryData} cx="50%" cy="50%"
                innerRadius={45} outerRadius={70}
                paddingAngle={4} dataKey="total"
              >
                {newsPerCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {newsPerCategoryData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{item.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: News per Month Chart + Upcoming Events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Bar Chart - Berita per Bulan */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Berita Dipublikasikan per Bulan</h3>
              <p className="text-xs text-gray-400 mt-0.5">Jumlah artikel yang diterbitkan — 2024</p>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <FileText size={12} />
              Total: 39 artikel
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={newsMonthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="berita" name="Artikel" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-emerald-600" />
            <h3 className="font-bold text-gray-800">Agenda Mendatang</h3>
          </div>
          <div className="space-y-3 flex-1">
            {upcomingEvents.map((event) => (
              <div key={event.name} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors group">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${eventTypeStyle[event.type]}`}>
                  {event.type === 'meeting' ? 'Rapat' : event.type === 'exam' ? 'Ujian' : event.type === 'event' ? 'Acara' : 'Akademik'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors truncate">{event.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Aktivitas Terkini</h3>
          <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Lihat Semua</button>
        </div>
        <div className="space-y-1">
          {recentActivities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700">{activity.action}</p>
                  <p className="text-xs text-gray-400 truncate">{activity.detail}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-gray-400">{activity.time}</span>
                  {activity.status === 'success' && <CheckCircle size={14} className="text-emerald-500" />}
                  {activity.status === 'warning' && <Clock size={14} className="text-amber-500" />}
                  {activity.status === 'pending' && <AlertCircle size={14} className="text-red-400" />}
                  {activity.status === 'info' && <Eye size={14} className="text-blue-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};