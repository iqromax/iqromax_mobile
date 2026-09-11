
import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  Users, UserCheck, DollarSign, FileText, 
  ArrowUpRight, Calendar, Star, CheckCircle2,
  Server, Database, CreditCard, Bell, Loader2
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const platformStatus = [
  { name: "Server holati", status: "Barqaror", icon: Server, color: "text-purple-400", bg: "bg-purple-500/10" },
  { name: "Ma'lumotlar bazasi (PostgreSQL)", status: "Barqaror", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "To'lov / Tangalar tizimi", status: "Barqaror", icon: CreditCard, color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "Push & Real-time Bildirishnomalar", status: "Barqaror", icon: Bell, color: "text-green-400", bg: "bg-green-500/10" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0C0C18] border border-purple-500/30 p-3 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.2)]">
        <p className="text-white font-bold">{payload[0].value.toLocaleString()} ta</p>
        <p className="text-xs text-indigo-200/60 mt-1">{label}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    activeUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalXp: 0,
    totalCoins: 0,
    topUsers: [],
    recentActivities: [],
    activeUsersData: []
  });

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 15000); // 15 soniyada avto-refresh
    return () => clearInterval(interval);
  }, []);

  const todayDate = new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });

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
              Bugungi faoliyat va platformaning real vaqtdagi statistikalari
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A0A16] border border-[#1A1A2F] text-indigo-200/80 hover:text-white hover:bg-[#121223] transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{todayDate}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Users */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Jami foydalanuvchilar</p>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin my-2" />
            ) : (
              <h3 className="text-3xl font-bold text-white mb-2">{stats.totalUsers.toLocaleString()}</h3>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> Real vaqtda
              </span>
              <span className="text-indigo-200/50">Bazadagi barcha hisoblar</span>
            </div>
          </div>

          {/* Card 2: Active Users */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Faol foydalanuvchilar</p>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin my-2" />
            ) : (
              <h3 className="text-3xl font-bold text-white mb-2">{stats.activeUsers.toLocaleString()}</h3>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> Faol statusda
              </span>
              <span className="text-indigo-200/50">Aktiv foydalanuvchilar</span>
            </div>
          </div>

          {/* Card 3: Teachers & Students */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">O'qituvchi / O'quvchilar</p>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin my-2" />
            ) : (
              <h3 className="text-3xl font-bold text-white mb-2">{stats.totalTeachers} / {stats.totalStudents}</h3>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-indigo-400 font-medium bg-indigo-400/10 px-1.5 py-0.5 rounded">
                O'qituvchilar : O'quvchilar
              </span>
            </div>
          </div>

          {/* Card 4: Total XP & Coins */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-indigo-200/70 font-medium">Jami toplangan XP</p>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin my-2" />
            ) : (
              <h3 className="text-3xl font-bold text-white mb-2">{stats.totalXp.toLocaleString()} XP</h3>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-yellow-400 font-medium bg-yellow-400/10 px-1.5 py-0.5 rounded">
                🪙 {stats.totalCoins.toLocaleString()} Coin
              </span>
              <span className="text-indigo-200/50">Jami tangalar</span>
            </div>
          </div>

        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Line Chart */}
          <div className="lg:col-span-2 bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Ro'yxatdan o'tish statistikasi (Oxirgi 7 kun)</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121223] text-xs font-medium text-indigo-200 border border-[#1A1A2F]">
                <span>7 kunlik real grafik</span>
              </button>
            </div>
            <div className="flex-1 min-h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.activeUsersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2F" vertical={false} />
                    <XAxis dataKey="name" stroke="#4B4B6B" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#4B4B6B" fontSize={12} tickLine={false} axisLine={false} />
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
              )}
            </div>
          </div>

          {/* Recent Activities List */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">So'nggi foydalanuvchilar va faoliyatlar</h2>
            </div>
            <div className="flex-1 space-y-5">
              {stats.recentActivities.length === 0 ? (
                <p className="text-xs text-indigo-300/40 text-center py-6">Faoliyatlar yo'q</p>
              ) : (
                stats.recentActivities.map((act: any) => (
                  <div key={act.id} className="flex items-start gap-4 group cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.bg} ${act.color}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-100 group-hover:text-white transition-colors truncate">{act.title}</p>
                      <p className="text-xs text-indigo-300/60 mt-0.5 truncate">{act.desc}</p>
                    </div>
                    <span className="text-[10px] text-indigo-300/40 shrink-0 mt-1">{act.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Users */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Eng faol foydalanuvchilar (Top XP)</h2>
            </div>
            <div className="space-y-4">
              {stats.topUsers.length === 0 ? (
                <p className="text-xs text-indigo-300/40 text-center py-4">Foydalanuvchilar topilmadi</p>
              ) : (
                stats.topUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-[#121223] rounded-xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-indigo-200/50 w-4 text-center">{user.id}</span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 shrink-0 overflow-hidden">
                        <div className="w-full h-full rounded-full bg-[#050510] flex items-center justify-center relative overflow-hidden text-xs text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{user.name}</p>
                        <p className="text-xs text-indigo-300/60 mt-0.5">ID: {user.customId} | Level {user.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-white">{user.xp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Ro'yxatdan o'tish dinamikasi (Kunlar)</h2>
            </div>
            <div className="flex-1 min-h-[250px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.activeUsersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2F" vertical={false} />
                    <XAxis dataKey="name" stroke="#4B4B6B" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#4B4B6B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1A1A2F', opacity: 0.4 }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {stats.activeUsersData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index === stats.activeUsersData.length - 1 ? '#A855F7' : '#7C3AED'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Platform Status */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">Platforma va Tizim Holati</h2>
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
