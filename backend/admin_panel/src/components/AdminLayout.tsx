import React, { useState } from 'react';
import { Home, Users, Bell, ChevronLeft, ChevronRight, LogOut, ChevronDown, User, UserCheck, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#070712] text-white font-sans selection:bg-purple-500/30">
      
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-[260px]' : 'w-[88px]'} transition-all duration-300 flex-shrink-0 bg-[#05050C] border-r border-[#151528] flex flex-col justify-between sticky top-0 h-screen overflow-y-auto`}>
        
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className={`p-6 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-4`}>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-2xl font-black text-white tracking-wider flex items-center">
                  IQRO<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">MAX</span>
                </h1>
                <p className="text-xs text-indigo-200/50 uppercase tracking-[0.2em] font-semibold mt-1">
                  Admin Panel
                </p>
              </div>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-6 h-6 rounded-full bg-[#121223] flex items-center justify-center text-indigo-300 hover:text-white transition-colors border border-indigo-500/10 shrink-0"
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-2">
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-3 ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3.5 rounded-xl transition-all ${
                location.pathname === '/dashboard' 
                  ? 'bg-gradient-to-r from-[#4A1D96] to-[#2B1B61] text-white font-medium shadow-[0_0_15px_rgba(74,29,150,0.3)] border border-[#5B21B6]/50' 
                  : 'text-indigo-200/60 hover:text-white hover:bg-[#121223] border border-transparent'
              }`}
            >
              <Home className={`w-5 h-5 ${location.pathname === '/dashboard' ? 'text-purple-200' : ''}`} />
              {isSidebarOpen && <span>Dashboard</span>}
            </Link>
            
            <div className="space-y-1">
              <button 
                onClick={() => {
                  setIsUsersMenuOpen(!isUsersMenuOpen);
                  if (!isSidebarOpen) setIsSidebarOpen(true);
                }}
                className={`w-full flex items-center justify-between ${isSidebarOpen ? 'px-4' : 'justify-center px-0'} py-3.5 rounded-xl transition-all ${
                  ['/users', '/students', '/teachers', '/parents'].includes(location.pathname)
                    ? 'bg-gradient-to-r from-[#4A1D96] to-[#2B1B61] text-white font-medium shadow-[0_0_15px_rgba(74,29,150,0.3)] border border-[#5B21B6]/50' 
                    : 'text-indigo-200/60 hover:text-white hover:bg-[#121223] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-5 h-5 ${['/users', '/students', '/teachers', '/parents'].includes(location.pathname) ? 'text-purple-200' : ''}`} />
                  {isSidebarOpen && <span>Foydalanuvchilar</span>}
                </div>
                {isSidebarOpen && (
                  <ChevronDown className={`w-4 h-4 text-indigo-300/50 transition-transform duration-300 ${isUsersMenuOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
              
              {/* Sub-menu */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarOpen && isUsersMenuOpen ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pl-11 pr-2 space-y-1 py-1">
                  <Link 
                    to="/users" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      location.pathname === '/users' 
                        ? 'text-white bg-[#1A1A2F]/80 font-medium' 
                        : 'text-indigo-200/50 hover:text-white hover:bg-[#121223]'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Umumiy</span>
                  </Link>
                  <Link 
                    to="/students" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      location.pathname === '/students' 
                        ? 'text-white bg-[#1A1A2F]/80 font-medium' 
                        : 'text-indigo-200/50 hover:text-white hover:bg-[#121223]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>O'quvchilar</span>
                  </Link>
                  <Link 
                    to="/teachers" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      location.pathname === '/teachers' 
                        ? 'text-white bg-[#1A1A2F]/80 font-medium' 
                        : 'text-indigo-200/50 hover:text-white hover:bg-[#121223]'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>O'qituvchilar</span>
                  </Link>
                  <Link 
                    to="/parents" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      location.pathname === '/parents' 
                        ? 'text-white bg-[#1A1A2F]/80 font-medium' 
                        : 'text-indigo-200/50 hover:text-white hover:bg-[#121223]'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Ota-Onalar</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Section -> Logout */}
        <div className="p-4 mb-2">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-3 rounded-xl bg-[#0C0C18] border border-[#1A1A2F] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors group`}
          >
            <LogOut className="w-5 h-5 text-indigo-300/60 group-hover:text-red-400 transition-colors shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium text-indigo-200/80 group-hover:text-red-400 transition-colors">Tizimdan chiqish</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-[88px] flex items-center justify-between px-8 border-b border-[#151528] bg-[#070712]/80 backdrop-blur-md sticky top-0 z-40">
          
          <div className="flex items-center gap-6">
             {/* Left side of header can have breadcrumbs or greeting, but based on image, greeting is in body. Search is here. */}
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-indigo-200/70 hover:text-white hover:bg-[#121223] transition-colors border border-transparent hover:border-[#1A1A2F]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-3.5 h-3.5 bg-purple-500 border-2 border-[#070712] rounded-full text-[8px] font-bold flex items-center justify-center text-white">
                7
              </span>
            </button>

            {/* Profile Avatar */}
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 shrink-0 overflow-hidden relative shadow-[0_0_10px_rgba(139,92,246,0.2)] hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all">
              <div className="w-full h-full rounded-full bg-[#050510] flex items-center justify-center relative overflow-hidden">
                <img src="/admin-logo.png" alt="Admin" className="w-full h-full object-cover scale-[1.3] mt-1" />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-x-hidden">
          {children}
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
