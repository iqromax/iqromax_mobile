import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ShoppingBag, Plus, Trash2, Edit, Sparkles, AlertCircle, CheckCircle2, Zap, Image as ImageIcon, Key, Shirt, Filter } from 'lucide-react';

interface ShopItem {
  id: string;
  category: 'inventory' | 'energy' | 'mystery';
  subcategory?: string | null;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  value: number;
  price: number;
  isActive: boolean;
  createdAt: string;
}

const ShopAdmin = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'inventory' | 'energy' | 'mystery'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [category, setCategory] = useState<'inventory' | 'energy' | 'mystery'>('inventory');
  const [subcategory, setSubcategory] = useState<'top' | 'pants' | 'shoes' | 'accessories' | 'backpacks'>('top');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<number>(1);
  const [price, setPrice] = useState<number>(50);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchShopItems = async () => {
    try {
      const res = await fetch('/api/admin/shop-items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error('Fetch shop items error:', e);
    }
  };

  useEffect(() => {
    fetchShopItems();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setCategory('inventory');
    setSubcategory('top');
    setName('');
    setDescription('');
    setValue(1);
    setPrice(50);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ShopItem) => {
    setEditingItem(item);
    setCategory(item.category);
    setSubcategory((item.subcategory as any) || 'top');
    setName(item.name);
    setDescription(item.description || '');
    setValue(item.value || 1);
    setPrice(item.price || 50);
    setImageFile(null);
    setImagePreview(item.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setAlertMsg({ text: 'Iltimos, mahsulot nomini kiriting!', type: 'error' });
      return;
    }

    if (price === undefined || price < 0) {
      setAlertMsg({ text: 'Iltimos, narxni to\'g\'ri kiriting!', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('category', category);
      if (category === 'inventory') {
        formData.append('subcategory', subcategory);
      }
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('value', String(value));
      formData.append('price', String(price));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const url = editingItem ? `/api/admin/shop-items/${editingItem.id}` : '/api/admin/shop-items';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setAlertMsg({
          text: editingItem ? 'Mahsulot muvaffaqiyatli yangilandi!' : 'Yangi mahsulot IQROSHOP do\'koniga qo\'shildi!',
          type: 'success',
        });
        setIsModalOpen(false);
        fetchShopItems();
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
    if (!window.confirm('Haqiqatan ham ushbu mahsulotni o\'chirmoqchimisiz?')) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/shop-items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
        setAlertMsg({ text: 'Mahsulot do\'kondan o\'chirildi', type: 'success' });
      }
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredItems = items.filter(item => {
    if (activeCategoryFilter === 'all') return true;
    return item.category === activeCategoryFilter;
  });

  const getSubcategoryLabel = (sub?: string | null) => {
    switch (sub) {
      case 'top': return 'Ustki kiyim';
      case 'pants': return 'Shim';
      case 'shoes': return 'Oyoq kiyim';
      case 'accessories': return 'Aksessuarlar';
      case 'backpacks': return 'Ryukzaklar';
      default: return sub || '-';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D0D1F] p-6 rounded-2xl border border-[#1A1A35]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">IQROSHOP Do'koni Boshqaruvi</h1>
              <p className="text-sm text-gray-400 mt-1">Inventar skinlari, energiya paketlari va sirli sandiq kalitlarini boshqarish</p>
            </div>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Mahsulot Qo'shish</span>
          </button>
        </div>

        {/* Global Notification */}
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

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 bg-[#080816] p-1.5 rounded-xl border border-[#1A1A35] w-fit overflow-x-auto">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Barchasi ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeCategoryFilter === 'inventory'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Inventar Skinlari ({items.filter(i => i.category === 'inventory').length})</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('energy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeCategoryFilter === 'energy'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Energiya ({items.filter(i => i.category === 'energy').length})</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('mystery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeCategoryFilter === 'mystery'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Sirli Sandiq Kalitlari ({items.filter(i => i.category === 'mystery').length})</span>
          </button>
        </div>

        {/* SHOP PRODUCTS TABLE */}
        <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-[#1A1A2F] flex items-center justify-between">
            <h2 className="font-bold text-white text-base">IQROSHOP Mahsulotlari Jadvali ({filteredItems.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#080814] border-b border-[#151528] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Rasm & Mahsulot</th>
                  <th className="py-4 px-6 font-semibold">Asosiy Bo'lim</th>
                  <th className="py-4 px-6 font-semibold">Ichki Kategoriya / Qiymat</th>
                  <th className="py-4 px-6 font-semibold">Narxi (Coin)</th>
                  <th className="py-4 px-6 font-semibold">Yaratilgan Sana</th>
                  <th className="py-4 px-6 font-semibold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151528] text-sm text-gray-300">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#121225]/50 transition-colors group">
                    
                    {/* Image & Product Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 bg-[#121225]" 
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                            {item.category === 'inventory' ? '👕' : item.category === 'energy' ? '⚡' : '🔑'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white group-hover:text-amber-300 transition-colors">{item.name}</p>
                          {item.description && <p className="text-xs text-gray-400 max-w-xs truncate">{item.description}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Main Category */}
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-bold rounded-lg border uppercase ${
                        item.category === 'inventory'
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                          : item.category === 'energy'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      }`}>
                        {item.category === 'inventory' ? 'Inventar' : item.category === 'energy' ? 'Energiya' : 'Sirli Sandiq'}
                      </span>
                    </td>

                    {/* Subcategory or Value */}
                    <td className="py-4 px-6 text-gray-300 text-xs font-semibold">
                      {item.category === 'inventory' ? (
                        <span className="bg-[#15152A] px-2.5 py-1 rounded-md border border-[#252545]">
                          {getSubcategoryLabel(item.subcategory)}
                        </span>
                      ) : item.category === 'energy' ? (
                        <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                          ⚡ +{item.value} Chaqmoq
                        </span>
                      ) : (
                        <span className="text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                          🔑 +{item.value} ta Kalit
                        </span>
                      )}
                    </td>

                    {/* Price in Coins */}
                    <td className="py-4 px-6 font-bold text-amber-400">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🪙</span>
                        <span>{item.price} Coin</span>
                      </div>
                    </td>

                    {/* Created At */}
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
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

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-500">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                      <p className="font-medium text-base text-gray-400">Hozircha do'konda mahsulotlar mavjud emas</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CREATE / EDIT SHOP ITEM MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0C0C18] border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A2F]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingItem ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}
                    </h2>
                    <p className="text-xs text-gray-400">Bo'limni tanlang va kerakli maydonlarni to'ldiring</p>
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
                
                {/* 1. Asosiy Bo'lim Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Asosiy Bo'lim (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'inventory' | 'energy' | 'mystery')}
                    className="w-full bg-[#121225] border border-[#1A1A35] focus:border-amber-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors font-semibold"
                  >
                    <option value="inventory">👕 Inventar (Skinlar va Buyumlar)</option>
                    <option value="energy">⚡ Energiya (Chaqmoq sotib olish)</option>
                    <option value="mystery">🎁 Sirli Sandiq (Kalitlar sotib olish)</option>
                  </select>
                </div>

                {/* 2. Dynamic Field: INVENTAR SUB-CATEGORY SELECT */}
                {category === 'inventory' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Inventar Bo'limi (Subcategory)
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value as any)}
                      className="w-full bg-[#121225] border border-[#1A1A35] focus:border-amber-500 text-purple-300 font-bold rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                    >
                      <option value="top">🧥 Ustki kiyim</option>
                      <option value="pants">👖 Shim</option>
                      <option value="shoes">👟 Oyoq kiyim</option>
                      <option value="accessories">👓 Aksessuarlar</option>
                      <option value="backpacks">🎒 Ryukzaklar</option>
                    </select>
                  </div>
                )}

                {/* 3. Product Image Upload (Only for Inventory) */}
                {category === 'inventory' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Mahsulot Rasmi (Image Upload)
                    </label>
                    <div className="flex items-center gap-4 bg-[#121225] p-3 border border-[#1A1A35] rounded-xl">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-amber-500/30" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-[#181832] flex items-center justify-center text-gray-500 border border-[#252545]">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-all">
                          <ImageIcon className="w-4 h-4" />
                          <span>Rasm Tanlash...</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                        <p className="text-[11px] text-gray-400 mt-1">PNG, JPG formatdagi rasmlar</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    {category === 'inventory' ? 'Mahsulot Nomi' : category === 'energy' ? 'Energiya Nomi' : 'Kalit Nomi'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      category === 'inventory' ? 'Masalan: Cyber Huddi' : category === 'energy' ? 'Masalan: Kichik Energiya Paketi' : 'Masalan: 3 ta Oltin Kalit'
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121225] border border-[#1A1A35] focus:border-amber-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* 5. Dynamic Field: DESCRIPTION / VALUE */}
                {category !== 'inventory' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      {category === 'energy' ? 'Energiya Qiymati (Chaqmoq Soni)' : 'Kalitlar Soni (Dona)'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      placeholder={category === 'energy' ? 'Masalan: 5 (chaqmoq)' : 'Masalan: 3 (kalit)'}
                      value={value}
                      onChange={(e) => setValue(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-[#121225] border border-[#1A1A35] focus:border-amber-500 text-amber-400 font-bold rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Tavsifi (Description)</label>
                  <textarea
                    rows={2}
                    placeholder="Mahsulot haqida qisqacha ma'lumot..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#121225] border border-[#1A1A35] focus:border-amber-500 text-white rounded-xl p-3.5 text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* 6. Product Price (Coin) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Narxi (Oltin Coin) 🪙
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="Masalan: 50"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#121225] border border-[#1A1A35] focus:border-amber-500 text-amber-400 font-bold rounded-xl p-3.5 text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Modal Action Buttons */}
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
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Saqlanmoqda...' : (editingItem ? 'O\'zgarishlarni Saqlash ✨' : 'Yaratish va Qo\'shish ✨')}
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

export default ShopAdmin;
