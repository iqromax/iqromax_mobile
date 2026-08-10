import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Trash2, Video, Plus, Play, MessageCircle, Camera, Link as LinkIcon, CheckCircle2, Upload } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

type MissionType = 'YOUTUBE' | 'TELEGRAM' | 'INSTAGRAM';

interface Mission {
  id: string;
  type: MissionType;
  title: string;
  link: string | null;
  fileUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function EnergyCenter() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Video state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isVideoDeleting, setIsVideoDeleting] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missionType, setMissionType] = useState<MissionType>('YOUTUBE');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [missionsRes, videoRes] = await Promise.all([
        fetch('/api/admin/missions'),
        fetch('/api/ad-video')
      ]);
      
      if (missionsRes.ok) {
        const missionsData = await missionsRes.json();
        setMissions(missionsData);
      }
      
      if (videoRes.ok) {
        const videoData = await videoRes.json();
        setVideoUrl(videoData.url);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Iltimos, faqat video fayl yuklang.');
      return;
    }

    setIsVideoUploading(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/admin/ad-video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setVideoUrl(data.url);
        if (videoFileInputRef.current) videoFileInputRef.current.value = '';
      } else {
        alert('Video yuklashda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Video yuklashda xatolik yuz berdi');
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleVideoDelete = async () => {
    if (!confirm('Haqiqatan ham joriy videoni o\'chirmoqchimisiz?')) return;

    setIsVideoDeleting(true);
    try {
      const response = await fetch('/api/admin/ad-video', {
        method: 'DELETE',
      });
      if (response.ok) {
        setVideoUrl(null);
      } else {
        alert('O\'chirishda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('O\'chirishda xatolik yuz berdi');
    } finally {
      setIsVideoDeleting(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Sarlavhani kiriting!");
      return;
    }
    if (!link.trim()) {
      alert("Havolani (Link) kiriting!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('type', missionType);
    formData.append('title', title);
    if (link) formData.append('link', link);

    try {
      const response = await fetch('/api/admin/missions', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchData();
      } else {
        alert('Missiya qo\'shishda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Missiya qo\'shishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setLink('');

    setMissionType('YOUTUBE');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haqiqatan ham bu missiyani o\'chirmoqchimisiz?')) return;

    try {
      const response = await fetch(`/api/admin/missions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMissions(missions.filter(m => m.id !== id));
      } else {
        alert('O\'chirishda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('O\'chirishda xatolik yuz berdi');
    }
  };
  
  const getMissionIcon = (type: MissionType) => {
    switch (type) {
      case 'YOUTUBE': return <Play className="w-5 h-5 text-red-500" />;
      case 'TELEGRAM': return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'INSTAGRAM': return <Camera className="w-5 h-5 text-pink-500" />;
      default: return <LinkIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* VIDEO AD SECTION */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Energiya markazi (Reklama Videosi)</h1>
            <p className="text-indigo-200/60">
              Mobil ilovadagi Energiya markazida ko'rsatiladigan reklamani boshqarish. Foydalanuvchilar videoni ko'rib 1 energiya olishadi. Faqat bitta reklama videoni joylash mumkin.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64 border border-[#1A1A2F] rounded-2xl bg-[#0A0A16]">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl p-8 shadow-xl">
              {videoUrl ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <Video className="w-6 h-6" />
                      <span className="font-medium">Faol reklama mavjud</span>
                    </div>
                    <button
                      onClick={handleVideoDelete}
                      disabled={isVideoDeleting}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isVideoDeleting ? 'O\'chirilmoqda...' : 'Joriy videoni o\'chirish'}
                    </button>
                  </div>

                  <div className="aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-black border border-[#1A1A2F]">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                    <PlayCircle className="w-10 h-10 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Hozircha reklama yo'q</h3>
                    <p className="text-indigo-200/60 max-w-md mx-auto">
                      Yangi reklama videosini yuklash uchun quyidagi tugmani bosing. Tavsiya etilgan uzunlik: 30 soniyadan 1 daqiqagacha.
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    ref={videoFileInputRef}
                    onChange={handleVideoFileChange}
                  />

                  <button
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={isVideoUploading}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5" />
                    {isVideoUploading ? 'Yuklanmoqda...' : 'Reklama joylashtirish'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-px bg-[#1A1A2F] w-full my-8"></div>

        {/* MISSIONS SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Energiya markazi: Missiyalar</h1>
              <p className="text-indigo-200/60">
                Foydalanuvchilarga energiya beruvchi qoshimcha missiyalarni qo'shish va boshqarish.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Missiya qo'shish
            </button>
          </div>

          {!isLoading && (
            <div className="bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl overflow-hidden shadow-xl">
              {missions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#121223] border-b border-[#1A1A2F]">
                        <th className="px-6 py-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider">Turi</th>
                        <th className="px-6 py-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider">Sarlavha</th>
                        <th className="px-6 py-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider">Manzil (Link / Fayl)</th>
                        <th className="px-6 py-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider">Sana</th>
                        <th className="px-6 py-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A2F]">
                      {missions.map((mission) => (
                        <tr key={mission.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-[#121223] border border-[#1A1A2F]">
                                {getMissionIcon(mission.type)}
                              </div>
                              <span className="text-sm font-medium text-white">
                                {mission.type === 'YOUTUBE' ? 'YouTube' :
                                 mission.type === 'TELEGRAM' ? 'Telegram' : 'Instagram'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-white font-medium">{mission.title}</div>
                          </td>
                          <td className="px-6 py-4">
                            {mission.link ? (
                              <a href={mission.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-400 hover:underline">
                                <LinkIcon className="w-3 h-3" /> Linkni ochish
                              </a>
                            ) : mission.fileUrl ? (
                              <span className="text-sm text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Fayl biriktirilgan
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {new Date(mission.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete(mission.id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                    <PlayCircle className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Hozircha missiyalar yo'q</h3>
                    <p className="text-sm text-indigo-200/60 max-w-sm mx-auto">
                      Foydalanuvchilarga yangi missiyalar taqdim etish uchun "Missiya qo'shish" tugmasini bosing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ADD MISSION MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-[#0A0A16] border border-[#1A1A2F] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#1A1A2F] flex justify-between items-center bg-[#121223]">
                <h3 className="text-lg font-bold text-white">Yangi missiya qo'shish</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Missiya turi</label>
                  <select 
                    value={missionType} 
                    onChange={(e) => setMissionType(e.target.value as MissionType)}
                    className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="YOUTUBE">YouTube Video Link</option>
                    <option value="TELEGRAM">Telegram Kanalga Obuna</option>
                    <option value="INSTAGRAM">Instagram Sahifaga Obuna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sarlavha (Ilovada ko'rinadi)</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: 30 soniyalik video ko'ring"
                    className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Manzil (URL Link)</label>
                    <input 
                      type="url" 
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder={
                        missionType === 'TELEGRAM' ? "https://t.me/iqromaxuz" :
                        missionType === 'INSTAGRAM' ? "https://instagram.com/iqromaxuz" :
                        "https://youtube.com/watch?v=..."
                      }
                      className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-[#121223] text-gray-300 rounded-xl font-medium hover:bg-[#1A1A2F] transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saqlanmoqda...</>
                    ) : (
                      'Saqlash'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
