import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageBackground } from '@/components/layout/PageBackground';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useSound } from '@/hooks/useSound';
import { supabase } from '@/integrations/supabase/client';
import { PandaMascot } from '@/components/PandaMascot';
import { useConfettiEffect } from '@/components/kids/Confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Trophy, Zap, Flame, Star, Target, BarChart3, FileText, Users, GraduationCap, Calculator } from 'lucide-react';
import { HeroCarousel } from '@/components/HeroCarousel';
import { SectionCarousel, kidsSection, parentsSection, teachersSection, blogSection } from '@/components/SectionCarousel';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { PullToRefresh } from '@/components/PullToRefresh';
import { PageSkeleton } from '@/components/PageSkeleton';
import { ParentHero } from '@/components/parent/ParentHero';
import { ParentControlMenu } from '@/components/parent/ParentControlMenu';
import { ParentLiveActivity } from '@/components/parent/ParentLiveActivity';
import { ParentDashboardPanel } from '@/components/parent/ParentDashboardPanel';
import { ParentQuickControls } from '@/components/parent/ParentQuickControls';
import { ParentRecommendations } from '@/components/parent/ParentRecommendations';
import { ParentAlerts } from '@/components/parent/ParentAlerts';

interface Profile {
  username: string;
  total_score: number;
  total_problems_solved: number;
  best_streak: number;
  daily_goal: number;
  current_streak: number;
  avatar_url: string | null;
}

interface GamificationData {
  level: number;
  current_xp: number;
  energy: number;
  combo: number;
  total_xp: number;
}

const KidsHome = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, isParent, isTeacher, isStudent } = useUserRole();
  const { soundEnabled, toggleSound } = useSound();
  const { triggerConfetti } = useConfettiEffect();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [todaySolved, setTodaySolved] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: dashData, error: rpcError } = await supabase.rpc('get_user_dashboard_stats', { p_user_id: user.id });
      
      const row = Array.isArray(dashData) ? dashData[0] : dashData;
      
      if (!rpcError && row) {
        setProfile({
          username: row.username || 'Player',
          total_score: Number(row.total_score) || 0,
          total_problems_solved: Number(row.total_problems_solved) || 0,
          best_streak: Number(row.best_streak) || 0,
          daily_goal: Number(row.daily_goal) || 20,
          current_streak: Number(row.current_streak) || 0,
          avatar_url: row.avatar_url,
        });

        setGamification({
          level: Number(row.level) || 1,
          current_xp: Number(row.current_xp) || 0,
          energy: Number(row.energy) || 100,
          combo: Number(row.combo) || 0,
          total_xp: Number(row.total_xp) || 0,
        });

        const solved = Number(row.today_solved) || 0;
        setTodaySolved(solved);

        const goal = Math.max(1, Number(row.daily_goal) || 20);
        const progress = (solved / goal) * 100;
        if (progress >= 100) {
          triggerConfetti('stars');
        }
      } else {
        // Fallback: RPC ishlamasa to'g'ridan-to'g'ri jadvallardan o'qish
        console.warn('Dashboard RPC failed, using fallback:', rpcError?.message);
        
        const [profileRes, gamificationRes, todayRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('user_gamification').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('game_sessions')
            .select('correct')
            .eq('user_id', user.id)
            .gte('created_at', new Date().toISOString().split('T')[0]),
        ]);

        if (profileRes.data) {
          const p = profileRes.data;
          setProfile({
            username: p.username || 'Player',
            total_score: Number(p.total_score) || 0,
            total_problems_solved: Number(p.total_problems_solved) || 0,
            best_streak: Number(p.best_streak) || 0,
            daily_goal: Number(p.daily_goal) || 20,
            current_streak: Number(p.current_streak) || 0,
            avatar_url: p.avatar_url,
          });
        }

        if (gamificationRes.data) {
          const g = gamificationRes.data;
          setGamification({
            level: Number(g.level) || 1,
            current_xp: Number(g.current_xp) || 0,
            energy: Number(g.energy) || 100,
            combo: Number(g.combo) || 0,
            total_xp: Number(g.total_xp) || 0,
          });
        }

        if (todayRes.data) {
          const solved = todayRes.data.reduce((sum, s) => sum + (Number(s.correct) || 0), 0);
          setTodaySolved(solved);
        }
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }

    setLoading(false);
  }, [user, triggerConfetti]);

  useEffect(() => {
    if (!user && !authLoading) {
      setLoading(false);
      return;
    }

    if (!user) return;
    fetchData();
  }, [user, authLoading, fetchData]);

  const handleRefresh = async () => {
    await fetchData();
  };

  if (loading || authLoading) {
    return (
      <PageBackground className="min-h-screen">
        <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />
        <PageSkeleton type="home" />
      </PageBackground>
    );
  }



  // Calculate progress
  const dailyGoal = profile?.daily_goal || 20;
  const dailyProgress = Math.min((todaySolved / dailyGoal) * 100, 100);
  const level = gamification?.level || 1;
  const currentXP = gamification?.current_xp || 0;
  const requiredXP = level * 120;
  const xpProgress = Math.min((currentXP / requiredXP) * 100, 100);

  return (
    <PageBackground className="min-h-screen pb-20 sm:pb-24">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <PullToRefresh onRefresh={handleRefresh}>
        {/* Minimal stats header — faqat student uchun (teacher/parent o'z layoutiga ega) */}
        {!isParent && !isTeacher && (
        <div className="container px-4 sm:px-6 pt-6 sm:pt-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Salom 👋</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                {profile?.username || 'Player'}
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/60">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium">Bosqich {level}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-card border border-border/60">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wide font-medium">XP</span>
              </div>
              <p className="text-xl font-semibold tracking-tight">{currentXP}<span className="text-sm text-muted-foreground font-normal">/{requiredXP}</span></p>
              <div className="h-1 bg-secondary rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border/60">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                <Target className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wide font-medium">Bugun</span>
              </div>
              <p className="text-xl font-semibold tracking-tight">{todaySolved}<span className="text-sm text-muted-foreground font-normal">/{dailyGoal}</span></p>
              <div className="h-1 bg-secondary rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${dailyProgress}%` }} />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border/60">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wide font-medium">Streak</span>
              </div>
              <p className="text-xl font-semibold tracking-tight">{profile?.current_streak || 0}<span className="text-sm text-muted-foreground font-normal"> kun</span></p>
              <div className="h-1 bg-secondary rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-foreground rounded-full" style={{ width: `${Math.min((profile?.current_streak || 0) * 10, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Role-specific content */}
        {isParent ? (
          /* PARENT HOME — o'quvchini nazorat qiladigan menyu va boshqaruv paneli */
          <div className="container px-3 xs:px-4 py-4 sm:py-6 space-y-8 sm:space-y-10">
            {/* 1) Header — Hero with child profile */}
            <ParentHero
              childName={profile?.username || 'Asadbek'}
              level={level}
              totalXp={gamification?.total_xp || 0}
              weeklyAccuracy={Math.round(dailyProgress)}
              coursesCount={profile?.total_problems_solved ? Math.min(profile.total_problems_solved, 12) : 12}
              todayProgressPct={Math.round(dailyProgress)}
              streak={profile?.current_streak || 0}
            />

            {/* 2) Live faoliyat — hozir nima qilayapti */}
            <ParentLiveActivity
              childName={profile?.username || 'Asadbek'}
              isOnline={true}
              todaySolved={todaySolved}
              dailyGoal={dailyGoal}
              todayMinutes={Math.round(todaySolved * 1.8)}
            />

            {/* 3) Nazorat menyusi — 8 ta funksional kartochka */}
            <ParentControlMenu
              isChildOnline={true}
              pendingHomework={2}
              unreadMessages={3}
              newAchievements={1}
            />

            {/* 4) Katta dashboard paneli — sidebar + chart + ro'yxatlar */}
            <ParentDashboardPanel
              childName={profile?.username || 'Asadbek'}
              level={level}
              totalXp={gamification?.total_xp || 0}
              weeklyAccuracy={Math.round(dailyProgress)}
              totalCorrect={profile?.total_problems_solved || 0}
              improvement={14}
            />

            {/* 5) Tezkor nazorat — kunlik maqsad, vaqt cheklovi, qulflash */}
            <ParentQuickControls
              initialDailyGoal={dailyGoal}
              initialTimeLimitMinutes={60}
            />

            {/* 6) Bildirishnomalar va eslatmalar */}
            <ParentAlerts />

            {/* 7) Shaxsiy tavsiyalar — zaif mavzular va yutuqlar */}
            <ParentRecommendations />
          </div>
        ) : isTeacher ? (
          /* TEACHER HOME — reference dizaynga moslangan to'liq landing */
          <div className="container px-3 sm:px-6">
            <TeacherDashboard />
          </div>
        ) : (
          /* STUDENT HOME - Modern minimal */
          <>
            {/* Hero Carousel */}
            <div className="container px-4 sm:px-6 pt-6">
              <HeroCarousel userRole={role as any} />
            </div>

            {/* Primary CTA */}
            <div className="container px-4 sm:px-6 pt-5">
              <button
                onClick={() => navigate('/train')}
                className="w-full h-14 sm:h-16 rounded-2xl flex items-center justify-center gap-3 bg-foreground text-background hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
              >
                <span className="text-base sm:text-lg font-semibold tracking-tight">Mashqni boshlash</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Section Carousels */}
            <div className="container px-4 sm:px-6 pt-8 space-y-2">
              <SectionCarousel {...kidsSection} />
              <SectionCarousel {...parentsSection} />
              <SectionCarousel {...teachersSection} />
              <SectionCarousel {...blogSection} />
            </div>
          </>
        )}

        {/* Subscription Plans - temporarily hidden */}
      </PullToRefresh>
    </PageBackground>
  );
};

export default KidsHome;