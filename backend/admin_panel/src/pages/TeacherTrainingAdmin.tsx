import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
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
  const [activeTab, setActiveTab] = useState<'modules' | 'videos' | 'tests' | 'exams' | 'graduates' | 'guides'>('modules');

  // MOCK DATA STATES
  const [modules, setModules] = useState<{id: string, name: string}[]>([]);

  React.useEffect(() => {
    fetchModules();
    fetchEnrollments();
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/courses/exams');
      const data = await res.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch('/api/admin/courses/enrollments');
      const data = await res.json();
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetch('/api/courses/modules');
      const data = await res.json();
      setModules(data);
      
      const allVideos: any[] = [];
      const allTests: any[] = [];
      const allGuides: any[] = [];
      data.forEach((m: any) => {
        if (m.videos) allVideos.push(...m.videos);
        if (m.tests) allTests.push(...m.tests);
        if (m.guides) allGuides.push(...m.guides);
      });
      setVideos(allVideos);
      setTests(allTests);
      setGuides(allGuides);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };
  const [videos, setVideos] = useState<{id: string, moduleId: string, name: string, order: number, duration: string}[]>([]);
  const [tests, setTests] = useState<{id: string, moduleId: string, duration: string, order: number, qCount: number, title?: string, testType?: string, practicalOp?: string, practicalDigits?: string, practicalCount?: number}[]>([]);
  const [guides, setGuides] = useState<{id: string, moduleId: string, title: string, order: number, content: string}[]>([]);
  const [exams, setExams] = useState<{id: string, title: string, duration: string, qCount: number, practicalOp?: string, practicalDigits?: string, practicalCount?: number, questions?: any[]}[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [teachersSubTab, setTeachersSubTab] = useState<'in_progress' | 'completed'>('in_progress');

  // MODAL STATES
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);

  // FORM STATES: Module
  const [moduleName, setModuleName] = useState("");
  const [moduleOrder, setModuleOrder] = useState("");

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
  const [practicalOp, setPracticalOp] = useState("oddiy");
  const [practicalDigits, setPracticalDigits] = useState("1");
  const [practicalCount, setPracticalCount] = useState("7");
  
  // FORM STATES: Guide
  const [selectedModuleForGuide, setSelectedModuleForGuide] = useState("");
  const [guideTitle, setGuideTitle] = useState("");
  const [guideContent, setGuideContent] = useState("");
  const [guideOrder, setGuideOrder] = useState("");

  const [testSubTab, setTestSubTab] = useState<'theory' | 'practical'>('theory');

  // Exam State
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [examPracticalOp, setExamPracticalOp] = useState("oddiy");
  const [examPracticalDigits, setExamPracticalDigits] = useState("1");
  const [examPracticalCount, setExamPracticalCount] = useState("7");
  const [examSubTab, setExamSubTab] = useState<'theory' | 'practical'>('theory');
  const [examQuestions, setExamQuestions] = useState([
    { id: 1, text: "", options: [{ id: 1, text: "" }, { id: 2, text: "" }], correctOptionId: 1 }
  ]);

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
      const isEdit = !!editingModuleId;
      const url = isEdit ? `/api/admin/courses/modules/${editingModuleId}` : '/api/admin/courses/modules';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: moduleName, order: parseInt(moduleOrder) || (modules.length + 1) })
      });
      if (!res.ok) throw new Error('Xatolik');
      
      const savedMod = await res.json();
      if (isEdit) {
        setModules(modules.map(m => m.id === savedMod.id ? savedMod : m));
      } else {
        setModules([...modules, savedMod]);
      }
      setModuleName("");
      setModuleOrder("");
      setEditingModuleId(null);
      setIsModuleModalOpen(false);
      showToast(isEdit ? "Modul muvaffaqiyatli yangilandi!" : "Modul muvaffaqiyatli qo'shildi!");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  const openEditModuleModal = (mod: any) => {
    setEditingModuleId(mod.id);
    setModuleName(mod.name || "");
    setModuleOrder(mod.order?.toString() || "");
    setIsModuleModalOpen(true);
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

  // HANDLERS: Guide
  const handleAddGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleForGuide) return showToast("Modulni tanlang", 'error');
    if (!guideTitle.trim()) return showToast("Qo'llanma nomini kiriting", 'error');
    if (!guideOrder.trim()) return showToast("Tartib raqamini kiriting", 'error');
    
    try {
      const isEdit = !!editingGuideId;
      const url = isEdit ? `/api/admin/courses/guides/${editingGuideId}` : '/api/admin/courses/guides';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModuleForGuide,
          title: guideTitle,
          content: guideContent,
          order: parseInt(guideOrder)
        })
      });
      if (!res.ok) throw new Error('Xatolik');
      
      const savedGuide = await res.json();
      if (isEdit) {
        setGuides(guides.map(g => g.id === savedGuide.id ? savedGuide : g));
      } else {
        setGuides([...guides, savedGuide]);
      }
      
      setSelectedModuleForGuide("");
      setGuideTitle("");
      setGuideContent("");
      setGuideOrder("");
      setEditingGuideId(null);
      setIsGuideModalOpen(false);
      showToast(isEdit ? "Qo'llanma muvaffaqiyatli yangilandi!" : "Qo'llanma muvaffaqiyatli qo'shildi!");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  const openEditGuideModal = (guide: any) => {
    setEditingGuideId(guide.id);
    setSelectedModuleForGuide(guide.moduleId);
    setGuideTitle(guide.title || "");
    setGuideContent(guide.content || "");
    setGuideOrder(guide.order?.toString() || "");
    setIsGuideModalOpen(true);
  };

  const handleDeleteGuide = async (id: string) => {
    if (!window.confirm('Rostdan ham o\'chirmoqchimisiz?')) return;
    try {
      const res = await fetch(`/api/admin/courses/guides/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xatolik');
      setGuides(guides.filter(g => g.id !== id));
      showToast("Qo'llanma o'chirildi");
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
    
    if (testSubTab === 'theory') {
      if (!testDuration.trim()) return showToast("Vaqtni kiriting", 'error');
      for (let i=0; i<questions.length; i++) {
        if (!questions[i].text.trim()) return showToast(`${i+1}-savol matni yo'q!`, 'error');
        for (let j=0; j<questions[i].options.length; j++) {
          if (!questions[i].options[j].text.trim()) return showToast(`${i+1}-savolning ${j+1}-varianti bo'sh!`, 'error');
        }
      }
    }

    const payload = {
      moduleId: selectedModuleForTest,
      title: testTitle,
      duration: testSubTab === 'theory' ? testDuration : "",
      order: parseInt(testOrder),
      testType: testSubTab,
      practicalOp: testSubTab === 'practical' ? practicalOp : undefined,
      practicalDigits: testSubTab === 'practical' ? practicalDigits : undefined,
      practicalCount: testSubTab === 'practical' ? practicalCount : undefined,
      questions: testSubTab === 'theory' ? questions.map(q => ({
        text: q.text,
        options: q.options.map(o => ({
          text: o.text,
          isCorrect: o.id === q.correctOptionId
        }))
      })) : []
    };

    try {
      const isEdit = !!editingTestId;
      const url = isEdit ? `/api/admin/courses/tests/${editingTestId}` : '/api/admin/courses/tests';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Xatolik');
      const savedTest = await res.json();
      
      const formattedTest = {
        id: savedTest.id,
        moduleId: savedTest.moduleId,
        duration: savedTest.duration,
        order: savedTest.order,
        qCount: testSubTab === 'theory' ? questions.length : 0,
        title: savedTest.title || testTitle,
        testType: savedTest.testType || testSubTab,
        practicalOp: savedTest.practicalOp || practicalOp,
        practicalDigits: savedTest.practicalDigits || practicalDigits,
        practicalCount: savedTest.practicalCount || parseInt(practicalCount)
      };

      if (isEdit) {
        setTests(tests.map(t => t.id === savedTest.id ? formattedTest : t));
      } else {
        setTests([...tests, formattedTest]);
      }

      setSelectedModuleForTest("");
      setTestTitle("");
      setTestOrder("");
      setTestDuration("");
      setQuestions([{ id: Date.now(), text: "", options: [{ id: Date.now() + 1, text: "" }, { id: Date.now() + 2, text: "" }], correctOptionId: Date.now() + 1 }]);
      setEditingTestId(null);
      setIsTestModalOpen(false);
      showToast(isEdit ? "Test muvaffaqiyatli yangilandi!" : "Test muvaffaqiyatli qo'shildi!");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  const openEditTestModal = async (testId: string) => {
    try {
      const res = await fetch(`/api/courses/tests/${testId}`);
      if (!res.ok) throw new Error('Testni yuklashda xatolik');
      const testData = await res.json();

      setEditingTestId(testData.id);
      setSelectedModuleForTest(testData.moduleId || "");
      setTestTitle(testData.title || "");
      setTestDuration(testData.duration || "");
      setTestOrder(testData.order?.toString() || "");
      
      if (testData.questions && testData.questions.length > 0) {
        setQuestions(testData.questions.map((q: any, qIdx: number) => {
          const correctOpt = q.options.find((o: any) => o.isCorrect) || q.options[0];
          return {
            id: q.id || (Date.now() + qIdx),
            text: q.text || "",
            options: q.options.map((o: any, oIdx: number) => ({
              id: o.id || (Date.now() + qIdx * 10 + oIdx),
              text: o.text || ""
            })),
            correctOptionId: correctOpt.id || (Date.now() + qIdx * 10)
          };
        }));
      } else {
        setQuestions([{ id: Date.now(), text: "", options: [{ id: Date.now() + 1, text: "" }, { id: Date.now() + 2, text: "" }], correctOptionId: Date.now() + 1 }]);
      }

      setIsTestModalOpen(true);
    } catch (error) {
      showToast("Test ma'lumotlarini yuklashda xatolik", 'error');
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

  // HANDLERS: Exam
  const addExamQuestion = () => {
    setExamQuestions([...examQuestions, {
      id: Date.now(), text: "", options: [{ id: 1, text: "" }, { id: 2, text: "" }], correctOptionId: 1
    }]);
  };

  const removeExamQuestion = (id: number) => {
    if (examQuestions.length <= 1) return showToast("Kamida 1 ta savol bo'lishi shart!", 'error');
    setExamQuestions(examQuestions.filter(q => q.id !== id));
  };

  const addExamOption = (qId: number) => {
    setExamQuestions(examQuestions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...q.options, { id: Date.now(), text: "" }] };
      }
      return q;
    }));
  };

  const removeExamOption = (qId: number, optId: number) => {
    setExamQuestions(examQuestions.map(q => {
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

  const updateExamOptionText = (qId: number, optId: number, text: string) => {
    setExamQuestions(examQuestions.map(q => {
      if (q.id === qId) {
        return { ...q, options: q.options.map(o => o.id === optId ? { ...o, text } : o) };
      }
      return q;
    }));
  };

  const setCorrectExamOption = (qId: number, optId: number) => {
    setExamQuestions(examQuestions.map(q => q.id === qId ? { ...q, correctOptionId: optId } : q));
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return showToast("Imtihon nomini kiriting", 'error');
    if (!examDuration.trim()) return showToast("Umumiy vaqtni kiriting", 'error');
    
    for (let i=0; i<examQuestions.length; i++) {
      if (!examQuestions[i].text.trim()) return showToast(`${i+1}-savol matni yo'q!`, 'error');
      for (let j=0; j<examQuestions[i].options.length; j++) {
        if (!examQuestions[i].options[j].text.trim()) return showToast(`${i+1}-savolning ${j+1}-varianti bo'sh!`, 'error');
      }
    }

    const payload = {
      title: examTitle,
      duration: examDuration,
      practicalOp: examPracticalOp,
      practicalDigits: examPracticalDigits,
      practicalCount: examPracticalCount,
      questions: examQuestions.map(q => ({
        question: q.text,
        options: q.options.map(o => o.text),
        answer: q.options.find(o => o.id === q.correctOptionId)?.text || q.options[0].text
      }))
    };

    try {
      const isEdit = !!editingExamId;
      const url = isEdit ? `/api/admin/courses/exams/${editingExamId}` : '/api/admin/courses/exams';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Xatolik');
      const savedExam = await res.json();
      
      const formattedExam = {
        id: savedExam.id,
        title: savedExam.title,
        duration: savedExam.duration,
        qCount: savedExam.questions?.length || 0,
        practicalOp: savedExam.practicalOp,
        practicalDigits: savedExam.practicalDigits,
        practicalCount: savedExam.practicalCount,
        questions: savedExam.questions
      };

      if (isEdit) {
        setExams(exams.map(e => e.id === savedExam.id ? formattedExam : e));
      } else {
        setExams([...exams, formattedExam]);
      }

      setExamTitle("");
      setExamDuration("");
      setExamQuestions([{ id: 1, text: "", options: [{ id: 1, text: "" }, { id: 2, text: "" }], correctOptionId: 1 }]);
      setIsExamModalOpen(false);
      setEditingExamId(null);
      showToast(isEdit ? "Imtihon muvaffaqiyatli yangilandi!" : "Imtihon muvaffaqiyatli qo'shildi!");
    } catch (error) {
      showToast("Server xatosi", 'error');
    }
  };

  const openEditExamModal = (exam: any) => {
    setEditingExamId(exam.id);
    setExamTitle(exam.title || "");
    setExamDuration(exam.duration || "");
    setExamPracticalOp(exam.practicalOp || "oddiy");
    setExamPracticalDigits(exam.practicalDigits || "1");
    setExamPracticalCount(exam.practicalCount?.toString() || "7");
    
    if (exam.questions && exam.questions.length > 0) {
      setExamQuestions(exam.questions.map((q: any, idx: number) => {
        const options = q.options.map((opt: string, oIdx: number) => ({ id: oIdx + 1, text: opt }));
        const correctOpt = options.find((o: any) => o.text === q.answer) || options[0];
        return {
          id: idx + 1,
          text: q.question,
          options,
          correctOptionId: correctOpt.id
        };
      }));
    } else {
      setExamQuestions([{ id: 1, text: "", options: [{ id: 1, text: "" }, { id: 2, text: "" }], correctOptionId: 1 }]);
    }
    
    setIsExamModalOpen(true);
  };

  const handleDeleteExam = async (id: string) => {
    if (!window.confirm("Rostdan ham ushbu imtihonni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/courses/exams/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xato');
      setExams(exams.filter(e => e.id !== id));
      showToast("Imtihon o'chirildi!");
    } catch (error) {
      showToast("Xatolik yuz berdi", 'error');
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
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-sm ${activeTab === 'guides' ? 'bg-[#1A1A2F] text-pink-400' : 'text-indigo-200/60 hover:text-white hover:bg-[#121223]'}`}
          >
            <FileText className="w-4 h-4" /> Qo'llanma darsliklar
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
            <GraduationCap className="w-4 h-4" /> Ustozlar
          </button>
        </div>

        {/* CONTENT: MODULES */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingModuleId(null);
                  setModuleName("");
                  setModuleOrder("");
                  setIsModuleModalOpen(true);
                }}
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
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModuleModal(mod)} className="p-3 text-purple-400 hover:text-white hover:bg-purple-500/20 transition-colors rounded-xl bg-purple-500/10">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteModule(mod.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
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

        {/* CONTENT: GUIDES */}
        {activeTab === 'guides' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingGuideId(null);
                  setSelectedModuleForGuide("");
                  setGuideTitle("");
                  setGuideOrder("");
                  setGuideContent("");
                  setIsGuideModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(219,39,119,0.3)]"
              >
                <Plus className="w-4 h-4" /> Qo'llanma qo'shish
              </button>
            </div>

            <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
              {guides.map(guide => (
                <div key={guide.id} className="flex items-center justify-between p-5 border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-white block">{guide.title}</span>
                      <span className="text-sm text-indigo-200/60">Tartib: {guide.order} • Modul: {modules.find(m => m.id === guide.moduleId)?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditGuideModal(guide)} className="p-3 text-pink-400 hover:text-white hover:bg-pink-500/20 transition-colors rounded-xl bg-pink-500/10">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteGuide(guide.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {guides.length === 0 && <div className="p-12 text-center text-indigo-200/50 font-medium">Qo'llanmalar mavjud emas</div>}
            </div>
          </div>
        )}

        {/* CONTENT: TESTS */}
        {activeTab === 'tests' && (
          <div className="space-y-4">
            
            {/* Sub-tabs for Tests */}
            <div className="flex gap-4 border-b border-[#1A1A2F] pb-4 mb-4">
              <button 
                onClick={() => setTestSubTab('theory')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${testSubTab === 'theory' ? 'bg-emerald-500/20 text-emerald-400' : 'text-indigo-200/50 hover:text-indigo-200 hover:bg-[#1A1A2F]'}`}
              >
                Nazariy testlar
              </button>
              <button 
                onClick={() => setTestSubTab('practical')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${testSubTab === 'practical' ? 'bg-emerald-500/20 text-emerald-400' : 'text-indigo-200/50 hover:text-indigo-200 hover:bg-[#1A1A2F]'}`}
              >
                Amaliy testlar
              </button>
            </div>

            {testSubTab === 'theory' ? (
              <>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setEditingTestId(null);
                      setSelectedModuleForTest("");
                      setTestTitle("");
                      setTestOrder("");
                      setTestDuration("");
                      setQuestions([{ id: Date.now(), text: "", options: [{ id: Date.now() + 1, text: "" }, { id: Date.now() + 2, text: "" }], correctOptionId: Date.now() + 1 }]);
                      setIsTestModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)]"
                  >
                    <Plus className="w-4 h-4" /> Yangi nazariy test
                  </button>
                </div>

                <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
                  {tests.filter(t => t.testType === 'theory' || !t.testType).map(test => (
                    <div key={test.id} className="flex items-center justify-between p-5 border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-semibold text-lg text-white block">{test.title} ({test.duration} daqiqa)</span>
                          <span className="text-sm text-indigo-200/60">Tartib: {test.order} • Modul: {modules.find(m => m.id === test.moduleId)?.name} • {test.qCount} ta savol</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditTestModal(test.id)} className="p-3 text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-colors rounded-xl bg-emerald-500/10">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteTest(test.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {tests.filter(t => t.testType === 'theory' || !t.testType).length === 0 && <div className="p-12 text-center text-indigo-200/50 font-medium">Nazariy testlar mavjud emas</div>}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setEditingTestId(null);
                      setSelectedModuleForTest("");
                      setTestTitle("");
                      setTestOrder("");
                      setPracticalOp("oddiy");
                      setPracticalDigits("1");
                      setPracticalCount("7");
                      setIsTestModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)]"
                  >
                    <Plus className="w-4 h-4" /> Yangi amaliy test
                  </button>
                </div>

                <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
                  {tests.filter(t => t.testType === 'practical').map(test => (
                    <div key={test.id} className="flex items-center justify-between p-5 border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                          <ListOrdered className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-semibold text-lg text-white block">{test.title}</span>
                          <span className="text-sm text-indigo-200/60">Tartib: {test.order} • Modul: {modules.find(m => m.id === test.moduleId)?.name} • {test.practicalCount} ta misol, {test.practicalOp}, {test.practicalDigits} xonali</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => {
                          setEditingTestId(test.id);
                          setSelectedModuleForTest(test.moduleId);
                          setTestTitle(test.title || "");
                          setTestOrder(test.order?.toString() || "");
                          setPracticalOp(test.practicalOp || "oddiy");
                          setPracticalDigits(test.practicalDigits || "1");
                          setPracticalCount(test.practicalCount?.toString() || "7");
                          setIsTestModalOpen(true);
                        }} className="p-3 text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-colors rounded-xl bg-emerald-500/10">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteTest(test.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {tests.filter(t => t.testType === 'practical').length === 0 && <div className="p-12 text-center text-indigo-200/50 font-medium">Amaliy testlar mavjud emas</div>}
                </div>
              </>
            )}
          </div>
        )}

        {/* CONTENT: EXAMS */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingExamId(null);
                  setExamTitle("");
                  setExamDuration("");
                  setExamPracticalOp("oddiy");
                  setExamPracticalDigits("1");
                  setExamPracticalCount("7");
                  setExamQuestions([{ id: 1, text: "", options: [{ id: 1, text: "" }, { id: 2, text: "" }], correctOptionId: 1 }]);
                  setIsExamModalOpen(true);
                }}
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
                      <span className="text-sm text-indigo-200/60">
                        Nazariy: {exam.qCount} savol • Amaliy: {exam.practicalCount} ta misol ({exam.practicalOp}, {exam.practicalDigits} xonali)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditExamModal(exam)} className="p-3 text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-colors rounded-xl bg-emerald-500/10">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteExam(exam.id)} className="p-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors rounded-xl bg-red-500/10">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {exams.length === 0 && <div className="p-12 text-center text-indigo-200/50 font-medium">Imtihonlar mavjud emas</div>}
            </div>
          </div>
        )}

        {/* CONTENT: TEACHERS */}
        {activeTab === 'graduates' && (
          <div className="space-y-4">
            
            <div className="flex gap-2 p-1 bg-[#0C0C18] border border-[#1A1A2F] rounded-xl w-fit">
              <button 
                onClick={() => setTeachersSubTab('in_progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${teachersSubTab === 'in_progress' ? 'bg-[#1A1A2F] text-blue-400' : 'text-indigo-200/60 hover:text-white'}`}
              >
                Ustozlar (Jarayonda)
              </button>
              <button 
                onClick={() => setTeachersSubTab('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${teachersSubTab === 'completed' ? 'bg-[#1A1A2F] text-emerald-400' : 'text-indigo-200/60 hover:text-white'}`}
              >
                Tugallagan ustozlar
              </button>
            </div>

            <div className="bg-[#0C0C18] border border-[#1A1A2F] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#1A1A2F] bg-[#121223]/50">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" /> {teachersSubTab === 'in_progress' ? 'Hozirda o\'qiyotganlar' : 'Sertifikat olgan o\'qituvchilar'}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A2F] text-xs uppercase text-indigo-200/50 bg-[#121223]/30">
                      <th className="p-4 font-semibold">Ism va familiya</th>
                      <th className="p-4 font-semibold">Natija (Progress)</th>
                      <th className="p-4 font-semibold">Yozilgan sana</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.filter(e => teachersSubTab === 'in_progress' ? e.progress < 100 : e.progress >= 100).map(grad => (
                      <tr key={grad.id} className="border-b border-[#1A1A2F] last:border-0 hover:bg-[#121223] transition-colors text-sm">
                        <td className="p-4 font-medium text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/30">
                            {grad.name.charAt(0)}
                          </div>
                          {grad.name}
                        </td>
                        <td className="p-4 text-emerald-400 font-semibold">{grad.progress}%</td>
                        <td className="p-4 text-indigo-200/80">{new Date(grad.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {enrollments.filter(e => teachersSubTab === 'in_progress' ? e.progress < 100 : e.progress >= 100).length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-indigo-200/50 font-medium">Hozircha ma'lumot yo'q</td>
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
                
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-semibold text-indigo-200/60 uppercase flex items-center gap-1"><ListOrdered className="w-3 h-3" /> Tartib raqami</label>
                  <input 
                    type="number" 
                    placeholder="Masalan: 3" 
                    value={testOrder} 
                    onChange={e => setTestOrder(e.target.value)} 
                    className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {testSubTab === 'theory' ? (
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-semibold text-indigo-200/60 uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Vaqt (daqiqa)</label>
                    <input 
                      type="number" 
                      placeholder="Masalan: 10" 
                      value={testDuration} 
                      onChange={e => setTestDuration(e.target.value)} 
                      className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-indigo-200/60 uppercase flex items-center gap-1">Misol turi</label>
                      <select 
                        value={practicalOp} 
                        onChange={e => setPracticalOp(e.target.value)}
                        className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="oddiy">Oddiy</option>
                        <option value="formula5">Formula 5</option>
                        <option value="formula10">Formula 10</option>
                        <option value="aralash">Aralash</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-indigo-200/60 uppercase flex items-center gap-1">Nechi xonalik</label>
                      <select 
                        value={practicalDigits} 
                        onChange={e => setPracticalDigits(e.target.value)}
                        className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="1">1 xonali</option>
                        <option value="2">2 xonali</option>
                        <option value="3">3 xonali</option>
                        <option value="4">4 xonali</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-semibold text-indigo-200/60 uppercase flex items-center gap-1">Misollar soni</label>
                      <input 
                        type="number" 
                        placeholder="Masalan: 10" 
                        value={practicalCount} 
                        onChange={e => setPracticalCount(e.target.value)} 
                        className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl h-12 px-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </>
                )}
              </div>

              {testSubTab === 'theory' && (
              <div className="space-y-6">
                {/* Questions Section */}
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
              )}

            </div>

            <div className="p-6 border-t border-[#1A1A2F] shrink-0 bg-[#0C0C18] rounded-b-2xl">
              <button onClick={handleAddTest} className="w-full rounded-xl h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-colors">
                Testni Yaratish va Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
      {/* GUIDE MODAL */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0C0C18] w-full max-w-3xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-[#1A1A2F]">
            <div className="flex items-center justify-between px-8 h-20 shrink-0 border-b border-[#1A1A2F] bg-[#121223]">
              <div>
                <h3 className="text-2xl font-black text-white">Qo'llanma Yaratish</h3>
                <p className="text-sm text-indigo-200/50">Yangi darslik uchun qo'llanmani sozlang</p>
              </div>
              <button onClick={() => setIsGuideModalOpen(false)} className="w-10 h-10 rounded-full bg-[#1A1A2F] hover:bg-pink-500 hover:text-white flex items-center justify-center transition-all text-indigo-200/50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-pink-400 uppercase tracking-widest block mb-2">Qaysi modulga?</label>
                  <select 
                    value={selectedModuleForGuide}
                    onChange={(e) => setSelectedModuleForGuide(e.target.value)}
                    className="w-full rounded-xl h-14 px-4 bg-[#121223] border border-[#1A1A2F] text-white focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="">Modulni tanlang</option>
                    {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-pink-400 uppercase tracking-widest block mb-2">Qo'llanma Nomi</label>
                    <input 
                      placeholder="Qo'llanma nomi..." 
                      value={guideTitle}
                      onChange={(e) => setGuideTitle(e.target.value)}
                      className="w-full rounded-xl h-14 px-4 bg-[#121223] border border-[#1A1A2F] text-white placeholder-indigo-200/30 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-pink-400 uppercase tracking-widest block mb-2">Tartib Raqami</label>
                    <input 
                      placeholder="1, 2..." 
                      type="number"
                      value={guideOrder}
                      onChange={(e) => setGuideOrder(e.target.value)}
                      className="w-full rounded-xl h-14 px-4 bg-[#121223] border border-[#1A1A2F] text-white placeholder-indigo-200/30 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-pink-400 uppercase tracking-widest block mb-2">Tavsif (Rich Text)</label>
                  <div className="bg-white rounded-xl text-black">
                    <ReactQuill 
                      theme="snow" 
                      value={guideContent} 
                      onChange={setGuideContent} 
                      className="rounded-xl overflow-hidden"
                      style={{ height: '300px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#1A1A2F] shrink-0 bg-[#0C0C18] rounded-b-2xl mt-10">
              <button onClick={handleAddGuide} className="w-full rounded-xl h-14 bg-pink-600 hover:bg-pink-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(219,39,119,0.3)] transition-colors">
                Qo'llanmani Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXAM MODAL */}
      {isExamModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121223] w-full max-w-4xl rounded-3xl border border-[#1A1A2F] shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#1A1A2F] flex items-center justify-between sticky top-0 bg-[#121223] z-10 rounded-t-3xl">
              <h3 className="text-2xl font-bold text-white">{editingExamId ? "Imtihonni tahrirlash" : "Yangi imtihon qo'shish"}</h3>
              <button onClick={() => setIsExamModalOpen(false)} className="p-2 text-indigo-200/60 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>



            <div className="p-6 overflow-y-auto flex-1">
              <form id="examForm" onSubmit={handleAddExam} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-indigo-200/80 mb-2">Imtihon nomi</label>
                    <input 
                      type="text" 
                      value={examTitle}
                      onChange={e => setExamTitle(e.target.value)}
                      placeholder="Masalan: Yakuniy Imtihon"
                      className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo-200/80 mb-2">Umumiy davomiyligi (daqiqa)</label>
                    <input 
                      type="text" 
                      value={examDuration}
                      onChange={e => setExamDuration(e.target.value)}
                      placeholder="Masalan: 60"
                      className="w-full bg-[#0C0C18] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Questions Section */}
                  <div className="space-y-8">
                    {examQuestions.map((q, qIndex) => (
                      <div key={q.id} className="bg-[#0C0C18] p-6 rounded-2xl border border-[#1A1A2F] relative group">
                        <button 
                          type="button" 
                          onClick={() => removeExamQuestion(q.id)}
                          className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-bold text-amber-400 mb-2">{qIndex + 1}-savol</label>
                          <input 
                            type="text" 
                            value={q.text}
                            onChange={(e) => {
                              setExamQuestions(examQuestions.map(ques => ques.id === q.id ? { ...ques, text: e.target.value } : ques));
                            }}
                            placeholder="Savol matnini kiriting"
                            className="w-full bg-[#121223] border border-[#1A1A2F] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                            required
                          />
                        </div>

                        <div className="space-y-3 pl-4 border-l-2 border-[#1A1A2F]">
                          {q.options.map((opt, optIndex) => (
                            <div key={opt.id} className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setCorrectExamOption(q.id, opt.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${q.correctOptionId === opt.id ? 'border-amber-400 bg-amber-400/20 text-amber-400' : 'border-[#1A1A2F] text-transparent hover:border-amber-400/50'}`}
                              >
                                <div className={`w-2.5 h-2.5 rounded-full ${q.correctOptionId === opt.id ? 'bg-amber-400' : 'bg-transparent'}`} />
                              </button>
                              
                              <input 
                                type="text" 
                                value={opt.text}
                                onChange={(e) => updateExamOptionText(q.id, opt.id, e.target.value)}
                                placeholder={`${optIndex + 1}-variant`}
                                className={`w-full bg-[#121223] border rounded-lg px-3 py-2 text-white focus:outline-none ${q.correctOptionId === opt.id ? 'border-amber-500/50' : 'border-[#1A1A2F] focus:border-indigo-500/50'}`}
                                required
                              />
                              
                              <button type="button" onClick={() => removeExamOption(q.id, opt.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          <button type="button" onClick={() => addExamOption(q.id)} className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium mt-2">
                            <Plus className="w-4 h-4" /> Variant qo'shish
                          </button>
                        </div>
                      </div>
                    ))}

                    <button type="button" onClick={addExamQuestion} className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#1A1A2F] rounded-2xl text-indigo-200/60 hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all">
                      <Plus className="w-5 h-5" /> Yangi savol qo'shish
                    </button>
                  </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#1A1A2F] sticky bottom-0 bg-[#121223] rounded-b-3xl">
              <button type="submit" form="examForm" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                <CheckCircle2 className="w-5 h-5" /> Saqlash va {editingExamId ? 'Yangilash' : 'Yaratish'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
