import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Plus, Trash2, Package, Upload, CheckCircle, AlertCircle, Box } from 'lucide-react';

interface SkinItem {
  id: string;
  category: string;
  name: string;
  rarity: string;
  imageUrl?: string;
  modelUrl?: string;
  price?: number;
  isLocked?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

const CATEGORIES = [
  { id: 'bosh_kiyim', label: 'Bosh kiyim' },
  { id: 'ustki_kiyim', label: 'Ustki kiyim' },
  { id: 'shim', label: 'Shim' },
  { id: 'oyoq_kiyim', label: 'Oyoq kiyim' },
  { id: 'aksessuar', label: 'Aksessuarlar' },
  { id: 'ryukzak', label: 'Ryukzak' },
];

const RARITIES = ['ODDIY', 'RARE', 'EPIC', 'LEGENDARY'];

export default function InventoryAdmin() {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('bosh_kiyim');
  const [skins, setSkins] = useState<SkinItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('bosh_kiyim');
  const [name, setName] = useState<string>('');
  const [rarity, setRarity] = useState<string>('ODDIY');
  const [price, setPrice] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Alert
  const [alert, setAlert] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({
    show: false,
    msg: '',
    type: 'success',
  });

  const showAlert = (msg: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: '', type: 'success' }), 4000);
  };

  const fetchSkins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory-skins');
      if (res.ok) {
        const data = await res.json();
        setSkins(data);
      }
    } catch (e) {
      console.error('Fetch skins error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkins();
  }, []);

  const handleCreateSkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showAlert('Iltimos, skin nomini kiriting!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('name', name.trim());
      formData.append('rarity', rarity);
      formData.append('price', String(price));
      formData.append('isLocked', String(isLocked));
      
      if (imageFile) formData.append('image', imageFile);
      if (glbFile) formData.append('glbModel', glbFile);

      const res = await fetch('/api/admin/inventory-skins', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        showAlert('Yangi skin muvaffaqiyatli qo\'shildi!');
        setIsAddModalOpen(false);
        // Reset form
        setName('');
        setPrice(0);
        setIsLocked(false);
        setImageFile(null);
        setGlbFile(null);
        fetchSkins();
      } else {
        const err = await res.json();
        showAlert(err.error || 'Skinni saqlashda xatolik yuz berdi', 'error');
      }
    } catch (e) {
      console.error('Create skin error:', e);
      showAlert('Server bilan bog\'lanishda xatolik', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkin = async (id: string) => {
    if (!confirm('Ushbu skinni o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`/api/admin/inventory-skins/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showAlert('Skin o\'chirildi');
        fetchSkins();
      }
    } catch (e) {
      showAlert('Skinni o\'chirishda xatolik', 'error');
    }
  };

  const filteredSkins = skins.filter(s => s.category === activeCategoryTab);

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#05050C] p-6 rounded-2xl border border-[#151528]">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Package className="w-7 h-7 text-purple-400" />
              Inventar (Skinlar) Boshqaruvi
            </h1>
            <p className="text-indigo-200/60 text-sm mt-1">
              Bosh kiyim, Ustki kiyim, Shim, Oyoq kiyim, Aksessuarlar va Ryukzak skinlarini qo'shing va boshqaring
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Skin Qo'shish
          </button>
        </div>

        {/* Alert Notification */}
        {alert.show && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${alert.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
            {alert.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{alert.msg}</span>
          </div>
        )}

        {/* 6 Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const count = skins.filter(s => s.category === cat.id).length;
            const isActive = activeCategoryTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryTab(cat.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4A1D96] to-[#2B1B61] text-white border border-[#5B21B6] shadow-lg shadow-purple-900/20'
                    : 'bg-[#05050C] text-indigo-200/60 hover:text-white border border-[#151528] hover:bg-[#121223]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-purple-500/30 text-purple-200' : 'bg-[#151528] text-indigo-300/50'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="text-center py-16 text-indigo-300/50">Yuklanmoqda...</div>
        ) : filteredSkins.length === 0 ? (
          <div className="bg-[#05050C] border border-[#151528] rounded-2xl p-12 text-center">
            <Box className="w-12 h-12 text-indigo-400/30 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-indigo-200">Ushbu bo'limda skinlar mavjud emas</h3>
            <p className="text-sm text-indigo-200/50 mt-1 max-w-md mx-auto">
              "Skin Qo'shish" tugmasini bosib ushbu bo'lim uchun yangi skin yaratishingiz mumkin
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSkins.map(item => (
              <div
                key={item.id}
                className="bg-[#05050C] border border-[#151528] hover:border-purple-500/30 rounded-2xl p-4 flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Skin Preview Image */}
                  <div className="w-full h-40 bg-[#0C0C18] rounded-xl mb-3 overflow-hidden flex items-center justify-center relative border border-[#151528]">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <Package className="w-10 h-10 text-indigo-400/30" />
                    )}
                    {item.modelUrl && (
                      <span className="absolute top-2 right-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        3D GLB
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base truncate">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${
                      item.rarity === 'LEGENDARY' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      item.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      item.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {item.rarity}
                    </span>
                    {item.price ? (
                      <span className="text-xs font-bold text-amber-400">🪙 {item.price} Coin</span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#151528] flex items-center justify-between">
                  <span className="text-xs text-indigo-200/40">
                    {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteSkin(item.id)}
                    className="p-2 text-indigo-400/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Skin Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#090915] border border-[#1F1F38] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              
              <div className="p-6 border-b border-[#1F1F38] flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  Yangi Skin Qo'shish
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-indigo-200/50 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSkin} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-indigo-200/70 uppercase tracking-wider mb-2">
                    Bo'lim Tanlash *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#121225] border border-[#252545] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm font-medium"
                    required
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Skin Name */}
                <div>
                  <label className="block text-xs font-bold text-indigo-200/70 uppercase tracking-wider mb-2">
                    Skin Nomi (Name) *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Golden Crown"
                    className="w-full bg-[#121225] border border-[#252545] rounded-xl px-4 py-3 text-white placeholder-indigo-300/30 focus:outline-none focus:border-purple-500 text-sm font-medium"
                    required
                  />
                </div>

                {/* Rarity & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-indigo-200/70 uppercase tracking-wider mb-2">
                      Noyoblik (Rarity)
                    </label>
                    <select
                      value={rarity}
                      onChange={(e) => setRarity(e.target.value)}
                      className="w-full bg-[#121225] border border-[#252545] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm font-medium"
                    >
                      {RARITIES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-200/70 uppercase tracking-wider mb-2">
                      Narxi (Coin)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-[#121225] border border-[#252545] rounded-xl px-4 py-3 text-white placeholder-indigo-300/30 focus:outline-none focus:border-purple-500 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-indigo-200/70 uppercase tracking-wider mb-2">
                    Skin Rasmi (Image Upload)
                  </label>
                  <div className="relative border-2 border-dashed border-[#252545] hover:border-purple-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#121225]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <span className="text-xs text-indigo-200/70 block">
                      {imageFile ? imageFile.name : 'Rasm faylini tanlang (PNG, JPG)'}
                    </span>
                  </div>
                </div>

                {/* 3D GLB Model Upload */}
                <div>
                  <label className="block text-xs font-bold text-indigo-200/70 uppercase tracking-wider mb-2">
                    3D Model (.GLB Upload)
                  </label>
                  <div className="relative border-2 border-dashed border-[#252545] hover:border-purple-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#121225]">
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={(e) => setGlbFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
                    <span className="text-xs text-indigo-200/70 block">
                      {glbFile ? glbFile.name : '3D model faylini tanlang (.GLB)'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#252545] text-indigo-200/70 hover:text-white hover:bg-[#121225] font-semibold text-sm cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/30 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Yaratilmoqda...' : 'Yaratish'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
