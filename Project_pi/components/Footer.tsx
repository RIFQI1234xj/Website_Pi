import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-900 text-white pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Kolom 1: Identitas Sekolah */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-extrabold mb-0 text-yellow-400 tracking-wide">
              MI Al-Hasani
            </h3>
            <img
              src={encodeURI('/logo madrasah hebat.png')}
              alt="logo madrasah hebat"
              className="h-24 w-auto mb-0"
            />
            <div className="flex space-x-3 mt-1">
              <a href="#" className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 text-white hover:bg-yellow-400 hover:text-emerald-900 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 text-white hover:bg-yellow-400 hover:text-emerald-900 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 text-white hover:bg-yellow-400 hover:text-emerald-900 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          
          {/* Kolom 2: Kontak Kami */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Kontak Kami</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <MapPin size={20} className="mr-2 flex-shrink-0 text-yellow-500" />
                <span className="leading-relaxed">Jl. Kp. Babakansirna 02/02 Ds. Jogjogan Kec. Cisarua Kab. Bogor 16750</span>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="mr-2 text-yellow-500" />
                <span>+(0251) 8256657</span>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="mr-2 text-yellow-500" />
                <span>misalhasani@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Kolom 3: Lokasi */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Lokasi</h4>
          
          {/* Peta Google Maps MTsS Al Hasani (FIXED LOKASI) */}
          <iframe 
            src="https://maps.google.com/maps?q=MTsS+AL+HASANI,+Jl.+Jogjogan,+Cisarua,+Bogor&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            className="w-full h-48 rounded-lg shadow-lg border-0" 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-emerald-800 pt-8 flex justify-center items-center text-sm text-gray-400">
          <p className="text-center">&copy; MI Al-Hasani. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};