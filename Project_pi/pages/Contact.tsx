import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter, 
  User, MessageSquare, Send
} from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { ensureUrl, getAddressWithPostalCode, normalizePhoneNumber } from '../lib/schoolSettings';

export const Contact: React.FC = () => {
  const { settings } = useSchoolSettings();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: ''
  });

  const whatsappNumber = normalizePhoneNumber(settings.whatsapp_number);
  const socialLinks = [
    { icon: Facebook, href: ensureUrl(settings.facebook_url), label: 'Facebook' },
    { icon: Instagram, href: ensureUrl(settings.instagram_url), label: 'Instagram' },
    { icon: Youtube, href: ensureUrl(settings.youtube_url), label: 'YouTube' },
    { icon: Twitter, href: ensureUrl(settings.twitter_url), label: 'Twitter / X' },
  ].filter((item) => item.href);

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber) return;
    const message = `Pesan Baru dari Website ${settings.school_name}\n\nNama: ${formData.nama}\nEmail: ${formData.email}\nPesan: ${formData.pesan}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-ivory-50 animate-fade-in min-h-screen pb-12">
      {/* Hero Banner Asli (Dikembalikan) */}
      <div className="bg-teal-700 pt-32 pb-16 text-center text-white">
        <h1 className="font-serif text-4xl font-bold mb-4">Kontak</h1>
        <p className="text-teal-200">Hubungi kami untuk informasi lebih lanjut</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Kotak Form (Terpisah dan Sejajar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Side: Contact Info (Dark Teal) */}
          <AnimatedSection animation="slideLeft" className="bg-teal-700 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg flex flex-col h-full">
            {/* Background Decorations */}
            <div className="absolute -top-24 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Phone className="w-8 h-8 opacity-90" />
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Informasi Kontak</h2>
                </div>
                
                <p className="text-teal-100 mb-10 text-sm leading-relaxed opacity-90">
                  Jangan ragu untuk menghubungi kami melalui berbagai saluran berikut. Kami berkomitmen untuk merespons setiap pertanyaan dalam waktu 24 jam.
                </p>

                <div className="space-y-6 mb-10">
                  {/* WhatsApp */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/5">
                      <Phone className="w-5 h-5 text-emerald-100" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">WhatsApp</h4>
                      <p className="text-emerald-100 text-sm">{settings.whatsapp_number || 'Belum tersedia'}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/5">
                      <Mail className="w-5 h-5 text-emerald-100" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Email</h4>
                      <p className="text-emerald-100 text-sm">{settings.email || 'Belum tersedia'}</p>
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/5">
                      <MapPin className="w-5 h-5 text-emerald-100" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Alamat</h4>
                      <p className="text-emerald-100 text-sm leading-snug whitespace-pre-line">{getAddressWithPostalCode(settings)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {/* Ikuti Kami */}
                <div className="mb-8">
                  <h4 className="font-bold text-white mb-4 text-sm">Ikuti Kami</h4>
                  {socialLinks.length > 0 ? (
                    <div className="flex gap-3">
                      {socialLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.label}
                            href={item.href || undefined}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={item.label}
                            className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/5"
                          >
                            <Icon className="w-4 h-4 text-emerald-50" />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-emerald-100 text-sm">Media sosial resmi belum ditambahkan.</p>
                  )}
                </div>

                {/* Maps Button */}
                {settings.map_link ? (
                  <a 
                    href={ensureUrl(settings.map_link) || undefined} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <MapPin className="w-4 h-4" />
                    Lihat di Gmaps
                  </a>
                ) : (
                  <div className="w-full py-3.5 bg-white/10 text-emerald-100 rounded-xl font-semibold text-center border border-white/10">
                    Link lokasi belum tersedia
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Right Side: Form (White) */}
          <AnimatedSection animation="slideRight" delay={0.2} className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 flex flex-col h-full">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-2">Kirim Pesan</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Isi formulir berikut dan kami akan segera membalas Anda melalui pesan WhatsApp atau email yang Anda isikan.
              </p>
            </div>

            <form onSubmit={handleWhatsAppSend} className="space-y-6 flex-1 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-slate-50 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-sm" 
                      placeholder="Nama Anda" 
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-slate-50 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-sm" 
                      placeholder="email@contoh.com" 
                    />
                  </div>
                </div>
              </div>

              {/* Pesan */}
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-bold text-slate-700 mb-2">Pesan</label>
                <div className="relative flex-1">
                  <MessageSquare className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                  <textarea 
                    required
                    value={formData.pesan}
                    onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                    className="w-full h-full min-h-[120px] pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:bg-slate-50 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-sm resize-none" 
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!whatsappNumber}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {whatsappNumber ? 'Kirim Pesan' : 'WhatsApp Belum Tersedia'}
              </button>
            </form>
          </AnimatedSection>

        </div>

        {/* Map Section */}
        <AnimatedSection animation="slideUp" delay={0.3} className="mt-24 mb-8">
          <h2 className="font-serif text-3xl font-bold text-center text-slate-800 tracking-tight mb-8">Lokasi Kami</h2>
          <div className="w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
            {settings.map_embed_url ? (
              <iframe
                src={settings.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Lokasi ${settings.school_name}`}
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 px-6 text-center">
                Peta lokasi belum ditambahkan pada pengaturan sekolah.
              </div>
            )}
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
};
