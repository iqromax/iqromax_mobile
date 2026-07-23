import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageBackground } from '@/components/layout/PageBackground';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { useSound } from '@/hooks/useSound';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CourseManager } from '@/components/CourseManager';

import { FAQManager } from '@/components/FAQManager';
import { ChatHistoryManager } from '@/components/ChatHistoryManager';
import { AdminUserCharts } from '@/components/AdminUserCharts';
import { FileManager } from '@/components/FileManager';
import { TestimonialsManager } from '@/components/TestimonialsManager';
import { AdminReports } from '@/components/AdminReports';
import { CompetitionsManager } from '@/components/CompetitionsManager';
import { TeamMembersManager } from '@/components/TeamMembersManager';
import { 
  Mail, 
  FileText, 
  Trash2, 
  Plus, 
  Edit, 
  Clock,
  User,
  ShieldCheck,
  Loader2,
  Check,
  X,
  Users,
  BarChart3,
  Trophy,
  Target,
  TrendingUp,
  Flame,
  GraduationCap,
  
  HelpCircle,
  MessageCircle,
  FolderOpen,
  Upload,
  Quote,
  BarChart2,
  PlusCircle,
  Zap,
  RefreshCw,
  Download,
  Settings,
  Bell,
  Phone,
  Search
} from 'lucide-react';
import { formatPhoneNumber } from '@/lib/phoneFormatter';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  icon: string;
  gradient: string;
  is_published: boolean;
  created_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  total_score: number;
  total_problems_solved: number;
  best_streak: number;
  created_at: string;
  avatar_url: string | null;
  phone_number: string | null;
  last_active_date?: string | null;
}

interface GameSession {
  id: string;
  user_id: string;
  difficulty: string;
  section: string;
  score: number;
  correct: number;
  incorrect: number;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalProblems: number;
  totalScore: number;
  totalGames: number;
  newUsersToday: number;
  activeToday: number;
}

const ICON_OPTIONS = ['Brain', 'Calculator', 'Lightbulb', 'Target', 'TrendingUp', 'Sparkles', 'BookOpen'];
const GRADIENT_OPTIONS = [
  { label: "Ko'k", value: 'from-blue-500 to-cyan-500' },
  { label: 'Yashil', value: 'from-green-500 to-emerald-500' },
  { label: 'Sariq', value: 'from-yellow-500 to-orange-500' },
  { label: 'Binafsha', value: 'from-purple-500 to-pink-500' },
  { label: 'Qizil', value: 'from-red-500 to-rose-500' },
  { label: 'Indigo', value: 'from-indigo-500 to-violet-500' },
];
const CATEGORY_OPTIONS = ["Boshlang'ich", "Texnikalar", "Mashqlar", "Maslahatlar", "Dasturlar", "Bolalar uchun"];

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { soundEnabled, toggleSound } = useSound();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{ open: boolean; userId: string; username: string }>({ open: false, userId: '', username: '' });
  const [deletingUser, setDeletingUser] = useState(false);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [adminUsers, setAdminUsers] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProblems: 0,
    totalScore: 0,
    totalGames: 0,
    newUsersToday: 0,
    activeToday: 0,
  });
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: CATEGORY_OPTIONS[0],
    author: 'IQroMax jamoasi',
    read_time: '5 daqiqa',
    icon: 'BookOpen',
    gradient: GRADIENT_OPTIONS[0].value,
    is_published: false,
  });
  const [savingPost, setSavingPost] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
      fetchBlogPosts();
      fetchUsers();
      fetchGameSessions();
      fetchStats();
      fetchAdminUsers();
    }
  }, [isAdmin]);

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');
    if (error) {
      console.error('Error fetching admin users:', error);
      toast.error("Admin foydalanuvchilar ro'yxatini olishda xatolik");
      return;
    }
    if (data) {
      setAdminUsers(data.map(r => r.user_id));
    }
  };

  const toggleAdminRole = async (userId: string) => {
    const isCurrentlyAdmin = adminUsers.includes(userId);
    
    if (isCurrentlyAdmin) {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (!error) {
        setAdminUsers(prev => prev.filter(id => id !== userId));
        toast.success("Admin huquqi olib tashlandi");
      } else {
        console.error('Error removing admin role:', error);
        toast.error("Admin huquqini olib tashlashda xatolik");
      }
    } else {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });
      
      if (!error) {
        setAdminUsers(prev => [...prev, userId]);
        toast.success("Admin huquqi berildi");
      } else {
        console.error('Error assigning admin role:', error);
        toast.error("Admin huquqini berishda xatolik");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeletingUser(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setUsers(prev => prev.filter(u => u.user_id !== userId));
      setAdminUsers(prev => prev.filter(id => id !== userId));
      setDeleteConfirmDialog({ open: false, userId: '', username: '' });
      toast.success("Foydalanuvchi o'chirildi");
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast.error(err.message || "Foydalanuvchini o'chirishda xatolik");
    } finally {
      setDeletingUser(false);
    }
  };

  const checkAdminRole = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (error) {
      console.error('Error checking admin role:', error);
      toast.error("Admin huquqini tekshirishda xatolik");
      navigate('/');
      setCheckingAdmin(false);
      return;
    }
    if (data) {
      setIsAdmin(true);
    } else {
      toast.error("Sizda admin huquqi yo'q");
      navigate('/');
    }
    setCheckingAdmin(false);
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching contact messages:', error);
      toast.error("Xabarlarni olishda xatolik");
    } else if (data) {
      setMessages(data);
    }
    setLoadingMessages(false);
  };

  const fetchBlogPosts = async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching blog posts:', error);
      toast.error("Maqolalarni olishda xatolik");
    } else if (data) {
      setBlogPosts(data);
    }
    setLoadingPosts(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('total_score', { ascending: false });
    if (error) {
      console.error('Error fetching users:', error);
      toast.error("Foydalanuvchilar ro'yxatini olishda xatolik");
    } else if (data) {
      setUsers(data);
    }
    setLoadingUsers(false);
  };

  const fetchGameSessions = async () => {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) {
      console.error('Error fetching game sessions:', error);
      toast.error("O'yin sessiyalarini olishda xatolik");
    } else if (data) {
      setGameSessions(data);
    }
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Get profiles stats
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
    // Get game sessions count
    const { count: gamesCount, error: gamesError } = await supabase.from('game_sessions').select('*', { count: 'exact', head: true });
    
    if (profilesError || gamesError) {
      console.error('Error fetching stats:', { profilesError, gamesError });
      toast.error("Statistikani olishda xatolik");
      return;
    }

    if (profiles) {
      const totalScore = profiles.reduce((sum, p) => sum + (p.total_score || 0), 0);
      const totalProblems = profiles.reduce((sum, p) => sum + (p.total_problems_solved || 0), 0);
      const newUsersToday = profiles.filter(p => p.created_at.startsWith(today)).length;
      const activeToday = profiles.filter(p => p.last_active_date === today).length;

      setStats({
        totalUsers: profiles.length,
        totalProblems,
        totalScore,
        totalGames: gamesCount || 0,
        newUsersToday,
        activeToday,
      });
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setMessageDialogOpen(true);
    if (!message.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', message.id);
      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, is_read: true } : m));
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success("Xabar o'chirildi");
      setMessageDialogOpen(false);
    }
  };

  const openBlogDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setBlogForm({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author,
        read_time: post.read_time,
        icon: post.icon,
        gradient: post.gradient,
        is_published: post.is_published,
      });
    } else {
      setEditingPost(null);
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        category: CATEGORY_OPTIONS[0],
        author: 'IQroMax jamoasi',
        read_time: '5 daqiqa',
        icon: 'BookOpen',
        gradient: GRADIENT_OPTIONS[0].value,
        is_published: false,
      });
    }
    setBlogDialogOpen(true);
  };

  const handleSavePost = async () => {
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }
    setSavingPost(true);
    try {
      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(blogForm).eq('id', editingPost.id);
        if (error) throw error;
        toast.success("Maqola yangilandi");
      } else {
        const { error } = await supabase.from('blog_posts').insert(blogForm);
        if (error) throw error;
        toast.success("Maqola yaratildi");
      }
      setBlogDialogOpen(false);
      fetchBlogPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setSavingPost(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) {
      setBlogPosts(prev => prev.filter(p => p.id !== id));
      toast.success("Maqola o'chirildi");
    }
  };

  const togglePostPublish = async (post: BlogPost) => {
    const { error } = await supabase.from('blog_posts').update({ is_published: !post.is_published }).eq('id', post.id);
    if (!error) {
      setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_published: !p.is_published } : p));
      toast.success(post.is_published ? "Maqola yashirildi" : "Maqola chop etildi");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const unreadCount = messages.filter(m => !m.is_read).length;

  const [activeTab, setActiveTab] = useState('users');

  return (
    <PageBackground className="flex flex-col min-h-screen">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-card/80 dark:bg-card/40 backdrop-blur-xl border-r border-border/40 hidden md:flex flex-col shrink-0">
          <div className="p-6 border-b border-border/20">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Admin Panel
            </h2>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-8">
            {/* Bosh sahifa Group */}
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Bosh sahifa</p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <Users className="w-4 h-4" /> Foydalanuvchilar
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'faq' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <HelpCircle className="w-4 h-4" /> Ko'p beriladigan savollar
                </button>
              </div>
            </div>

            {/* Kontent Group */}
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Kontent</p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <GraduationCap className="w-4 h-4" /> Kurslar
                </button>
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'blog' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <FileText className="w-4 h-4" /> Blog maqolalari
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'files' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <FolderOpen className="w-4 h-4" /> Fayllar
                </button>
              </div>
            </div>

            {/* Statistika Group */}
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Statistika</p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <BarChart2 className="w-4 h-4" /> Hisobotlar
                </button>
                <button
                  onClick={() => setActiveTab('competitions')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'competitions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <Trophy className="w-4 h-4" /> Musobaqalar
                </button>
              </div>
            </div>

            {/* Aloqa Group */}
            <div>
              <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Aloqa</p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <Mail className="w-4 h-4" /> Xabarlar
                  {unreadCount > 0 && <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-[10px]">{unreadCount}</Badge>}
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'chats' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <MessageCircle className="w-4 h-4" /> Chat tarixi
                </button>
                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'testimonials' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <Quote className="w-4 h-4" /> Sharhlar
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'team' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  <Users className="w-4 h-4" /> Jamoa
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 dark:bg-black/20 p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Mobile Navigation - Scrollable Tabs */}
            <div className="md:hidden flex overflow-x-auto pb-4 gap-2 no-scrollbar -mx-4 px-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card/50 text-muted-foreground border border-border/40'}`}
              >
                <Users className="w-3.5 h-3.5" /> Foydalanuvchilar
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'faq' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card/50 text-muted-foreground border border-border/40'}`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> FAQ
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'courses' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card/50 text-muted-foreground border border-border/40'}`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Kurslar
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'blog' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card/50 text-muted-foreground border border-border/40'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Blog
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'messages' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card/50 text-muted-foreground border border-border/40'}`}
              >
                <Mail className="w-3.5 h-3.5" /> Xabarlar {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>

            {/* Content based on activeTab */}
            {activeTab === 'users' && (
              <div className="space-y-8">
                <AdminUserCharts users={users} gameSessions={gameSessions} />
                <Card className="overflow-hidden border-border/40 shadow-xl">
                  <CardHeader className="px-3 sm:px-6 py-3 sm:py-6 bg-card/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl font-black">Foydalanuvchilar</CardTitle>
                        <CardDescription>Platformada ro'yxatdan o'tgan barcha foydalanuvchilar</CardDescription>
                      </div>
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ism yoki telefon raqami..."
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="pl-9 h-11 rounded-xl border-border/40 focus:border-primary/40 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="w-12 font-black">#</TableHead>
                          <TableHead className="font-black">Foydalanuvchi</TableHead>
                          <TableHead className="font-black">Ball / Masala</TableHead>
                          <TableHead className="font-black">Sana</TableHead>
                          <TableHead className="text-right font-black pr-6">Amallar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users
                          .filter((profile) => {
                            if (!userSearchQuery.trim()) return true;
                            const query = userSearchQuery.toLowerCase().replace(/\s/g, '');
                            const username = profile.username.toLowerCase();
                            const phone = (profile.phone_number || '').replace(/\s/g, '').toLowerCase();
                            return username.includes(query) || phone.includes(query);
                          })
                          .map((profile, index) => (
                            <TableRow key={profile.id} className="hover:bg-primary/[0.02]">
                              <TableCell className="font-bold text-muted-foreground">#{index + 1}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold">{profile.username}</span>
                                    {adminUsers.includes(profile.user_id) && (
                                      <Badge variant="default" className="text-[9px] h-4">Admin</Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">{profile.phone_number ? formatPhoneNumber(profile.phone_number) : "Telefon yo'q"}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-black text-primary">{profile.total_score.toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground">{profile.total_problems_solved} masala</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {formatDate(profile.created_at).split(',')[0]}
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => toggleAdminRole(profile.user_id)}>
                                    <ShieldCheck className={`h-4 w-4 ${adminUsers.includes(profile.user_id) ? 'text-primary' : 'text-muted-foreground'}`} />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => setDeleteConfirmDialog({ open: true, userId: profile.user_id, username: profile.username })}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'faq' && <FAQManager />}
            {activeTab === 'reports' && <AdminReports />}
            {activeTab === 'competitions' && <CompetitionsManager />}
            {activeTab === 'courses' && <CourseManager isAdmin={isAdmin} />}
            {activeTab === 'files' && <FileManager isAdmin={isAdmin} />}
            {activeTab === 'testimonials' && <TestimonialsManager />}
            {activeTab === 'team' && <TeamMembersManager />}
            {activeTab === 'chats' && <ChatHistoryManager />}
            {activeTab === 'blog' && (
               <Card className="overflow-hidden border-border/40 shadow-xl">
                 <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card/50">
                   <div>
                     <CardTitle className="text-xl font-black">Blog maqolalari</CardTitle>
                     <CardDescription>Maqolalarni boshqarish va nashr qilish</CardDescription>
                   </div>
                   <Button onClick={() => openBlogDialog()} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl px-6">
                     <Plus className="w-4 h-4 mr-2" /> Yangi maqola
                   </Button>
                 </CardHeader>
                 <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="font-black">Maqola</TableHead>
                          <TableHead className="font-black">Holat</TableHead>
                          <TableHead className="font-black">Muallif</TableHead>
                          <TableHead className="text-right font-black pr-6">Amallar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.map((post) => (
                          <TableRow key={post.id} className="hover:bg-primary/[0.02]">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-bold">{post.title}</span>
                                <span className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={post.is_published ? 'default' : 'secondary'} className="text-[10px]">
                                {post.is_published ? 'Nashr etilgan' : 'Qoralama'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-medium text-muted-foreground">{post.author}</TableCell>
                            <TableCell className="text-right pr-6">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => togglePostPublish(post)}>
                                  {post.is_published ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openBlogDialog(post)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => handleDeletePost(post.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </CardContent>
               </Card>
            )}
            {activeTab === 'messages' && (
              <Card className="overflow-hidden border-border/40 shadow-xl">
                <CardHeader className="p-6 bg-card/50">
                  <CardTitle className="text-xl font-black">Kontakt xabarlari</CardTitle>
                  <CardDescription>Foydalanuvchilardan kelgan xabarlar</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-20">
                      <Mail className="w-16 h-16 mx-auto mb-4 opacity-10 text-primary" />
                      <p className="text-muted-foreground font-bold">Hozircha xabarlar yo'q</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-lg ${message.is_read ? 'bg-card/50 border-border/40' : 'bg-primary/5 border-primary/20 ring-1 ring-primary/10'}`}
                          onClick={() => handleViewMessage(message)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              {!message.is_read && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                              <span className="font-black text-lg">{message.name}</span>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">{formatDate(message.created_at)}</span>
                          </div>
                          <p className="font-bold text-primary mb-1">{message.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Dialogs remain the same... */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-3xl border-border/40">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">{selectedMessage?.subject}</DialogTitle>
            <DialogDescription className="font-bold">{selectedMessage?.name} ({selectedMessage?.email})</DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-2xl bg-muted/30 text-sm leading-relaxed">
              {selectedMessage?.message}
            </div>
            <p className="text-xs font-bold text-muted-foreground text-right">{selectedMessage && formatDate(selectedMessage.created_at)}</p>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => selectedMessage && handleDeleteMessage(selectedMessage.id)} className="w-full rounded-xl font-black h-12">
              <Trash2 className="w-4 h-4 mr-2" /> Xabarni o'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-border/40">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{editingPost ? 'Maqolani tahrirlash' : 'Yangi maqola'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Sarlavha</Label>
              <Input value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="h-12 rounded-xl font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Qisqa tavsif</Label>
              <Textarea value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="rounded-xl font-medium" rows={2} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">To'liq matn</Label>
              <Textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className="rounded-xl font-medium" rows={8} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Kategoriya</Label>
                <Select value={blogForm.category} onValueChange={(v) => setBlogForm({ ...blogForm, category: v })}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {CATEGORY_OPTIONS.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">O'qish vaqti</Label>
                <Input value={blogForm.read_time} onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })} className="h-12 rounded-xl" />
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
              <Switch checked={blogForm.is_published} onCheckedChange={(v) => setBlogForm({ ...blogForm, is_published: v })} />
              <Label className="font-bold cursor-pointer">Maqolani darhol nashr qilish</Label>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setBlogDialogOpen(false)} className="font-bold rounded-xl">Bekor qilish</Button>
            <Button onClick={handleSavePost} disabled={savingPost} className="bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-xl h-12 shadow-lg shadow-primary/20">
              {savingPost ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmDialog.open} onOpenChange={(open) => !open && setDeleteConfirmDialog({ open: false, userId: '', username: '' })}>
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-3xl border-border/40">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-destructive">⚠️ Foydalanuvchini o'chirish</DialogTitle>
            <DialogDescription className="text-base font-medium pt-2">
              <strong>{deleteConfirmDialog.username}</strong> foydalanuvchisini o'chirmoqchimisiz? Barcha ma'lumotlar butunlay yo'qoladi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 mt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirmDialog({ open: false, userId: '', username: '' })} className="font-bold rounded-xl">Bekor qilish</Button>
            <Button variant="destructive" onClick={() => handleDeleteUser(deleteConfirmDialog.userId)} disabled={deletingUser} className="font-black px-6 rounded-xl h-12">
              {deletingUser ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />} Ha, o'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageBackground>
  );
};

export default Admin;
