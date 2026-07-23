import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Youtube,
  Heart,
  MessageSquare
} from 'lucide-react';
import { FeedbackDialog } from './FeedbackDialog';

const footerLinks = {
  platform: [
    { label: 'Bosh sahifa', href: '/' },
    { label: 'Mashq qilish', href: '/train' },
    { label: 'Savol-javoblar', href: '/faq' },
  ],
  support: [
    { label: 'Biz haqimizda', href: '/about' },
    { label: 'Maxfiylik siyosati', href: '/privacy' },
    { label: 'Foydalanish shartlari', href: '/terms' },
  ],
};

const socialLinks = [
  { icon: MessageCircle, href: 'https://t.me/mentalarifmetika_uz', label: 'Telegram' },
  { icon: Instagram, href: 'https://instagram.com/iqromaxcom', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@iqromaxcom', label: 'YouTube' },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Logo size="xs" />
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
              Mental arifmetika olamida eng yetakchi va innovatsion platforma. 
              Intellektual salohiyat sari biz bilan birga.
            </p>
            <div className="flex gap-5 text-zinc-400">
              {socialLinks.map((social) => (
                <social.icon key={social.label} className="w-5 h-5" />
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] mb-8">Platforma</h4>
            <ul className="space-y-5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm font-bold">
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] mb-8">Yordam</h4>
            <ul className="space-y-5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm font-bold">
                    {link.label}
                  </span>
                </li>
              ))}
              <li>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm font-bold">
                  Fikr va mulohaza
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] mb-8">Bog'lanish</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">info@iqromax.uz</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">+998 99 005 30 00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-xs font-medium">
            © {currentYear} IQroMax Inc. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">With Love</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
