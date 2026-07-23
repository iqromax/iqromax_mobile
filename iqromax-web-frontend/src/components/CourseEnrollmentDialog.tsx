import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  Send, 
  User, 
  Phone, 
  MessageSquare, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface CourseEnrollmentDialogProps {
  children: React.ReactNode;
  courseName?: string;
}

export const CourseEnrollmentDialog = ({ children, courseName }: CourseEnrollmentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('feedback/', {
        name: formData.name,
        email: formData.phone, // We use email field to store phone number
        subject: `Kursga ariza: ${courseName || 'Noma\'lum kurs'}`,
        message: formData.message,
        is_read: false
      });
      setIsSuccess(true);
      toast.success("Arizangiz muvaffaqiyatli yuborildi!");
      setFormData({ name: '', phone: '', message: '' });
      
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Arizani yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-[32px] bg-white shadow-2xl">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8"
            >
              <DialogHeader className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <DialogTitle className="text-2xl font-black text-zinc-900 tracking-tight">
                  Kursga yozilish
                </DialogTitle>
                <DialogDescription className="text-zinc-500 font-medium pt-1">
                  Ma'lumotlaringizni qoldiring, biz siz bilan tez orada bog'lanamiz.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                    Ism va Familiya
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masalan: Azizbek Olimov" 
                      className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-emerald-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                    Telefon raqam
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                      id="phone" 
                      required 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+998 (__) ___-__-__" 
                      className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-emerald-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                    Qo'shimcha xabar (ixtiyoriy)
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-zinc-400" />
                    <Textarea 
                      id="message" 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Sizni nima qiziqtiryapti?" 
                      className="min-h-[100px] pl-11 pt-3.5 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-emerald-500/20 transition-all font-medium resize-none"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-zinc-900 text-white hover:bg-emerald-600 font-black text-base transition-all shadow-xl shadow-zinc-900/10 active:scale-[0.98] mt-4"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Yuborilmoqda...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Yuborish <Send className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">Muvaffaqiyatli!</h2>
              <p className="text-zinc-500 font-medium mb-8">
                Sizning arizangiz qabul qilindi. Tez orada operatorlarimiz bog'lanishadi.
              </p>
              <Button 
                onClick={() => setIsOpen(false)}
                className="h-12 rounded-2xl bg-zinc-900 text-white font-black px-8"
              >
                Tushunarli
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
