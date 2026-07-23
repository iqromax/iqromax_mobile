import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageBackground } from '@/components/layout/PageBackground';
import { Navbar } from '@/components/Navbar';
import { useSound } from '@/hooks/useSound';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  Smile,
  MessageCircle,
  CheckCheck,
  Check,
  Phone,
  Video,
  MoreVertical,
  Filter,
  Plus,
  Star,
  Pin,
  Bell,
  BellOff,
  ImageIcon,
  Mic,
  Users2,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';

type Role = 'parent' | 'teacher' | 'student' | 'admin';

interface Conversation {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  pinned?: boolean;
  starred?: boolean;
  muted?: boolean;
  typing?: boolean;
}

interface Message {
  id: string;
  authorId: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  isMine: boolean;
}

type FilterTab = 'all' | 'unread' | 'pinned' | 'parents' | 'teachers' | 'students';

const ROLE_CONFIG: Record<Role, { label: string; bg: string; fg: string; icon: typeof Users2 }> = {
  parent: { label: 'Ota-ona', bg: 'bg-orange-100 dark:bg-orange-900/40', fg: 'text-orange-600', icon: Users2 },
  teacher: { label: 'Trener', bg: 'bg-emerald-100 dark:bg-emerald-900/40', fg: 'text-emerald-600', icon: GraduationCap },
  student: { label: "O'quvchi", bg: 'bg-blue-100 dark:bg-blue-900/40', fg: 'text-blue-600', icon: Users2 },
  admin: { label: 'Admin', bg: 'bg-purple-100 dark:bg-purple-900/40', fg: 'text-purple-600', icon: ShieldCheck },
};

const Messages = () => {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const { soundEnabled, toggleSound } = useSound();

  // Mock conversations (kelajakda Supabase'dan olinadi)
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Madina Karimova',
      role: 'parent',
      avatar: '🧕',
      lastMessage: "Salom ustoz! Farzandimning bugungi darsi qanday o'tdi?",
      lastTime: '5 daq oldin',
      unread: 2,
      online: true,
      pinned: true,
      typing: true,
    },
    {
      id: '2',
      name: 'Asadbek Abduazizov',
      role: 'student',
      avatar: '🧒',
      lastMessage: 'Vazifani yubordim, tekshirib bering iltimos.',
      lastTime: '12 daq oldin',
      unread: 1,
      online: true,
      starred: true,
    },
    {
      id: '3',
      name: "Bahromjon Qodirov",
      role: 'teacher',
      avatar: '👨‍🏫',
      lastMessage: "5-A guruh uchun yangi materiallarni yukladim.",
      lastTime: '1 soat oldin',
      unread: 0,
      online: false,
    },
    {
      id: '4',
      name: 'Dilfuza Ismoilova',
      role: 'teacher',
      avatar: '🧕',
      lastMessage: 'Rahmat juda foydali maslahat berdingiz!',
      lastTime: '3 soat oldin',
      unread: 0,
      online: true,
    },
    {
      id: '5',
      name: 'Sanjar Toshpulatov',
      role: 'parent',
      avatar: '👨',
      lastMessage: "O'g'limning streak'i shunchalik o'sdiki, ajoyib!",
      lastTime: 'Kecha',
      unread: 0,
      online: false,
      starred: true,
    },
    {
      id: '6',
      name: 'IQROMAX Admin',
      role: 'admin',
      avatar: '🛡️',
      lastMessage: "Yangi yangilanish: AI tahlili 2.0 chiqdi.",
      lastTime: '2 kun oldin',
      unread: 0,
      online: true,
      muted: true,
    },
    {
      id: '7',
      name: "Sevinch Rahimova",
      role: 'student',
      avatar: '👧',
      lastMessage: "Ustoz, men mashqlarni tugatdim 🎉",
      lastTime: '3 kun oldin',
      unread: 0,
      online: false,
    },
  ]);

  const [activeId, setActiveId] = useState<string>('1');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId);

  // Mock messages for active conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      authorId: '1',
      text: "Salom ustoz! Farzandim bugun darsda qanday qatnashdi?",
      time: '14:20',
      status: 'read',
      isMine: false,
    },
    {
      id: 'm2',
      authorId: 'me',
      text: "Salom Madina opa! Asadbek bugun juda yaxshi qatnashdi. 92% aniqlik bilan barcha mashqlarni bajardi.",
      time: '14:23',
      status: 'read',
      isMine: true,
    },
    {
      id: 'm3',
      authorId: 'me',
      text: "Tez hisoblash bo'yicha 3 yangi mavzuni o'zlashtirdi. Davom eting!",
      time: '14:23',
      status: 'read',
      isMine: true,
    },
    {
      id: 'm4',
      authorId: '1',
      text: "Ajoyib yangiliklar! Uy vazifasi bormi?",
      time: '14:25',
      status: 'read',
      isMine: false,
    },
    {
      id: 'm5',
      authorId: 'me',
      text: "Ha, men hozir yuboraman. 10 ta mashq, taxminan 20-25 daqiqa.",
      time: '14:26',
      status: 'delivered',
      isMine: true,
    },
    {
      id: 'm6',
      authorId: '1',
      text: "Salom ustoz! Farzandimning bugungi darsi qanday o'tdi?",
      time: '14:30',
      status: 'sent',
      isMine: false,
    },
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeId]);

  // Filter conversations
  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
          !c.lastMessage.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filter === 'unread' && c.unread === 0) return false;
      if (filter === 'pinned' && !c.pinned) return false;
      if (filter === 'parents' && c.role !== 'parent') return false;
      if (filter === 'teachers' && c.role !== 'teacher') return false;
      if (filter === 'students' && c.role !== 'student') return false;
      return true;
    });
  }, [conversations, search, filter]);

  // Sort: pinned first, then by recency (mock)
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }, [filtered]);

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  const sendMessage = () => {
    if (!draft.trim()) return;
    const newMsg: Message = {
      id: `m${messages.length + 1}`,
      authorId: 'me',
      text: draft,
      time: format(new Date(), 'HH:mm'),
      status: 'sent',
      isMine: true,
    };
    setMessages([...messages, newMsg]);
    setDraft('');
  };

  const filters: { id: FilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'Hammasi', count: conversations.length },
    { id: 'unread', label: "O'qilmagan", count: totalUnread },
    { id: 'pinned', label: 'Pin', count: conversations.filter((c) => c.pinned).length },
    { id: 'parents', label: 'Ota-onalar', count: conversations.filter((c) => c.role === 'parent').length },
    { id: 'teachers', label: 'Trenerlar', count: conversations.filter((c) => c.role === 'teacher').length },
    { id: 'students', label: "O'quvchilar", count: conversations.filter((c) => c.role === 'student').length },
  ];

  return (
    <PageBackground className="min-h-screen pb-20 sm:pb-24 bg-gradient-to-br from-emerald-50/40 via-background to-amber-50/30 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/20">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <div className="container px-3 sm:px-6 py-5 sm:py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 h-9 px-3 -ml-1 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Orqaga</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-sm">
            <MessageCircle className="h-3 w-3" />
            XABARLAR
            {totalUnread > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[9px] font-black">
                {totalUnread}
              </span>
            )}
          </span>
        </div>

        {/* MAIN — 2 col layout (chat list + chat view) */}
        <div className="rounded-3xl bg-card border border-border/40 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-[340px_1fr] min-h-[calc(100vh-220px)]">
          {/* CHAT LIST (chap) */}
          <aside className="border-b lg:border-b-0 lg:border-r border-border/40 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="font-display font-black text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-emerald-500" />
                    Xabarlar
                  </h1>
                  <p className="text-[11px] text-muted-foreground">
                    {conversations.length} ta suhbat
                    {totalUnread > 0 && <> · <span className="text-emerald-600 font-bold">{totalUnread} ta yangi</span></>}
                  </p>
                </div>
                <button
                  className="h-9 w-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm transition-colors"
                  aria-label="Yangi xabar"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Suhbat yoki xabar qidirish..."
                  className="w-full h-9 pl-8 pr-3 rounded-lg bg-secondary/50 border border-border/40 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all"
                />
              </div>

              {/* Filter pills */}
              <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      filter === f.id
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Filter className="h-2.5 w-2.5" />
                    {f.label}
                    {f.count !== undefined && f.count > 0 && (
                      <span className={`text-[9px] font-black px-1.5 rounded-full ${
                        filter === f.id ? 'bg-white/25' : 'bg-background'
                      }`}>
                        {f.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
              {sorted.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto opacity-40 mb-2" />
                  <p className="text-xs">Suhbat topilmadi</p>
                </div>
              ) : (
                <ul>
                  {sorted.map((c) => {
                    const roleCfg = ROLE_CONFIG[c.role];
                    const isActive = c.id === activeId;
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => setActiveId(c.id)}
                          className={`w-full text-left flex items-start gap-3 px-3 py-3 border-l-2 transition-colors ${
                            isActive
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500'
                              : 'border-transparent hover:bg-secondary/50'
                          }`}
                        >
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className={`h-11 w-11 rounded-full flex items-center justify-center text-base shadow-sm ${roleCfg.bg}`}>
                              {c.avatar}
                            </div>
                            {c.online && (
                              <span className="absolute bottom-0 right-0 flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-card" />
                              </span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="text-sm font-bold truncate">{c.name}</span>
                                {c.pinned && <Pin className="h-2.5 w-2.5 text-emerald-500 flex-shrink-0" fill="currentColor" />}
                                {c.starred && <Star className="h-2.5 w-2.5 text-amber-400 flex-shrink-0" fill="currentColor" />}
                                {c.muted && <BellOff className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />}
                              </div>
                              <span className="text-[10px] text-muted-foreground flex-shrink-0">{c.lastTime}</span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-[11px] truncate ${
                                c.unread > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                              }`}>
                                {c.typing ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold italic">
                                    <span className="flex gap-0.5">
                                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </span>
                                    yozmoqda...
                                  </span>
                                ) : (
                                  c.lastMessage
                                )}
                              </p>
                              {c.unread > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex-shrink-0">
                                  {c.unread}
                                </span>
                              )}
                            </div>

                            {/* Role badge */}
                            <div className="mt-1">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${roleCfg.bg} ${roleCfg.fg}`}>
                                <roleCfg.icon className="h-2 w-2" />
                                {roleCfg.label}
                              </span>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          {/* CHAT VIEW (o'ng) */}
          {active ? (
            <div className="flex flex-col bg-secondary/10">
              {/* Chat header */}
              <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-card border-b border-border/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-base ${ROLE_CONFIG[active.role].bg}`}>
                      {active.avatar}
                    </div>
                    {active.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm sm:text-base truncate">{active.name}</div>
                    <div className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                      {active.online ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Hozir online
                        </>
                      ) : (
                        <>So'nggi marta yaqinda</>
                      )}
                      <span>·</span>
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded ${ROLE_CONFIG[active.role].bg} ${ROLE_CONFIG[active.role].fg} font-bold`}>
                        {ROLE_CONFIG[active.role].label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-colors" aria-label="Qo'ng'iroq">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-colors" aria-label="Video">
                    <Video className="h-4 w-4" />
                  </button>
                  <button className="h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-colors" aria-label="Bildirishnoma">
                    {active.muted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  </button>
                  <button className="h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-colors" aria-label="Boshqa">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3">
                {/* Date separator */}
                <div className="flex items-center justify-center my-2">
                  <div className="px-3 py-1 rounded-full bg-secondary/70 text-[10px] font-semibold text-muted-foreground">
                    Bugun
                  </div>
                </div>

                {messages.map((msg, i) => {
                  const prevMsg = messages[i - 1];
                  const isFirstInGroup = !prevMsg || prevMsg.isMine !== msg.isMine;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-2' : 'mt-0.5'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[80%] sm:max-w-[70%] ${msg.isMine ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar (only for first in group, not mine) */}
                        {isFirstInGroup && !msg.isMine ? (
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${ROLE_CONFIG[active.role].bg}`}>
                            {active.avatar}
                          </div>
                        ) : (
                          <div className="w-7 flex-shrink-0" />
                        )}

                        {/* Bubble */}
                        <div
                          className={`group rounded-2xl px-3.5 py-2 shadow-sm ${
                            msg.isMine
                              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-md'
                              : 'bg-card text-foreground border border-border/40 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm leading-snug whitespace-pre-wrap break-words">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 text-[9px] ${
                            msg.isMine ? 'text-white/70 justify-end' : 'text-muted-foreground'
                          }`}>
                            <span>{msg.time}</span>
                            {msg.isMine && (
                              <>
                                {msg.status === 'read' ? (
                                  <CheckCheck className="h-3 w-3 text-amber-300" />
                                ) : msg.status === 'delivered' ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {active.typing && (
                  <div className="flex justify-start mt-2">
                    <div className="flex items-end gap-2">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${ROLE_CONFIG[active.role].bg}`}>
                        {active.avatar}
                      </div>
                      <div className="bg-card border border-border/40 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="bg-card border-t border-border/40 p-3 sm:p-4">
                <div className="flex items-end gap-2">
                  <button
                    className="h-10 w-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-colors flex-shrink-0"
                    aria-label="Fayl biriktirish"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  <div className="flex-1 relative bg-secondary/50 rounded-2xl border border-border/40 focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Xabar yozing..."
                      rows={1}
                      className="w-full bg-transparent border-0 text-sm leading-snug px-3 py-2.5 resize-none focus:outline-none placeholder:text-muted-foreground"
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                    <div className="absolute right-2 bottom-1.5 flex items-center gap-0.5">
                      <button className="h-7 w-7 rounded-lg hover:bg-background flex items-center justify-center text-muted-foreground hover:text-amber-500 transition-colors" aria-label="Emoji">
                        <Smile className="h-3.5 w-3.5" />
                      </button>
                      <button className="h-7 w-7 rounded-lg hover:bg-background flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-colors" aria-label="Rasm">
                        <ImageIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {draft.trim() ? (
                    <button
                      onClick={sendMessage}
                      className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 transition-colors flex-shrink-0"
                      aria-label="Yuborish"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      className="h-10 w-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-emerald-600 transition-colors flex-shrink-0"
                      aria-label="Ovozli xabar"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center text-center text-muted-foreground p-8">
              <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-3">
                <MessageCircle className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="font-display font-bold text-base mb-1">Suhbat tanlang</h3>
              <p className="text-xs max-w-xs">Chap tomondagi ro'yxatdan kim bilan suhbatlashmoqchi ekaningizni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  );
};

export default Messages;
