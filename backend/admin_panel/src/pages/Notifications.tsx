import React, { useState, useEffect } from 'react';
import { Send, Users, AlertCircle, CheckCircle2, Bell, Sparkles, MessageSquare } from 'lucide-react';
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

  useEffect(() => {
    fetchUsers();
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
          
          <div className="relative bg-[#070714]/90 backdrop-blur-xl rounded-[2rem] p-8 sm:p-10 border border-white/5 shadow-2xl overflow-hidden">
            
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
              
              {/* Target Selection */}
              <div className="space-y-3 relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-indigo-100 ml-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  Qabul qiluvchi
                </label>
                <div className={`relative rounded-2xl transition-all duration-300 ${isFocused === 'target' ? 'ring-2 ring-purple-500/50 bg-[#121226]' : 'bg-[#0B0B19]'}`}>
                  <select 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    onFocus={() => setIsFocused('target')}
                    onBlur={() => setIsFocused(null)}
                    className="w-full bg-transparent border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none transition-colors cursor-pointer text-sm"
                  >
                    <option value="ALL">🌟 Barcha foydalanuvchilarga (Global e'lon)</option>
                    <optgroup label="Maxsus Foydalanuvchilar" className="bg-[#0B0B19]">
                      {users.map(user => (
                        <option key={user.id} value={user.customId} className="bg-[#0B0B19]">
                          {user.name} ({user.customId}) - {user.role}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-3 relative">
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
              <div className="space-y-3 relative">
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
