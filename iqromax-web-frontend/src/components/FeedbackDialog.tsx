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
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Star,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackDialogProps {
  children: React.ReactNode;
}

export const FeedbackDialog = ({ children }: FeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'problem' | 'other'>('suggestion');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    
    const subjectMap = {
      suggestion: 'Taklif',
      problem: 'Xatolik',
      other: 'Boshqa'
    };

    try {
      await api.post('feedback/', {
        name: user?.user_metadata?.username || user?.email?.split('@')[0] || 'Mehmon',
        email: user?.email || 'guest@iqromax.uz',
        subject: subjectMap[feedbackType],
        message: message.trim(),
        is_read: false
      });
      setIsSuccess(true);
      toast.success("Fikr-mulohazangiz uchun rahmat!");
      setMessage('');
      
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Xabarni yuborishda xatolik yuz berdi");
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
              key="feedback-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8"
            >
              <DialogHeader className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <DialogTitle className="text-2xl font-black text-zinc-900 tracking-tight">
                  Izoh yoki taklif
                </DialogTitle>
                <DialogDescription className="text-zinc-500 font-medium pt-1">
                  Bizni rivojlantirishga yordam bering! Fikrlaringiz biz uchun muhim.
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-2 mb-6">
                {[
                  { id: 'suggestion', label: 'Taklif', icon: ThumbsUp },
                  { id: 'problem', label: 'Xatolik', icon: AlertCircle },
                  { id: 'other', label: 'Boshqa', icon: MessageSquare },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackType(type.id as any)}
                    className={`flex-1 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all border ${
                      feedbackType === type.id 
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                        : 'bg-zinc-50 text-zinc-400 border-zinc-100 hover:bg-zinc-100'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-message" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                    Xabaringiz
                  </Label>
                  <Textarea 
                    id="feedback-message" 
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Fikringizni shu yerda qoldiring..." 
                    className="min-h-[120px] rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-emerald-500/20 transition-all font-medium resize-none p-4"
                  />
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
              key="feedback-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">Rahmat!</h2>
              <p className="text-zinc-500 font-medium mb-8">
                Fikringiz muvaffaqiyatli qabul qilindi. Sizning yordamingiz bilan biz yanada yaxshi bo'lamiz!
              </p>
              <Button 
                onClick={() => setIsOpen(false)}
                className="h-12 rounded-2xl bg-zinc-900 text-white font-black px-8"
              >
                Yopish
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
