import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, AlertCircle, CheckCircle2, Bell, Sparkles, MessageSquare, Search, Check, ChevronDown } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const Notifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('ALL');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);

  // Custom Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
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
        setTimeout(() => setSuccessMsg(''), 4000);
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

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8">
        
        {/* Header Section */}
        <div className="relative mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <Bell className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-300 tracking-tight mb-3">
            Xabarnomalar Markazi
          </h1>
          <p className="text-indigo-200/70 text-base max-w-xl mx-auto leading-relaxed">
            Tizimdagi barcha foydalanuvchilarga yoki shaxsiy tarzda e'lonlar, yangiliklar va bildirishnomalarni yuboring.
          </p>
          
          {/* Decorative blurs */}
          <div className="absolute -top-10 left-1/4 w-32 h-32 bg-purple-600/30 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="absolute top-10 right-1/4 w-32 h-32 bg-blue-600/20 rounded-full blur-[60px] pointer-events-none"></div>
        </div>

        {/* Main Card */}
        <div className="relative group">
          {/* Animated gradient border wrapper */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600/50 via-blue-500/50 to-purple-600/50 rounded-[2rem] blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-[#070714]/90 backdrop-blur-xl rounded-[2rem] p-8 sm:p-10 border border-white/5 shadow-2xl overflow-visible">
            
            {/* Inner top highlight */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>

            {/* Alerts */}
            {successMsg && (
              <div className="mb-8 p-5 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-start gap-4 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="p-2 bg-green-500/20 rounded-full shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-green-300 font-semibold text-base mb-1">Muvaffaqiyatli!</h3>
                  <p className="text-green-200/70 text-sm">{successMsg}</p>
                </div>
              </div>
            )}
            
            {errorMsg && (
              <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-4 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="p-2 bg-red-500/20 rounded-full shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-red-300 font-semibold text-base mb-1">Xatolik!</h3>
                  <p className="text-red-200/70 text-sm">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-8">
              
              {/* Target Selection - Custom Searchable Dropdown */}
              <div className="space-y-3 relative" ref={dropdownRef}>
                <label className="flex items-center gap-2 text-sm font-semibold text-indigo-100 ml-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  Qabul qiluvchi
                </label>
                
                <div className={`relative rounded-2xl transition-all duration-300 ${isDropdownOpen ? 'ring-2 ring-purple-500/50 bg-[#121226]' : 'bg-[#0B0B19]'}`}>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between bg-transparent border border-white/10 rounded-2xl px-5 py-4 text-white cursor-pointer transition-colors hover:bg-white/5"
                  >
                    <span className="text-sm truncate pr-4 text-indigo-50">
                      {getTargetLabel()}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <ChevronDown className={`w-4 h-4 text-indigo-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-[#0B0B19]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col max-h-[320px] animate-in fade-in slide-in-from-top-2 duration-200">
                      
                      {/* Search Bar */}
                      <div className="p-3 border-b border-white/10 bg-[#070714]">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                          <input 
                            type="text"
                            placeholder="Ism, ID yoki raqam bo'yicha qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#121226] border border-white/5 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-indigo-300/50 focus:outline-none transition-all"
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      {/* Users List */}
                      <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                        
                        {/* Global Option */}
                        <div 
                          onClick={() => { setTarget('ALL'); setIsDropdownOpen(false); setSearchQuery(''); }}
                          className={`flex items-center justify-between p-3 mb-1 rounded-xl cursor-pointer transition-all duration-200 ${target === 'ALL' ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${target === 'ALL' ? 'bg-purple-500/30' : 'bg-white/5'}`}>
                              <Users className={`w-5 h-5 ${target === 'ALL' ? 'text-purple-300' : 'text-indigo-300'}`} />
                            </div>
                            <span className={`text-sm font-medium ${target === 'ALL' ? 'text-purple-200' : 'text-indigo-100'}`}>
                              🌟 Barcha foydalanuvchilarga (Global e'lon)
                            </span>
                          </div>
                          {target === 'ALL' && <Check className="w-5 h-5 text-purple-400" />}
                        </div>
                        
                        {/* Filtered Users */}
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map(user => {
                            const isSelected = target === user.customId;
                            return (
                              <div 
                                key={user.id}
                                onClick={() => { setTarget(user.customId); setIsDropdownOpen(false); setSearchQuery(''); }}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500/50 to-blue-500/50 p-[1px]">
                                    <div className="w-full h-full rounded-full bg-[#0B0B19] flex items-center justify-center overflow-hidden">
                                      <img 
                                        src={user.character ? `/avatars/${user.character.toLowerCase()}.png` : (user.avatar || '/admin-logo.png')} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => { e.currentTarget.src = '/admin-logo.png'; }}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <div className={`text-sm font-medium ${isSelected ? 'text-purple-200' : 'text-indigo-100'}`}>
                                      {user.name}
                                    </div>
                                    <div className="text-xs text-indigo-300/60 mt-0.5">
                                      {user.customId} • {user.role}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && <Check className="w-5 h-5 text-purple-400" />}
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-indigo-300/50">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <div className="text-sm">Foydalanuvchi topilmadi</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-3 relative z-10">
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
                    placeholder="Masalan: Tizimda yangi imkoniyatlar yaratildi!"
                    required
                    className="w-full bg-transparent border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-indigo-300/30 focus:outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-3 relative z-0">
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
                    placeholder="Batafsil ma'lumotni bu yerga yozing..."
                    required
                    rows={6}
                    className="w-full bg-transparent border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-indigo-300/30 focus:outline-none text-sm transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto sm:min-w-[200px] float-right relative overflow-hidden group rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-px font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-[#0A0A16] sm:bg-transparent rounded-[15px] sm:rounded-none group-hover:bg-transparent transition-colors">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        <span className="text-base tracking-wide">Yuborish</span>
                      </>
                    )}
                  </div>
                </button>
                <div className="clear-both"></div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
