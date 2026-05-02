import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  setProfileTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage, setProfileTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // --- LOGIC LOGO CERDAS ---
  // 1. Sistem akan mencoba memuat file "/logo.png" (file Anda).
  // 2. Jika tidak ditemukan, akan otomatis menggunakan fallbackLogo (Inisial MI).
  const [imgSrc, setImgSrc] = useState<string>("/logo.png");
  
  const fallbackLogo = "https://ui-avatars.com/api/?name=MI&background=FBBF24&color=064E3B&bold=true&size=128&rounded=true";

  const handleImageError = () => {
    // Jika gambar lokal gagal dimuat (file tidak ada), ganti ke fallback
    if (imgSrc !== fallbackLogo) {
      setImgSrc(fallbackLogo);
    }
  };

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Trigger change when scrolled down 20px
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Beranda', value: Page.HOME },
    { 
      label: 'Profil', 
      value: Page.PROFILE,
      children: [
        { label: 'Identitas Sekolah', tab: 'identitas' },
        { label: 'Sejarah & Visi Misi', tab: 'sejarah' },
        { label: 'Guru & Staff', tab: 'guru' },
        { label: 'Fasilitas Sekolah', tab: 'fasilitas' },
      ]
    },
    { label: 'Program', value: Page.PROGRAMS },
    { label: 'Berita', value: Page.NEWS },
    { label: 'Galeri', value: Page.GALLERY },
    { label: 'Kontak', value: Page.CONTACT },
  ];

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsOpen(false);
    if (page !== Page.PROFILE || currentPage !== Page.PROFILE) {
         window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDropdownClick = (page: Page, tab: string) => {
    setProfileTab(tab);
    setIsOpen(false);
    setActiveDropdown(null);

    if (currentPage === page) {
        const element = document.getElementById(tab);
        if (element) {
            const yOffset = -90; 
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    } else {
        setPage(page);
    }
  };

  // Logic for visual state:
  // 1. If mobile menu is open -> Solid White background
  // 2. If Scrolled -> Glassmorphism (Semi-transparent white + Blur)
  // 3. If Top -> Transparent
  const isSolidNavbar = isOpen || isScrolled;

  // Dynamic Styles
  const navbarClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans ${
    isOpen 
      ? 'bg-white shadow-md py-0' // Mobile menu open: Solid White
      : isScrolled
        ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' // Scrolled: Frosted Glass Effect
        : 'bg-transparent py-4' // Top: Transparent
  }`;

  // Text Colors:
  // Dark Green when scrolled or menu open (for readability on white/glass)
  // White when at top (for readability on dark hero images)
  const textColorClass = isSolidNavbar ? 'text-emerald-950' : 'text-white';
  const subTextColorClass = isSolidNavbar ? 'text-emerald-700' : 'text-emerald-100';
  const mobileMenuButtonColor = isSolidNavbar ? 'text-emerald-800' : 'text-white';

  const getLinkClass = (itemValue: Page) => {
    const isActive = currentPage === itemValue;
    if (isSolidNavbar) {
        // Style when scrolled (Dark Text)
        return isActive 
            ? 'text-emerald-800 border-yellow-500' 
            : 'text-gray-600 border-transparent hover:text-emerald-800 hover:border-emerald-300';
    } else {
        // Style when top (White Text)
        return isActive 
            ? 'text-yellow-400 border-yellow-400' 
            : 'text-white/90 border-transparent hover:text-yellow-400 hover:border-yellow-400/50';
    }
  };

  return (
    <nav className={navbarClasses}>
      {/* Optional: Subtle gradient shade for better text readability on transparent mode only */}
      {!isSolidNavbar && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none transition-opacity duration-300"></div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16 md:h-20 transition-all duration-300">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNavClick(Page.HOME)}>
            <div className={`flex-shrink-0 flex items-center transition-colors duration-300 ${textColorClass}`}>
              
              <img 
                src={imgSrc}
                onError={handleImageError}
                alt="Logo MI Al-Hasani"
                className={`mr-3 object-contain drop-shadow-md transition-all duration-300 ${isScrolled ? 'h-10 w-auto max-w-[120px]' : 'h-10 md:h-12 w-auto max-w-[150px]'}`}
              />

              <div className="flex flex-col">
                <h1 className={`font-bold text-xl md:text-2xl leading-none tracking-tight drop-shadow-sm transition-colors duration-300 ${textColorClass}`}>MI AL-HASANI</h1>
                <p className={`text-[10px] md:text-xs font-medium tracking-wide mt-0.5 transition-colors duration-300 ${subTextColorClass}`}>Cerdas, Berkarakter, Islami</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <>
                    <button
                      className={`text-sm font-bold px-1 py-1 transition-all duration-300 border-b-2 flex items-center tracking-wide ${getLinkClass(item.value)}`}
                      onClick={() => handleNavClick(item.value)}
                    >
                      {item.label} <ChevronDown size={14} className="ml-1" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pt-4">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropdownClick(item.value, child.tab);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-b border-gray-50 last:border-0"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.value)}
                    className={`text-sm font-bold px-1 py-1 transition-all duration-300 border-b-2 tracking-wide ${getLinkClass(item.value)}`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            {/* Admin Button - Desktop */}
            <button
              onClick={() => { setPage(Page.ADMIN_DASHBOARD); setIsOpen(false); }}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-300 ${
                isSolidNavbar
                  ? 'border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white'
                  : 'border-white/60 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              <ShieldCheck size={13} /> Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${mobileMenuButtonColor} focus:outline-none p-2 transition-colors duration-300 hover:text-yellow-500`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 max-h-screen overflow-y-auto animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                   <div>
                     <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-lg text-base font-bold transition-colors ${
                          currentPage === item.value
                            ? 'text-emerald-800 bg-emerald-50 border-l-4 border-emerald-600'
                            : 'text-gray-600 hover:text-emerald-800 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                        <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Mobile Submenu */}
                      <div className={`pl-8 pr-4 space-y-1 overflow-hidden transition-all duration-300 ${activeDropdown === item.label ? 'max-h-96 py-2' : 'max-h-0'}`}>
                         {item.children.map(child => (
                           <button
                             key={child.label}
                             onClick={() => handleDropdownClick(item.value, child.tab)}
                             className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-500 hover:text-emerald-700 rounded-md hover:bg-emerald-50"
                           >
                             {child.label}
                           </button>
                         ))}
                      </div>
                   </div>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.value)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-base font-bold transition-colors ${
                      currentPage === item.value
                        ? 'text-emerald-800 bg-emerald-50 border-l-4 border-emerald-600'
                        : 'text-gray-600 hover:text-emerald-800 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            {/* Admin Link - Mobile */}
            <button
              onClick={() => { setPage(Page.ADMIN_DASHBOARD); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-base font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors"
            >
              <ShieldCheck size={16} /> Masuk Panel Admin
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};