import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  Users, 
  Trash2, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  UserCheck, 
  Phone, 
  Mail, 
  Sparkles,
  Link,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { io } from 'socket.io-client';

export const ParentsManager = () => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchParents = async () => {
    setLoading(true);
    try {
      // Fetch users with parent role
      const res = await api.get('admin/users?role=parent');
      setParents(res.data || []);
    } catch (err) {
      console.error('Fetch parents error:', err);
      toast.error("Ota-onalar ro'yxatini yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();

    // Socket.io for real-time parent registration and invites
    const socket = io(window.location.origin.replace('http', 'ws'), {
      path: '/api/socket.io',
      transports: ['websocket', 'polling']
    });

    socket.on('parent_invite_sent', () => {
      fetchParents();
    });

    socket.on('parent_invite_accepted', () => {
      fetchParents();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDeleteParent = async (id: string, name: string) => {
    if (!confirm(`Haqiqatdan ham "${name}" nomli ota-onani tizimdan o'chirmoqchimisiz?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`admin/users/${id}`);
      toast.success("Ota-ona muvaffaqiyatli o'chirildi");
      setParents(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete parent error:', err);
      toast.error("Ota-onani o'chirishda xatolik yuz berdi");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredParents = parents.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.email && p.email.toLowerCase().includes(query)) ||
      (p.phone && p.phone.toLowerCase().includes(query)) ||
      (p.country && p.country.toLowerCase().includes(query)) ||
      (p.customId && p.customId.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Ota-onalar Ro'yxati</h2>
              <p className="text-zinc-500 text-xs font-medium mt-0.5">Real-vaqt rejimida ro'yxatdan o'tgan ota-onalar va ulangan farzandlar monitoringi</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchParents}
            variant="outline"
            className="rounded-2xl h-11 px-4 border-zinc-200 hover:bg-zinc-50 font-bold text-xs gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-500' : ''}`} />
            Yangilash
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-none shadow-sm rounded-3xl bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Jami Ota-onalar</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-zinc-900 mt-2">{parents.length}</p>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Farzand Biriktirganlar</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-zinc-900 mt-2">
            {parents.filter(p => p.country && p.country.length > 0).length}
          </p>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Faol Holatdagilar</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-zinc-900 mt-2">
            {parents.filter(p => p.status === 'Faol' || !p.status).length}
          </p>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="p-6 pb-4 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-base font-black text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" /> barcha Ota-onalar Jadvali
          </CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Ism, email yoki telefon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 rounded-2xl border-zinc-200 bg-zinc-50 focus:bg-white text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
            </div>
          ) : filteredParents.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Users className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-600 font-bold text-sm">Hozircha ota-onalar ro'yxatdan o'tmagan</p>
              <p className="text-zinc-400 text-xs mt-1">Yangi ota-onalar ilova orqali kirishi bilan bu yerda real-vaqtda ko'rinadi.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-black text-zinc-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Ota-ona</th>
                    <th className="py-4 px-6">Aloqa Ma'lumotlari</th>
                    <th className="py-4 px-6">Biriktirilgan Farzand ID</th>
                    <th className="py-4 px-6">Sana</th>
                    <th className="py-4 px-6 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {filteredParents.map((parent) => (
                    <tr key={parent.id} className="hover:bg-zinc-50/80 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 font-black text-sm">
                            {(parent.name || 'O').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900">{parent.name || "Ota-ona"}</p>
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 mt-0.5">
                              OTA-ONA AKKAUNTI
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-600">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{parent.email || "Noma'lum email"}</span>
                        </div>
                        {parent.phone && (
                          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{parent.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Linked Child */}
                      <td className="py-4 px-6">
                        {parent.country ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold text-xs">
                            <Link className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ID: {parent.country}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">Biriktirilmagan</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>
                            {parent.createdAt ? new Date(parent.createdAt).toLocaleDateString('uz-UZ') : "Bugun"}
                          </span>
                        </div>
                      </td>

                      {/* Delete Action */}
                      <td className="py-4 px-6 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteParent(parent.id, parent.name)}
                          disabled={deletingId === parent.id}
                          className="h-8 w-8 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
