import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Filter
} from 'lucide-react';
import { blogPosts } from '@/data/blogData';
import { useState, useEffect } from 'react';
import api, { getImageUrl } from '@/lib/axios';

const Blogs = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('blogs/');
        setBlogs(res.data);
      } catch (err) {
        console.error("Xatolik yangiliklarni yuklashda:", err);
      }
    };
    fetchBlogs();
  }, []);

  // Filter based on search query
  const activeBlogsList = blogs.length > 0 ? blogs : blogPosts;
  const filteredBlogs = activeBlogsList.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-emerald-500/10 selection:text-emerald-600">
      <Navbar soundEnabled={false} onToggleSound={() => {}} />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER SECTION */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black tracking-widest mb-6 uppercase"
            >
              Ma'lumotlar bazasi
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6"
            >
              Barcha <span className="text-emerald-500">yangiliklar</span> va bloglar
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 text-sm md:text-base font-medium max-w-2xl mx-auto mb-10"
            >
              IQROMAX platformasining eng so'nggi yangiliklari, metodik qo'llanmalar va ta'lim sohasidagi foydali maqolalar to'plami.
            </motion.p>

            {/* SEARCH & FILTER BAR */}
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Maqolalarni qidirish..." 
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm outline-none"
                />
              </div>
              <Button variant="outline" className="h-12 rounded-2xl border-zinc-200 px-6 gap-2 font-bold text-sm">
                <Filter className="w-4 h-4" /> Saralash
              </Button>
            </div>
          </div>

          {/* BLOG GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentPosts.map((post, i) => {
              const isDb = !!post.slug;
              const idOrSlug = isDb ? post.slug : post.id;
              const dateText = isDb ? new Date(post.created_at).toLocaleDateString() : post.date;
              const excerptText = isDb ? (post.content ? post.content.slice(0, 100) + '...' : '') : post.excerpt;
              const authorImageSrc = isDb && post.author_image ? getImageUrl(post.author_image) : `https://i.pravatar.cc/100?u=${post.author}`;

              return (
                <motion.article
                  key={post.id || idOrSlug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/blog/${idOrSlug}`)}
                  className="group cursor-pointer bg-white rounded-[32px] overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-200/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden bg-zinc-100">
                    <img 
                      src={getImageUrl(post.image)} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md text-[10px] font-black uppercase text-emerald-600 tracking-wider shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-zinc-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateText}
                    </div>
                    <h3 className="text-xl font-black mb-3 text-zinc-900 group-hover:text-emerald-500 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {excerptText}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                          <img src={authorImageSrc} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-black text-zinc-700">{post.author}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/5 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-12 h-12 rounded-2xl border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${
                  currentPage === i + 1 
                  ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-900/20' 
                  : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <Button 
              variant="outline" 
              size="icon" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-12 h-12 rounded-2xl border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blogs;
