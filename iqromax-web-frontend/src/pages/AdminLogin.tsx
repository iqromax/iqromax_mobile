import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post('token/', {
        username: formData.username,
        password: formData.password
      });

      if (response.data && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        toast.success("Xush kelibsiz, Admin!");
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("Username yoki parol noto'g'ri");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-zinc-900 rounded-[28px] flex items-center justify-center shadow-2xl rotate-6"
          >
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </motion.div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
          <CardHeader className="pt-10 pb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black tracking-widest mb-4 uppercase mx-auto">
              <Sparkles className="w-3 h-3" />
              Tizim boshqaruvi
            </div>
            <CardTitle className="text-3xl font-black text-zinc-900 tracking-tight">Admin Portal</CardTitle>
            <CardDescription className="text-zinc-500 font-medium pt-1">
              Boshqaruv paneliga kirish uchun ma'lumotlarni kiriting.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label 
                  htmlFor="username" 
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1"
                >
                  Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 transition-colors group-focus-within:text-emerald-500" />
                  <Input
                    id="username"
                    placeholder="Admin foydalanuvchi nomi"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="h-14 pl-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-emerald-500/20 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1"
                >
                  Parol
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 transition-colors group-focus-within:text-emerald-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-14 pl-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-emerald-500/20 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-zinc-900 text-white hover:bg-emerald-600 font-black text-base transition-all shadow-xl shadow-zinc-900/10 active:scale-[0.98] mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Kiritilmoqda...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Kirish <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-900 transition-colors text-xs font-bold group"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Bosh sahifaga qaytish
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} IQROMAX Enterprise Edition
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
