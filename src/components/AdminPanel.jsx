import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, X, Download, RefreshCw, CheckCircle2, AlertTriangle, Users, Heart, DollarSign, FileText, Lock, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AdminPanel({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const [token, setToken] = useState(() => localStorage.getItem('dom_admin_token') || '');
  const [activeTab, setActiveTab] = useState('memberships');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data states
  const [memberships, setMemberships] = useState([]);
  const [charityRecords, setCharityRecords] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [grievances, setGrievances] = useState([]);

  // Status edit modal state
  const [editingMember, setEditingMember] = useState(null);
  const [newStatus, setNewStatus] = useState('active');
  const [statusReason, setStatusReason] = useState('');
  const [marriageConsentConfirmed, setMarriageConsentConfirmed] = useState(false);
  const [statusActionMessage, setStatusActionMessage] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      fetchAllData();
    }
  }, [isOpen, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      setToken(data.token);
      localStorage.setItem('dom_admin_token', data.token);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('dom_admin_token');
    setMemberships([]);
    setCharityRecords([]);
    setAuditLogs([]);
    setGrievances([]);
  };

  const autofillDemoCredentials = () => {
    setLoginEmail('admin@domshadivivah.in');
    setLoginPass('RoyalAdmin2026!#');
  };

  const fetchAllData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [memRes, charRes, auditRes, grvRes] = await Promise.all([
        fetch('/api/admin/memberships', { headers }),
        fetch('/api/admin/charity', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/admin/grievances', { headers }),
      ]);

      if (memRes.status === 401 || memRes.status === 403) {
        handleLogout();
        return;
      }

      const [memData, charData, auditData, grvData] = await Promise.all([
        memRes.json(),
        charRes.json(),
        auditRes.json(),
        grvRes.json(),
      ]);

      if (memData.success) setMemberships(memData.data);
      if (charData.success) setCharityRecords(charData.data);
      if (auditData.success) setAuditLogs(auditData.data);
      if (grvData.success) setGrievances(grvData.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    setStatusActionMessage('');

    if (newStatus === 'marriage_fixed' && !marriageConsentConfirmed) {
      setStatusActionMessage(
        language === 'hi'
          ? 'त्रुटि: विवाह तय होने की स्थिति बदलने से पहले दोनों परिवारों की लिखित सहमति पुष्टि अनिवार्य है।'
          : 'Error: Written consent from both families must be confirmed before marking Marriage Fixed.'
      );
      return;
    }

    try {
      const res = await fetch(`/api/admin/memberships/${editingMember.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          reason: statusReason || 'Administrative review update',
          marriageFixedConsentConfirmed: marriageConsentConfirmed,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to update status');
      }

      setEditingMember(null);
      setStatusReason('');
      setMarriageConsentConfirmed(false);
      fetchAllData();
    } catch (err) {
      setStatusActionMessage(err.message);
    }
  };

  const handleExport = async (type) => {
    try {
      const res = await fetch(`/api/admin/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domshadivivah_${type}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl royal-card bg-[#120309] border-2 border-[#d4af37] p-5 sm:p-7 rounded-2xl shadow-2xl my-4 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#f5d77f] hover:bg-[#801235] transition-colors border border-[#d4af37]/40"
          aria-label="Close admin modal"
        >
          <X size={18} />
        </button>

        {/* ADMIN LOGIN SCREEN */}
        {!token ? (
          <div className="max-w-md mx-auto py-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#801235] border border-[#d4af37] mx-auto flex items-center justify-center text-[#f5d77f] mb-3">
                <Lock size={24} />
              </div>
              <h3 className="font-display font-bold text-2xl text-gold-gradient">
                {t.adminLoginTitle}
              </h3>
              <p className="text-xs text-[#d8c7b5] mt-1 font-light">
                {t.adminLoginDesc}
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-200">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@domshadivivah.in"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                  Secret Key / Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-[#d4af37]/30 text-xs text-[#faeed1] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={autofillDemoCredentials}
                  className="text-[#f5d77f] hover:underline"
                >
                  {language === 'hi' ? 'डेमो क्रेडेंशियल भरें' : 'Autofill Demo Admin Credentials'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-royal-gold w-full text-center py-3 text-xs tracking-widest mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Secretariat Console'}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div>
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/25 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#801235] border border-[#d4af37] flex items-center justify-center text-[#f5d77f]">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#faeed1]">
                    {t.adminTitle}
                  </h3>
                  <span className="text-[10px] text-[#d4af37] font-mono">
                    Super Admin: admin@domshadivivah.in • Server Authenticated
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAllData}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-black/40 border border-[#d4af37]/40 text-xs text-[#faeed1] hover:text-[#f5d77f] flex items-center gap-1.5"
                  title="Refresh data"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  <span>{language === 'hi' ? 'रीफ्रेश' : 'Refresh'}</span>
                </button>

                <button
                  onClick={() => handleExport(activeTab === 'charity' ? 'charity' : 'memberships')}
                  className="px-3 py-1.5 rounded-lg bg-[#801235]/40 border border-[#d4af37]/40 text-xs text-[#f5d77f] hover:bg-[#801235] flex items-center gap-1.5"
                  title="Export records to JSON"
                >
                  <Download size={13} />
                  <span>{t.adminExportBtn}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 hover:bg-red-900/60 flex items-center gap-1"
                >
                  <LogOut size={13} />
                  <span>{t.adminLogout}</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-5 pb-2 border-b border-white/5">
              {[
                { id: 'memberships', label: t.adminTabMemberships, count: memberships.length, icon: Users },
                { id: 'payments', label: t.adminTabPayments, count: memberships.length, icon: DollarSign },
                { id: 'charity', label: t.adminTabCharity, count: charityRecords.length, icon: Heart },
                { id: 'grievances', label: t.adminTabGrievances, count: grievances.length, icon: FileText },
                { id: 'audit', label: t.adminTabAudit, count: auditLogs.length, icon: ShieldAlert },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-accent uppercase tracking-wider transition-all flex items-center gap-2 border ${
                      activeTab === tab.id
                        ? 'bg-[#d4af37] text-black font-bold border-[#f5d77f] shadow'
                        : 'bg-black/40 border-[#d4af37]/25 text-[#d8c7b5] hover:border-[#d4af37]'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 text-current">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: MEMBERSHIP MANAGEMENT */}
            {activeTab === 'memberships' && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-[#d4af37]/30 bg-black/40">
                  <table className="w-full text-left text-xs text-[#faeed1]">
                    <thead className="bg-[#1e040f] border-b border-[#d4af37]/20 uppercase text-[10px] font-mono text-[#f5d77f]">
                      <tr>
                        <th className="p-3">ID & Role</th>
                        <th className="p-3">Fee (INR)</th>
                        <th className="p-3">Candidate & Contact</th>
                        <th className="p-3">Family Members</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {memberships.map((m) => (
                        <tr key={m.id} className="hover:bg-white/5">
                          <td className="p-3">
                            <span className="font-mono text-[11px] text-[#d4af37] block">{m.id}</span>
                            <span className="text-[10px] uppercase font-bold text-amber-200">
                              {m.role === 'groom' ? t.groomRole : t.brideRole}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-amber-300">
                            ₹{m.fee?.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <strong className="block text-sm">{m.name}</strong>
                            <span className="text-stone-400 block text-[11px]">Phone: {m.phone}</span>
                            <span className="text-stone-400 block text-[11px]">Age: {m.age} Yrs • {m.maritalStatus}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-xs font-accent text-[#f5d77f] block">
                              {m.familyMembers?.length || 0} Members
                            </span>
                            <span className="text-[10px] text-stone-400 line-clamp-1">
                              {m.familyMembers?.map((f) => `${f.relation}: ${f.name}`).join(', ')}
                            </span>
                          </td>
                          <td className="p-3 text-stone-300">
                            {m.city}, {m.state}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-accent uppercase inline-block ${
                              m.status === 'marriage_fixed'
                                ? 'bg-[#801235] text-[#faeed1] border border-[#f5d77f]'
                                : m.status === 'in_discussion'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500'
                                : m.status === 'active'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                                : 'bg-stone-800 text-stone-400'
                            }`}>
                              {m.status === 'marriage_fixed' ? t.statusMarriageFixed : m.status === 'in_discussion' ? t.statusInDiscussion : m.status === 'active' ? t.statusActive : t.statusInactive}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setEditingMember(m);
                                setNewStatus(m.status);
                                setMarriageConsentConfirmed(Boolean(m.marriageFixedConsent));
                              }}
                              className="px-2.5 py-1 rounded border border-[#d4af37]/50 hover:bg-[#d4af37] hover:text-black transition-colors text-[11px] font-accent"
                            >
                              {t.updateStatusBtn}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: MEMBERSHIP PAYMENTS LEDGER (Requirement 6) */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-[#200511] border border-[#d4af37]/35 text-xs text-[#faeed1] flex items-center justify-between">
                  <span><strong>Membership Revenue Ledger:</strong> Groom ₹5,100 | Bride ₹2,100</span>
                  <span className="text-amber-300 text-[11px] font-mono">Gateway Status: INTEGRATION_PENDING</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#d4af37]/30 bg-black/40">
                  <table className="w-full text-left text-xs text-[#faeed1]">
                    <thead className="bg-[#1e040f] border-b border-[#d4af37]/20 uppercase text-[10px] font-mono text-[#f5d77f]">
                      <tr>
                        <th className="p-3">Member ID</th>
                        <th className="p-3">Candidate Name</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Fee (INR)</th>
                        <th className="p-3">Payment Status</th>
                        <th className="p-3">Gateway Condition</th>
                        <th className="p-3">Refund Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {memberships.map((m) => (
                        <tr key={m.id} className="hover:bg-white/5">
                          <td className="p-3 font-mono text-[#d4af37]">{m.id}</td>
                          <td className="p-3 font-semibold">{m.name}</td>
                          <td className="p-3 uppercase text-[11px]">{m.role}</td>
                          <td className="p-3 font-mono font-bold text-amber-300">₹{m.fee?.toLocaleString()}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-200 border border-amber-600/40">
                              {m.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3 text-[11px] text-stone-300 font-mono">
                            {m.paymentGatewayStatus}
                          </td>
                          <td className="p-3 text-[11px] text-stone-400">
                            {m.refundDisputeStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: SEPARATE CHARITY LEDGER (Requirement 5 & 6) */}
            {activeTab === 'charity' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-[#200511] border border-[#d4af37]/35 text-xs text-[#faeed1] flex items-center justify-between">
                  <span><strong>Voluntary Charity Ledger:</strong> Dedicated assistance for marriages of daughters from economically disadvantaged families.</span>
                  <span className="text-amber-300 text-[11px] font-mono">100% Segregated Ledger</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#d4af37]/30 bg-black/40">
                  <table className="w-full text-left text-xs text-[#faeed1]">
                    <thead className="bg-[#1e040f] border-b border-[#d4af37]/20 uppercase text-[10px] font-mono text-[#f5d77f]">
                      <tr>
                        <th className="p-3">Charity ID</th>
                        <th className="p-3">Contributor / Family</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Amount (INR)</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Payment Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {charityRecords.map((c) => (
                        <tr key={c.id} className="hover:bg-white/5">
                          <td className="p-3 font-mono text-[#d4af37]">{c.id}</td>
                          <td className="p-3 font-semibold">{c.contributorName}</td>
                          <td className="p-3 text-[11px] text-stone-300">
                            {c.phone || c.email || 'Confidential'}
                          </td>
                          <td className="p-3 font-mono font-bold text-amber-300">
                            ₹{c.amount?.toLocaleString()}
                          </td>
                          <td className="p-3 text-[11px] text-stone-300 max-w-xs line-clamp-1">
                            {c.purpose}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-200 border border-amber-600/40">
                              {c.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3 text-[10px] text-stone-400 font-mono">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: GRIEVANCES */}
            {activeTab === 'grievances' && (
              <div className="space-y-3">
                {grievances.map((g) => (
                  <div key={g.id} className="p-4 rounded-xl bg-black/40 border border-[#d4af37]/25 space-y-1.5 text-xs text-[#d8c7b5]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                      <span className="font-mono text-[#f5d77f] font-bold">{g.id} • {g.name} ({g.phone})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {g.status}
                      </span>
                    </div>
                    <p className="font-semibold text-[#faeed1]">{g.subject}</p>
                    <p className="font-light">{g.description}</p>
                    <span className="text-[10px] text-stone-500 font-mono block">Logged: {new Date(g.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: AUDIT LOG (Requirement 6 & 7) */}
            {activeTab === 'audit' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-black/60 border border-[#d4af37]/25 text-xs text-stone-300">
                  {t.adminAuditLoggedNotice}
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#d4af37]/30 bg-black/40">
                  <table className="w-full text-left text-xs text-[#faeed1]">
                    <thead className="bg-[#1e040f] border-b border-[#d4af37]/20 uppercase text-[10px] font-mono text-[#f5d77f]">
                      <tr>
                        <th className="p-3">Log ID</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Admin</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Target</th>
                        <th className="p-3">Reason / Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5">
                          <td className="p-3 text-[#d4af37]">{log.id}</td>
                          <td className="p-3 text-stone-400">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="p-3 text-amber-200">{log.adminUser}</td>
                          <td className="p-3 font-bold">{log.action}</td>
                          <td className="p-3">{log.targetType}:{log.targetId}</td>
                          <td className="p-3 text-stone-300 max-w-sm line-clamp-1">{log.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STATUS EDIT MODAL (Requirement 4: Confirmation for Marriage Fixed) */}
        {editingMember && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in">
            <div className="relative w-full max-w-lg royal-card bg-[#18040d] border-2 border-[#d4af37] p-6 rounded-2xl shadow-2xl">
              <button
                onClick={() => setEditingMember(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-[#f5d77f]"
              >
                <X size={16} />
              </button>

              <h4 className="font-display font-bold text-xl text-gold-gradient mb-1">
                {language === 'hi' ? 'सदस्यता स्थिति अपडेट' : 'Update Member Status'}
              </h4>
              <p className="text-xs text-stone-300 mb-4 font-mono">
                {editingMember.id} • {editingMember.name} ({editingMember.role === 'groom' ? t.groomRole : t.brideRole})
              </p>

              {statusActionMessage && (
                <div className="mb-4 p-3 rounded bg-red-950/80 border border-red-500/50 text-xs text-red-200">
                  {statusActionMessage}
                </div>
              )}

              <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    Select New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#d4af37]/30 text-xs text-[#faeed1]"
                  >
                    <option value="active">{t.statusActive}</option>
                    <option value="in_discussion">{t.statusInDiscussion}</option>
                    <option value="marriage_fixed">{t.statusMarriageFixed}</option>
                    <option value="inactive">{t.statusInactive}</option>
                  </select>
                </div>

                {/* Explicit Written Consent Confirmation for Marriage Fixed (Requirement 4) */}
                {newStatus === 'marriage_fixed' && (
                  <div className="p-3.5 rounded-xl bg-[#2a0615] border border-[#f5d77f]/60 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-accent font-bold text-[#f5d77f]">
                      <AlertTriangle size={15} />
                      <span>{t.confirmMarriageFixedTitle}</span>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      {t.confirmMarriageFixedDesc}
                    </p>
                    <label className="flex items-start gap-2 text-xs text-[#faeed1] cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        required
                        checked={marriageConsentConfirmed}
                        onChange={(e) => setMarriageConsentConfirmed(e.target.checked)}
                        className="mt-0.5 accent-[#d4af37]"
                      />
                      <span>
                        {language === 'hi'
                          ? 'हाँ, मैंने दोनों परिवारों से लिखित सहमति प्राप्त कर ली है।'
                          : 'Yes, I confirm that written consent from both families has been verified.'}
                      </span>
                    </label>
                    <p className="text-[11px] text-amber-300 italic pt-1 border-t border-white/5">
                      {t.charityOptionalNoticeConfirm}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-accent uppercase text-[#faeed1] block mb-1">
                    {t.reasonLabel} *
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="e.g. Verified wedding invitation and consent letters from parents."
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#d4af37]/30 text-xs text-[#faeed1]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 rounded border border-stone-600 text-xs text-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-royal-gold text-xs px-5 py-2"
                  >
                    Save Status & Log Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
