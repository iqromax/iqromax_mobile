import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Trash2, 
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  ThumbsUp,
  MoreHorizontal
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

interface FeedbackItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const FeedbackManager = ({ searchQuery = "" }: { searchQuery?: string }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'suggestion' | 'problem' | 'other'>('all');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.get('feedback/');
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ushbu xabarni o'chirib tashlamoqchimisiz?")) return;

    try {
      await api.delete(`feedback/${id}/`);
      toast.success("Muvaffaqiyatli o'chirildi");
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  const toggleReadStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`feedback/${id}/`, { is_read: !currentStatus });
      fetchFeedbacks();
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

  const getCategoryBadge = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('taklif') || s.includes('suggestion')) {
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5"><ThumbsUp className="w-3 h-3" /> Taklif</Badge>;
    }
    if (s.includes('xatolik') || s.includes('problem')) {
      return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 gap-1.5"><AlertCircle className="w-3 h-3" /> Xatolik</Badge>;
    }
    return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1.5"><MessageSquare className="w-3 h-3" /> Boshqa</Badge>;
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches = 
        f.name?.toLowerCase().includes(q) ||
        f.email?.toLowerCase().includes(q) ||
        f.subject?.toLowerCase().includes(q) ||
        f.message?.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (filter === 'all') return true;
    const s = f.subject.toLowerCase();
    if (filter === 'suggestion') return s.includes('taklif') || s.includes('suggestion');
    if (filter === 'problem') return s.includes('xatolik') || s.includes('problem');
    if (filter === 'other') return !s.includes('taklif') && !s.includes('suggestion') && !s.includes('xatolik') && !s.includes('problem');
    return true;
  });

  if (loading && feedbacks.length === 0) {
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
          <h2 className="text-2xl font-black text-foreground tracking-tight">Izoh yoki takliflar</h2>
          <p className="text-sm text-muted-foreground font-medium">Foydalanuvchilardan kelgan fikr va mulohazalar</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card border border-border/50 p-1 rounded-xl">
          <Button 
            variant={filter === 'all' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('all')}
            className="rounded-lg h-8 text-[11px] font-bold"
          >
            Hammasi
          </Button>
          <Button 
            variant={filter === 'suggestion' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('suggestion')}
            className="rounded-lg h-8 text-[11px] font-bold"
          >
            Takliflar
          </Button>
          <Button 
            variant={filter === 'problem' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('problem')}
            className="rounded-lg h-8 text-[11px] font-bold"
          >
            Xatoliklar
          </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[60px] font-black uppercase tracking-tighter text-[11px] py-5 pl-6">#</TableHead>
              <TableHead className="w-[180px] font-black uppercase tracking-tighter text-[11px] py-5">Sana</TableHead>
              <TableHead className="w-[150px] font-black uppercase tracking-tighter text-[11px] py-5">Bo'lim</TableHead>
              <TableHead className="font-black uppercase tracking-tighter text-[11px] py-5">Xabar mazmuni</TableHead>
              <TableHead className="w-[100px] text-right font-black uppercase tracking-tighter text-[11px] py-5 pr-6">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-medium">
                  {filter === 'all' ? "Hali hech qanday xabarlar kelib tushmagan." : "Ushbu bo'limda xabarlar mavjud emas."}
                </TableCell>
              </TableRow>
            ) : (
              filteredFeedbacks.map((item, index) => (
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
                    {getCategoryBadge(item.subject)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-foreground line-clamp-1">{item.message}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{item.name} ({item.email})</span>
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
                          {item.is_read ? "O'qilmagan deb belgilash" : "O'qildi deb belgilash"}
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
