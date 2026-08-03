import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Upload, Trash2, Video } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

export default function EnergyCenter() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVideoStatus();
  }, []);

  const fetchVideoStatus = async () => {
    try {
      const response = await fetch('/api/ad-video');
      if (response.ok) {
        const data = await response.json();
        setVideoUrl(data.url);
      }
    } catch (error) {
      console.error('Error fetching video status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('mp4')) {
      alert('Iltimos, mobil ilovada ko\'rsatilishi uchun faqat MP4 (.mp4) formatidagi video yuklang!');
      return;
    }

    setIsUploading(true);
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
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert('Video yuklashda xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Video yuklashda xatolik yuz berdi');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Haqiqatan ham joriy videoni o\'chirmoqchimisiz?')) return;

    setIsDeleting(true);
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
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Energiya markazi (Reklama)</h1>
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
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'O\'chirilmoqda...' : 'Joriy videoni o\'chirish'}
                  </button>
                </div>
                
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#1A1A2F]">
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
                    Yangi reklama videosini yuklash uchun quyidagi tugmani bosing. Tavsiya etilgan uzunlik: 30 soniyadan 1 daqiqagacha.<br/>
                    <strong className="text-yellow-400">Diqqat: Ilovada ko'rinishi uchun faqat MP4 (.mp4) video yuklang!</strong>
                  </p>
                </div>
                
                <input 
                  type="file" 
                  accept="video/mp4" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                  {isUploading ? 'Yuklanmoqda...' : 'Reklama joylashtirish'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
