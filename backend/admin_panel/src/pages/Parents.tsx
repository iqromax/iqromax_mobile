import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Search, Trash2, Loader2, AlertTriangle, UserCheck, ShieldCheck, Mail, Phone, Link, Calendar, RefreshCw } from 'lucide-react';

interface ParentUser {
  id: string;
  customId: string;
  name: string;
  phone: string;
  email: string;
  country: string | null;
  status: string;
  createdAt?: string;
}

const Parents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [parents, setParents] = useState<ParentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchParents = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users?role=parent');
      if (response.ok) {
        const data = await response.json();
        setParents(data);
      } else {
        console.error('Failed to fetch parents');
      }
    } catch (error) {
      console.error('Error fetching parents:', error);
    } fontally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      try {
        const response = await fetch('/api/admin/users?role=parent');
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setParents(data);
        }
      } catch (error) {
        console.error('Error fetching parents:', error);
      } finally {
        if (isMounted && showLoading) setIsLoading(false);
      }
    };

    load(true);

    const interval = setInterval(() => {
      load(false);
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredParents = parents.filter(p =>
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.phone && p.phone.includes(searchTerm)) ||
    (p.country && p.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.customId && p.customId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setParents(prev => prev.filter(p => p.id !== userToDelete.id));
        setUserToDelete(null);
      } else {
        alert("O'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              👨‍👩‍👧 Ota-onalar ro'yxati
            </h1>
            <p className="text-sm text-indigo-200/60 mt-1">
              Real-vaqt rejimida ro'yxatdan o'tgan ota-onalar va ulangan farzandlar monitoringi
            </p>
          </div>
          <button 
            onClick={() => fetchParents(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A0A16] border border-[#1A1A2F] text-indigo-200/80 hover:text-white hover:bg-[#121223] transition-colors text-sm font-medium self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-purple-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yangilash</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Jami Ota-onalar</p>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white">{parents.length}</h3>
          </div>

          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Farzand Biriktirganlar</p>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Link className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {parents.filter(p => p.country && p.country.length > 0).length}
            </h3>
          </div>

          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Faol Holatdagilar</p>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {parents.filter(p => p.status === 'Faol' || !p.status).length}
            </h3>
          </div>
        </div>

        {/* Toolbar: Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A0A16] border border-[#1A1A2F] p-4 rounded-2xl shadow-lg">
          <div className="relative w-full sm:max-w-md group">
            <input 
              type="text" 
              placeholder="Ism, tel, email yoki farzand ID bo'yicha qidirish..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-[#05050C] border border-[#1A1A2F] rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-indigo-200/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-indigo-300/40 group-focus-within:text-purple-400 transition-colors" />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#1A1A2F] bg-[#05050C]/50">
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Ota-ona Ismi</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Aloqa Ma'lumotlari</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Biriktirilgan Farzand ID</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Ro'yxatdan o'tgan sana</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider text-right">Amallar</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#1A1A2F]">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                      <p className="text-indigo-200/50 text-sm mt-3">Yuklanmoqda...</p>
                    </td>
                  </tr>
                ) : filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <p className="text-indigo-200/50 text-sm">Hozircha ota-onalar ro'yxatdan o'tmagan</p>
                    </td>
                  </tr>
                ) : (
                  filteredParents.map((parent) => (
                    <tr 
                      key={parent.id}
                      className="hover:bg-[#121223] transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">
                            {(parent.name || 'O').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors block">
                              {parent.name || "Ota-ona"}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-0.5">
                              OTA-ONA
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-6 text-sm text-indigo-100/80 whitespace-nowrap space-y-1">
                        <div className="flex items-center gap-1.5 text-indigo-200/80">
                          <Mail className="w-3.5 h-3.5 text-purple-400" />
                          <span>{parent.email || "Noma'lum email"}</span>
                        </div>
                        {parent.phone && (
                          <div className="flex items-center gap-1.5 text-indigo-300/60 text-xs">
                            <Phone className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{parent.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Child ID */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {parent.country ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 font-medium text-xs">
                            <Link className="w-3.5 h-3.5" />
                            ID: {parent.country}
                          </span>
                        ) : (
                          <span className="text-indigo-300/40 italic text-xs">Biriktirilmagan</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-sm text-indigo-200/60 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{parent.createdAt ? new Date(parent.createdAt).toLocaleDateString('uz-UZ') : "Bugun"}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <button 
                          onClick={() => setUserToDelete({ id: parent.id, name: parent.name || 'Ota-ona' })}
                          className="w-8 h-8 rounded-lg inline-flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 hover:border-red-500"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Delete Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#05050C]/80 backdrop-blur-sm" onClick={() => !isDeleting && setUserToDelete(null)}></div>
          <div className="relative w-full max-w-sm bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ota-onani o'chirish</h3>
              <p className="text-xs text-indigo-200/70 mb-6">
                Haqiqatan ham <strong className="text-white">{userToDelete.name}</strong> akkauntini o'chirmoqchimisiz?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl border border-[#1A1A2F] text-indigo-200/70 text-xs font-medium hover:bg-[#121223]"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "O'chirish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Parents;
