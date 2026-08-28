import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, Save, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
            <Download className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">App Downloading Sozlamasi</h1>
            <p className="text-sm text-gray-400">iqromax.net/downloading sahifasidagi Yuklab Olish buttoni havolasini boshqarish</p>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {alert && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${alert.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
          {alert.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-semibold text-sm">{alert.message}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-md shadow-lg space-y-6">
        <div className="border-b border-slate-700 pb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-purple-400" />
            <span>Mobil Ilovani Yuklab Olish Havolasi</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Foydalanuvchi <code className="bg-slate-900 text-purple-300 px-2 py-0.5 rounded">https://iqromax.net/downloading</code> sahifasida <strong>"Mobil Ilovani Yuklab Olish"</strong> tugmasini bosganda ochiladigan havola.
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-400">Yuklanmoqda...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                Yuklab Olish Link Manzili (URL):
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={downloadLink}
                  onChange={(e) => setDownloadLink(e.target.value)}
                  placeholder="https://iqromax.net/app-release.apk"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saqlanmoqda...' : 'Linkni Saqlash'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppDownloadingAdmin;
