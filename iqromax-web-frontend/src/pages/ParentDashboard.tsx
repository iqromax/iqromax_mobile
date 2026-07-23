import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, subDays, startOfWeek } from 'date-fns';

import { PageBackground } from '@/components/layout/PageBackground';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useSound } from '@/hooks/useSound';
import { supabase } from '@/integrations/supabase/client';
import { PullToRefresh } from '@/components/PullToRefresh';
import { PageSkeleton } from '@/components/PageSkeleton';
import { ParentEmailSettings } from '@/components/ParentEmailSettings';

import { ParentHero } from '@/components/parent/ParentHero';
import { ParentTrustStats } from '@/components/parent/ParentTrustStats';
import { ParentWhyChoose } from '@/components/parent/ParentWhyChoose';
import { ParentDashboardPanel } from '@/components/parent/ParentDashboardPanel';
import { ParentRecommendations } from '@/components/parent/ParentRecommendations';
import { ParentTestimonials } from '@/components/parent/ParentTestimonials';
import { ParentFAQ } from '@/components/parent/ParentFAQ';

interface ChildStats {
  username: string;
  avatar_url: string | null;
  total_score: number;
  total_problems_solved: number;
  best_streak: number;
  current_streak: number;
  daily_goal: number;
}

interface GamificationData {
  level: number;
  current_xp: number;
  total_xp: number;
  total_correct: number;
  total_incorrect: number;
}

interface DailyStats {
  date: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
}

interface WeeklyComparison {
  thisWeek: { correct: number; total: number; accuracy: number };
  lastWeek: { correct: number; total: number; accuracy: number };
  improvement: number;
}

interface LessonMonitoring {
  totalLessons: number;
  completedLessons: number;
  totalWatchedMinutes: number;
  recentLessons: {
    id: string;
    title: string;
    course_title: string;
    watched_seconds: number;
    completed: boolean;
  }[];
}

const WEEKDAY_LABELS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { soundEnabled, toggleSound } = useSound();

  const [childStats, setChildStats] = useState<ChildStats | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<WeeklyComparison | null>(null);
  const [todaySolved, setTodaySolved] = useState(0);
  const [lessonMonitoring, setLessonMonitoring] = useState<LessonMonitoring | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileData) {
      setChildStats({
        username: profileData.username,
        avatar_url: profileData.avatar_url,
        total_score: profileData.total_score || 0,
        total_problems_solved: profileData.total_problems_solved || 0,
        best_streak: profileData.best_streak || 0,
        current_streak: profileData.current_streak || 0,
        daily_goal: profileData.daily_goal || 20,
      });
    }

    const { data: gamificationData } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (gamificationData) {
      setGamification({
        level: gamificationData.level,
        current_xp: gamificationData.current_xp,
        total_xp: gamificationData.total_xp,
        total_correct: gamificationData.total_correct,
        total_incorrect: gamificationData.total_incorrect,
      });
    }

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, 'yyyy-MM-dd');
    });

    const { data: sessionsData } = await supabase
      .from('game_sessions')
      .select('created_at, correct, incorrect')
      .eq('user_id', user.id)
      .gte('created_at', last7Days[0]);

    const dailyMap = new Map<string, { correct: number; incorrect: number }>();
    last7Days.forEach((date) => dailyMap.set(date, { correct: 0, incorrect: 0 }));

    sessionsData?.forEach((session) => {
      const date = format(new Date(session.created_at), 'yyyy-MM-dd');
      if (dailyMap.has(date)) {
        const current = dailyMap.get(date)!;
        dailyMap.set(date, {
          correct: current.correct + (session.correct || 0),
          incorrect: current.incorrect + (session.incorrect || 0),
        });
      }
    });

    const processedDailyStats: DailyStats[] = last7Days.map((date) => {
      const stats = dailyMap.get(date)!;
      const total = stats.correct + stats.incorrect;
      return {
        date,
        correct: stats.correct,
        incorrect: stats.incorrect,
        total,
        accuracy: total > 0 ? Math.round((stats.correct / total) * 100) : 0,
      };
    });

    setDailyStats(processedDailyStats);

    const today = format(new Date(), 'yyyy-MM-dd');
    const todayStats = processedDailyStats.find((s) => s.date === today);
    setTodaySolved(todayStats?.correct || 0);

    const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const lastWeekStart = subDays(thisWeekStart, 7);

    const { data: thisWeekData } = await supabase
      .from('game_sessions')
      .select('correct, incorrect')
      .eq('user_id', user.id)
      .gte('created_at', format(thisWeekStart, 'yyyy-MM-dd'));

    const { data: lastWeekData } = await supabase
      .from('game_sessions')
      .select('correct, incorrect')
      .eq('user_id', user.id)
      .gte('created_at', format(lastWeekStart, 'yyyy-MM-dd'))
      .lt('created_at', format(thisWeekStart, 'yyyy-MM-dd'));

    const thisWeekStats = {
      correct: thisWeekData?.reduce((sum, s) => sum + (s.correct || 0), 0) || 0,
      total:
        thisWeekData?.reduce((sum, s) => sum + (s.correct || 0) + (s.incorrect || 0), 0) || 0,
      accuracy: 0,
    };
    thisWeekStats.accuracy = thisWeekStats.total > 0
      ? Math.round((thisWeekStats.correct / thisWeekStats.total) * 100)
      : 0;

    const lastWeekStats = {
      correct: lastWeekData?.reduce((sum, s) => sum + (s.correct || 0), 0) || 0,
      total:
        lastWeekData?.reduce((sum, s) => sum + (s.correct || 0) + (s.incorrect || 0), 0) || 0,
      accuracy: 0,
    };
    lastWeekStats.accuracy = lastWeekStats.total > 0
      ? Math.round((lastWeekStats.correct / lastWeekStats.total) * 100)
      : 0;

    const improvement = lastWeekStats.accuracy > 0
      ? thisWeekStats.accuracy - lastWeekStats.accuracy
      : thisWeekStats.accuracy;

    setWeeklyComparison({
      thisWeek: thisWeekStats,
      lastWeek: lastWeekStats,
      improvement,
    });

    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, course_id, courses!inner(title)')
      .eq('is_published', true);

    const { data: progressData } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id, completed, watched_seconds')
      .eq('user_id', user.id);

    const progressMap = new Map(progressData?.map((p) => [p.lesson_id, p]) || []);

    const totalLessons = lessons?.length || 0;
    const completedLessons = progressData?.filter((p) => p.completed).length || 0;
    const totalWatchedSeconds =
      progressData?.reduce((sum, p) => sum + (p.watched_seconds || 0), 0) || 0;

    const recentLessons = (lessons || [])
      .map((l) => {
        const progress = progressMap.get(l.id);
        return {
          id: l.id,
          title: l.title,
          course_title: (l.courses as { title?: string } | null)?.title || '',
          watched_seconds: progress?.watched_seconds || 0,
          completed: progress?.completed || false,
        };
      })
      .filter((l) => l.watched_seconds > 0 || l.completed)
      .sort((a, b) => b.watched_seconds - a.watched_seconds)
      .slice(0, 5);

    setLessonMonitoring({
      totalLessons,
      completedLessons,
      totalWatchedMinutes: Math.floor(totalWatchedSeconds / 60),
      recentLessons,
    });

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/auth');
      return;
    }
    if (user) fetchData();
  }, [user, authLoading, fetchData, navigate]);

  const handleRefresh = async () => {
    await fetchData();
  };

  if (loading || authLoading) {
    return (
      <PageBackground className="min-h-screen">
        <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />
        <PageSkeleton type="default" />
      </PageBackground>
    );
  }

  if (!childStats) {
    return (
      <PageBackground className="min-h-screen">
        <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />
        <div className="container px-4 py-8 text-center">
          <p className="text-muted-foreground">Ma'lumot topilmadi</p>
        </div>
      </PageBackground>
    );
  }

  const level = gamification?.level || 1;
  const totalXp = gamification?.total_xp || 0;
  const accuracy =
    gamification && gamification.total_correct + gamification.total_incorrect > 0
      ? Math.round(
          (gamification.total_correct /
            (gamification.total_correct + gamification.total_incorrect)) *
            100
        )
      : 0;

  // Map raw daily stats (yyyy-MM-dd) to weekday labels for the chart
  const chartDailyStats = dailyStats.map((d) => {
    const idx = (new Date(d.date).getDay() + 6) % 7; // Mon = 0
    return { date: WEEKDAY_LABELS[idx], accuracy: d.accuracy };
  });

  const todayProgressPct = childStats.daily_goal > 0
    ? Math.min(Math.round((todaySolved / childStats.daily_goal) * 100), 100)
    : 0;

  return (
    <PageBackground className="min-h-screen pb-20 sm:pb-24">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="container px-3 xs:px-4 py-4 sm:py-6 space-y-10 sm:space-y-14">
          <ParentHero
            childName={childStats.username}
            level={level}
            totalXp={totalXp}
            weeklyAccuracy={weeklyComparison?.thisWeek.accuracy ?? accuracy}
            coursesCount={lessonMonitoring?.completedLessons ?? 0}
            todayProgressPct={todayProgressPct}
            streak={childStats.current_streak}
          />

          <ParentTrustStats />

          <ParentWhyChoose />

          <ParentDashboardPanel
            childName={childStats.username}
            level={level}
            totalXp={totalXp}
            weeklyAccuracy={weeklyComparison?.thisWeek.accuracy ?? accuracy}
            totalCorrect={gamification?.total_correct ?? 0}
            improvement={weeklyComparison?.improvement ?? 0}
            dailyStats={chartDailyStats}
            recentLessons={lessonMonitoring?.recentLessons ?? []}
          />

          <ParentRecommendations />

          <ParentTestimonials />

          <ParentFAQ />

          {/* Email sozlamalari — eski blok, bu yerda saqlangan */}
          <section className="max-w-3xl mx-auto">
            <h3 className="font-display font-bold text-lg sm:text-xl mb-4 flex items-center gap-2">
              <span>📧</span> Email sozlamalari
            </h3>
            <ParentEmailSettings />
          </section>
        </div>
      </PullToRefresh>
    </PageBackground>
  );
};

export default ParentDashboard;
