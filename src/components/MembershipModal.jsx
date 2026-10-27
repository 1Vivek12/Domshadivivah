import React, { useState } from 'react';
import { X, ShieldCheck, Heart, Sparkles, CheckCircle2, User, Phone, Mail, MapPin, Briefcase, Calendar, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MembershipModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    role: 'groom',
    name: '',
    dob: '',
    age: '',
    maritalStatus: 'never_married',
    education: '',
    profession: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    familyMembers: [
      { relation: 'Father', name: '', contact: '', consentGiven: true },
      { relation: 'Mother', name: '', contact: '', consentGiven: true }
    ],
    termsAccepted: false,
    privacyConsent: false,
  });

  if (!isOpen) return null;

  const currentFee = formData.role === 'groom' ? 5100 : 2100;

  const handleAddFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        { relation: 'Guardian', name: '', contact: '', consentGiven: true }
      ]
    }));
  };

  const handleRemoveFamilyMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.familyMembers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, familyMembers: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.termsAccepted || !formData.privacyConsent) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया नियम एवं शर्तों तथा डेटा गोपनीयता की सहमति को स्वीकार करें।'
          : 'Please accept the Terms of Service and Privacy Consent.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/membership/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Registration failed');
      }

      setSubmittedData(result.data);
    } catch (err) {
      console.error('Registration submission error:', err);
      setErrorMessage(err.message || 'Server error. Please verify network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedData(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl royal-card bg-[#14030a] border-2 border-[#d4af37] p-5 sm:p-8 rounded-2xl shadow-[0_0_60px_rgba(212,175,55,0.35)] my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={resetForm}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#f5d77f] hover:bg-[#801235] transition-colors border border-[#d4af37]/40"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {submittedData ? (
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#801235] border-2 border-[#d4af37] mx-auto flex items-center justify-center text-[#f5d77f] animate-bounce">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                REGISTRATION ID: {submittedData.id}
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-gold-gradient mt-1">
                {t.modalThanksTitle}
              </h3>
            </div>

            {/* Honest Payment Status Notice (Requirement 6) */}
            <div className="p-4 rounded-xl bg-[#200511] border border-[#d4af37]/50 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-accent text-[#f5d77f]">
                <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                <span className="font-bold">
                  {language === 'hi' ? 'भुगतान स्थिति: गेटवे एकीकरण प्रक्रियाधीन' : 'Payment Status: Gateway Integration Pending'}
                </span>
              </div>
              <p className="text-xs text-[#faeed1] leading-relaxed">
                {language === 'hi' ? submittedData.messageHindi : submittedData.messageEn}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#d8c7b5]">
                <span>{language === 'hi' ? 'निर्धारित शुल्क:' : 'Assigned Fee:'} <strong>₹{submittedData.fee?.toLocaleString()}</strong></span>
                <span className="font-mono text-[11px] text-amber-300">Status: GATEWAY_PENDING</span>
              </div>
            </div>

            <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
              {t.modalThanksDesc}
            </p>

            <button
              onClick={resetForm}
              className="btn-royal-gold text-xs px-6 py-2.5 mx-auto"
            >
              {language === 'hi' ? 'स्वीकारें एवं बंद करें' : 'Acknowledge & Close'}
            </button>
          </div>
        ) : (
          <div>
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#801235]/40 border border-[#d4af37]/40 text-[#f5d77f] text-[10px] uppercase tracking-widest font-accent mb-3">
              <ShieldCheck size={12} />
              <span>{t.modalBadge}</span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#faeed1] mb-1">
              {t.modalTitle}
            </h3>

            {/* Upfront Transparent Pricing Schedule (Requirement 1) */}
            <div className="my-4 p-4 rounded-xl bg-[#220614] border border-[#d4af37]/60 shadow-inner">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#d4af37]/20">
                <span className="text-xs font-accent uppercase tracking-wider text-[#f5d77f]">
                  {t.feeNoticeTitle}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">100% INR Transparent</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className={`p-2.5 rounded-lg border transition-all ${formData.role === 'groom' ? 'bg-[#801235]/60 border-[#f5d77f] shadow' : 'bg-black/30 border-[#d4af37]/25'}`}>
                  <span className="text-xs block text-[#d8c7b5]">{t.groomRole}</span>
                  <span className="font-display font-bold text-lg sm:text-xl text-[#f5d77f]">₹5,100</span>
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${formData.role === 'bride' ? 'bg-[#801235]/60 border-[#f5d77f] shadow' : 'bg-black/30 border-[#d4af37]/25'}`}>
                  <span className="text-xs block text-[#d8c7b5]">{t.brideRole}</span>
                  <span className="font-display font-bold text-lg sm:text-xl text-[#f5d77f]">₹2,100</span>
                </div>
              </div>

              {/* Genuine Included Services (Requirement 1) */}
              <div className="mt-3 pt-2 text-[11px] text-[#d8c7b5] space-y-1">
                <p className="font-semibold text-[#faeed1]">{t.membershipFeaturesTitle}</p>
                <ul className="list-disc list-inside space-y-0.5 text-stone-300">
                  {t.membershipFeatures.slice(0, 3).map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Candidate Role Selection */}
              <div>
                <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1.5">
                  {t.selectRoleLabel} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'groom' })}
                    className={`py-2.5 rounded-lg border text-xs font-accent uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      formData.role === 'groom'
                        ? 'bg-[#d4af37] text-black font-bold border-[#f5d77f] shadow-md'
                        : 'bg-black/40 border-[#d4af37]/30 text-stone-300 hover:border-[#d4af37]'
                    }`}
                  >
                    <span>{t.groomRole} (₹5,100)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'bride' })}
                    className={`py-2.5 rounded-lg border text-xs font-accent uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      formData.role === 'bride'
                        ? 'bg-[#d4af37] text-black font-bold border-[#f5d77f] shadow-md'
                        : 'bg-black/40 border-[#d4af37]/30 text-stone-300 hover:border-[#d4af37]'
                    }`}
                  >
                    <span>{t.brideRole} (₹2,100)</span>
                  </button>
                </div>
              </div>

              {/* 2. Basic Candidate Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.candidateNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. राघवेंद्र / Raghavendra"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.maritalStatusLabel} *
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="never_married">{t.statusNeverMarried}</option>
                    <option value="divorced">{t.statusDivorced}</option>
                    <option value="widowed">{t.statusWidowed}</option>
                    <option value="awaiting_divorce">{t.statusAwaitingDivorce}</option>
                  </select>
                </div>
              </div>

              {/* 3. DOB & Education/Profession */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.dobLabel}
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.ageLabel} *
                  </label>
                  <input
                    type="number"
                    required
                    min={formData.role === 'groom' ? 21 : 18}
                    max={75}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.cityLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. उदयपुर, राजस्थान"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                  {t.professionLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g. M.Arch / Senior Heritage Architect"
                  className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* 4. Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.phoneLabel} *
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="candidate@example.com"
                    className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* 5. FAMILY MEMBERS SECTION (Requirement 3: Replaced any maternal with Family Members / परिवार के सदस्य) */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-[#d4af37]/25 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/15">
                  <div>
                    <h4 className="text-xs font-accent uppercase tracking-wider text-[#f5d77f]">
                      {t.familyMembersTitle}
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      {t.familyMembersDesc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFamilyMember}
                    className="px-2.5 py-1 rounded bg-[#801235]/60 hover:bg-[#801235] text-[11px] text-[#f5d77f] border border-[#d4af37]/40 flex items-center gap-1 transition-colors"
                  >
                    <Plus size={13} />
                    <span>{t.addFamilyMemberBtn}</span>
                  </button>
                </div>

                {formData.familyMembers.map((member, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-[#18040d]/70 p-2.5 rounded-lg border border-white/5">
                    <div className="sm:col-span-3">
                      <select
                        value={member.relation}
                        onChange={(e) => handleFamilyMemberChange(index, 'relation', e.target.value)}
                        className="w-full px-2 py-1.5 rounded bg-black/60 border border-[#d4af37]/30 text-xs text-[#faeed1]"
                      >
                        <option value="Father">{t.relationFather}</option>
                        <option value="Mother">{t.relationMother}</option>
                        <option value="Brother">{t.relationBrother}</option>
                        <option value="Sister">{t.relationSister}</option>
                        <option value="Guardian">{t.relationGuardian}</option>
                        <option value="Other">{t.relationOther}</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                        placeholder={language === 'hi' ? 'सदस्य का नाम' : 'Member Name'}
                        className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-[#d4af37]/30 text-xs text-[#faeed1]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <input
                        type="tel"
                        value={member.contact}
                        onChange={(e) => handleFamilyMemberChange(index, 'contact', e.target.value)}
                        placeholder={language === 'hi' ? 'संपर्क नंबर (ऐच्छिक)' : 'Contact No (Optional)'}
                        className="w-full px-2.5 py-1.5 rounded bg-black/60 border border-[#d4af37]/30 text-xs text-[#faeed1]"
                      />
                    </div>

                    <div className="sm:col-span-1 text-right">
                      {formData.familyMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFamilyMember(index)}
                          className="p-1.5 text-stone-400 hover:text-red-400"
                          title={t.removeMemberBtn}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 6. Legal & Privacy Consents (Requirement 2) */}
              <div className="space-y-2 pt-1 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer text-stone-300">
                  <input
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-0.5 accent-[#d4af37]"
                  />
                  <span>
                    {t.termsLabel}
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-stone-300">
                  <input
                    type="checkbox"
                    required
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                    className="mt-0.5 accent-[#d4af37]"
                  />
                  <span>
                    {t.privacyConsentLabel}
                  </span>
                </label>
              </div>

              {/* Honest Gateway Disclaimer (Requirement 6) */}
              <div className="p-3 rounded-lg bg-black/60 border border-[#d4af37]/25 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{t.gatewayPendingNotice}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-royal-gold w-full text-center py-3 text-xs tracking-widest disabled:opacity-50"
              >
                {submitting
                  ? (language === 'hi' ? 'पंजीकरण प्रेषित हो रहा है...' : 'Submitting Application...')
                  : `${t.submitRegistrationBtn} (${formData.role === 'groom' ? '₹5,100' : '₹2,100'})`
                }
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
