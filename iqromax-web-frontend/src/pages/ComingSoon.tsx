import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles, Rocket, Timer, Bell, ArrowRight } from 'lucide-react';

const ComingSoon = ({ title = "Ushbu bo'lim" }: { title?: string }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-emerald-500/10 selection:text-emerald-600">
      <Navbar soundEnabled={false} onToggleSound={() => {}} />
      
      <main className="flex flex-col items-center justify-center pt-12 pb-24 px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Animated Illustration Header (Compact) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative inline-block mb-10"
          >
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse" />
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-zinc-900 rounded-[30px] flex items-center justify-center shadow-xl rotate-6 hover:rotate-0 transition-transform duration-500">
              <Rocket className="w-10 h-10 md:w-16 md:h-16 text-emerald-400" />
              
              {/* Floating Icons (Compact) */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center border border-zinc-100"
              >
                <Timer className="w-4 h-4 text-emerald-500" />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-2 -left-2 w-8 h-8 bg-zinc-800 rounded-xl shadow-lg flex items-center justify-center border border-zinc-700"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content (Compact) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black tracking-widest mb-5 uppercase shadow-sm">
              <Sparkles className="w-3 h-3" />
              Yaqinda qo'shiladi
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black mb-4 leading-tight tracking-tight text-zinc-900">
              {title} <span className="text-emerald-500">tez orada</span> tayyor bo'ladi!
            </h1>
            
            <p className="text-zinc-500 text-sm md:text-base font-medium mb-10 max-w-lg mx-auto leading-relaxed">
              Biz ushbu sahifani siz uchun yanada qiziqarli va foydali qilish ustida ishlamoqdamiz.
            </p>

            {/* Actions (Compact) */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button 
                size="lg"
                onClick={() => navigate('/')}
                className="h-11 rounded-2xl bg-zinc-900 text-white hover:bg-emerald-600 font-black px-8 text-sm shadow-xl shadow-zinc-900/10 transition-all hover:scale-105"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Bosh sahifa
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="h-11 rounded-2xl border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 text-sm font-bold px-8 hover:bg-zinc-50 group"
              >
                <Bell className="mr-2 h-4 w-4 text-emerald-500" /> Xabardor bo'lish
              </Button>
            </div>
          </motion.div>

          {/* Social Proof / Stats (Compact) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-6 text-zinc-400 font-bold text-[10px] uppercase tracking-widest"
          >
            <div className="flex items-center gap-2">
              <span className="text-zinc-900 text-base font-black">95%</span> Tayyor
            </div>
            <div className="w-1 h-1 bg-zinc-300 rounded-full" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-900 text-base font-black">200+</span> Kutayotganlar
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComingSoon;
