import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, AlertCircle, CheckCircle2, Bell, Sparkles, MessageSquare, Search, Check, ChevronDown, Plus, X, Clock } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const Notifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('ALL');
  const [users, setUsers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/admin/notifications/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const response = await fetch('/api/notifications/admin-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          message,
          target
        })
      });
      
      if (response.ok) {
        setSuccessMsg('Xabarnoma muvaffaqiyatli yuborildi!');
        setTitle('');
        setMessage('');
        fetchHistory(); // Refresh table
        setTimeout(() => {
          setSuccessMsg('');
          setIsModalOpen(false); // Close modal on success after delay
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMsg(errorData.error || 'Xatolik yuz berdi');
      }
    } catch (err: any) {
      setErrorMsg('Tizimda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.customId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.phone && u.phone.includes(searchQuery))
  );

  const getTargetLabel = () => {
    if (target === 'ALL') return "🌟 Barcha foydalanuvchilarga (Global e'lon)";
    const user = users.find(u => u.customId === target);
    if (user) return `${user.name} (${user.customId})`;
    return target;
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
          <div className="relative">
            <div className="inline-flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-300 tracking-tight">
                  Xabarnomalar Markazi
                </h1>
                <p className="text-indigo-200/70 text-sm mt-1">Yuborilgan xabarlar tarixi va statistikasi</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto relative overflow-hidden group rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-px font-semibold text-white transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:-translate-y-1"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-[#0A0A16] group-hover:bg-transparent transition-colors rounded-[15px]">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span className="tracking-wide">Yangi Xabar</span>
            </div>
          </button>
        </div>

        {/* History Table Card */}
        <div className="relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600/30 via-blue-500/30 to-purple-600/30 rounded-[2rem] blur-sm opacity-50 transition-opacity duration-500"></div>
          
          <div className="relative bg-[#070714]/90 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-5 text-sm font-semibold text-indigo-200/80 uppercase tracking-wider">Xabar / Matn</th>
                    <th className="p-5 text-sm font-semibold text-indigo-200/80 uppercase tracking-wider">Qabul qiluvchi</th>
                    <th className="p-5 text-sm font-semibold text-indigo-200/80 uppercase tracking-wider whitespace-nowrap">Vaqt</th>
                    <th className="p-5 text-sm font-semibold text-indigo-200/80 uppercase tracking-wider">O'qildi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {historyLoading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-indigo-200/70">Tarix yuklanmoqda...</p>
                      </td>
                    </tr>
                  ) : history.length > 0 ? (
                    history.map((item, idx) => {
                      const readPercent = item.total > 0 ? Math.round((item.readCount / item.total) * 100) : 0;
                      return (
                        <tr key={item.id || idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-5 align-top min-w-[250px] max-w-[400px]">
                            <h4 className="text-white font-medium text-base mb-1 line-clamp-1">{item.title}</h4>
                            <p className="text-indigo-200/70 text-sm line-clamp-2">{item.message}</p>
                          </td>
                          <td className="p-5 align-top whitespace-nowrap">
                            {item.target === 'ALL' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-medium">
                                <Users className="w-3.5 h-3.5" /> Global (Barchaga)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-medium">
                                <Users className="w-3.5 h-3.5" /> ID: {item.target}
                              </span>
                            )}
                          </td>
                          <td className="p-5 align-top whitespace-nowrap text-indigo-200/80 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-indigo-400/50" />
                              {formatDate(item.createdAt)}
                            </div>
                          </td>
                          <td className="p-5 align-top min-w-[150px]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-indigo-200">
                                {item.readCount} / {item.total} ta
                              </span>
                              <span className="text-xs font-bold text-purple-400">{readPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#121223] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${readPercent}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <AlertCircle className="w-10 h-10 text-indigo-300/30 mx-auto mb-3" />
                        <p className="text-indigo-200/70">Hali hech qanday xabarnoma yuborilmagan.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Send Notification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#070714] rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-visible animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-400" />
                Yangi Xabar Yuborish
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-indigo-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {successMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-green-200/90 text-sm font-medium">{successMsg}</p>
                </div>
              )}
              
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-200/90 text-sm font-medium">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSend} className="space-y-6">
                
                {/* Target Selection - Custom Searchable Dropdown */}
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="flex items-center gap-2 text-sm font-semibold text-indigo-100 ml-1">
                    <Users className="w-4 h-4 text-purple-400" />
                    Qabul qiluvchi
                  </label>
                  
                  <div className={`relative rounded-2xl transition-all duration-300 ${isDropdownOpen ? 'ring-2 ring-purple-500/50 bg-[#121226]' : 'bg-[#0B0B19]'}`}>
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between bg-transparent border border-white/10 rounded-2xl px-4 py-3 text-white cursor-pointer transition-colors hover:bg-white/5"
                    >
                      <span className="text-sm truncate pr-4 text-indigo-50">
                        {getTargetLabel()}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <ChevronDown className={`w-4 h-4 text-indigo-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#0B0B19]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col max-h-[250px] animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="p-2 border-b border-white/10 bg-[#070714]">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                            <input 
                              type="text"
                              placeholder="Qidirish..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-[#121226] border border-white/5 focus:border-purple-500/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-indigo-300/50 focus:outline-none transition-all"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                          <div 
                            onClick={() => { setTarget('ALL'); setIsDropdownOpen(false); setSearchQuery(''); }}
                            className={`flex items-center justify-between p-2.5 mb-1 rounded-xl cursor-pointer transition-all duration-200 ${target === 'ALL' ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                          >
                            <span className={`text-sm font-medium ${target === 'ALL' ? 'text-purple-200' : 'text-indigo-100'}`}>
                              🌟 Barcha foydalanuvchilarga (Global)
                            </span>
                            {target === 'ALL' && <Check className="w-4 h-4 text-purple-400" />}
                          </div>
                          
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => {
                              const isSelected = target === user.customId;
                              return (
                                <div 
                                  key={user.id}
                                  onClick={() => { setTarget(user.customId); setIsDropdownOpen(false); setSearchQuery(''); }}
                                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0B0B19]">
                                      <img 
                                        src={user.character ? `/avatars/${user.character.toLowerCase()}.png` : (user.avatar || '/admin-logo.png')} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => { e.currentTarget.src = '/admin-logo.png'; }}
                                      />
                                    </div>
                                    <div>
                                      <div className={`text-sm font-medium ${isSelected ? 'text-purple-200' : 'text-indigo-100'}`}>{user.name}</div>
                                      <div className="text-[10px] text-indigo-300/60">{user.customId}</div>
                                    </div>
                                  </div>
                                  {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-4 text-center text-xs text-indigo-300/50">Topilmadi</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title Input */}
                <div className="space-y-2 relative z-10">
                  <label className="flex items-center gap-2 text-sm font-semibold text-indigo-100 ml-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Xabar Sarlavhasi
                  </label>
                  <div className={`relative rounded-2xl transition-all duration-300 ${isFocused === 'title' ? 'ring-2 ring-purple-500/50 bg-[#121226]' : 'bg-[#0B0B19]'}`}>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onFocus={() => setIsFocused('title')}
                      onBlur={() => setIsFocused(null)}
                      placeholder="Sarlavhani kiriting..."
                      required
                      className="w-full bg-transparent border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-indigo-300/30 focus:outline-none text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-2 relative z-0">
                  <label className="flex items-center gap-2 text-sm font-semibold text-indigo-100 ml-1">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    Xabar Matni
                  </label>
                  <div className={`relative rounded-2xl transition-all duration-300 ${isFocused === 'message' ? 'ring-2 ring-purple-500/50 bg-[#121226]' : 'bg-[#0B0B19]'}`}>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setIsFocused('message')}
                      onBlur={() => setIsFocused(null)}
                      placeholder="Xabar matnini kiriting..."
                      required
                      rows={5}
                      className="w-full bg-transparent border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-indigo-300/30 focus:outline-none text-sm transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="relative overflow-hidden group rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-medium text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  >
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <div className="relative flex items-center gap-2 px-6 py-3">
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Yuborish</span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Notifications;
