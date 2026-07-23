import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { TeacherHero } from './teacher/TeacherHero';
import { TeacherTrustStats } from './teacher/TeacherTrustStats';
import { TeacherWhyChoose } from './teacher/TeacherWhyChoose';
import { TeacherDashboardPanel } from './teacher/TeacherDashboardPanel';
import { TeacherManagement } from './teacher/TeacherManagement';
import { TeacherIncome } from './teacher/TeacherIncome';
import { TeacherTestimonials } from './teacher/TeacherTestimonials';
import { TeacherFAQ } from './teacher/TeacherFAQ';

interface TeacherDashboardProps {
  /** O'qituvchi ismi (agar tashqaridan berilsa) */
  teacherName?: string;
}

/**
 * O'qituvchi sahifasi — reference dizayniga moslangan to'liq landing.
 * Tarkibi:
 *  1) Hero (yashil + rasm + daromad/o'quvchilar/guruhlar floating kartalar)
 *  2) Trust stats (4 ustun)
 *  3) Why choose (6 xususiyat)
 *  4) Katta dashboard paneli (sidebar + KPI + chartlar + ro'yxatlar)
 *  5) Boshqaruv (zaif/top o'quvchilar + materiallar + eslatmalar)
 *  6) Daromad (chart + testimonial)
 *  7) Testimonials
 *  8) FAQ
 */
export const TeacherDashboard = ({ teacherName: overrideName }: TeacherDashboardProps = {}) => {
  const { user } = useAuth();
  const [teacherName, setTeacherName] = useState(overrideName || 'Ustoz');

  useEffect(() => {
    if (overrideName) {
      setTeacherName(overrideName);
      return;
    }
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!cancelled && data) {
        const display = (data as { full_name?: string; username?: string }).full_name
          || (data as { username?: string }).username
          || 'Ustoz';
        setTeacherName(display);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, overrideName]);

  return (
    <div className="space-y-8 sm:space-y-12 py-4 sm:py-6">
      <TeacherHero teacherName={teacherName} />

      <TeacherTrustStats />

      <TeacherWhyChoose />

      <TeacherDashboardPanel teacherName={teacherName} />

      <TeacherManagement />

      <TeacherIncome />

      <TeacherTestimonials />

      <TeacherFAQ />
    </div>
  );
};
