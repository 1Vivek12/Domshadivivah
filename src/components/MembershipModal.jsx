import React, { useState } from 'react';
import { X, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MembershipModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    candidateType: 'daughter',
    candidateName: '',
    familyName: '',
    city: '',
    profession: '',
    phone: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-xl royal-card bg-[#14030a] border-2 border-[#d4af37] p-6 sm:p-8 rounded-2xl shadow-[0_0_60px_rgba(212,175,55,0.35)] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#f5d77f] hover:bg-[#801235] transition-colors border border-[#d4af37]/40"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#801235] border-2 border-[#d4af37] mx-auto flex items-center justify-center text-[#f5d77f] animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-gold-gradient">
              {t.modalThanksTitle}
            </h3>
            <p className="text-sm sm:text-base text-[#faeed1] font-accent">
              {formData.familyName ? `${formData.familyName} • ` : ''}{t.modalThanksDesc}
            </p>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#801235]/40 border border-[#d4af37]/40 text-[#f5d77f] text-[10px] uppercase tracking-widest font-accent mb-3">
              <ShieldCheck size={12} />
              <span>{t.modalBadge}</span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#faeed1] mb-2">
              {t.modalTitle}
            </h3>

            <p className="text-xs text-[#d8c7b5] font-light leading-relaxed mb-6">
              {t.modalDesc}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                  {t.inquiringFor}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'daughter', label: t.optionDaughter },
                    { id: 'son', label: t.optionSon },
                    { id: 'self', label: t.optionSelf },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setFormData({ ...formData, candidateType: item.id })}
                      className={`py-2 rounded-lg border text-xs font-accent transition-all ${
                        formData.candidateType === item.id
                          ? 'bg-[#d4af37] text-black font-bold border-[#f5d77f]'
                          : 'bg-black/40 border-[#d4af37]/30 text-stone-300 hover:border-[#d4af37]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.candidateNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    placeholder="e.g. अनन्या शर्मा / Ananya"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.familyNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.familyName}
                    onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                    placeholder="e.g. राठौड़ (मेवाड़) / Rathore"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.professionLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="e.g. वास्तुकार / Senior Architect"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.cityLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. नई दिल्ली / New Delhi"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="family@domain.com"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <p className="text-[10px] text-stone-400 italic">
                {t.modalDisclaimer}
              </p>

              <button
                type="submit"
                className="btn-royal-gold w-full text-center py-3 text-xs tracking-widest mt-2"
              >
                {t.submitInquiry}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
