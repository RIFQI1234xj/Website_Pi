import React, { useState } from 'react';
import { Save, School, Globe, Mail, Phone, Lock, Bell, Shield } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [schoolName, setSchoolName] = useState('MI Al-Hasani');
  const [email, setEmail] = useState('info@mialhasani.sch.id');
  const [phone, setPhone] = useState('(022) 123-4567');
  const [website, setWebsite] = useState('https://mialhasani.sch.id');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const InputField = ({ label, icon: Icon, value, onChange, type = 'text' }: any) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type={type} value={value} onChange={(e: any) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition bg-white" />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <Shield size={16} /> Pengaturan berhasil disimpan!
        </div>
      )}

      {/* Profil Sekolah */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <School size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-800">Profil Sekolah</h3>
        </div>
        <InputField label="Nama Sekolah" icon={School} value={schoolName} onChange={setSchoolName} />
        <InputField label="Email Sekolah" icon={Mail} value={email} onChange={setEmail} type="email" />
        <InputField label="No. Telepon" icon={Phone} value={phone} onChange={setPhone} />
        <InputField label="Website" icon={Globe} value={website} onChange={setWebsite} />
      </div>

      {/* Keamanan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Lock size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-800">Keamanan Akun</h3>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Lama</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
          </div>
        </div>
      </div>

      {/* Notifikasi */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-800">Preferensi Notifikasi</h3>
        </div>
        {[
          { label: 'Notifikasi email untuk berita baru', desc: 'Terima email saat ada artikel baru dipublikasikan' },
          { label: 'Notifikasi pesan kontak', desc: 'Terima email saat ada pesan masuk dari pengunjung' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-semibold text-gray-700">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all shadow-inner" />
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleSave}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-600 shadow-sm hover:shadow-md transition-all font-semibold">
        <Save size={16} /> Simpan Pengaturan
      </button>
    </div>
  );
};
