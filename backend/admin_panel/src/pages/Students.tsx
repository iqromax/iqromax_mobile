import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Search, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

// Define the User type matching backend schema
interface User {
  id: string;
  customId: string;
  name: string;
  phone: string;
  email: string;
  country: string | null;
  status: string;
  avatar?: string;
  character?: string;
}

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch users from backend
  useEffect(() => {
    let isMounted = true;
    const fetchStudents = async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      try {
        const response = await fetch('/api/admin/users?role=Student');
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setStudents(data);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        if (isMounted && showLoading) setIsLoading(false);
      }
    };

    fetchStudents(true);
    
    // Polling every 3 seconds for real-time updates without showing loading spinner
    const interval = setInterval(() => {
      fetchStudents(false);
    }, 3000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filter students by search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.includes(searchTerm)
  );

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Haqiqatan ham ${name} o'quvchini o'chirmoqchimisiz?`)) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setStudents(prev => prev.filter(s => s.id !== id));
        } else {
          alert("O'chirishda xatolik yuz berdi");
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      if (response.ok) {
        setStudents(prev => prev.map(s => s.id === editingUser.id ? editingUser : s));
        setEditingUser(null);
      } else {
        alert("Tahrirlashda xatolik yuz berdi");
      }
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              O'quvchilar ro'yxati
            </h1>
            <p className="text-sm text-indigo-200/60 mt-1">
              Barcha o'quvchilarni boshqarish va kuzatish
            </p>
          </div>
        </div>

        {/* Toolbar: Search and Add */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A0A16] border border-[#1A1A2F] p-4 rounded-2xl shadow-lg">
          {/* Search */}
          <div className="relative w-full sm:max-w-md group">
            <input 
              type="text" 
              placeholder="Ism, tel raqami yoki email bo'yicha qidirish..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-[#05050C] border border-[#1A1A2F] rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-indigo-200/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-indigo-300/40 group-focus-within:text-purple-400 transition-colors" />
          </div>

          {/* Add Button */}
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-95 shrink-0">
            <Plus className="w-4.5 h-4.5" />
            <span>Foydalanuvchi qo'shish</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              
              {/* Table Head */}
              <thead>
                <tr className="border-b border-[#1A1A2F] bg-[#05050C]/50">
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">ID</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Name (Ism)</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Tel raqami</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Country</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Holati</th>
                  <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase tracking-wider text-right">Amallar</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#1A1A2F]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                      <p className="text-indigo-200/50 text-sm mt-3">Yuklanmoqda...</p>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <p className="text-indigo-200/50 text-sm">Foydalanuvchilar topilmadi</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student.id}
                      className="hover:bg-[#121223] transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-indigo-300/60 whitespace-nowrap">
                        {student.customId}
                      </td>
                      
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[1px] shrink-0 overflow-hidden">
                            <div className="w-full h-full rounded-full bg-[#050510] flex items-center justify-center relative overflow-hidden">
                              <img 
                                src={student.character ? `/avatars/${student.character}.png` : (student.avatar || '/admin-logo.png')} 
                                alt={student.name} 
                                className="w-full h-full object-cover scale-[1.3] mt-1" 
                                onError={(e) => { e.currentTarget.src = '/admin-logo.png'; }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-sm text-indigo-100/80 whitespace-nowrap">
                        {student.phone}
                      </td>
                      
                      <td className="py-4 px-6 text-sm text-indigo-200/60 whitespace-nowrap">
                        {student.email}
                      </td>
                      
                      <td className="py-4 px-6 text-sm text-indigo-100/80 whitespace-nowrap">
                        {student.country || '-'}
                      </td>
                      
                      <td className="py-4 px-6 whitespace-nowrap">
                        {student.status === 'Faol' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                            Faol
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                            Nofaol
                          </span>
                        )}
                      </td>
                      
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingUser(student)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(student.id, student.name);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="border-t border-[#1A1A2F] bg-[#05050C]/50 px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-indigo-200/50">Jami {filteredStudents.length} ta o'quvchi ko'rsatilmoqda</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-[#1A1A2F] bg-[#0A0A16] text-indigo-300 hover:text-white transition-colors text-xs font-medium disabled:opacity-50">Oldingi</button>
              <button className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs font-medium shadow-[0_0_10px_rgba(168,85,247,0.4)]">1</button>
              <button className="px-3 py-1.5 rounded-lg border border-[#1A1A2F] bg-[#0A0A16] text-indigo-300 hover:text-white transition-colors text-xs font-medium disabled:opacity-50">Keyingi</button>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">O'quvchini tahrirlash</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm text-indigo-200/60 mb-1">Ism</label>
                <input 
                  type="text" 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full h-11 bg-[#05050C] border border-[#1A1A2F] rounded-xl px-4 text-white focus:border-purple-500/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200/60 mb-1">Telefon</label>
                <input 
                  type="text" 
                  value={editingUser.phone} 
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  className="w-full h-11 bg-[#05050C] border border-[#1A1A2F] rounded-xl px-4 text-white focus:border-purple-500/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200/60 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editingUser.email} 
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full h-11 bg-[#05050C] border border-[#1A1A2F] rounded-xl px-4 text-white focus:border-purple-500/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200/60 mb-1">Status</label>
                <select 
                  value={editingUser.status} 
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  className="w-full h-11 bg-[#05050C] border border-[#1A1A2F] rounded-xl px-4 text-white focus:border-purple-500/50 focus:outline-none"
                >
                  <option value="Faol">Faol</option>
                  <option value="Nofaol">Nofaol</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 h-11 rounded-xl border border-[#1A1A2F] text-white font-medium hover:bg-[#1A1A2F] transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Students;
