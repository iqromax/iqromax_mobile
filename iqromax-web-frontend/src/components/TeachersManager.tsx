import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  UserCheck, 
  Trash2, 
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  User,
  Loader2,
  Search,
  MoreHorizontal,
  Mail,
  ShieldCheck,
  FileText
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export const TeachersManager = ({ searchQuery: externalSearchQuery = "" }: { searchQuery?: string }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'teachers'>('requests');
  const [requests, setRequests] = useState<TeacherRequestItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const res = await api.get('teacher/requests');
      setRequests(res.data.requests || []);
      setTeachers(res.data.teachers || []);
    } catch (err) {
      console.error(err);
      toast.error("O'qituvchilar ma'lumotlarini yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Ushbu o'qituvchi so'rovini tasdiqlamoqchimisiz? Emailga avtomatik parol yuboriladi.")) return;

    setActionLoadingId(id);
    try {
      await api.post('teacher/approve', { id });
      toast.success("O'qituvchi tasdiqlandi va kirish ma'lumotlari emailga yuborildi!");
      fetchTeacherData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Tasdiqlashda xatolik yuz berdi");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Ushbu so'rovni rad etmoqchimisiz?")) return;

    setActionLoadingId(id);
    try {
      await api.post('teacher/reject', { id });
      toast.success("So'rov rad etildi");
      fetchTeacherData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Rad etishda xatolik");
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const filteredRequests = requests.filter(req => 
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && requests.length === 0 && teachers.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">O'qituvchilar Boshqaruvi</h2>
          <p className="text-sm text-muted-foreground font-medium">O'qituvchilar so'rovlari va tasdiqlangan o'qituvchilar ro'yxati</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/50 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Sub tabs: So'rovlar & O'qituvchilar */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'requests'
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>So'rovlar</span>
          {requests.filter(r => r.status === 'PENDING').length > 0 && (
            <Badge className="bg-amber-500 text-white font-black text-[10px] px-1.5 py-0.5 h-4 ml-1">
              {requests.filter(r => r.status === 'PENDING').length}
            </Badge>
          )}
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'teachers'
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>O'qituvchilar</span>
          <Badge className="bg-emerald-500/20 text-emerald-500 font-black text-[10px] px-1.5 py-0.5 h-4 ml-1">
            {teachers.length}
          </Badge>
        </button>
      </div>

      {/* TAB 1: SO'ROVLAR JADVALI */}
      {activeTab === 'requests' && (
        <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[60px] font-black uppercase tracking-tighter text-[11px] py-5 pl-6">#</TableHead>
                <TableHead className="w-[160px] font-black uppercase tracking-tighter text-[11px] py-5">Sana</TableHead>
                <TableHead className="w-[200px] font-black uppercase tracking-tighter text-[11px] py-5">Ism Sharif</TableHead>
                <TableHead className="font-black uppercase tracking-tighter text-[11px] py-5">Aloqa ma'lumotlari</TableHead>
                <TableHead className="w-[140px] font-black uppercase tracking-tighter text-[11px] py-5">Holati</TableHead>
                <TableHead className="w-[140px] text-right font-black uppercase tracking-tighter text-[11px] py-5 pr-6">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground font-medium">
                    Hali hech qanday o'qituvchilik so'rovlari kelib tushmagan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((item, index) => (
                  <TableRow key={item.id} className="group border-border/40 hover:bg-primary/[0.02] transition-colors">
                    <TableCell className="pl-6">
                      <span className="font-bold text-muted-foreground">{index + 1}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{formatDate(item.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span>{item.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span>{item.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.status === 'PENDING' && (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold text-[10px]">
                          Kutilmoqda
                        </Badge>
                      )}
                      {item.status === 'APPROVED' && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold text-[10px]">
                          Tasdiqlangan
                        </Badge>
                      )}
                      {item.status === 'REJECTED' && (
                        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold text-[10px]">
                          Rad etilgan
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            disabled={actionLoadingId === item.id}
                            className="h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1"
                          >
                            {actionLoadingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            Tasdiqlash
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(item.id)}
                            disabled={actionLoadingId === item.id}
                            className="h-8 px-3 rounded-lg text-rose-500 hover:bg-rose-500/10 font-bold text-xs gap-1 border-rose-500/20"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Rad etish
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">Bajarildi</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* TAB 2: O'QITUVCHILAR JADVALI */}
      {activeTab === 'teachers' && (
        <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[60px] font-black uppercase tracking-tighter text-[11px] py-5 pl-6">#</TableHead>
                <TableHead className="w-[100px] font-black uppercase tracking-tighter text-[11px] py-5">ID</TableHead>
                <TableHead className="w-[200px] font-black uppercase tracking-tighter text-[11px] py-5">Ism Sharif (Username)</TableHead>
                <TableHead className="font-black uppercase tracking-tighter text-[11px] py-5">Aloqa ma'lumotlari</TableHead>
                <TableHead className="w-[160px] font-black uppercase tracking-tighter text-[11px] py-5">Qo'shilgan sana</TableHead>
                <TableHead className="w-[100px] font-black uppercase tracking-tighter text-[11px] py-5">Holati</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground font-medium">
                    Hali hech qanday o'qituvchilar mavjud emas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((item, index) => (
                  <TableRow key={item.id} className="group border-border/40 hover:bg-primary/[0.02] transition-colors">
                    <TableCell className="pl-6">
                      <span className="font-bold text-muted-foreground">{index + 1}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono font-bold text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                        {item.customId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span>{item.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span>{item.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{formatDate(item.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold text-[10px]">
                        Faol
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
