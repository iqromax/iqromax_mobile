import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  Users, UserCheck, DollarSign, FileText, 
  ArrowUpRight, Calendar, Star, CheckCircle2,
  Server, Database, CreditCard, Bell
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

// Mock Data
const activeUsersData = [
  { name: '14 May', value: 2500 },
  { name: '15 May', value: 4800 },
  { name: '16 May', value: 6200 },
  { name: '17 May', value: 4200 },
  { name: '18 May', value: 6500 },
  { name: '19 May', value: 4500 },
  { name: '20 May', value: 8742 },
];

const revenueData = [
  { name: '14 May', value: 3000 },
  { name: '15 May', value: 4500 },
  { name: '16 May', value: 3500 },
  { name: '17 May', value: 6000 },
  { name: '18 May', value: 7500 },
  { name: '19 May', value: 6000 },
  { name: '20 May', value: 8200 },
];

const topUsers = [
  { id: 1, name: 'Abdulloh Karimov', level: 12, xp: '9,850 XP', avatar: '/admin-logo.png' },
  { id: 2, name: 'Sardor Tashpulatov', level: 11, xp: '8,420 XP', avatar: '/admin-logo.png' },
  { id: 3, name: 'Zarina Nematova', level: 10, xp: '7,250 XP', avatar: '/admin-logo.png' },
  { id: 4, name: 'Behruz Aliyev', level: 9, xp: '6,890 XP', avatar: '/admin-logo.png' },
  { id: 5, name: 'Madina Saidova', level: 8, xp: '5,760 XP', avatar: '/admin-logo.png' },
];

const recentActivities = [
  { id: 1, title: "Yangi foydalanuvchi ro'yxatdan o'tdi", desc: "Abdulloh Karimov", time: "2 daqiqa oldin", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: 2, title: "Yangi to'lov amalga oshirildi", desc: "Premium obuna (1 oy)", time: "15 daqiqa oldin", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
  { id: 3, title: "Yangi mashq qo'shildi", desc: "Aritmetik 25-mashq", time: "1 soat oldin", icon: FileText, color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: 4, title: "Turnir yakunlandi", desc: "Haftalik Turnir #124", time: "3 soat oldin", icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { id: 5, title: "Yangi o'qituvchi qo'shildi", desc: "Nilufar Tursunova", time: "5 soat oldin", icon: UserCheck, color: "text-blue-400", bg: "bg-blue-500/10" },
];

const platformStatus = [
  { name: "Server holati", status: "Barqaror", icon: Server, color: "text-purple-400", bg: "bg-purple-500/10" },
  { name: "Ma'lumotlar bazasi", status: "Barqaror", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "To'lov tizimi", status: "Barqaror", icon: CreditCard, color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "Push bildirishnomalar", status: "Barqaror", icon: Bell, color: "text-green-400", bg: "bg-green-500/10" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0C0C18] border border-purple-500/30 p-3 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.2)]">
        <p className="text-white font-bold">{payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-indigo-200/60 mt-1">{label}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Xush kelibsiz, Admin! <span className="text-2xl">👋</span>
            </h1>
            <p className="text-sm text-indigo-200/60 mt-1">
              Bugungi faoliyat va platforma statistikalari
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A0A16] border border-[#1A1A2F] text-indigo-200/80 hover:text-white hover:bg-[#121223] transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>20 May, 2026</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Jami foydalanuvchilar</p>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">12,458</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12.5%
              </span>
              <span className="text-indigo-200/50">O'tgan oyga nisbatan</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Faol foydalanuvchilar</p>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">8,742</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 8.3%
              </span>
              <span className="text-indigo-200/50">O'tgan oyga nisbatan</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Jami daromad</p>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">$24,750</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 15.7%
              </span>
              <span className="text-indigo-200/50">O'tgan oyga nisbatan</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Jami mashqlar</p>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">65,214</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 10.2%
              </span>
              <span className="text-indigo-200/50">O'tgan oyga nisbatan</span>
            </div>
          </div>

        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Line Chart */}
          <div className="lg:col-span-2 bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Faol foydalanuvchilar statistikasi</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121223] text-xs font-medium text-indigo-200 hover:text-white transition-colors border border-[#1A1A2F]">
                <span>7 kunlik</span>
              </button>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeUsersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2F" vertical={false} />
                  <XAxis dataKey="name" stroke="#4B4B6B" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#4B4B6B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}K`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2D1B69', strokeWidth: 2, strokeDasharray: '5 5' }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#0A0A16", stroke: "#8B5CF6", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activities List */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">So'nggi faoliyatlar</h2>
              <button className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">Barchasi</button>
            </div>
            <div className="flex-1 space-y-5">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-4 group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.bg} ${act.color}`}>
                    <act.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-100 group-hover:text-white transition-colors truncate">{act.title}</p>
                    <p className="text-xs text-indigo-300/60 mt-0.5 truncate">{act.desc}</p>
                  </div>
                  <span className="text-[10px] text-indigo-300/40 shrink-0 mt-1">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Users */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Eng faol foydalanuvchilar</h2>
              <button className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">Barchasi</button>
            </div>
            <div className="space-y-4">
              {topUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 hover:bg-[#121223] rounded-xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-indigo-200/50 w-4 text-center">{user.id}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 shrink-0 overflow-hidden">
                      <div className="w-full h-full rounded-full bg-[#050510] flex items-center justify-center relative overflow-hidden">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover scale-[1.3] mt-1" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{user.name}</p>
                      <p className="text-xs text-indigo-300/60 mt-0.5">Level {user.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-white">{user.xp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Daromad statistikasi</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121223] text-xs font-medium text-indigo-200 hover:text-white transition-colors border border-[#1A1A2F]">
                <span>7 kunlik</span>
              </button>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2F" vertical={false} />
                  <XAxis dataKey="name" stroke="#4B4B6B" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#4B4B6B" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}K`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1A1A2F', opacity: 0.4 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? '#A855F7' : '#7C3AED'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Status */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">Platforma holati</h2>
            </div>
            <div className="space-y-4">
              {platformStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[#121223] border border-[#1A1A2F]">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                      <item.icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-sm font-medium text-indigo-100">{item.name}</span>
                  </div>
                  <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
