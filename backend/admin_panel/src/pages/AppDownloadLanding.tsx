import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Sparkles, Gift, CheckCircle2, ShieldCheck, Zap, Trophy } from 'lucide-react';

const AppDownloadLanding = () => {
  const [searchParams] = useSearchParams();
  const promoCode = searchParams.get('promo') || searchParams.get('ref') || 'N3WRE3';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPromo = () => {
    navigator.clipboard.writeText(promoCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadApp = () => {
    // Redirect to direct APK or Store link
    window.location.href = 'https://iqromax.net';
  };

  return (
    <div className="min-h-screen bg-[#05050C] text-white flex flex-col items-center justify-between font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Glow & Elements */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-5xl px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 border border-purple-400/30">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-wider text-white">IQRO<span className="text-purple-400">MAX</span></span>
            <span className="block text-[10px] text-purple-300/70 font-semibold tracking-widest uppercase">Aqliy Rivojlanish Platformasi</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#121225] border border-[#252545] px-4 py-2 rounded-xl text-xs font-semibold text-gray-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Rasmiy Mobil Ilova</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl px-4 py-8 flex flex-col items-center text-center z-10 space-y-8">
        
        {/* Special Invitation Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-purple-500/15 border border-purple-500/30 shadow-inner">
          <Gift className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold text-purple-200">
            Maxsus Taklifnoma Qabul Qilindi! 🎁
          </span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-wide">
            IQROMAX Ilovasini Yuklab Oling va <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">3 Kunlik BEPUL Premium</span> ga Ega Bo'ling!
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            Mental arifmetika, tezkor hisoblash hamda mantiqiy mashqlar bilan bilamingizni oshiring! Sirli sandiqlarni oching va cheksiz chaqmoq energiyaga ega bo'ling.
          </p>
        </div>

        {/* Promo Code Card */}
        <div className="w-full max-w-md bg-gradient-to-b from-[#121226] to-[#0A0A17] p-6 rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 backdrop-blur-xl relative group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-black text-[11px] px-4 py-1 rounded-full shadow-md uppercase tracking-wider">
            Sizning Bonus Promokodingiz
          </div>

          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between bg-[#080816] p-4 rounded-2xl border border-[#1F1F3D]">
              <span className="text-2xl sm:text-3xl font-mono font-black text-purple-300 tracking-wider">
                {promoCode}
              </span>
              <button
                onClick={handleCopyPromo}
                className="flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : null}
                <span>{isCopied ? 'Nusxalandi!' : 'Nusxalash'}</span>
              </button>
            </div>
            
            <p className="text-[11px] text-gray-400 text-center">
              * Ilovani yuklab olib ro'yxatdan o'tayotganda ushbu promokodni kiriting va bonuslarga ega bo'ling!
            </p>
          </div>
        </div>

        {/* Download Buttons Section */}
        <div className="w-full max-w-md space-y-4 pt-2">
          <button
            onClick={handleDownloadApp}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3 border border-purple-400/30"
          >
            <Download className="w-6 h-6 animate-bounce" />
            <span>Mobil Ilovani Yuklab Olish</span>
          </button>

          {/* Features Badges Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-[#0C0C1B] border border-[#1A1A35] p-3 rounded-2xl flex flex-col items-center text-center">
              <Zap className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold text-gray-200">Cheksiz Energiya</span>
            </div>

            <div className="bg-[#0C0C1B] border border-[#1A1A35] p-3 rounded-2xl flex flex-col items-center text-center">
              <Gift className="w-5 h-5 text-purple-400 mb-1" />
              <span className="text-[11px] font-bold text-gray-200">Sirli Sandiq</span>
            </div>

            <div className="bg-[#0C0C1B] border border-[#1A1A35] p-3 rounded-2xl flex flex-col items-center text-center">
              <Trophy className="w-5 h-5 text-indigo-400 mb-1" />
              <span className="text-[11px] font-bold text-gray-200">Onlayn Battle</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-gray-500 border-t border-[#121225] bg-[#030308] z-10">
        <p>© 2026 IQROMAX. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
};

export default AppDownloadLanding;
