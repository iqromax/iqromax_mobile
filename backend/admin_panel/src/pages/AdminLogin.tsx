import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Loader2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call and validation error
    setTimeout(() => {
      setIsLoading(false);
      if (formData.username !== 'doniyor' || formData.password !== 'doniyor') {
        setError('Login yoki parol noto\'g\'ri! Qaytadan urinib ko\'ring.');
      } else {
        navigate('/dashboard');
      }
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-between p-6 md:px-12 lg:px-24 xl:px-36 2xl:px-48 bg-[#050510] relative overflow-hidden"
      style={{
        backgroundImage: "url('/admin-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center left",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Toast Error Alert (Screen level) */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 40, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#0A0B1A]/90 backdrop-blur-xl border-l-4 border-l-red-500 border-y border-r border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.3)] rounded-2xl p-4 min-w-[320px] max-w-md"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-400 font-semibold text-sm">Kirishda xatolik</h3>
              <p className="text-xs text-indigo-100/70 mt-0.5">{error}</p>
            </div>
            <button 
              onClick={() => setError('')}
              className="text-indigo-300/50 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Animated progress bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-transparent rounded-b-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Text Content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex flex-col max-w-xl z-10 pt-[25vh] text-center items-center absolute left-[20%] xl:left-[25%] -translate-x-1/2"
      >
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-7xl font-black text-white mb-4 tracking-wider flex items-center drop-shadow-2xl"
        >
          IQRO<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">MAX</span>
        </motion.h1>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-2xl text-indigo-200/90 tracking-[0.3em] uppercase font-semibold mb-8 drop-shadow-lg"
        >
          Admin Panel
        </motion.h2>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-base text-indigo-100/70 leading-relaxed max-w-[420px] text-center"
        >
          IQROMAX admin paneliga xush kelibsiz. Tizimni boshqarish uchun hisobingizga kiring.
        </motion.p>
      </motion.div>

      {/* Right Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[460px] z-10 ml-auto lg:ml-0 lg:absolute lg:right-[5%] xl:right-[5%]"
      >
        <div className="rounded-[28px] overflow-hidden bg-[#0A0B1A]/70 backdrop-blur-xl border border-indigo-500/20 shadow-[0_0_50px_rgba(30,20,80,0.5)] p-10 relative">

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
            className="flex justify-center mb-6 relative mt-4"
          >
            <motion.img 
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              src="/admin-logo.png" 
              alt="Admin Logo" 
              className="w-32 h-32 scale-[2.5] object-contain pointer-events-none" 
            />
          </motion.div>

          <div className="text-center mb-10 relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-white mb-2 tracking-wide"
            >
              Xush kelibsiz!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-indigo-200/60 font-light"
            >
              Hisobingizga kirish uchun ma'lumotlaringizni kiriting
            </motion.p>
          </div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6 relative z-10"
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <label 
                htmlFor="username" 
                className="block text-xs font-medium text-indigo-100/80 ml-1"
              >
                Username
              </label>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-indigo-300/50 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="username"
                  placeholder="Username kiriting"
                  value={formData.username}
                  onChange={(e) => { setFormData({ ...formData, username: e.target.value }); setError(''); }}
                  className={`w-full h-12 pl-12 rounded-xl border bg-[#060714]/80 text-white placeholder:text-indigo-300/30 focus:outline-none focus:ring-1 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50 bg-red-500/5' : 'border-indigo-500/20 focus:bg-[#0A0C1D] focus:border-purple-500/50 focus:ring-purple-500/50'}`}
                  required
                />
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <label 
                htmlFor="password" 
                className="block text-xs font-medium text-indigo-100/80 ml-1"
              >
                Password
              </label>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-indigo-300/50 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parol kiriting"
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(''); }}
                  className={`w-full h-12 pl-12 pr-12 rounded-xl border bg-[#060714]/80 text-white placeholder:text-indigo-300/30 focus:outline-none focus:ring-1 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50 bg-red-500/5' : 'border-indigo-500/20 focus:bg-[#0A0C1D] focus:border-purple-500/50 focus:ring-purple-500/50'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/50 hover:text-indigo-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-between mt-4"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-indigo-500/30 flex items-center justify-center bg-[#060714]/80 group-hover:border-purple-500/50 transition-colors relative overflow-hidden">
                  <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer" />
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute inset-0" 
                  />
                </div>
                <span className="text-xs text-indigo-200/60 group-hover:text-indigo-200/80 transition-colors">Meni eslab qol</span>
              </label>
              
              <a href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors hover:underline underline-offset-2">
                Parolni unutdingizmi?
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] border-0 flex items-center justify-center relative overflow-hidden group"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="opacity-90">KIRITILMOQDA...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    <span>KIRISH</span>
                  </div>
                )}
              </button>
            </motion.div>
          </motion.form>

        </div>
      </motion.div>
      
    </div>
  );
};

export default AdminLogin;
