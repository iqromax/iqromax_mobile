import React, { useState, useEffect } from 'react';
import { Send, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from '../lib/axios';

const Notifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('ALL');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
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
      await axios.post('/api/notifications/admin-send', {
        title,
        message,
        target
      });
      setSuccessMsg('Xabarnoma muvaffaqiyatli yuborildi!');
      setTitle('');
      setMessage('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Xabarnomalar Yuborish</h1>
        <p className="text-indigo-200/60 text-sm">Tizimdagi foydalanuvchilarga umumiy yoki yakka tartibda xabar yuborish</p>
      </div>

      <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-green-200 text-sm">{successMsg}</p>
          </div>
        )}
        
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200 text-sm">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-200/80">Kimgadir (Qabul qiluvchi)</label>
            <div className="relative">
              <select 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-purple-500/50 transition-colors"
              >
                <option value="ALL">Barcha foydalanuvchilarga (Global)</option>
                {users.map(user => (
                  <option key={user.id} value={user.customId}>
                    {user.name} ({user.customId}) - {user.role}
                  </option>
                ))}
              </select>
              <Users className="w-4 h-4 text-indigo-400/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-200/80">Xabar Sarlavhasi</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Yangi Darajaga Ko'tarildingiz!"
              required
              className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white placeholder-indigo-200/30 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-200/80">Xabar Matni</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xabar mazmunini bu yerga yozing..."
              required
              rows={5}
              className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white placeholder-indigo-200/30 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(147,51,234,0.3)]"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Yuborilmoqda...' : 'Xabarni Yuborish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Notifications;
