import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Lock, X, ClipboardList, MessageCircle, Phone, Loader2, AlertCircle } from 'lucide-react';
import { usePpdbStatus } from '../../hooks/usePpdbStatus';

// --- WhatsApp panitia ---
const PANITIA_WA_NUMBER = '6281385086531';
const PANITIA_WA_TEXT = encodeURIComponent(
  "Assalamu'alaikum, saya ingin bertanya mengenai pendaftaran PPDB MI Al-Hasani. Terima kasih."
);

interface PPDBStatusModalProps {
  onStatusChange?: (isOpen: boolean) => void;
}

export const PPDBStatusModal: React.FC<PPDBStatusModalProps> = ({ onStatusChange }) => {
  const [showModal, setShowModal] = useState(true);
  const { ppdbStatus, loading, error } = usePpdbStatus();

  // Notify parent component about the status so it can hide/disable the form if needed
  useEffect(() => {
    if (ppdbStatus && onStatusChange) {
      onStatusChange(ppdbStatus.is_open);
    }
  }, [ppdbStatus, onStatusChange]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const scrollToForm = () => {
    setShowModal(false);
    // Add a slight delay to allow modal to close before scrolling
    setTimeout(() => {
      const formElement = document.getElementById('registration-form-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 size={40} className="text-emerald-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Memuat informasi PPDB...</p>
            </div>
          ) : error || !ppdbStatus ? (
            <div className="p-10 flex flex-col items-center text-center min-h-[300px]">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h3>
              <p className="text-gray-500 text-sm mb-6">{error || 'Gagal terhubung ke server.'}</p>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          ) : ppdbStatus.is_open ? (
            // SCENARIO A: OPEN
            <div className="p-8 md:p-10 text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                 {/* Pulsing ring */}
                 <div className="absolute inset-0 rounded-full border-4 border-emerald-400 opacity-20 animate-ping"></div>
                 <Megaphone size={36} className="text-emerald-600 relative z-10" />
              </div>
              
              <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full mb-4">
                Tahun Ajaran {ppdbStatus.tahun_ajaran}
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">
                Pendaftaran PPDB Online<br/>
                <span className="text-emerald-600">Resmi Dibuka!</span>
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed px-2">
                Selamat Datang! Penerimaan Peserta Didik Baru (PPDB) Online MI Al-Hasani Tahun Ajaran <strong>{ppdbStatus.tahun_ajaran}</strong> telah resmi dibuka. Silakan siapkan berkas pendaftaran Anda.
              </p>
            </div>
          ) : (
            // SCENARIO B: CLOSED
            <div className="p-8 md:p-10 text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                 <Lock size={36} className="text-red-500 relative z-10" />
              </div>

              <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-full mb-4">
                Tahun Ajaran {ppdbStatus.tahun_ajaran}
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">
                Pendaftaran Belum Dibuka / <span className="text-red-600">Ditutup</span>
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-8 px-2">
                Mohon maaf, saat ini pendaftaran online PPDB MI Al-Hasani Tahun Ajaran <strong>{ppdbStatus.tahun_ajaran}</strong> belum dibuka atau telah resmi berakhir.
              </p>

              <div className="flex flex-col items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${PANITIA_WA_NUMBER}?text=${PANITIA_WA_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full group flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/30 transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle size={18} />
                  Hubungi Panitia via WhatsApp
                  <Phone size={14} className="opacity-70 group-hover:rotate-12 transition-transform" />
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-semibold rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
