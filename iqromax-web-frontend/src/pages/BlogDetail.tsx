import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  Share2, 
  Bookmark, 
  Clock, 
  ArrowRight, 
  Sparkles,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Send,
  Search
} from 'lucide-react';
import { blogPosts } from '@/data/blogData';
import { useEffect, useState } from 'react';
import api, { getImageUrl } from '@/lib/axios';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState<any[]>([]);

  // Scroll to top and fetch post on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`blogs/${id}/`);
        setPost(res.data);
      } catch (err) {
        console.warn("API load failed or slug not found, falling back to local mock data.");
        const local = blogPosts.find(p => String(p.id) === id || p.slug === id);
        setPost(local || null);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('blogs/');
        setAllBlogs(res.data);
      } catch (e) {
        setAllBlogs([]);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-bold text-sm">Maqola yuklanmoqda...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center p-12 rounded-[40px] bg-white shadow-2xl border border-zinc-100 max-w-sm">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-black mb-4 text-zinc-900">Maqola topilmadi</h1>
          <p className="text-zinc-500 text-sm mb-8">Siz qidirayotgan maqola o'chirilgan yoki manzili o'zgargan bo'lishi mumkin.</p>
          <Button onClick={() => navigate('/blogs')} className="w-full h-12 rounded-2xl bg-zinc-900 text-white font-bold">Barcha bloglar</Button>
        </div>
      </div>
    );
  }

  // Recommendations (exclude current post)
  const activeBlogsList = allBlogs.length > 0 ? allBlogs : blogPosts;
  const recommendations = activeBlogsList.filter(p => (p.slug || String(p.id)) !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-emerald-500/10 selection:text-emerald-600">
      <Navbar soundEnabled={false} onToggleSound={() => {}} />
      
      <main className="pt-24 pb-32">
        <div className="container max-w-5xl mx-auto px-6">
          {/* NAVIGATION & ACTIONS */}
          <div className="flex items-center justify-between mb-12">
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/blogs')}
              className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:border-zinc-900 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">Orqaga qaytish</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-zinc-100 hover:bg-zinc-900 hover:text-white transition-all">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-zinc-100 hover:bg-zinc-900 hover:text-white transition-all">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* LEFT SIDEBAR - AUTHOR & SOCIAL */}
            <aside className="lg:col-span-1 hidden lg:block sticky top-32 h-fit">
              <div className="flex flex-col gap-6 items-center">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500 p-0.5 overflow-hidden flex items-center justify-center bg-zinc-50">
                  {post.author_image || post.authorImage ? (
                    <img src={getImageUrl(post.author_image || post.authorImage)} alt={post.author} className="w-full h-full rounded-full object-cover" />
                  ) : <User className="w-5 h-5 text-zinc-400" />}
                </div>
                <div className="h-12 w-[1px] bg-zinc-100" />
                <button className="text-zinc-400 hover:text-[#1877F2] transition-colors"><Facebook className="w-5 h-5" /></button>
                <button className="text-zinc-400 hover:text-[#1DA1F2] transition-colors"><Twitter className="w-5 h-5" /></button>
                <button className="text-zinc-400 hover:text-[#0A66C2] transition-colors"><Linkedin className="w-5 h-5" /></button>
                <button className="text-zinc-400 hover:text-[#0088CC] transition-colors"><Send className="w-5 h-5" /></button>
              </div>
            </aside>

            {/* MAIN ARTICLE CONTENT */}
            <div className="lg:col-span-11 max-w-3xl">
              {/* Header */}
              <header className="mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-black tracking-widest mb-8 uppercase"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {post.category}
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight text-zinc-900"
                >
                  {post.title}
                </motion.h1>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-8 text-zinc-400 text-sm font-bold"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : post.date}
                  </div>
                  <div className="flex items-center gap-2.5 text-emerald-600 bg-emerald-500/5 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4" />
                    {post.read_time || post.readTime || "5 min"} o'qish
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-200 flex items-center justify-center bg-zinc-50">
                       {post.author_image || post.authorImage ? (
                         <img src={getImageUrl(post.author_image || post.authorImage)} alt={post.author} className="w-full h-full object-cover" />
                       ) : <User className="w-3 h-3 text-zinc-400" />}
                    </div>
                    {post.author}
                  </div>
                </motion.div>
              </header>

              {/* Featured Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative h-[300px] md:h-[540px] rounded-[48px] overflow-hidden mb-16 shadow-2xl shadow-zinc-200/50"
              >
                <img 
                  src={getImageUrl(post.image)} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Body Content */}
              <article className="mb-20">
                {post.content.split('\n\n').map((paragraph: string, i: number) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-600 text-lg md:text-xl leading-relaxed mb-8 font-medium first-letter:text-4xl first-letter:font-black first-letter:text-emerald-500 first-letter:mr-1"
                  >
                    {paragraph.trim()}
                  </motion.p>
                ))}
              </article>

              {/* Tags Section */}
              <div className="flex flex-wrap gap-3 mb-24">
                {(post.hashtags ? post.hashtags.split(' ').map((t: string) => t.replace('#', '')).filter(Boolean) : (post.tags || [])).map((tag: string, i: number) => (
                  <button key={i} className="px-5 py-2.5 rounded-2xl bg-white border border-zinc-100 text-zinc-500 text-sm font-bold hover:border-emerald-500 hover:text-emerald-600 transition-all">
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Recommendations Section */}
              <div className="mt-24 border-t border-zinc-100 pt-16">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                    Sizga <span className="text-emerald-500">tavsiya</span> etiladi
                  </h3>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/blogs')}
                    className="text-zinc-500 hover:text-emerald-600 font-bold gap-2 group"
                  >
                    Barchasini ko'rish <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {recommendations.map((rec, i) => {
                    const recIdOrSlug = rec.slug || rec.id;
                    return (
                      <motion.div
                        key={rec.id || recIdOrSlug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => navigate(`/blog/${recIdOrSlug}`)}
                        className="group cursor-pointer"
                      >
                        <div className="relative h-40 rounded-3xl overflow-hidden mb-4 shadow-lg shadow-zinc-200/50">
                          <img 
                            src={rec.image} 
                            alt={rec.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[8px] font-black uppercase text-emerald-600 tracking-wider">
                            {rec.category}
                          </div>
                        </div>
                        <h4 className="text-sm font-black text-zinc-900 group-hover:text-emerald-500 transition-colors line-clamp-2 leading-tight mb-2">
                          {rec.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                          <Calendar className="w-3 h-3" />
                          {rec.created_at ? new Date(rec.created_at).toLocaleDateString() : rec.date}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Newsletter Block */}
              <div className="mt-12 p-10 rounded-[48px] bg-emerald-500 text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4">Yangiliklardan xabardor bo'ling</h3>
                  <p className="text-white/80 text-sm font-medium mb-8 max-w-md">Mental arifmetika olamidagi eng so'nggi xabarlar va foydali maslahatlarni bevosita pochtangizga oling.</p>
                  <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder="Email manzilingiz" 
                      className="flex-1 h-14 rounded-2xl bg-white text-zinc-900 px-6 outline-none font-bold text-sm sm:text-base"
                    />
                    <Button className="h-14 w-full sm:w-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
                      <span className="sm:hidden mr-2">Yuborish</span>
                      <ArrowRight className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
