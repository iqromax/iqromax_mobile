import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Trash2, 
  Clock,
  CheckCircle2,
  Phone,
  User,
  Loader2,
  Search,
  MoreHorizontal,
  Mail
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

interface ApplicationItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const CourseApplicationsManager = ({ searchQuery: externalSearchQuery = "" }: { searchQuery?: string }) => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('feedback/');
      // Filter out only items that start with "Kursga ariza"
      const courseApps = res.data.filter((item: any) => 
        item.subject && item.subject.startsWith('Kursga ariza')
      );
      setApplications(courseApps);
    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ushbu arizani o'chirib tashlamoqchimisiz?")) return;

    try {
      await api.delete(`feedback/${id}/`);
      toast.success("Muvaffaqiyatli o'chirildi");
      fetchApplications();
    } catch (err) {
      console.error(err);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  const toggleReadStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`feedback/${id}/`, { is_read: !currentStatus });
      fetchApplications();
    } catch (err) {
      console.error(err);
      toast.error("Holatni yangilashda xatolik");
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

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Kursga arizalar</h2>
          <p className="text-sm text-muted-foreground font-medium">O'quv kurslariga yozilish uchun kelgan arizalar</p>
        </div>
        
        <div className="relative w-full sm:w-64">
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

      <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[60px] font-black uppercase tracking-tighter text-[11px] py-5 pl-6">#</TableHead>
              <TableHead className="w-[180px] font-black uppercase tracking-tighter text-[11px] py-5">Sana</TableHead>
              <TableHead className="w-[200px] font-black uppercase tracking-tighter text-[11px] py-5">Foydalanuvchi</TableHead>
              <TableHead className="font-black uppercase tracking-tighter text-[11px] py-5">Kurs / Xabar</TableHead>
              <TableHead className="w-[100px] text-right font-black uppercase tracking-tighter text-[11px] py-5 pr-6">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-medium">
                  Hali hech qanday arizalar kelib tushmagan.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((item, index) => (
                <TableRow key={item.id} className={`group border-border/40 hover:bg-primary/[0.02] transition-colors ${!item.is_read ? 'bg-primary/[0.01]' : ''}`}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      {!item.is_read && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      <span className="font-bold text-muted-foreground">{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{formatDate(item.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-medium">{item.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="w-fit text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/10 py-0 h-5">
                        {item.subject.replace('Kursga ariza: ', '')}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium line-clamp-1">{item.message || "Qo'shimcha xabar yo'q"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-border/50 shadow-xl">
                        <DropdownMenuItem 
                          onClick={() => toggleReadStatus(item.id, item.is_read)}
                          className="text-xs font-bold gap-2 py-2.5 cursor-pointer"
                        >
                          {item.is_read ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          {item.is_read ? "Kutilmoqda deb belgilash" : "Bog'lanildi deb belgilash"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(item.id)}
                          className="text-xs font-bold gap-2 py-2.5 cursor-pointer text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          O'chirib tashlash
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
