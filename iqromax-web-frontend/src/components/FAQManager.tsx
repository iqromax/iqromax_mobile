import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  HelpCircle,
  Loader2,
  Search,
  PlusCircle,
  Calendar
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export const FAQManager = ({ searchQuery = "" }: { searchQuery?: string }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await api.get('faqs/');
      setFaqs(res.data);
      if (!editingId) {
        setFormData(prev => ({ ...prev, order_index: res.data.length + 1 }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      order_index: faqs.length + 1,
      is_active: true,
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Savol va javobni kiriting");
      return;
    }

    const payload = {
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      order_index: formData.order_index,
      is_active: formData.is_active,
    };

    try {
      if (editingId) {
        await api.patch(`faqs/${editingId}/`, payload);
        toast.success("FAQ yangilandi");
      } else {
        await api.post('faqs/', payload);
        toast.success("Yangi FAQ muvaffaqiyatli yaratildi");
      }
      resetForm();
      fetchFAQs();
    } catch (err) {
      console.error(err);
      toast.error(editingId ? "Yangilashda xatolik yuz berdi" : "Qo'shishda xatolik yuz berdi");
    }
  };

  const handleEdit = (faq: FAQItem) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index,
      is_active: faq.is_active,
    });
    setEditingId(faq.id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ushbu savolni o'chirib tashlamoqchimisiz?")) return;

    try {
      await api.delete(`faqs/${id}/`);
      toast.success("Muvaffaqiyatli o'chirildi");
      fetchFAQs();
    } catch (err) {
      console.error(err);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && faqs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Ko'p beriladigan savollar</h2>
          <p className="text-sm text-muted-foreground font-medium">Platforma yordam bo'limi savollarini boshqarish</p>
        </div>
        {!isFormVisible && (
          <Button 
            onClick={() => setIsFormVisible(true)}
            className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20"
          >
            <PlusCircle className="w-5 h-5" />
            Yangi savol qo'shish
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isFormVisible && (
        <Card className="border-emerald-500/20 bg-emerald-500/[0.02] overflow-hidden shadow-xl">
          <CardHeader className="border-b border-emerald-500/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                {editingId ? "Savolni tahrirlash" : "Yangi savol yaratish"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm} className="hover:bg-red-500/10 hover:text-red-500">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tartib raqami</Label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="h-12 rounded-xl border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 font-bold"
                  />
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Savol</Label>
                  <Input
                    placeholder="Savolni kiriting..."
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="h-12 rounded-xl border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Javob</Label>
                <Textarea
                  placeholder="Javobni kiriting..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                  className="rounded-xl border-emerald-500/20 focus:border-emerald-500 focus:ring-emerald-500/20 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={resetForm} className="font-bold rounded-xl">
                  Bekor qilish
                </Button>
                <Button type="submit" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 rounded-xl shadow-lg shadow-emerald-500/20">
                  {editingId ? "Yangilash" : "Yaratish"} <Save className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* FAQ Table */}
      <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[80px] font-black uppercase tracking-tighter text-[11px] py-5">#</TableHead>
              <TableHead className="font-black uppercase tracking-tighter text-[11px] py-5">Savol nomi</TableHead>
              <TableHead className="w-[200px] font-black uppercase tracking-tighter text-[11px] py-5">Yaratilgan vaqti</TableHead>
              <TableHead className="w-[120px] text-right font-black uppercase tracking-tighter text-[11px] py-5 pr-6">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFaqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-muted-foreground font-medium">
                  {searchQuery ? "Qidiruv bo'yicha ma'lumot topilmadi." : "Hozircha hech qanday savollar mavjud emas."}
                </TableCell>
              </TableRow>
            ) : (
              filteredFaqs.map((faq) => (
                <TableRow key={faq.id} className="group border-border/40 hover:bg-primary/[0.02] transition-colors">
                  <TableCell className="font-bold text-muted-foreground">{faq.order_index}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-foreground leading-tight">{faq.question}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{faq.answer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{formatDate(faq.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(faq)}
                        className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(faq.id)}
                        className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
