import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Contact: React.FC = () => {
  // 1. Inisialisasi State untuk Form
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: ''
  });

  // 2. Logika Pengiriman ke WhatsApp
  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nomor WA Admin (Gunakan kode negara 62 tanpa tanda + atau spasi)
    const WHATSAPP_NUMBER = "6281385086531"; 

    // Susun format pesan
    const message = `Pesan Baru dari Website MI Al-Hasani\n\n` +
                    `Nama: ${formData.nama}\n` +
                    `Email: ${formData.email}\n` +
                    `Pesan: ${formData.pesan}`;

    // Buka WhatsApp di tab baru
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white animate-fade-in">
      <div className="bg-emerald-800 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Kontak</h1>
        <p className="text-emerald-200">Hubungi kami untuk informasi lebih lanjut</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left: Info */}
            <div className="space-y-8">
                 <div>
                     <h2 className="text-2xl font-bold text-emerald-800 mb-6">Hubungi Kami</h2>
                     <p className="text-gray-600 mb-8">
                         Silakan hubungi kami untuk informasi PPDB atau menyampaikan kritik dan saran membangun.
                     </p>
                     
                     <div className="space-y-6">
                         <div className="flex items-start">
                             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                                 <MapPin size={24} />
                             </div>
                             <div className="ml-4">
                                 <h4 className="font-bold text-gray-800">Alamat</h4>
                                 <p className="text-gray-600 text-sm">Jl. Kp. Babakansirna 02/02 Ds. Jogjogan Kec. Cisarua Kab. Bogor 16750</p>
                             </div>
                         </div>
                         <div className="flex items-start">
                             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                                 <Phone size={24} />
                             </div>
                             <div className="ml-4">
                                 <h4 className="font-bold text-gray-800">Telepon / WA</h4>
                                 <p className="text-gray-600 text-sm">+(0813) 85086531</p>
                             </div>
                         </div>
                          <div className="flex items-start">
                             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                                 <Mail size={24} />
                             </div>
                             <div className="ml-4">
                                 <h4 className="font-bold text-gray-800">Email</h4>
                                 <p className="text-gray-600 text-sm">misalhasani@gmail.com</p>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>

            {/* Right: Form Terintegrasi WA */}
            <div className="bg-white p-0 rounded-2xl">
                <h2 className="text-2xl font-bold text-emerald-800 mb-6">Kirim Pesan</h2>
                <form onSubmit={handleWhatsAppSend} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input 
                          type="text" 
                          required
                          value={formData.nama}
                          onChange={(e) => setFormData({...formData, nama: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                          placeholder="Nama Anda" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                          placeholder="email@contoh.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                        <textarea 
                          rows={4} 
                          required
                          value={formData.pesan}
                          onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                          placeholder="Tulis pesan Anda disini..."
                        ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-md"
                    >
                        Kirim Pesan via WhatsApp
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};