import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLoader } from "@/components/PageLoader";
import { PageTransition } from "@/components/PageTransition";
import { PullToRefresh } from "@/components/PullToRefresh";
import { SessionTimeoutProvider } from "@/components/SessionTimeoutProvider";

// Core pages - loaded immediately
import KidsHome from "@/pages/KidsHome";
import Landing from "@/pages/Landing";

// Lazy loaded pages for better initial load
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPostPage = lazy(() => import("@/pages/BlogPost"));
const Admin = lazy(() => import("@/pages/Admin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const LessonDetail = lazy(() => import("@/pages/LessonDetail"));
const WeeklyGame = lazy(() => import("@/pages/WeeklyGame"));
const Badges = lazy(() => import("@/pages/Badges"));
const Install = lazy(() => import("@/pages/Install"));
// MentalArithmetic removed
const Achievements = lazy(() => import("@/pages/Achievements"));
const ChallengeStats = lazy(() => import("@/pages/ChallengeStats"));
const Statistics = lazy(() => import("@/pages/Statistics"));
const Messages = lazy(() => import("@/pages/Messages"));
const Records = lazy(() => import("@/pages/Records"));
const ProblemSheetGenerator = lazy(() => import("@/pages/ProblemSheetGenerator"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profile"));
const KidsCourses = lazy(() => import("@/pages/KidsCourses"));
const KidsLeaderboard = lazy(() => import("@/pages/KidsLeaderboard"));
const ParentDashboard = lazy(() => import("@/pages/ParentDashboard"));
const LessonStats = lazy(() => import("@/pages/LessonStats"));

const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const About = lazy(() => import("@/pages/About"));
const AbacusSimulator = lazy(() => import("@/pages/AbacusSimulator"));
const AbacusPractice = lazy(() => import("@/pages/AbacusPractice"));
const LiveSessions = lazy(() => import("@/pages/LiveSessions"));
const FeatureDetail = lazy(() => import("@/pages/FeatureDetail"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Blogs = lazy(() => import("@/pages/Blogs"));
const ComingSoon = lazy(() => import("@/pages/ComingSoon"));
const MentalTrainer = lazy(() => import("@/pages/MentalTrainer"));
const LiveClassroom = lazy(() => import("@/pages/LiveClassroom"));
const Subjects = lazy(() => import("@/pages/Subjects"));
const SubjectPractice = lazy(() => import("@/pages/SubjectPractice"));
const LMSDashboard = lazy(() => import("@/pages/LMSDashboard"));

// Lazy load heavy widgets
const HelpChatWidget = lazy(() => import("@/components/HelpChatWidget").then(m => ({ default: m.HelpChatWidget })));

// Optimized QueryClient with stale-while-revalidate
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh longer
      gcTime: 1000 * 60 * 30, // 30 minutes cache
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false, // Don't refetch on tab switch (saves bandwidth)
      refetchOnReconnect: true,
    },
  },
});

const handleRefresh = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  window.location.reload();
};

// Simple loading fallback for lazy components
const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
            <SessionTimeoutProvider>
            <PageLoader />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <PullToRefresh onRefresh={handleRefresh}>
              {/* ENTERPRISE: Main content wrapper - allows natural document flow */}
              <main className="relative min-h-screen pb-16 md:pb-0" style={{ minHeight: '100dvh' }}>
                <PageTransition>
                  <Suspense fallback={<LazyFallback />}>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/home" element={<KidsHome />} />
                      <Route path="/feature/:id" element={<FeatureDetail />} />
                      <Route path="/blog/:id" element={<BlogDetail />} />
                      <Route path="/blogs" element={<Blogs />} />
                      <Route path="/subjects" element={<ComingSoon title="Fanlar" />} />
                      <Route path="/tournaments" element={<ComingSoon title="Musobaqalar" />} />
                      <Route path="/live" element={<ComingSoon title="Live darslar" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/train" element={<Index />} />
                      
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogPostPage />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/courses" element={<KidsCourses />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/leaderboard" element={<KidsLeaderboard />} />
                      <Route path="/parent-dashboard" element={<ParentDashboard />} />
                      <Route path="/lesson-stats" element={<LessonStats />} />
                      <Route path="/courses/:courseId" element={<CourseDetail />} />
                      <Route path="/lessons/:lessonId" element={<LessonDetail />} />
                      <Route path="/weekly-game" element={<WeeklyGame />} />
                      <Route path="/badges" element={<Badges />} />
                      <Route path="/install" element={<Install />} />
                      
                      <Route path="/achievements" element={<Achievements />} />
                      <Route path="/statistics" element={<Statistics />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/records" element={<Records />} />
                      <Route path="/challenge-stats" element={<ChallengeStats />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/abacus-simulator" element={<AbacusSimulator />} />
                      <Route path="/abacus-practice" element={<AbacusPractice />} />
                      <Route path="/live-sessions" element={<LiveSessions />} />
                      <Route path="/live/:sessionId" element={<LiveClassroom />} />
                      <Route path="/subjects" element={<Subjects />} />
                      <Route path="/subjects/:subjectId" element={<SubjectPractice />} />
                      <Route path="/lms" element={<LMSDashboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </PageTransition>
              </main>
            </PullToRefresh>
            <MobileBottomNav />
            
            
          
            <Suspense fallback={null}>
              <HelpChatWidget />
            </Suspense>
          </BrowserRouter>
          </SessionTimeoutProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
