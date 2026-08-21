import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Search, Loader2, CheckCircle2, XCircle, Clock, Mail, Phone, UserCheck, FileText, AlertCircle, Send, Trash2 } from 'lucide-react';

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

  // Custom Confirm, Reject & Delete Modals
  const [approveModalItem, setApproveModalItem] = useState<TeacherRequestItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<TeacherRequestItem | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherUserItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

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

  const confirmApprove = async () => {
    if (!approveModalItem) return;
    const id = approveModalItem.id;
    setActionLoadingId(id);
    try {
      const res = await fetch('/api/teacher/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setApproveModalItem(null);
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

  const confirmReject = async () => {
    if (!rejectModalItem) return;
    const id = rejectModalItem.id;
    setActionLoadingId(id);
    try {
      const res = await fetch('/api/teacher/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason: rejectionReason })
      });
      if (res.ok) {
        setRejectModalItem(null);
        setRejectionReason('');
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

  const confirmDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    const id = teacherToDelete.id;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTeacherToDelete(null);
        fetchTeacherData(false);
      } else {
        alert("O'chirishda xatolik yuz berdi");
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
                                onClick={() => setApproveModalItem(req)}
                                disabled={actionLoadingId === req.id}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-1.5 transition-all"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Tasdiqlash
                              </button>
                              <button
                                onClick={() => {
                                  setRejectModalItem(req);
                                  setRejectionReason('');
                                }}
                                disabled={actionLoadingId === req.id}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center gap-1.5 transition-all"
                              >
                                <XCircle className="w-4 h-4" />
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
                    <th className="py-4 px-6 text-xs font-semibold text-indigo-200/50 uppercase text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A2F]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-indigo-200/50 text-sm">
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
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setTeacherToDelete(t)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 hover:border-rose-500 hover:shadow-[0_0_10px_rgba(244,63,94,0.5)] ml-auto"
                            title="O'qituvchini o'chirish"
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
        )}
      </div>

      {/* APPROVE CONFIRMATION MODAL */}
      {approveModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#05050C]/80 backdrop-blur-md" onClick={() => !actionLoadingId && setApproveModalItem(null)}></div>
          <div className="relative w-full max-w-md bg-[#0D0D1F] border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">O'qituvchini Tasdiqlash</h3>
              <p className="text-sm text-indigo-200/70 mb-6 leading-relaxed">
                Haqiqatan ham <strong className="text-white">{approveModalItem.name}</strong> foydalanuvchisini o'qituvchilikka tasdiqlamoqchimisiz?
                <br />
                <span className="text-emerald-400 text-xs mt-2 block font-medium">✨ Emailga avtomatik ravishda login (username) va parol yuboriladi.</span>
              </p>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setApproveModalItem(null)}
                  disabled={!!actionLoadingId}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#121228] border border-[#1A1A35] text-indigo-200/80 text-sm font-medium hover:bg-[#1A1A3F] hover:text-white transition-all disabled:opacity-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={confirmApprove}
                  disabled={!!actionLoadingId}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoadingId === approveModalItem.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Tasdiqlanmoqda...
                    </>
                  ) : (
                    "Ha, Tasdiqlash"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL WITH REASON INPUT */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#05050C]/80 backdrop-blur-md" onClick={() => !actionLoadingId && setRejectModalItem(null)}></div>
          <div className="relative w-full max-w-md bg-[#0D0D1F] border border-rose-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500"></div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 shadow-[inset_0_0_15px_rgba(244,63,94,0.2)]">
                <AlertCircle className="w-8 h-8 text-rose-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">So'rovni Rad Etish</h3>
              <p className="text-sm text-indigo-200/70 mb-4 leading-relaxed">
                <strong className="text-white">{rejectModalItem.name}</strong> so'rovini rad etish sababini kiriting. Ushbu sabab uning emailiga yuboriladi.
              </p>

              {/* Reason Textarea */}
              <div className="w-full text-left mb-6">
                <label className="block text-xs font-semibold text-indigo-200/60 uppercase tracking-wider mb-2">Rad etish sababi</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Masalan: Hujjatlar yetarli emas yoki talablarga mos kelmaydi..."
                  className="w-full bg-[#050512] border border-[#1A1A35] rounded-xl p-3 text-sm text-white placeholder:text-indigo-200/30 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  disabled={!!actionLoadingId}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#121228] border border-[#1A1A35] text-indigo-200/80 text-sm font-medium hover:bg-[#1A1A3F] hover:text-white transition-all disabled:opacity-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={confirmReject}
                  disabled={!!actionLoadingId}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoadingId === rejectModalItem.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Rad etish & Yuborish
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE TEACHER CONFIRMATION MODAL */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#05050C]/80 backdrop-blur-md" onClick={() => !actionLoadingId && setTeacherToDelete(null)}></div>
          <div className="relative w-full max-w-md bg-[#0D0D1F] border border-rose-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-600 to-pink-600"></div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 shadow-[inset_0_0_15px_rgba(244,63,94,0.2)]">
                <AlertCircle className="w-8 h-8 text-rose-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">O'qituvchini O'chirish</h3>
              <p className="text-sm text-indigo-200/70 mb-6 leading-relaxed">
                Haqiqatan ham <strong className="text-white">{teacherToDelete.name}</strong> ismli o'qituvchini tizimdan o'chirib tashlamoqchimisiz?
                <br />
                <span className="text-rose-400 text-xs mt-2 block font-medium">⚠️ O'qituvchi ilovada bo'lsa real-vaqt rejimida ogohlantirilib, tizimdan chiqarib yuboriladi.</span>
              </p>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setTeacherToDelete(null)}
                  disabled={!!actionLoadingId}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#121228] border border-[#1A1A35] text-indigo-200/80 text-sm font-medium hover:bg-[#1A1A3F] hover:text-white transition-all disabled:opacity-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteTeacher}
                  disabled={!!actionLoadingId}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoadingId === teacherToDelete.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      O'chirilmoqda...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Ha, O'chirish
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
