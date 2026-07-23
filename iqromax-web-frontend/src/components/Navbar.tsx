import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Volume2, 
  VolumeX, 
  User, 
  LogOut, 
  Home, 
  Settings, 
  Moon, 
  Sun, 
  Trophy, 
  Menu, 
  X, 
  BookOpen, 
  Calculator, 
  ClipboardList, 
  Video,
  LayoutDashboard
} from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar = ({ soundEnabled, onToggleSound }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<{ username: string; avatar_url: string | null; total_score: number } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url, total_score')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string, external = false) => !external && location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: "Asosiy" },
    { path: '/subjects', icon: BookOpen, label: "Fanlar" },
    { path: '/abacus-simulator', icon: Calculator, label: "Abakus" },
    { path: '/train', icon: ClipboardList, label: "Mashqlar" },
    { path: '/tournaments', icon: Trophy, label: "Musobaqalar" },
    { path: '/live', icon: Video, label: "Live" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between relative">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Logo size="xs" />
            </Link>
          </div>
          
          {/* Nav Links - Center */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  if (item.external) {
                    window.location.href = item.path;
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive(item.path, item.external)
                    ? 'text-primary bg-primary/5'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions - Right */}
          <div className="flex items-center gap-2">
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {profile.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{profile.username}</p>
                    <p className="text-xs font-medium text-primary mt-0.5 flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> {profile.total_score} Ball
                    </p>
                  </div>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="py-2.5 cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-emerald-500" />
                      <span className="font-medium">Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="py-2.5 cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-zinc-400" />
                    <span className="font-medium">Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="py-2.5 cursor-pointer text-rose-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-bold">Chiqish</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 py-4 px-4 space-y-1 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                if (item.external) {
                  window.location.href = item.path;
                } else {
                  navigate(item.path);
                }
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-bold transition-all ${
                isActive(item.path, item.external)
                  ? 'bg-primary/10 text-primary'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              <item.icon className="h-5 w-5 opacity-70" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
