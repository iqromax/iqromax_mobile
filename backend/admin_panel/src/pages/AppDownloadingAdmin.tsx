import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Download, Link as LinkIcon, Save, CheckCircle2, AlertCircle, ExternalLink, Globe, ShieldCheck, Sparkles } from 'lucide-react';

const AppDownloadingAdmin = () => {
  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchDownloadLink();
  }, []);

  const fetchDownloadLink = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/download-link');
      if (res.ok) {
        const data = await res.json();
        setDownloadLink(data.link || '');
      }
    } catch (e) {
      console.error('Error fetching download link:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadLink.trim()) {
      setAlert({ message: 'Iltimos, link manzilini kiriting!', type: 'error' });
      return;
    }

    setSaving(true);
    setAlert(null);
    try {
      const res = await fetch('/api/admin/download-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: downloadLink.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        setAlert({ message: 'Yuklab olish havolasi muvaffaqiyatli saqlandi! 🎉', type: 'success' });
      } else {
        setAlert({ message: data.error || 'Saqlashda xatolik yuz berdi', type: 'error' });
      }
    } catch (e) {
      setAlert({ message: 'Server bilan ulanishda xatolik yuz berdi', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header Section with Neon Glow */}
        <div className="bg-[#0A0A16] border border-[#1A1A2F] p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 border border-purple-400/30">
              <Download className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2">
                App Downloading Sozlamasi <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-sm text-indigo-200/60 mt-1 font-medium">
                <code className="bg-[#121223] text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-mono text-xs">iqromax.net/downloading</code> sahifasidagi Yuklab Olish buttoni havolasi
              </p>
            </div>
          </div>

          <a 
            href="https://iqromax.net/downloading" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121223] border border-[#252545] text-indigo-200 hover:text-white hover:border-purple-500/50 transition-all text-xs font-bold z-10 shrink-0"
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Landing Sahifani Ko'rish</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Alert Notification */}
        {alert && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
            alert.type === 'success' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
          }`}>
            {alert.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="font-semibold text-sm">{alert.message}</span>
          </div>
        )}

        {/* Main Settings Card */}
        <div className="bg-[#0A0A16] border border-[#1A1A2F] p-6 sm:p-8 rounded-2xl shadow-xl space-y-6 relative">
          <div className="border-b border-[#1A1A2F] pb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <LinkIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Mobil Ilovani Yuklab Olish Havolasi (URL)</h2>
                <p className="text-xs text-indigo-200/50 mt-0.5">Tugma bosilganda o'quvchi o'tadigan havola (PlayMarket, AppStore yoki Direct APK link)</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Avto-Sinchronizatsiya Faol</span>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-indigo-200/60 font-medium animate-pulse flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <span>Ma'lumotlar yuklanmoqda...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200/70">
                  Yuklab Olish Link Manzili:
                </label>
                <div className="relative flex items-center">
                  <input
                    type="url"
                    value={downloadLink}
                    onChange={(e) => setDownloadLink(e.target.value)}
                    placeholder="https://iqromax.net/app-release.apk"
                    className="w-full bg-[#050510] border border-[#252545] rounded-xl py-4 pl-4 pr-12 text-white placeholder-indigo-300/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-sm shadow-inner"
                    required
                  />
                  <div className="absolute right-4 text-indigo-300/40">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-indigo-200/40 font-medium pt-1">
                  * Ushbu manzil saqlangach, `iqromax.net/downloading` sahifasidagi "Mobil Ilovani Yuklab Olish" tugmasi bosilganda darhol shu havola ochiladi.
                </p>
              </div>

              <div className="pt-4 border-t border-[#1A1A2F] flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-purple-600/30 active:scale-95 disabled:opacity-50 cursor-pointer border border-purple-400/30 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saqlanmoqda...' : 'Linkni Saqlash'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppDownloadingAdmin;
