import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageBackground } from '@/components/layout/PageBackground';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PullToRefresh } from '@/components/PullToRefresh';
import { PageSkeleton } from '@/components/PageSkeleton';
import {
  ArrowLeft,
  Lock,
  Star,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  Play,
  Clock,
  X,
  Trophy,
  Search,
  Filter,
  ArrowRight,
  PlayCircle,
  Award,
  Target,
  Sparkles,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  difficulty: string;
  lessons_count?: number;
  completed_lessons?: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  order_index: number | null;
}

type FilterStatus = 'all' | 'in_progress' | 'completed' | 'not_started';
type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

const difficultyConfig: Record<
  string,
  { label: string; bg: string; fg: string; ring: string; gradient: string; emoji: string }
> = {
  beginner: {
    label: "Boshlang'ich",
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    fg: 'text-emerald-600',
    ring: 'border-emerald-200 dark:border-emerald-800/50',
    gradient: 'from-emerald-400 to-emerald-600',
    emoji: '🌱',
  },
  intermediate: {
    label: "O'rta",
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    fg: 'text-amber-600',
    ring: 'border-amber-200 dark:border-amber-800/50',
    gradient: 'from-amber-400 to-orange-500',
    emoji: '🌿',
  },
  advanced: {
    label: 'Murakkab',
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    fg: 'text-rose-600',
    ring: 'border-rose-200 dark:border-rose-800/50',
    gradient: 'from-rose-400 to-rose-600',
    emoji: '🌳',
  },
};

const KidsCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { soundEnabled, toggleSound } = useSound();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<string, { total: number; completed: number }>>({});

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [diffFilter, setDiffFilter] = useState<FilterDifficulty>('all');

  const fetchCourses = useCallback(async () => {
    const { data: coursesData } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (coursesData) {
      const coursesWithLessons = await Promise.all(
        coursesData.map(async (course) => {
          const { count } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
            .eq('is_published', true);
          return { ...course, lessons_count: count || 0 };
        })
      );

      setCourses(coursesWithLessons);

      if (user) {
        const progressMap: Record<string, { total: number; completed: number }> = {};
        for (const course of coursesWithLessons) {
          const { data: lessons } = await supabase
            .from('lessons')
            .select('id')
            .eq('course_id', course.id)
            .eq('is_published', true);

          if (lessons && lessons.length > 0) {
            const lessonIds = lessons.map((l) => l.id);
            const { count } = await supabase
              .from('user_lesson_progress')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('completed', true)
              .in('lesson_id', lessonIds);

            progressMap[course.id] = {
              total: lessons.length,
              completed: count || 0,
            };
          }
        }
        setUserProgress(progressMap);
      }
    }
    setLoading(false);
  }, [user]);

  const fetchCourseLessons = useCallback(
    async (course: Course) => {
      setLessonsLoading(true);
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (lessonsData) {
        setCourseLessons(lessonsData);

        if (user) {
          const lessonIds = lessonsData.map((l) => l.id);
          const { data: progressData } = await supabase
            .from('user_lesson_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .eq('completed', true)
            .in('lesson_id', lessonIds);

          if (progressData) {
            setCompletedLessons(new Set(progressData.map((p) => p.lesson_id)));
          }
        }
      }
      setLessonsLoading(false);
    },
    [user]
  );

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleRefresh = async () => {
    await fetchCourses();
  };

  const getProgressPercent = useCallback(
    (courseId: string) => {
      const progress = userProgress[courseId];
      if (!progress || progress.total === 0) return 0;
      return Math.round((progress.completed / progress.total) * 100);
    },
    [userProgress]
  );

  const isCompleted = useCallback(
    (courseId: string) => {
      const progress = userProgress[courseId];
      return !!(progress && progress.completed === progress.total && progress.total > 0);
    },
    [userProgress]
  );

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    fetchCourseLessons(course);
  };

  // Filtering
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Search
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) &&
          !(c.description || '').toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Difficulty
      if (diffFilter !== 'all' && c.difficulty !== diffFilter) return false;
      // Status
      const pct = getProgressPercent(c.id);
      const completed = isCompleted(c.id);
      if (statusFilter === 'completed' && !completed) return false;
      if (statusFilter === 'in_progress' && (completed || pct === 0)) return false;
      if (statusFilter === 'not_started' && pct > 0) return false;
      return true;
    });
  }, [courses, search, diffFilter, statusFilter, getProgressPercent, isCompleted]);

  // Stats
  const totalCompleted = Object.values(userProgress).reduce((s, p) => s + p.completed, 0);
  const totalLessons = Object.values(userProgress).reduce((s, p) => s + p.total, 0);
  const completedCourses = Object.keys(userProgress).filter((id) => isCompleted(id)).length;
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <PageBackground className="min-h-screen">
        <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />
        <PageSkeleton type="courses" />
      </PageBackground>
    );
  }

  return (
    <PageBackground className="min-h-screen pb-20 sm:pb-24 bg-gradient-to-br from-emerald-50/40 via-background to-amber-50/30 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/20">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="container px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 h-9 px-3 -ml-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Orqaga</span>
            </Button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-sm">
              <GraduationCap className="h-3 w-3" />
              KURSLAR KATALOGI
            </span>
          </div>

          {/* HERO */}
          <section className="rounded-3xl bg-gradient-to-br from-emerald-50/80 via-amber-50/40 to-white dark:from-emerald-950/30 dark:via-amber-950/20 dark:to-card border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 px-5 sm:px-7 py-6 sm:py-8">
              <div className="min-w-0">
                <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                  Barcha <span className="text-emerald-600">kurslar</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Yapon abakus metodikasi asosida ishlab chiqilgan {courses.length} ta kurs sizni kutmoqda.
                  Boshqaruv panelidan istalgan kursni tanlang va o'rganishni boshlang.
                </p>

                {/* Inline action buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => setStatusFilter('in_progress')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 shadow-sm transition-colors"
                  >
                    <PlayCircle className="h-3.5 w-3.5" /> Davomida
                  </button>
                  <button
                    onClick={() => setStatusFilter('not_started')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card border border-border hover:border-emerald-300 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Yangi boshlash
                  </button>
                </div>
              </div>

              {/* Donut + summary */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="relative">
                  <svg viewBox="0 0 110 110" className="w-24 h-24">
                    <circle cx="55" cy="55" r="46" stroke="currentColor" strokeOpacity="0.1" strokeWidth="10" fill="none" />
                    <circle
                      cx="55"
                      cy="55"
                      r="46"
                      stroke="rgb(16 185 129)"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallPct / 100) * 289} 289`}
                      transform="rotate(-90 55 55)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-display font-black text-emerald-600 leading-none">{overallPct}%</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">umumiy</div>
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-base">
                    {totalCompleted} / {totalLessons}
                  </div>
                  <div className="text-[11px] text-muted-foreground">dars tugatildi</div>
                </div>
              </div>
            </div>
          </section>

          {/* KPI cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                icon: BookOpen,
                value: courses.length,
                label: 'Mavjud kurslar',
                sub: 'jami katalog',
                bg: 'bg-emerald-100 dark:bg-emerald-900/40',
                fg: 'text-emerald-600',
                gradient: 'from-emerald-50 to-green-50/30 dark:from-emerald-950/30 dark:to-green-950/20',
                border: 'border-emerald-200 dark:border-emerald-800/50',
              },
              {
                icon: Trophy,
                value: completedCourses,
                label: 'Tugatilgan',
                sub: 'kurslar',
                bg: 'bg-amber-100 dark:bg-amber-900/40',
                fg: 'text-amber-600',
                gradient: 'from-amber-50 to-yellow-50/30 dark:from-amber-950/30 dark:to-yellow-950/20',
                border: 'border-amber-200 dark:border-amber-800/50',
              },
              {
                icon: CheckCircle2,
                value: totalCompleted,
                label: 'Bajarilgan',
                sub: 'darslar',
                bg: 'bg-orange-100 dark:bg-orange-900/40',
                fg: 'text-orange-600',
                gradient: 'from-orange-50 to-amber-50/30 dark:from-orange-950/30 dark:to-amber-950/20',
                border: 'border-orange-200 dark:border-orange-800/50',
              },
              {
                icon: Target,
                value: `${overallPct}%`,
                label: 'Umumiy progress',
                sub: 'barcha kurs bo\'yicha',
                bg: 'bg-purple-100 dark:bg-purple-900/40',
                fg: 'text-purple-600',
                gradient: 'from-purple-50 to-fuchsia-50/30 dark:from-purple-950/30 dark:to-fuchsia-950/20',
                border: 'border-purple-200 dark:border-purple-800/50',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} p-4 sm:p-5 hover:shadow-md transition-shadow`}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3 shadow-sm`}>
                  <item.icon className={`h-5 w-5 ${item.fg}`} />
                </div>
                <div className="text-xl sm:text-2xl font-display font-black leading-tight">{item.value}</div>
                <div className="text-xs font-semibold mt-0.5">{item.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</div>
              </div>
            ))}
          </section>

          {/* SEARCH + FILTERS */}
          <section className="rounded-2xl bg-card border border-border/40 shadow-sm p-3 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Kurs nomi yoki tavsifi bo'yicha qidirish..."
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-secondary/50 border border-border/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all"
                />
              </div>

              {/* Status tabs */}
              <div className="flex items-center gap-1 bg-secondary/40 rounded-xl p-1 overflow-x-auto">
                {(
                  [
                    { id: 'all', label: 'Hammasi' },
                    { id: 'in_progress', label: 'Davomida' },
                    { id: 'completed', label: 'Tugagan' },
                    { id: 'not_started', label: 'Yangi' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-3 h-8 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === f.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Difficulty pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <Filter className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                {(
                  [
                    { id: 'all', label: 'Daraja' },
                    { id: 'beginner', label: '🌱 Oson' },
                    { id: 'intermediate', label: '🌿 O\'rta' },
                    { id: 'advanced', label: '🌳 Qiyin' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDiffFilter(d.id)}
                    className={`px-2.5 h-7 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                      diffFilter === d.id
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* COURSES GRID */}
          {filteredCourses.length === 0 ? (
            <section className="rounded-2xl bg-card border border-border/40 p-12 text-center">
              <Search className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="font-display font-bold text-base mb-1">Kurs topilmadi</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Boshqa filterlarni sinab ko'ring yoki qidiruvni o'zgartiring
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setDiffFilter('all');
                }}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
              >
                Filterlarni tozalash
              </button>
            </section>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredCourses.map((course, index) => {
                const progress = userProgress[course.id];
                const progressPercent = getProgressPercent(course.id);
                const completed = isCompleted(course.id);
                const isLocked =
                  index > 0 && courses[index - 1] &&
                  !isCompleted(courses[index - 1].id) &&
                  progressPercent === 0 &&
                  statusFilter === 'all' &&
                  diffFilter === 'all' &&
                  !search;
                const cfg = difficultyConfig[course.difficulty] || difficultyConfig.beginner;

                return (
                  <article
                    key={course.id}
                    onClick={() => !isLocked && handleCourseClick(course)}
                    className={`group rounded-2xl bg-card border border-border/40 overflow-hidden transition-all ${
                      isLocked
                        ? 'opacity-50 cursor-not-allowed grayscale'
                        : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-300 dark:hover:border-emerald-700/50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className={`relative h-36 bg-gradient-to-br ${cfg.gradient} overflow-hidden`}>
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl drop-shadow-lg group-hover:scale-110 transition-transform">
                          {cfg.emoji}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                      {/* Difficulty badge */}
                      <span className={`absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 ${cfg.fg} backdrop-blur-sm shadow-sm`}>
                        {cfg.emoji} {cfg.label}
                      </span>

                      {/* Lesson count badge */}
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-sm">
                        <BookOpen className="h-2.5 w-2.5" />
                        {course.lessons_count}
                      </span>

                      {isLocked && (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center backdrop-blur-sm">
                          <div className="h-12 w-12 rounded-full bg-white/15 border border-white/30 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}

                      {completed && (
                        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-lg">
                          <Trophy className="h-3 w-3" fill="currentColor" /> Tugagan
                        </div>
                      )}

                      {!isLocked && !completed && progressPercent > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                          <div
                            className={`h-full bg-gradient-to-r ${cfg.gradient}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-display font-bold text-base sm:text-lg leading-tight mb-1.5 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 min-h-[32px]">
                        {course.description || "Kurs tavsifi tez orada qo'shiladi"}
                      </p>

                      {progress && progress.total > 0 ? (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-display font-black">{progressPercent}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-1">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} transition-all`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {progress.completed} / {progress.total} dars tugatildi
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3 text-[10px] text-muted-foreground inline-flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-400" /> Yangi boshlash uchun mos
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-border/40">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          {completed ? (
                            <>
                              <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                              <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                              <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                            </>
                          ) : (
                            <>
                              <Star className="h-3 w-3 text-muted-foreground/40" />
                              <Star className="h-3 w-3 text-muted-foreground/40" />
                              <Star className="h-3 w-3 text-muted-foreground/40" />
                            </>
                          )}
                        </div>
                        {!isLocked && (
                          <span className={`inline-flex items-center gap-1 text-xs font-bold ${cfg.fg} group-hover:translate-x-0.5 transition-transform`}>
                            {completed ? 'Takror' : progressPercent > 0 ? 'Davom ettirish' : 'Boshlash'}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          {/* CTA banner */}
          <section className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl mb-1">
                    Yangi kurslarni boshlashga tayyormisiz?
                  </h3>
                  <p className="text-sm text-white/85">
                    Har bir tugatilgan kurs uchun maxsus sertifikat va yutuqlar oling.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/badges')}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-white text-emerald-700 hover:bg-white/95 text-sm font-bold shadow-sm transition-all flex-shrink-0"
              >
                Yutuqlarim
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </PullToRefresh>

      {/* Lessons Drawer */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCourse(null)} />

          <div className="relative w-full sm:max-w-lg max-h-[85vh] bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-border/40">
            {/* Header */}
            <div className={`relative p-5 sm:p-6 bg-gradient-to-br ${difficultyConfig[selectedCourse.difficulty]?.gradient || 'from-emerald-400 to-emerald-600'}`}>
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm">
                  {difficultyConfig[selectedCourse.difficulty]?.emoji || '🌱'}
                </div>
                <div className="text-white min-w-0">
                  <h2 className="font-display font-black text-lg sm:text-xl line-clamp-1">{selectedCourse.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-white/85 mt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {selectedCourse.lessons_count} dars
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {completedLessons.size} tugagan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons list */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[55vh]">
              <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-500" />
                Darslar ro'yxati
              </h3>

              {lessonsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-secondary rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : courseLessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Darslar hali qo'shilmagan</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {courseLessons.map((lesson, index) => {
                    const isLessonCompleted = completedLessons.has(lesson.id);
                    return (
                      <li
                        key={lesson.id}
                        onClick={() => navigate(`/lessons/${lesson.id}`)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5 ${
                          isLessonCompleted
                            ? 'border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20'
                            : 'border-border/40 bg-card hover:border-emerald-300 dark:hover:border-emerald-700/50'
                        }`}
                      >
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isLessonCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {isLessonCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-display font-black">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm line-clamp-1">{lesson.title}</h4>
                          {lesson.duration_minutes && (
                            <div className="text-[10px] text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                              <Clock className="h-2.5 w-2.5" /> {lesson.duration_minutes} daqiqa
                            </div>
                          )}
                        </div>
                        <Play className="h-4 w-4 text-emerald-500" />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-border/40 bg-secondary/30">
              <button
                onClick={() => {
                  const firstIncomplete = courseLessons.find((l) => !completedLessons.has(l.id));
                  navigate(`/lessons/${firstIncomplete?.id || courseLessons[0]?.id}`);
                }}
                disabled={courseLessons.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-5 w-5" />
                {completedLessons.size > 0 ? 'Davom ettirish' : 'Kursni boshlash'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </PageBackground>
  );
};

export default KidsCourses;
