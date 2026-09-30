import React, { useState } from 'react';
import { 
  FolderOpen, 
  Video, 
  FileText, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ListOrdered,
  X,
  CheckSquare,
  GraduationCap,
  Award,
  Pencil
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

export default function TeacherTrainingAdmin() {
  const [activeTab, setActiveTab] = useState<'modules' | 'videos' | 'tests' | 'exams' | 'graduates'>('modules');

  // MOCK DATA STATES
  const [modules, setModules] = useState<{id: string, name: string}[]>([]);

  React.useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch('/api/courses/modules');
      const data = await res.json();
      setModules(data);
      
      const allVideos: any[] = [];
      const allTests: any[] = [];
      data.forEach((m: any) => {
        if (m.videos) allVideos.push(...m.videos);
        if (m.tests) allTests.push(...m.tests);
      });
      setVideos(allVideos);
      setTests(allTests);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };
  const [videos, setVideos] = useState<{id: string, moduleId: string, name: string, order: number, duration: string}[]>([]);
  const [tests, setTests] = useState<{id: string, moduleId: string, duration: string, order: number, qCount: number}[]>([]);
  const [exams] = useState<{id: string, title: string, duration: string, qCount: number}[]>([]);
  const [graduates] = useState<{id: string, name: string, score: string, date: string}[]>([]);

  // MODAL STATES
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // FORM STATES: Module
  const [moduleName, setModuleName] = useState("");

  // FORM STATES: Video
  const [selectedModuleForVideo, setSelectedModuleForVideo] = useState("");
  const [videoOrder, setVideoOrder] = useState("");
  const [videoName, setVideoName] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // FORM STATES: Test
  const [selectedModuleForTest, setSelectedModuleForTest] = useState("");
  const [testOrder, setTestOrder] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [testTitle, setTestTitle] = useState("");
  
  // Test Questions State
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: [{ id: 1, text: "" }, { id: 2, text: "" }], correctOptionId: 1 }
  ]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    alert((type === 'error' ? 'Xato: ' : 'Muvaffaqiyat: ') + msg);
  };

  // HANDLERS: Module
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleName.trim()) return showToast("Modul nomini kiriting", 'error');
    
    try {
      const res = await fetch('/api/admin/courses/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: moduleName, order: modules.length + 1 })
      });
      if (!res.ok) throw new Error('Xatolik');
      
      const newMod = await res.json();
      setModules([...modules, newMod]);
      setModuleName("");
      setIsModuleModalOpen(false);
      showToast("Modul muvaffaqiyatli qo'shildi!");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!window.confirm('Rostdan ham o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`/api/admin/courses/modules/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xatolik');
      setModules(modules.filter(m => m.id !== id));
      showToast("Modul o'chirildi");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  // HANDLERS: Video
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleForVideo) return showToast("Modulni tanlang", 'error');
    if (!videoName.trim()) return showToast("Video nomini kiriting", 'error');
    if (!videoDuration.trim()) return showToast("Davomiyligini kiriting", 'error');
    if (!videoOrder.trim()) return showToast("Tartib raqamini kiriting", 'error');
    
    const formData = new FormData();
    formData.append('moduleId', selectedModuleForVideo);
    formData.append('name', videoName);
    formData.append('duration', videoDuration);
    formData.append('order', videoOrder);
    formData.append('description', videoDescription);
    if (videoLink) formData.append('videoUrl', videoLink);
    if (pdfFile) formData.append('pdfFile', pdfFile);

    try {
      const isEdit = !!editingVideoId;
      const url = isEdit ? `/api/admin/courses/videos/${editingVideoId}` : '/api/admin/courses/videos';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Xatolik');
      const savedVideo = await res.json();
      
      if (isEdit) {
        setVideos(videos.map(v => v.id === savedVideo.id ? savedVideo : v));
      } else {
        setVideos([...videos, savedVideo]);
      }
      
      setSelectedModuleForVideo("");
      setVideoName("");
      setVideoDuration("");
      setVideoOrder("");
      setVideoDescription("");
      setVideoLink("");
      setPdfFile(null);
      setEditingVideoId(null);
      setIsVideoModalOpen(false);
      showToast(editingVideoId ? "Video muvaffaqiyatli yangilandi!" : "Video muvaffaqiyatli yuklandi!");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  const openEditVideoModal = (video: any) => {
    setEditingVideoId(video.id);
    setSelectedModuleForVideo(video.moduleId);
    setVideoName(video.name || "");
    setVideoDuration(video.duration || "");
    setVideoOrder(video.order?.toString() || "");
    setVideoDescription(video.description || "");
    setVideoLink(video.videoUrl || "");
    setPdfFile(null);
    setIsVideoModalOpen(true);
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Rostdan ham o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`/api/admin/courses/videos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xatolik');
      setVideos(videos.filter(v => v.id !== id));
      showToast("Video o'chirildi");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  // HANDLERS: Test
  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { id: Date.now(), text: "", options: [{ id: Date.now() + 1, text: "" }, { id: Date.now() + 2, text: "" }], correctOptionId: Date.now() + 1 }
    ]);
  };

  const removeQuestion = (qId: number) => {
    if (questions.length === 1) return showToast("Kamida 1 ta savol bo'lishi shart!", 'error');
    setQuestions(questions.filter(q => q.id !== qId));
  };

  const updateQuestionText = (qId: number, text: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, text } : q));
  };

  const addOption = (qId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...q.options, { id: Date.now(), text: "" }] };
      }
      return q;
    }));
  };

  const removeOption = (qId: number, optId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        if (q.options.length <= 2) {
          showToast("Kamida 2 ta variant bo'lishi shart!", 'error');
          return q;
        }
        const newOptions = q.options.filter(o => o.id !== optId);
        return { 
          ...q, 
          options: newOptions,
          correctOptionId: q.correctOptionId === optId ? newOptions[0].id : q.correctOptionId
        };
      }
      return q;
    }));
  };

  const updateOptionText = (qId: number, optId: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: q.options.map(o => o.id === optId ? { ...o, text } : o) };
      }
      return q;
    }));
  };

  const setCorrectOption = (qId: number, optId: number) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, correctOptionId: optId } : q));
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleForTest) return showToast("Modulni tanlang", 'error');
    if (!testTitle.trim()) return showToast("Test nomini kiriting", 'error');
    if (!testOrder.trim()) return showToast("Tartib raqamini kiriting", 'error');
    if (!testDuration.trim()) return showToast("Vaqtni kiriting", 'error');

    for (let i=0; i<questions.length; i++) {
      if (!questions[i].text.trim()) return showToast(`${i+1}-savol matni yo'q!`, 'error');
      for (let j=0; j<questions[i].options.length; j++) {
        if (!questions[i].options[j].text.trim()) return showToast(`${i+1}-savolning ${j+1}-varianti bo'sh!`, 'error');
      }
    }

    const payload = {
      moduleId: selectedModuleForTest,
      title: testTitle,
      duration: testDuration,
      order: parseInt(testOrder),
      questions: questions.map(q => ({
        text: q.text,
        options: q.options.map(o => ({
          text: o.text,
          isCorrect: o.id === q.correctOptionId
        }))
      }))
    };

    try {
      const res = await fetch('/api/admin/courses/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Xatolik');
      const newTest = await res.json();
      
      setTests([...tests, {
        id: newTest.id,
        moduleId: newTest.moduleId,
        duration: newTest.duration,
        order: newTest.order,
        qCount: questions.length
      }]);

      setSelectedModuleForTest("");
      setTestTitle("");
      setTestOrder("");
      setTestDuration("");
      setQuestions([{ id: Date.now(), text: "", options: [{ id: Date.now() + 1, text: "" }, { id: Date.now() + 2, text: "" }], correctOptionId: Date.now() + 1 }]);
      setIsTestModalOpen(false);
      showToast("Test muvaffaqiyatli qo'shildi!");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!window.confirm('Rostdan ham o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`/api/admin/courses/tests/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xatolik');
      setTests(tests.filter(t => t.id !== id));
      showToast("Test o'chirildi");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 text-white pb-20">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">O'qituvchilikka Tayyorlov</h2>
          <p className="text-indigo-200/60 mt-2">Modullar, videolar va testlarni boshqarish paneli</p>
        </div>

        {/* TABS */}
        <div className="flex bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl p-1 w-fit">
          <button 
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'modules' ? 'bg-[#1A1A2F] text-purple-400' : 'text-indigo-200/60 hover:text-white hover:bg-[#121223]'}`}
          >
            <FolderOpen className="w-4 h-4" /> Modullar
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'videos' ? 'bg-[#1A1A2F] text-cyan-400' : 'text-indigo-200/60 hover:text-white hover:bg-[#121223]'}`}
          >
            <Video className="w-4 h-4" /> Video darsliklar
          </button>
          <button 
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'tests' ? 'bg-[#1A1A2F] text-emerald-400' : 'text-indigo-200/60 hover:text-white hover:bg-[#121223]'}`}
          >
            <FileText className="w-4 h-4" /> Testlar
          </button>
          <button 
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'exams' ? 'bg-[#1A1A2F] text-amber-400' : 'text-indigo-200/60 hover:text-white hover:bg-[#121223]'}`}
          >
            <CheckSquare className="w-4 h-4" /> Imtihon
          </button>
          <button 
            onClick={() => setActiveTab('graduates')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'graduates' ? 'bg-[#1A1A2F] text-blue-400' : 'text-indigo-200/60 hover:text-white hover:bg-[#121223]'}`}
          >
            <GraduationCap className="w-4 h-4" /> Tugallagan ustozlar
          </button>
        </div>

        {/* CONTENT: MODULES */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => setIsModuleModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
              >
                <Plus className="w-4 h-4" /> Yangi modul
              </button>
            </div>

            <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
              {modules.map(mod => (
                <div key={mod.id} className="flex items-center justify-between p-5 border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg text-white">{mod.name}</span>
                  </div>
                  <button onClick={() => handleDeleteModule(mod.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {modules.length === 0 && <div className="p-12 text-center text-indigo-200/50 font-medium">Modullar mavjud emas</div>}
            </div>
          </div>
        )}

        {/* CONTENT: VIDEOS */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingVideoId(null);
                  setSelectedModuleForVideo("");
                  setVideoName("");
                  setVideoDuration("");
                  setVideoOrder("");
                  setVideoDescription("");
                  setVideoLink("");
                  setPdfFile(null);
                  setIsVideoModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)]"
              >
                <Upload className="w-4 h-4" /> Video joylash
              </button>
            </div>

            <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
              {videos.map(vid => (
                <div key={vid.id} className="flex items-center justify-between p-5 border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-white block">{vid.name} ({vid.duration})</span>
                      <span className="text-sm text-indigo-200/60">Tartib: {vid.order} • Modul: {modules.find(m => m.id === vid.moduleId)?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditVideoModal(vid)} className="p-3 text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors rounded-xl bg-cyan-500/10">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteVideo(vid.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {videos.length === 0 && <div className="p-12 text-center text-indigo-200/50 font-medium">Videolar mavjud emas</div>}
            </div>
          </div>
        )}

        {/* CONTENT: TESTS */}
        {activeTab === 'tests' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => setIsTestModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)]"
              >
                <Plus className="w-4 h-4" /> Yangi test
              </button>
            </div>

            <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
              {tests.map(test => (
                <div key={test.id} className="flex items-center justify-between p-5 border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-white block">Nazariy test ({test.duration} daqiqa)</span>
                      <span className="text-sm text-indigo-200/60">Tartib: {test.order} • Modul: {modules.find(m => m.id === test.moduleId)?.name} • {test.qCount} ta savol</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTest(test.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {tests.length === 0 && <div className="p-12 text-center text-indigo-200/50 font-medium">Testlar mavjud emas</div>}
            </div>
          </div>
        )}

        {/* CONTENT: EXAMS */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => showToast("Tez orada imtihon yaratish moduli qo'shiladi", 'success')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]"
              >
                <Plus className="w-4 h-4" /> Yangi imtihon
              </button>
            </div>

            <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
              {exams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-5 border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                      <CheckSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-white block">{exam.title} ({exam.duration} daqiqa)</span>
                      <span className="text-sm text-indigo-200/60">{exam.qCount} ta savol</span>
                    </div>
                  </div>
                  <button className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {exams.length === 0 && <div className="p-12 text-center text-indigo-200/50 font-medium">Imtihonlar mavjud emas</div>}
            </div>
          </div>
        )}

        {/* CONTENT: GRADUATES */}
        {activeTab === 'graduates' && (
          <div className="space-y-4">
            <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#1A1A2F] bg-[#121223]/50">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" /> Sertifikat olgan o'qituvchilar
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A2F] text-xs uppercase text-indigo-200/50 bg-[#121223]/30">
                      <th className="p-4 font-semibold">Ism va familiya</th>
                      <th className="p-4 font-semibold">Natija (To'plagan ball)</th>
                      <th className="p-4 font-semibold">Sertifikat sanasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {graduates.map(grad => (
                      <tr key={grad.id} className="border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors text-sm">
                        <td className="p-4 font-medium text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/30">
                            {grad.name.charAt(0)}
                          </div>
                          {grad.name}
                        </td>
                        <td className="p-4 text-emerald-400 font-semibold">{grad.score}</td>
                        <td className="p-4 text-indigo-200/80">{grad.date}</td>
                      </tr>
                    ))}
                    {graduates.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-indigo-200/50 font-medium">Hozircha bitiruvchilar yo'q</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      {/* 1. Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1A1A2F] flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Yangi Modul</h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-indigo-200/50 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddModule} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-200/60 uppercase">Modul nomi</label>
                <input 
                  type="text"
                  placeholder="1-Modul" 
                  value={moduleName} 
                  onChange={e => setModuleName(e.target.value)} 
                  className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button type="submit" className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/20">
                Yaratish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1A1A2F] flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Video Joylash</h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="text-indigo-200/50 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddVideo} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-200/60 uppercase">Modulni tanlang</label>
                <select 
                  value={selectedModuleForVideo} 
                  onChange={e => setSelectedModuleForVideo(e.target.value)}
                  className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="" disabled className="text-indigo-200/30">Modul tanlang</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-200/60 uppercase">Video nomi</label>
                <input 
                  placeholder="Darslik nomi" 
                  value={videoName} 
                  onChange={e => setVideoName(e.target.value)} 
                  className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-200/60 uppercase">Davomiyligi</label>
                <input 
                  type="text" 
                  placeholder="Masalan: 12:30 yoki 12 minut" 
                  value={videoDuration} 
                  onChange={e => setVideoDuration(e.target.value)} 
                  className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-200/60 uppercase">Tafsif</label>
                <textarea 
                  placeholder="Video tafsifi" 
                  value={videoDescription} 
                  onChange={e => setVideoDescription(e.target.value)} 
                  className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl h-24 p-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-200/60 uppercase">Tartib raqami</label>
                <input 
                  type="number" 
                  placeholder="Masalan: 1" 
                  value={videoOrder} 
                  onChange={e => setVideoOrder(e.target.value)} 
                  className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-200/60 uppercase">YouTube Link, Iframe yoki ID</label>
                <input 
                  type="text" 
                  placeholder='Masalan: https://youtu.be/... yoki <iframe...>'
                  value={videoLink}
                  onChange={e => setVideoLink(e.target.value)}
                  className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-200/60 uppercase">PDF Material (Ixtiyoriy)</label>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={e => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full text-indigo-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 cursor-pointer text-sm"
                />
              </div>

              <button type="submit" className="w-full h-12 mt-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/20">
                Joylash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Test Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#1A1A2F] flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-white">Yangi Test Yaratish</h3>
              <button onClick={() => setIsTestModalOpen(false)} className="text-indigo-200/50 hover:text-white"><X className="w-6 h-6"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* General Test Info */}
              <div className="grid grid-cols-2 gap-6 bg-[#121223] p-6 rounded-2xl border border-[#1A1A2F]">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-semibold text-indigo-200/60 uppercase">Modulni tanlang</label>
                  <select 
                    value={selectedModuleForTest} 
                    onChange={e => setSelectedModuleForTest(e.target.value)}
                    className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="" disabled className="text-indigo-200/30">Modul tanlang</option>
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-semibold text-indigo-200/60 uppercase">Test Nomi</label>
                  <input 
                    placeholder="Masalan: Nazariy test" 
                    value={testTitle} 
                    onChange={e => setTestTitle(e.target.value)} 
                    className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-indigo-200/60 uppercase flex items-center gap-1"><ListOrdered className="w-3 h-3" /> Tartib raqami</label>
                  <input 
                    type="number" 
                    placeholder="Masalan: 3" 
                    value={testOrder} 
                    onChange={e => setTestOrder(e.target.value)} 
                    className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-indigo-200/60 uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Vaqt (daqiqa)</label>
                  <input 
                    type="number" 
                    placeholder="Masalan: 10" 
                    value={testDuration} 
                    onChange={e => setTestDuration(e.target.value)} 
                    className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">Savollar</h3>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={q.id} className="bg-[#121223] rounded-2xl border border-[#1A1A2F] p-6 space-y-6 shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <label className="text-sm font-bold text-emerald-400 uppercase tracking-widest">{qIndex + 1}-Savol</label>
                        <textarea 
                          placeholder="Savol matnini kiriting..." 
                          value={q.text}
                          onChange={(e) => updateQuestionText(q.id, e.target.value)}
                          className="w-full rounded-xl min-h-[100px] bg-[#0C0C18] border border-[#1A1A2F] p-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                        />
                      </div>
                      <button onClick={() => removeQuestion(q.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl bg-red-500/10 transition-colors mt-8 shrink-0">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Options */}
                    <div className="space-y-4 pl-4 border-l-2 border-[#1A1A2F]">
                      {q.options.map((opt, optIndex) => (
                        <div key={opt.id} className="flex items-center gap-4">
                          <button 
                            type="button"
                            onClick={() => setCorrectOption(q.id, opt.id)}
                            className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${q.correctOptionId === opt.id ? 'border-emerald-500 bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-indigo-200/20 hover:border-emerald-500/50 bg-[#0C0C18]'}`}
                          >
                            {q.correctOptionId === opt.id && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          
                          <input 
                            placeholder={`Variant ${optIndex + 1}`} 
                            value={opt.text}
                            onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                            className={`flex-1 rounded-xl h-12 px-4 transition-colors focus:outline-none ${q.correctOptionId === opt.id ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100 border' : 'bg-[#0C0C18] border border-[#1A1A2F] text-white placeholder-indigo-200/30 focus:border-emerald-500/50'}`}
                          />
                          
                          <button type="button" onClick={() => removeOption(q.id, opt.id)} className="p-3 text-red-400/70 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-xl shrink-0 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      <button type="button" onClick={() => addOption(q.id)} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold px-4 py-2 hover:bg-emerald-500/10 rounded-xl transition-colors">
                        <Plus className="w-4 h-4" /> Variant qo'shish
                      </button>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addQuestion} className="w-full rounded-2xl border-dashed border-2 border-[#1A1A2F] hover:border-emerald-500/50 h-16 font-bold text-indigo-200/50 hover:text-emerald-400 bg-[#121223] hover:bg-emerald-500/5 flex items-center justify-center gap-2 transition-all">
                  <Plus className="w-5 h-5" /> Yangi savol qo'shish
                </button>
              </div>

            </div>

            <div className="p-6 border-t border-[#1A1A2F] shrink-0 bg-[#0C0C18] rounded-b-2xl">
              <button onClick={handleAddTest} className="w-full rounded-xl h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-colors">
                Testni Yaratish va Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
