import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  Shield, Users, Trophy, Zap, Swords, Target, 
  Clock, ArrowUpRight,
  Crown, Star, ChevronRight, Activity,
  Loader2, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0C0C18] border border-purple-500/30 p-3 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]">
        <p className="text-xs text-indigo-200/60 font-medium">{label}</p>
        <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          +{payload[0].value} ta yangi klan
        </p>
      </div>
    );
  }
  return null;
};

const ClanDashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'today'>('7days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalClans: 1248,
    newClansToday: 12,
    activeClans: 856,
    activeRatio: '68.6% faol',
    totalMembers: 8420,
    totalClanXp: 12800000,
    formattedXp: '12.8M'
  });

  const [activityStats, setActivityStats] = useState({
    clanBattles: 2450,
    completedMissions: 8620,
    seasonXp: 5400000,
    formattedSeasonXp: '5.4M',
    pendingRequests: 86
  });

  const [creationChart, setCreationChart] = useState<any[]>([]);
  const [topClans, setTopClans] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const fetchClanHomeData = async () => {
    try {
      // 1. Fetch dashboard stats
      const statsRes = await fetch(`/api/admin/clan/dashboard-stats`);
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // 2. Fetch chart data
      const chartRes = await fetch(`/api/admin/clan/creation-chart?range=${timeRange}`);
      if (chartRes.ok) {
        const data = await chartRes.json();
        setCreationChart(data);
      }

      // 3. Fetch activity stats
      const actRes = await fetch(`/api/admin/clan/activity-stats`);
      if (actRes.ok) {
        const data = await actRes.json();
        setActivityStats(data);
      }

      // 4. Fetch top clans
      const topRes = await fetch(`/api/admin/clan/top-clans`);
      if (topRes.ok) {
        const data = await topRes.json();
        setTopClans(data);
      }

      // 5. Fetch recent activities
      const recentRes = await fetch(`/api/admin/clan/recent-activities`);
      if (recentRes.ok) {
        const data = await recentRes.json();
        setRecentActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch clan home data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClanHomeData();
    const interval = setInterval(fetchClanHomeData, 20000); // 20s auto-refresh
    return () => clearInterval(interval);
  }, [timeRange]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchClanHomeData();
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-extrabold text-xs shadow-[0_0_10px_rgba(245,158,11,0.5)]">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-slate-900 font-extrabold text-xs">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-amber-100 font-extrabold text-xs">
          3
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-lg bg-[#121223] border border-[#1A1A2F] flex items-center justify-center text-indigo-300/60 font-semibold text-xs">
        {rank}
      </div>
    );
  };

  const getLeagueStyle = (league: string) => {
    if (league.includes('Gold')) {
      return 'text-amber-300 bg-amber-400/10 border-amber-400/30';
    }
    if (league.includes('Silver')) {
      return 'text-slate-300 bg-slate-400/10 border-slate-400/30';
    }
    if (league.includes('Platinum')) {
      return 'text-cyan-300 bg-cyan-400/10 border-cyan-400/30';
    }
    return 'text-purple-300 bg-purple-400/10 border-purple-400/30';
  };

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Clan System Dashboard
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live data
              </span>
            </div>
            <p className="text-sm text-indigo-200/60 mt-1">
              Clan tizimining umumiy statistikasi va real vaqtdagi holati
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Range Selector */}
            <div className="flex items-center bg-[#0A0A16] border border-[#1A1A2F] rounded-xl p-1 text-xs">
              <button
                onClick={() => setTimeRange('7days')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === '7days'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                Oxirgi 7 kun
              </button>
              <button
                onClick={() => setTimeRange('30days')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === '30days'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                Oxirgi 30 kun
              </button>
              <button
                onClick={() => setTimeRange('today')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === 'today'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                Bugun
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-[#0A0A16] border border-[#1A1A2F] text-indigo-300 hover:text-white hover:bg-[#121223] transition-colors"
              title="Yangilash"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Main Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Total Clans */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-indigo-200/70">Jami Clan'lar</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin my-2" />
            ) : (
              <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                {stats.totalClans.toLocaleString()}
              </h3>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +{stats.newClansToday} bugun
              </span>
              <span className="text-indigo-200/50">Yangi klanlar</span>
            </div>
          </div>

          {/* Card 2: Active Clans */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-indigo-200/70">Faol Clan'lar</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin my-2" />
            ) : (
              <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                {stats.activeClans.toLocaleString()}
              </h3>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {stats.activeRatio}
              </span>
              <span className="text-indigo-200/50">Haftalik faollik</span>
            </div>
          </div>

          {/* Card 3: Clan Members */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-indigo-200/70">Clan a'zolari</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin my-2" />
            ) : (
              <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                {stats.totalMembers.toLocaleString()}
              </h3>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                Jami o'quvchilar
              </span>
              <span className="text-indigo-200/50">Klanlar safida</span>
            </div>
          </div>

          {/* Card 4: Total Clan XP */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-indigo-200/70">Jami Clan XP</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin my-2" />
            ) : (
              <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                {stats.formattedXp}
              </h3>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                ⚡ Season 5
              </span>
              <span className="text-indigo-200/50">Yig'ilgan umumiy XP</span>
            </div>
          </div>

        </div>

        {/* Section: Chart & Clan Activity Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart: Clan Creation Dynamics */}
          <div className="lg:col-span-2 bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Clan yaratish statistikasi</h2>
                <p className="text-xs text-indigo-200/50 mt-0.5">
                  Vaqt oralig'ida ochilgan yangi klanlar dinamikasi
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#121223] text-xs font-medium text-indigo-300 border border-[#1A1A2F]">
                  {timeRange === '7days' ? 'Oxirgi 7 kun' : timeRange === '30days' ? 'Oxirgi 30 kun' : 'Bugun'}
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={creationChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="clanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2F" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#4B4B6B" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10} 
                    />
                    <YAxis 
                      stroke="#4B4B6B" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8B5CF6" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#clanGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Clan System Activity Metrics */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Clan tizimi faoliyati</h2>
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Battle */}
                <div className="bg-[#121223] border border-[#1A1A2F] rounded-xl p-4 hover:border-purple-500/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2.5">
                    <Swords className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-indigo-300/60 font-medium">Clan Battle</p>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {activityStats.clanBattles.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-purple-400/80">Jami janglar</span>
                </div>

                {/* Missions */}
                <div className="bg-[#121223] border border-[#1A1A2F] rounded-xl p-4 hover:border-emerald-500/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2.5">
                    <Target className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-indigo-300/60 font-medium">Bajarilgan Missions</p>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {activityStats.completedMissions.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-400/80">Topshiriqlar</span>
                </div>

                {/* Season XP */}
                <div className="bg-[#121223] border border-[#1A1A2F] rounded-xl p-4 hover:border-amber-500/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2.5">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-indigo-300/60 font-medium">Season XP</p>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {activityStats.formattedSeasonXp}
                  </p>
                  <span className="text-[10px] text-amber-400/80">Mavsum ochkolari</span>
                </div>

                {/* Requests */}
                <div className="bg-[#121223] border border-[#1A1A2F] rounded-xl p-4 hover:border-cyan-500/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-indigo-300/60 font-medium">Kutilayotgan arizalar</p>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {activityStats.pendingRequests}
                  </p>
                  <span className="text-[10px] text-cyan-400/80">Ko'rib chiqilmagan</span>
                </div>

              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-5 pt-4 border-t border-[#151528] space-y-2">
              <Link
                to="/clan/clans"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 hover:text-white border border-purple-500/20 transition-all text-xs font-medium group"
              >
                <span>Barcha klanlar ro'yxatini ko'rish</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* Section: Top Clans & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Clans Table */}
          <div className="lg:col-span-2 bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Top Clan'lar
                </h2>
                <p className="text-xs text-indigo-200/50 mt-0.5">
                  Platformaning eng faol va yuqori darajadagi klanlari
                </p>
              </div>
              <Link
                to="/clan/clans"
                className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Barchasini ko'rish →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1A1A2F] text-[11px] text-indigo-300/50 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Clan</th>
                    <th className="pb-3">Level</th>
                    <th className="pb-3">A'zolar</th>
                    <th className="pb-3">Clan XP</th>
                    <th className="pb-3">League</th>
                    <th className="pb-3 text-right pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151528] text-sm">
                  {topClans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-indigo-300/40">
                        Klanlar topilmadi
                      </td>
                    </tr>
                  ) : (
                    topClans.map((clan) => (
                      <tr 
                        key={clan.id} 
                        className="hover:bg-[#121223]/60 transition-colors group cursor-pointer"
                      >
                        {/* Rank */}
                        <td className="py-3.5 pl-2">
                          {getRankBadge(clan.rank)}
                        </td>

                        {/* Clan Logo & Name */}
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <Shield className="w-5 h-5 text-purple-300" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                  {clan.name}
                                </span>
                                {clan.tag && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                                    [{clan.tag}]
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-indigo-300/40">{clan.region}</span>
                            </div>
                          </div>
                        </td>

                        {/* Level */}
                        <td className="py-3.5">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                            Lv.{clan.level}
                          </span>
                        </td>

                        {/* Members */}
                        <td className="py-3.5">
                          <div className="flex flex-col gap-1 w-24">
                            <span className="text-xs font-medium text-white">
                              {clan.membersCount} / {clan.maxMembers}
                            </span>
                            <div className="w-full bg-[#1A1A2F] h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, (clan.membersCount / clan.maxMembers) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* XP */}
                        <td className="py-3.5">
                          <div className="flex items-center gap-1 text-amber-300 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{clan.xp.toLocaleString()} XP</span>
                          </div>
                        </td>

                        {/* League */}
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getLeagueStyle(clan.league)}`}>
                            {clan.league}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 text-right pr-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Faol
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Clan Activities Feed */}
          <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-white">Oxirgi Clan faoliyatlari</h2>
                <p className="text-xs text-indigo-200/50 mt-0.5">Real vaqtdagi klan hodisalari</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-indigo-300/40 text-center py-6">Faoliyatlar yo'q</p>
              ) : (
                recentActivities.map((act) => (
                  <div 
                    key={act.id} 
                    className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[#121223] transition-colors cursor-pointer group"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.bg} ${act.color} border border-current/20`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                          {act.title}
                        </p>
                        <span className="text-[10px] text-indigo-300/40 shrink-0">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-indigo-300/60 mt-0.5 line-clamp-2">
                        {act.desc}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1A2F] text-indigo-300 font-medium">
                          {act.clanName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default ClanDashboardHome;
