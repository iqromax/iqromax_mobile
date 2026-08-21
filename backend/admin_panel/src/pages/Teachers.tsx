import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Search, Loader2, CheckCircle2, XCircle, Clock, Mail, Phone, UserCheck, FileText } from 'lucide-react';

interface TeacherRequestItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface TeacherUserItem {
  id: string;
  customId: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function Teachers() {
  const [activeTab, setActiveTab] = useState<'requests' | 'teachers'>('requests');
  const [requests, setRequests] = useState<TeacherRequestItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherUserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchTeacherData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await fetch('/api/teacher/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
        setTeachers(data.teachers || []);
      }
    } catch (error) {
      console.error('Error fetching teacher requests:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData(true);
    const interval = setInterval(() => {
      fetchTeacherData(false);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Ushbu o'qituvchi so'rovini tasdiqlamoqchimisiz? Emailga avtomatik login va parol yuboriladi.")) return;
    setActionLoadingId(id);
    try {
      const res = await fetch('/api/teacher/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert("O'qituvchi tasdiqlandi va login ma'lumotlari emailga yuborildi!");
        fetchTeacherData(false);
      } else {
        const err = await res.json();
        alert(err.error || "Tasdiqlashda xatolik");
      }
    } catch (e) {
      console.error(e);
      alert("Server bilan ulanishda xatolik");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Ushbu so'rovni rad etmoqchimisiz?")) return;
    setActionLoadingId(id);
    try {
      const res = await fetch('/api/teacher/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert("So'rov rad etildi");
        fetchTeacherData(false);
      } else {
        const err = await res.json();
        alert(err.error || "Rad etishda xatolik");
      }
    } catch (e) {
      console.error(e);
      alert("Server bilan ulanishda xatolik");
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const filteredRequests = requests.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.phone.includes(searchTerm)
  );

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone.includes(searchTerm) ||
    t.customId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              O'qituvchilar bo'limi
            </h1>
            <p className="text-sm text-indigo-200/60 mt-1">
              O'qituvchilik so'rovlarini tasdiqlash va o'qituvchilar ro'yxatini boshqarish
            </p>
          </div>
        </div>

        {/* Toolbar & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A0A16] border border-[#1A1A2F] p-4 rounded-2xl shadow-lg">
          {/* Sub tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'requests'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-[#05050C] text-indigo-200/60 hover:text-white border border-[#1A1A2F]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>So'rovlar</span>
              {requests.filter(r => r.status === 'PENDING').length > 0 && (
                <span className="bg-amber-500 text-white font-bold text-xs px-2 py-0.5 rounded-full ml-1">
                  {requests.filter(r => r.status === 'PENDING').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'teachers'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-[#05050C] text-indigo-200/60 hover:text-white border border-[#1A1A2F]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>O'qituvchilar ({teachers.length})</span>
            </button>
          </div>

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
        </div>

        {/* TAB 1: SO'ROVLAR */}
        {activeTab === 'requests' && (
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#1A1A2F] bg-[#05050C]/50">
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">#</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">Sana</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">Ism Sharif</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">Aloqa</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">Holati</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A2F]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                        <p className="text-indigo-200/50 text-sm mt-3">Yuklanmoqda...</p>
                      </td>
                    </tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-indigo-200/50 text-sm">
                        Hali o'qituvchilik so'rovlari kelib tushmagan
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req, idx) => (
                      <tr key={req.id} className="hover:bg-[#121223] transition-colors">
                        <td className="py-4 px-6 text-sm text-indigo-300/60 font-medium">{idx + 1}</td>
                        <td className="py-4 px-6 text-xs text-indigo-200/60 flex items-center gap-1.5 mt-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(req.createdAt)}</span>
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-white">{req.name}</td>
                        <td className="py-4 px-6 text-xs text-indigo-200/80">
                          <div className="flex items-center gap-1 mb-1">
                            <Mail className="w-3 h-3 text-purple-400" />
                            <span>{req.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{req.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {req.status === 'PENDING' && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Kutilmoqda
                            </span>
                          )}
                          {req.status === 'APPROVED' && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                              Tasdiqlangan
                            </span>
                          )}
                          {req.status === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                              Rad etilgan
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {req.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(req.id)}
                                disabled={actionLoadingId === req.id}
                                className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/30 text-xs font-medium flex items-center gap-1 transition-all"
                              >
                                {actionLoadingId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                Tasdiqlash
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                disabled={actionLoadingId === req.id}
                                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 text-xs font-medium flex items-center gap-1 transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Rad etish
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-indigo-200/40">Bajarildi</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: O'QITUVCHILAR */}
        {activeTab === 'teachers' && (
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#1A1A2F] bg-[#05050C]/50">
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">#</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">ID</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">Ism Sharif (Username)</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">Aloqa</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">Qo'shilgan sana</th>
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase">Holati</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A2F]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-indigo-200/50 text-sm">
                        O'qituvchilar mavjud emas
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.map((t, idx) => (
                      <tr key={t.id} className="hover:bg-[#121223] transition-colors">
                        <td className="py-4 px-6 text-sm text-indigo-300/60">{idx + 1}</td>
                        <td className="py-4 px-6 text-xs font-mono font-bold text-purple-400">{t.customId}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-white">{t.name}</td>
                        <td className="py-4 px-6 text-xs text-indigo-200/80">
                          <div>{t.email}</div>
                          <div className="text-indigo-200/50">{t.phone}</div>
                        </td>
                        <td className="py-4 px-6 text-xs text-indigo-200/60">{formatDate(t.createdAt)}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            Faol
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
