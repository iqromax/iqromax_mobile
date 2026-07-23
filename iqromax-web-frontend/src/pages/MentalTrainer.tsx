import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Brain, 
  Gamepad2, 
  BarChart3, 
  Users, 
  Timer, 
  ChevronRight,
  Settings,
  ChevronLeft,
  Sparkles,
  Play,
  LayoutGrid,
  BookOpen,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const MentalTrainer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mashq');
  const [formulaType, setFormulaType] = useState('oddiy');
  const [digitCount, setDigitCount] = useState(1);
  const [speed, setSpeed] = useState(0.5);
  const [problemCount, setProblemCount] = useState(5);

  const formulaTypes = [
    { id: 'oddiy', label: 'Oddiy', icon: '📘' },
    { id: 'formula5', label: 'Formula 5', icon: '🔢' },
    { id: 'formula10', label: 'Formula 10', icon: '➕' },
    { id: 'aralash', label: 'Aralash', icon: '🎯' },
    { id: 'manfiy', label: 'Manfiy', icon: '➖' },
    { id: 'kopaytirish', label: 'Ko\'paytirish', icon: '✖️' },
    { id: 'bolish', label: 'Bo\'lish', icon: '➗' },
  ];

  const speeds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 2.5, 3];
  const counts = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-emerald-500/10 selection:text-emerald-600">
      <Navbar soundEnabled={false} onToggleSound={() => {}} />
      
      <main className="pt-6 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* HEADER SECTION - COMPACT 80% FEEL */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black tracking-widest mb-3 uppercase">
                <Sparkles className="w-3 h-3" />
                Kundalik mashq qiling
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
                Mental Arifmetika Treneri
              </h1>
              <p className="text-zinc-500 text-sm font-medium">
                Aql hisoblash ko'nikmalarini rivojlantiring va o'z darajangizni oshiring
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-10 w-10 rounded-xl p-0 bg-white border-zinc-200">
                <Settings className="w-4 h-4 text-zinc-400" />
              </Button>
              <Button className="h-10 rounded-xl bg-zinc-900 text-white font-bold px-6 text-sm">
                Yutuqlar
              </Button>
            </div>
          </header>

          {/* MAIN TABS */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'mashq', label: 'Mashq', icon: Gamepad2 },
              { id: 'uquv', label: 'O\'quv', icon: BookOpen },
              { id: 'kunlik', label: 'Kunlik', icon: Calendar },
              { id: 'multiplayer', label: 'Multiplayer', icon: Users },
              { id: 'reyting', label: 'Reyting', icon: Trophy },
              { id: 'statistika', label: 'Statistika', icon: BarChart3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN - USER INFO & STATS */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="p-6 rounded-[32px] bg-zinc-900 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[60px] -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-xl font-black">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-lg">Level 1</h3>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">0 / 120 XP</p>
                    </div>
                  </div>
                  <Progress value={0} className="h-1.5 bg-white/10 mb-6" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Energiya</p>
                      <p className="text-lg font-black text-emerald-400">5/5</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Combo</p>
                      <p className="text-lg font-black text-blue-400">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Stats */}
              <div className="p-6 rounded-[32px] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-warning" />
                    </div>
                    <span className="text-sm font-bold text-zinc-600">Qiyinlik</span>
                  </div>
                  <span className="text-sm font-black">1/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-bold text-zinc-600">Koeffitsient</span>
                  </div>
                  <span className="text-sm font-black text-blue-500">×1.00</span>
                </div>
                
                <div className="pt-4 border-t border-zinc-50">
                  <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-zinc-900">Bonus tayyor!</p>
                      <p className="text-[10px] text-zinc-500">Challenge o'yna!</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - SETTINGS & START */}
            <div className="lg:col-span-8 space-y-8">
              {/* Misol Turi Selection */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-4 ml-2">Misol turi</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formulaTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFormulaType(type.id)}
                      className={`p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2 ${
                        formulaType === type.id 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                        : 'border-zinc-100 bg-white hover:border-zinc-200 text-zinc-600'
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className="text-xs font-black">{type.label}</span>
                    </button>
                  ))}
                  <button className="p-4 rounded-[24px] border-2 border-dashed border-zinc-200 bg-zinc-50/50 flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                    <MoreHorizontal className="w-6 h-6 text-zinc-400" />
                    <span className="text-xs font-black">Yana</span>
                  </button>
                </div>
              </div>

              {/* Son Xonasi */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-4 ml-2">Son xonasi</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(count => (
                    <button
                      key={count}
                      onClick={() => setDigitCount(count)}
                      className={`p-4 rounded-[24px] border-2 transition-all text-center ${
                        digitCount === count 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-zinc-100 bg-white hover:border-zinc-200'
                      }`}
                    >
                      <p className="text-lg font-black text-zinc-900">{count} xonali</p>
                      <p className="text-[10px] font-bold text-zinc-400">
                        {count === 1 ? '1-9' : count === 2 ? '10-99' : count === 3 ? '100-999' : '1000-9999'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed & Count Controls */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4 ml-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Tezligi (soniyada)</h3>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500 text-white text-xs font-black">{speed} s</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {speeds.map(s => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`h-8 rounded-lg text-[10px] font-black transition-all ${
                          speed === s ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 ml-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Misollar soni</h3>
                    <span className="px-2 py-1 rounded-lg bg-blue-500 text-white text-xs font-black">{problemCount} ta</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {counts.map(c => (
                      <button
                        key={c}
                        onClick={() => setProblemCount(c)}
                        className={`h-8 rounded-lg text-[10px] font-black transition-all ${
                          problemCount === c ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-6">
                <Button 
                  size="lg"
                  onClick={() => navigate('/game/trainer')}
                  className="w-full h-16 rounded-[28px] bg-zinc-900 text-white hover:bg-emerald-600 font-black text-xl shadow-2xl shadow-zinc-900/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6 fill-current" /> Boshlash
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentalTrainer;
