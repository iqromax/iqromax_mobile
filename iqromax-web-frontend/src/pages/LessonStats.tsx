import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageBackground } from '@/components/layout/PageBackground';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useSound } from '@/hooks/useSound';
import { supabase } from '@/integrations/supabase/client';
import { PullToRefresh } from '@/components/PullToRefresh';
import { PageSkeleton } from '@/components/PageSkeleton';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  PlayCircle,
  Trophy,
  Video,
  ArrowRight,
  BarChart3,
  Target,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';

interface CourseProgress {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  totalLessons: number;
  completedLessons: number;
  totalWatchedSeconds: number;
  totalDurationMinutes: number;
}

interface LessonProgress {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  course_id: string;
  course_title: string;
  completed: boolean;
  practice_completed: boolean;
  watched_seconds: number;
}

const LessonStats = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { soundEnabled, toggleSound } = useSound();

  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [recentLessons, setRecentLessons] = useState<LessonProgress[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalWatchedMinutes: 0,
    totalDurationMinutes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, description, thumbnail_url')
      .eq('is_published', true)
      .order('order_index');

    const { data: lessons } = await supabase
      .from('lessons')
      .select(
        `
        id, 
        title, 
        description, 
        duration_minutes, 
        course_id,
        courses!inner(title)
      `
      )
      .eq('is_published', true)
      .order('order_index');

    const { data: progressData } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id, completed, practice_completed, watched_seconds')
      .eq('user_id', user.id);

    const progressMap = new Map(progressData?.map((p) => [p.lesson_id, p]) || []);

    const courseProgressList: CourseProgress[] = [];
    let totalCompletedLessons = 0;
    let totalWatchedSeconds = 0;
    let totalDurationMinutes = 0;
    let completedCourses = 0;

    courses?.forEach((course) => {
      const courseLessons = lessons?.filter((l) => l.course_id === course.id) || [];
      const completed = courseLessons.filter((l) => progressMap.get(l.id)?.completed).length;
      const watched = courseLessons.reduce((sum, l) => {
        return sum + (progressMap.get(l.id)?.watched_seconds || 0);
      }, 0);
      const duration = courseLessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);

      totalCompletedLessons += completed;
      totalWatchedSeconds += watched;
      totalDurationMinutes += duration;

      if (completed === courseLessons.length && courseLessons.length > 0) {
        completedCourses++;
      }

      courseProgressList.push({
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        totalLessons: courseLessons.length,
        completedLessons: completed,
        totalWatchedSeconds: watched,
        totalDurationMinutes: duration,
      });
    });

    setCourseProgress(courseProgressList);

    const lessonsWithProgress: LessonProgress[] = (lessons || [])
      .map((l) => {
        const progress = progressMap.get(l.id);
        return {
          id: l.id,
          title: l.title,
          description: l.description,
          duration_minutes: l.duration_minutes || 0,
          course_id: l.course_id,
          course_title: (l.courses as { title?: string } | null)?.title || '',
          completed: progress?.completed || false,
          practice_completed: progress?.practice_completed || false,
          watched_seconds: progress?.watched_seconds || 0,
        };
      })
      .filter((l) => l.watched_seconds > 0 || l.completed)
      .sort((a, b) => b.watched_seconds - a.watched_seconds)
      .slice(0, 10);

    setRecentLessons(lessonsWithProgress);

    setTotalStats({
      totalCourses: courses?.length || 0,
      completedCourses,
      totalLessons: lessons?.length || 0,
      completedLessons: totalCompletedLessons,
      totalWatchedMinutes: Math.floor(totalWatchedSeconds / 60),
      totalDurationMinutes,
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}s ${mins}d`;
    return `${mins} daqiqa`;
  };

  if (loading || authLoading) {
    return (
      <PageBackground className="min-h-screen">
        <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />
        <PageSkeleton type="default" />
      </PageBackground>
    );
  }

  const overallProgress =
    totalStats.totalLessons > 0
      ? Math.round((totalStats.completedLessons / totalStats.totalLessons) * 100)
      : 0;

  const watchProgress =
    totalStats.totalDurationMinutes > 0
      ? Math.round((totalStats.totalWatchedMinutes / totalStats.totalDurationMinutes) * 100)
      : 0;

  const todayDate = new Date().toLocaleDateString('uz-UZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Filter courses by status
  const filteredCourses = courseProgress.filter((c) => {
    if (filter === 'all') return true;
    const isCompleted = c.totalLessons > 0 && c.completedLessons === c.totalLessons;
    if (filter === 'completed') return isCompleted;
    if (filter === 'in_progress') return !isCompleted && c.completedLessons > 0;
    return true;
  });

  return (
    <PageBackground className="min-h-screen pb-20 sm:pb-24 bg-gradient-to-br from-orange-50/40 via-background to-amber-50/40 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="container px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">
          {/* HERO */}
          <section className="rounded-3xl bg-gradient-to-br from-orange-100/70 via-amber-50/60 to-white dark:from-orange-950/30 dark:via-amber-950/20 dark:to-card border border-orange-200/60 dark:border-orange-800/40 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 px-5 sm:px-7 py-6 sm:py-7">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-500 text-white shadow-sm mb-3">
                  <Calendar className="h-3 w-3" />
                  {todayDate}
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                  Kunlik <span className="text-orange-500">hisobot</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> Mashqlar bajardi
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> Ball to'pladi
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="inline-flex items-center gap-1 text-purple-600 font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> Faol qatnashdi
                  </span>
                </p>
              </div>

              {/* Donut progress (right) */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="relative">
                  <svg viewBox="0 0 110 110" className="w-24 h-24">
                    <circle cx="55" cy="55" r="46" stroke="currentColor" strokeOpacity="0.1" strokeWidth="10" fill="none" />
                    <circle
                      cx="55"
                      cy="55"
                      r="46"
                      stroke="rgb(249 115 22)"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallProgress / 100) * 289} 289`}
                      transform="rotate(-90 55 55)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-display font-black text-orange-600 leading-none">
                      {overallProgress}%
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">umumiy</div>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-display font-bold text-base">
                    {totalStats.completedLessons} / {totalStats.totalLessons}
                  </div>
                  <div className="text-[11px] text-muted-foreground">dars tugatildi</div>
                </div>
              </div>
            </div>
          </section>

          {/* KPI CARDS */}
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              {
                icon: BookOpen,
                value: `${totalStats.completedCourses}/${totalStats.totalCourses}`,
                label: 'Kurslar',
                sub: 'tugatildi',
                bg: 'bg-orange-100 dark:bg-orange-900/40',
                fg: 'text-orange-600',
                border: 'border-orange-200 dark:border-orange-800/50',
                gradient: 'from-orange-50 to-amber-50/30 dark:from-orange-950/30 dark:to-amber-950/20',
              },
              {
                icon: CheckCircle2,
                value: `${totalStats.completedLessons}/${totalStats.totalLessons}`,
                label: 'Darslar',
                sub: 'tugatildi',
                bg: 'bg-emerald-100 dark:bg-emerald-900/40',
                fg: 'text-emerald-600',
                border: 'border-emerald-200 dark:border-emerald-800/50',
                gradient: 'from-emerald-50 to-green-50/30 dark:from-emerald-950/30 dark:to-green-950/20',
              },
              {
                icon: Clock,
                value: totalStats.totalWatchedMinutes.toString(),
                label: "Ko'rilgan",
                sub: 'daqiqa',
                bg: 'bg-purple-100 dark:bg-purple-900/40',
                fg: 'text-purple-600',
                border: 'border-purple-200 dark:border-purple-800/50',
                gradient: 'from-purple-50 to-fuchsia-50/30 dark:from-purple-950/30 dark:to-fuchsia-950/20',
              },
              {
                icon: BarChart3,
                value: `${overallProgress}%`,
                label: 'Progress',
                sub: 'umumiy',
                bg: 'bg-amber-100 dark:bg-amber-900/40',
                fg: 'text-amber-600',
                border: 'border-amber-200 dark:border-amber-800/50',
                gradient: 'from-amber-50 to-yellow-50/30 dark:from-amber-950/30 dark:to-yellow-950/20',
              },
              {
                icon: Target,
                value: `${watchProgress}%`,
                label: 'Video ko\'rish',
                sub: 'jami davomiylik',
                bg: 'bg-blue-100 dark:bg-blue-900/40',
                fg: 'text-blue-600',
                border: 'border-blue-200 dark:border-blue-800/50',
                gradient: 'from-blue-50 to-cyan-50/30 dark:from-blue-950/30 dark:to-cyan-950/20',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} p-4 sm:p-5 hover:shadow-md transition-shadow`}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3 shadow-sm`}>
                  <item.icon className={`h-5 w-5 ${item.fg}`} />
                </div>
                <div className="text-xl sm:text-2xl font-display font-black leading-tight">
                  {item.value}
                </div>
                <div className="text-xs font-semibold mt-0.5">{item.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</div>
              </div>
            ))}
          </section>

          {/* OVERALL PROGRESS BARS */}
          <section className="rounded-2xl bg-card border border-border/40 shadow-sm p-5 sm:p-6">
            <h3 className="font-display font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Umumiy progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold">Darslar tugatilishi</span>
                  <span className="font-display font-black text-orange-600">{overallProgress}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {totalStats.completedLessons} dan {totalStats.totalLessons} ta dars tugatildi
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold">Video ko'rish</span>
                  <span className="font-display font-black text-purple-600">{watchProgress}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all"
                    style={{ width: `${watchProgress}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {totalStats.totalWatchedMinutes} dan {totalStats.totalDurationMinutes} daqiqa ko'rildi
                </div>
              </div>
            </div>
          </section>

          {/* MAIN GRID — Courses (left) + Recent lessons (right) */}
          <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 sm:gap-6">
            {/* COURSES */}
            <div className="rounded-2xl bg-card border border-border/40 shadow-sm">
              <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-border/40">
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    Kurslar bo'yicha progress
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Har bir kurs bo'yicha alohida statistika
                  </p>
                </div>
                <div className="flex gap-1">
                  {[
                    { id: 'all', label: 'Hammasi' },
                    { id: 'in_progress', label: 'Davomida' },
                    { id: 'completed', label: 'Tugagan' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id as typeof filter)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        filter === f.id
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 sm:p-4 space-y-2.5">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-semibold">Kurslar topilmadi</p>
                    <p className="text-[11px] mt-1">Boshqa filterni tanlab ko'ring</p>
                  </div>
                ) : (
                  filteredCourses.map((course) => {
                    const progress =
                      course.totalLessons > 0
                        ? Math.round((course.completedLessons / course.totalLessons) * 100)
                        : 0;
                    const isCompleted = progress === 100;

                    return (
                      <button
                        key={course.id}
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className={`w-full text-left flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 ${
                          isCompleted
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40'
                            : 'bg-background/50 border-border/40 hover:border-orange-200 dark:hover:border-orange-700/50'
                        }`}
                      >
                        <div
                          className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden ${
                            isCompleted
                              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                              : 'bg-gradient-to-br from-orange-400 to-amber-500'
                          }`}
                        >
                          {isCompleted ? (
                            <Trophy className="h-6 w-6 text-white" fill="currentColor" />
                          ) : course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <BookOpen className="h-6 w-6 text-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-display font-bold text-sm sm:text-base truncate">
                              {course.title}
                            </h4>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black flex-shrink-0">
                                <CheckCircle2 className="h-2.5 w-2.5" /> Tugagan
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-muted-foreground mb-1.5">
                            <span>
                              {course.completedLessons}/{course.totalLessons} dars
                            </span>
                            <span>•</span>
                            <span>{formatTime(course.totalWatchedSeconds)}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isCompleted
                                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                                  : 'bg-gradient-to-r from-orange-400 to-orange-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div
                            className={`text-base sm:text-lg font-display font-black ${
                              isCompleted ? 'text-emerald-600' : 'text-orange-600'
                            }`}
                          >
                            {progress}%
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 ml-auto mt-0.5" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RECENT LESSONS */}
            <div className="rounded-2xl bg-card border border-border/40 shadow-sm">
              <div className="p-5 sm:p-6 border-b border-border/40">
                <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-purple-500" />
                  Oxirgi ko'rilgan darslar
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Eng so'nggi faollik bo'yicha
                </p>
              </div>

              {recentLessons.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Video className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-semibold">Hali darslar ko'rilmadi</p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="mt-3 text-xs font-bold text-orange-500 hover:text-orange-600 inline-flex items-center gap-1"
                  >
                    Boshlash <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <ul className="p-3 sm:p-4 space-y-2">
                  {recentLessons.map((lesson) => {
                    const watchPercent =
                      lesson.duration_minutes > 0
                        ? Math.min(
                            Math.round((lesson.watched_seconds / 60 / lesson.duration_minutes) * 100),
                            100
                          )
                        : 0;

                    return (
                      <li
                        key={lesson.id}
                        onClick={() => navigate(`/lessons/${lesson.id}`)}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border border-border/40 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-700/50 cursor-pointer transition-all group"
                      >
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            lesson.completed
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                              : 'bg-orange-100 dark:bg-orange-900/40 text-orange-600'
                          }`}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold truncate">{lesson.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {lesson.course_title}
                          </div>
                          <div className="h-1 rounded-full bg-secondary overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full ${
                                lesson.completed
                                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                                  : 'bg-gradient-to-r from-orange-400 to-orange-600'
                              }`}
                              style={{ width: `${watchPercent}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-[11px] font-bold">
                            {Math.floor(lesson.watched_seconds / 60)}d
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground/50 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all ml-auto" />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl mb-1">
                    Yangi darslarni o'rganishga tayyor
                  </h3>
                  <p className="text-sm text-white/85">
                    Barcha kurslar va darslarni katalogdan toping va yangi mavzularni boshlang.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-white text-orange-600 hover:bg-white/95 text-sm font-bold shadow-sm transition-all flex-shrink-0"
              >
                <BookOpen className="h-4 w-4" />
                Barcha kurslar
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </PullToRefresh>
    </PageBackground>
  );
};

export default LessonStats;
