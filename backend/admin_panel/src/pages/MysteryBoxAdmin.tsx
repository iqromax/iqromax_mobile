import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Package, Plus, Trash2, Sparkles, AlertCircle, CheckCircle2, Gift, Crown, Coins, Ticket } from 'lucide-react';

interface MysteryBoxItem {
  id: string;
  name: string;
  description: string;
  badge?: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

const MysteryBoxAdmin = () => {
  const [items, setItems] = useState<MysteryBoxItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [type, setType] = useState('premium');
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchMysteryBoxItems = async () => {
    try {
      const res = await fetch('/api/mystery-box');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  useEffect(() => {
    fetchMysteryBoxItems();
  }, []);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setAlertMsg({ text: 'Iltimos, sovg\'a nomi va tavsifini to\'ldiring!', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/mystery-box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          badge: badge.trim() || undefined,
          type
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAlertMsg({ text: 'Yangi sirli sovg\'a muvaffaqiyatli yaratildi!', type: 'success' });
        setName('');
        setDescription('');
        setBadge('');
        setType('premium');
        setIsModalOpen(false);
        fetchMysteryBoxItems();
      } else {
        setAlertMsg({ text: data.error || 'Yaratishda xatolik yuz berdi', type: 'error' });
      }
    } catch (e) {
      setAlertMsg({ text: 'Tarmoq xatosi yuz berdi', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Haqiqatan ham ushbu sirli sovg\'ani o\'chirmoqchimisiz?')) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/mystery-box/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
        setAlertMsg({ text: 'Sirli sovg\'a o\'chirildi', type: 'success' });
      }
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setIsDeleting(null);
    }
  };

  const getRewardIcon = (itemType: string) => {
    switch (itemType) {
      case 'coin':
        return <Coins className="w-6 h-6 text-yellow-400" />;
      case 'discount':
        return <Ticket className="w-6 h-6 text-red-400" />;
      case 'skin':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      default:
        return <Crown className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D0D1F] p-6 rounded-2xl border border-[#1A1A35]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Sirli Sandiq Boshqaruvi</h1>
              <p className="text-sm text-gray-400 mt-1">Sirli sandiqdan chiqadigan sovg'alar va mukofotlarni yaratish hamda sozlash</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Sirli Sandiq Yaratish</span>
          </button>
        </div>

        {/* Global Alert Notification */}
        {alertMsg && (
          <div className={`p-4 rounded-xl flex items-center justify-between border ${
            alertMsg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <div className="flex items-center gap-3">
              {alertMsg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              <span className="text-sm font-medium">{alertMsg.text}</span>
            </div>
            <button onClick={() => setAlertMsg(null)} className="text-xs underline cursor-pointer">Yopish</button>
          </div>
        )}

        {/* Existing Mystery Box Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-[#0C0C18] border border-[#1A1A2F] hover:border-purple-500/40 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 flex items-center justify-center">
                    {getRewardIcon(item.type)}
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    {item.badge || (item.type === 'coin' ? '🪙 Coin' : '⚡ Premium')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{item.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-[#151528] flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isDeleting === item.id}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting === item.id ? 'O\'chirilmoqda...' : 'O\'chirish'}</span>
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-16 bg-[#090915] border border-dashed border-[#1A1A35] rounded-2xl flex flex-col items-center justify-center text-center">
              <Gift className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium text-base">Hozircha hech qanday sirli sovg'a yaratilmagan</p>
              <p className="text-gray-600 text-xs mt-1">Yangi sirli sandiq yaratish uchun yuqoridagi tugmani bosing</p>
            </div>
          )}
        </div>

        {/* Create Mystery Box Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0C0C18] border border-purple-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A2F]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Yangi Sirli Sandiq Yaratish</h2>
                    <p className="text-xs text-gray-400">Foydalanuvchilar sandiqni ochganda yutib oladigan sovg'a</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Sovg'a Nomi (Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: 3 KUNLIK BEPUL PREMIUM"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121225] border border-[#1A1A35] focus:border-purple-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Sovg'a Tavsifi (Description)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Masalan: Ajoyib! Siz 3 kunlik Premium status yutdingiz!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#121225] border border-[#1A1A35] focus:border-purple-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Sovg'a Turi (Type)</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-[#121225] border border-[#1A1A35] focus:border-purple-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                    >
                      <option value="premium">⚡ Premium</option>
                      <option value="coin">🪙 Oltin Coin</option>
                      <option value="discount">🏷️ Chegirma Kuponi</option>
                      <option value="skin">✨ Eksklyuziv Skin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Nishon (Badge Tag)</label>
                    <input
                      type="text"
                      placeholder="Masalan: ⚡ 3 kun"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full bg-[#121225] border border-[#1A1A35] focus:border-purple-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#1A1A2F]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-[#121225] hover:bg-[#1A1A35] text-gray-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Yaratilmoqda...' : 'Saqlash va Yaratish ✨'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default MysteryBoxAdmin;
