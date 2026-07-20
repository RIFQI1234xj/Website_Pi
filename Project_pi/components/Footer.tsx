import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, Globe, ExternalLink } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { Page } from '../types';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { ensureUrl, getAddressWithPostalCode } from '../lib/schoolSettings';

interface FooterProps {
  setPage: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const { settings } = useSchoolSettings();
  const socialLinks = [
    { icon: Facebook, href: ensureUrl(settings.facebook_url), label: 'Facebook' },
    { icon: Instagram, href: ensureUrl(settings.instagram_url), label: 'Instagram' },
    { icon: Youtube, href: ensureUrl(settings.youtube_url), label: 'YouTube' },
  ].filter((item) => item.href);

  return (
    <footer className="bg-teal-700 text-white pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Kolom 1: Identitas Sekolah */}
          <AnimatedSection animation="slideUp" delay={0.1} className="flex flex-col items-center md:items-start text-center md:text-left">

            <img
              src={encodeURI('/logo madrasah hebat.png')}
              alt="logo madrasah hebat"
              className="h-24 w-auto mb-0"
            />
            <div className="flex space-x-3 mt-1">
              {socialLinks.length > 0 ? socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href || undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 text-white hover:bg-yellow-400 hover:text-teal-900 transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                );
              }) : (
                <span className="text-sm text-teal-200">Media sosial belum ditambahkan.</span>
              )}
            </div>
          </AnimatedSection>
          
          {/* Kolom 2: Tautan Cepat */}
          <AnimatedSection animation="slideUp" delay={0.2}>
            <h4 className="text-lg font-bold mb-6 text-white relative inline-block">
              Tautan Cepat
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-yellow-400 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm text-teal-50">
              <li>
                <button onClick={() => setPage(Page.HOME)} className="hover:text-yellow-400 transition-colors inline-flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-teal-400 transform group-hover:translate-x-1 transition-transform" /> Beranda
                </button>
              </li>
              <li>
                <button onClick={() => setPage(Page.PROFILE)} className="hover:text-yellow-400 transition-colors inline-flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-teal-400 transform group-hover:translate-x-1 transition-transform" /> Profil Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => setPage(Page.PROGRAMS)} className="hover:text-yellow-400 transition-colors inline-flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-teal-400 transform group-hover:translate-x-1 transition-transform" /> Program Unggulan
                </button>
              </li>
              <li>
                <button onClick={() => setPage(Page.NEWS)} className="hover:text-yellow-400 transition-colors inline-flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-teal-400 transform group-hover:translate-x-1 transition-transform" /> Berita & Artikel
                </button>
              </li>
              <li>
                <button onClick={() => setPage(Page.GALLERY)} className="hover:text-yellow-400 transition-colors inline-flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-teal-400 transform group-hover:translate-x-1 transition-transform" /> Galeri
                </button>
              </li>
              <li>
                <button onClick={() => setPage(Page.PPDB)} className="hover:text-yellow-400 transition-colors inline-flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-teal-400 transform group-hover:translate-x-1 transition-transform" /> PPDB
                </button>
              </li>
              <li>
                <button onClick={() => setPage(Page.CONTACT)} className="hover:text-yellow-400 transition-colors inline-flex items-center group">
                  <ArrowRight size={14} className="mr-2 text-teal-400 transform group-hover:translate-x-1 transition-transform" /> Kontak
                </button>
              </li>
            </ul>
          </AnimatedSection>
          
          {/* Kolom 3: Kontak Kami */}
          <AnimatedSection animation="slideUp" delay={0.3}>
            <h4 className="text-lg font-bold mb-6 text-white relative inline-block">
              Kontak Kami
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-yellow-400 rounded-full"></span>
            </h4>
            <div className="space-y-3 text-sm text-teal-50">
              <div className="flex items-start">
                <MapPin size={20} className="mr-2 flex-shrink-0 text-yellow-400" />
                <span className="leading-relaxed whitespace-pre-line">{getAddressWithPostalCode(settings)}</span>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="mr-2 text-yellow-400" />
                <span>{settings.phone || 'Nomor telepon belum tersedia'}</span>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="mr-2 text-yellow-400" />
                {settings.email ? (
                  <a href={`mailto:${settings.email}`} className="hover:text-yellow-400 transition-colors">
                    {settings.email}
                  </a>
                ) : (
                  <span>Email belum tersedia</span>
                )}
              </div>
              <div className="flex items-center">
                <Globe size={20} className="mr-2 text-yellow-400" />
                {settings.website ? (
                  <a
                    href={ensureUrl(settings.website) || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                  >
                    {settings.website}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span>Website belum tersedia</span>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Kolom 4: Lokasi */}
          <AnimatedSection animation="slideUp" delay={0.4}>
            <h4 className="text-lg font-bold mb-6 text-white relative inline-block">
              Lokasi
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-yellow-400 rounded-full"></span>
            </h4>
            
            {settings.map_embed_url ? (
              <iframe 
                src={settings.map_embed_url} 
                className="w-full h-48 rounded-lg shadow-lg border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title={`Lokasi ${settings.school_name}`}
              ></iframe>
            ) : settings.map_link ? (
              <a
                href={ensureUrl(settings.map_link) || undefined}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
              >
                <MapPin size={16} />
                Buka Lokasi di Google Maps
              </a>
            ) : (
              <p className="text-sm text-teal-200">Tautan lokasi belum tersedia.</p>
            )}
          </AnimatedSection>
      </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-teal-600 pt-8 flex justify-center items-center text-sm text-gray-400">
          <p className="text-center">&copy; {settings.school_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
