import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Package, Plus, Trash2, Edit, Sparkles, AlertCircle, CheckCircle2, Zap, Crown } from 'lucide-react';

interface MysteryBoxItem {
  id: string;
  name: string;
  description: string;
  badge?: string;
  type: string;
  value: number;
  isActive: boolean;
  createdAt: string;
}

const MysteryBoxAdmin = () => {
  const [items, setItems] = useState<MysteryBoxItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MysteryBoxItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'premium' | 'energy'>('premium');
  const [value, setValue] = useState<number>(3); // Default 3 days for premium or 5 for energy
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

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setType('premium');
    setValue(3);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MysteryBoxItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setType(item.type === 'energy' ? 'energy' : 'premium');
    setValue(item.value || (item.type === 'energy' ? 5 : 3));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setAlertMsg({ text: 'Iltimos, sovg\'a nomi va tavsifini to\'ldiring!', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const url = editingItem ? `/api/admin/mystery-box/${editingItem.id}` : '/api/admin/mystery-box';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          type,
          value
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAlertMsg({ 
          text: editingItem ? 'Sirli sovg\'a muvaffaqiyatli yangilandi!' : 'Yangi sirli sovg\'a yaratildi!', 
          type: 'success' 
        });
        setIsModalOpen(false);
        fetchMysteryBoxItems();
      } else {
        setAlertMsg({ text: data.error || 'Xatolik yuz berdi', type: 'error' });
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
        setAlertMsg({ text: 'Sirli sovg\'a muvaffaqiyatli o\'chirildi', type: 'success' });
      }
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setIsDeleting(null);
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
              <p className="text-sm text-gray-400 mt-1">Sirli sandiq sovg'alarini yaratish, tahrirlash hamda jadval ko'rinishida boshqarish</p>
            </div>
          </div>

          <button
            onClick={handleOpenCreateModal}
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

        {/* TABLE VIEW OF MYSTERY BOX ITEMS */}
        <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-[#1A1A2F] flex items-center justify-between">
            <h2 className="font-bold text-white text-base">Sirli Sovg'alar Ro'yxati ({items.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#080814] border-b border-[#151528] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Turi & Belgisi</th>
                  <th className="py-4 px-6 font-semibold">Sovg'a Nomi</th>
                  <th className="py-4 px-6 font-semibold">Tavsifi</th>
                  <th className="py-4 px-6 font-semibold">Qiymati</th>
                  <th className="py-4 px-6 font-semibold">Yaratilgan Sana</th>
                  <th className="py-4 px-6 font-semibold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151528] text-sm text-gray-300">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#121225]/50 transition-colors group">
                    {/* Type & Badge */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                          item.type === 'energy' 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                            : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        }`}>
                          {item.type === 'energy' ? <Zap className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          item.type === 'energy' 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                            : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                        }`}>
                          {item.badge || (item.type === 'energy' ? `⚡ ${item.value || 1} Energiya` : `👑 ${item.value || 1} kun Premium`)}
                        </span>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6 font-bold text-white group-hover:text-purple-300 transition-colors">
                      {item.name}
                    </td>

                    {/* Description */}
                    <td className="py-4 px-6 text-gray-400 max-w-xs truncate">
                      {item.description}
                    </td>

                    {/* Value */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-white bg-[#15152A] px-3 py-1 rounded-lg border border-[#252545]">
                        {item.type === 'energy' ? `${item.value || 1} ta Energiya ⚡` : `${item.value || 1} kun Premium 👑`}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Tahrirlash</span>
                        </button>

                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={isDeleting === item.id}
                          className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isDeleting === item.id ? 'O\'chirilmoqda...' : 'O\'chirish'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                      <p className="font-medium text-base text-gray-400">Hozircha hech qanday sirli sovg'a yaratilmagan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Mystery Box Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0C0C18] border border-purple-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A2F]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingItem ? 'Sirli Sandiqni Tahrirlash' : 'Yangi Sirli Sandiq Yaratish'}
                    </h2>
                    <p className="text-xs text-gray-400">Sovg'a turiga qarab kun yoki chaqmoq qiymatini belgilang</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Masalan: Ajoyib! Siz Premium status yutdingiz!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#121225] border border-[#1A1A35] focus:border-purple-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Sovg'a Turi Select: Premium or Energy */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Sovg'a Turi (Type)</label>
                    <select
                      value={type}
                      onChange={(e) => {
                        const newType = e.target.value as 'premium' | 'energy';
                        setType(newType);
                        if (newType === 'energy' && value > 10) {
                          setValue(5);
                        }
                      }}
                      className="w-full bg-[#121225] border border-[#1A1A35] focus:border-purple-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                    >
                      <option value="premium">👑 Premium (Kunlar bo'yicha)</option>
                      <option value="energy">⚡ Energiya (Chaqmoq 1-10)</option>
                    </select>
                  </div>

                  {/* Dynamic Value Input depending on Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      {type === 'energy' ? 'Chaqmoq Soni (1 - 10)' : 'Premium Kunlari (Kun)'}
                    </label>

                    {type === 'energy' ? (
                      <select
                        value={value}
                        onChange={(e) => setValue(parseInt(e.target.value, 10))}
                        className="w-full bg-[#121225] border border-[#1A1A35] focus:border-amber-500 text-amber-400 font-bold rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            ⚡ {num} ta Energiya (Chaqmoq)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        min={1}
                        max={365}
                        required
                        placeholder="Masalan: 3 kun"
                        value={value}
                        onChange={(e) => setValue(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-[#121225] border border-[#1A1A35] focus:border-purple-500 text-purple-300 font-bold rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                      />
                    )}
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
                    {isLoading ? 'Saqlanmoqda...' : (editingItem ? 'O\'zgarishlarni Saqlash ✨' : 'Saqlash va Yaratish ✨')}
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
