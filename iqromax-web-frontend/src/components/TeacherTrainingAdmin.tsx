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
  ListOrdered
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

export const TeacherTrainingAdmin = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'videos' | 'tests'>('modules');

  // MOCK DATA STATES
  const [modules, setModules] = useState<{id: string, name: string}[]>([
    { id: '1', name: "1-Modul: Iqromax metodikasi" },
    { id: '2', name: "2-Modul: Bolalar psixologiyasi" }
  ]);
  const [videos, setVideos] = useState<{id: string, moduleId: string, name: string, order: number}[]>([
    { id: '1', moduleId: '1', name: "Iqromax tizimi nima?", order: 1 }
  ]);
  const [tests, setTests] = useState<{id: string, moduleId: string, duration: string, order: number, qCount: number}[]>([
    { id: '1', moduleId: '1', duration: "10", order: 3, qCount: 10 }
  ]);

  // MODAL STATES
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // FORM STATES: Module
  const [moduleName, setModuleName] = useState("");

  // FORM STATES: Video
  const [selectedModuleForVideo, setSelectedModuleForVideo] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoOrder, setVideoOrder] = useState("");
  const [videoName, setVideoName] = useState("");

  // FORM STATES: Test
  const [selectedModuleForTest, setSelectedModuleForTest] = useState("");
  const [testOrder, setTestOrder] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [testTitle, setTestTitle] = useState("");
  
  // Test Questions State
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: [{ id: 1, text: "" }, { id: 2, text: "" }], correctOptionId: 1 }
  ]);

  // HANDLERS: Module
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleName.trim()) return toast.error("Modul nomini kiriting");
    setModules([...modules, { id: Date.now().toString(), name: moduleName }]);
    setModuleName("");
    setIsModuleModalOpen(false);
    toast.success("Modul muvaffaqiyatli qo'shildi!");
  };

  // HANDLERS: Video
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleForVideo) return toast.error("Modulni tanlang");
    if (!videoName.trim()) return toast.error("Video nomini kiriting");
    if (!videoOrder.trim()) return toast.error("Tartib raqamini kiriting");
    
    setVideos([...videos, {
      id: Date.now().toString(),
      moduleId: selectedModuleForVideo,
      name: videoName,
      order: parseInt(videoOrder)
    }]);
    
    setSelectedModuleForVideo("");
    setVideoFile(null);
    setVideoName("");
    setVideoOrder("");
    setIsVideoModalOpen(false);
    toast.success("Video muvaffaqiyatli yuklandi!");
  };

  // HANDLERS: Test
  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { id: Date.now(), text: "", options: [{ id: Date.now() + 1, text: "" }, { id: Date.now() + 2, text: "" }], correctOptionId: Date.now() + 1 }
    ]);
  };

  const removeQuestion = (qId: number) => {
    if (questions.length === 1) return toast.error("Kamida 1 ta savol bo'lishi shart!");
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
          toast.error("Kamida 2 ta variant bo'lishi shart!");
          return q;
        }
        const newOptions = q.options.filter(o => o.id !== optId);
        return { 
          ...q, 
          options: newOptions,
          // If deleted option was correct, select the first one
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

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleForTest) return toast.error("Modulni tanlang");
    if (!testTitle.trim()) return toast.error("Test nomini kiriting");
    if (!testOrder.trim()) return toast.error("Tartib raqamini kiriting");
    if (!testDuration.trim()) return toast.error("Vaqtni kiriting");

    // Validate questions
    for (let i=0; i<questions.length; i++) {
      if (!questions[i].text.trim()) return toast.error(`${i+1}-savol matni yo'q!`);
      for (let j=0; j<questions[i].options.length; j++) {
        if (!questions[i].options[j].text.trim()) return toast.error(`${i+1}-savolning ${j+1}-varianti bo'sh!`);
      }
    }

    setTests([...tests, {
      id: Date.now().toString(),
      moduleId: selectedModuleForTest,
      duration: testDuration,
      order: parseInt(testOrder),
      qCount: questions.length
    }]);

    setSelectedModuleForTest("");
    setTestTitle("");
    setTestOrder("");
    setTestDuration("");
    setQuestions([{ id: Date.now(), text: "", options: [{ id: Date.now() + 1, text: "" }, { id: Date.now() + 2, text: "" }], correctOptionId: Date.now() + 1 }]);
    setIsTestModalOpen(false);
    toast.success("Test muvaffaqiyatli qo'shildi!");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">O'qituvchilikka Tayyorlov</h2>
        <p className="text-zinc-500 font-medium mt-1">Modullar, videolar va testlarni boshqarish paneli</p>
      </div>

      {/* TABS */}
      <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-zinc-100 w-fit">
        <button 
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'modules' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
        >
          <FolderOpen className="w-4 h-4" /> Modullar
        </button>
        <button 
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'videos' ? 'bg-blue-50 text-blue-600' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
        >
          <Video className="w-4 h-4" /> Video darsliklar
        </button>
        <button 
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'tests' ? 'bg-emerald-50 text-emerald-600' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
        >
          <FileText className="w-4 h-4" /> Testlar
        </button>
      </div>

      {/* CONTENT: MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                  <Plus className="w-4 h-4" /> Yangi modul qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black">Yangi Modul</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddModule} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase">Modul nomi</Label>
                    <Input 
                      placeholder="Masalan: 1-Modul: Asoslar" 
                      value={moduleName} 
                      onChange={e => setModuleName(e.target.value)} 
                      className="rounded-xl h-12"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base">
                    Yaratish
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            {modules.map(mod => (
              <div key={mod.id} className="flex items-center justify-between p-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-zinc-900">{mod.name}</span>
                </div>
                <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {modules.length === 0 && <div className="p-8 text-center text-zinc-500 font-medium">Modullar yo'q</div>}
          </div>
        </div>
      )}

      {/* CONTENT: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                  <Upload className="w-4 h-4" /> Video joylash
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black">Video Joylash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddVideo} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase">Modulni tanlang</Label>
                    <Select value={selectedModuleForVideo} onValueChange={setSelectedModuleForVideo}>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue placeholder="Modul tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase">Video nomi</Label>
                    <Input 
                      placeholder="Darslik nomi" 
                      value={videoName} 
                      onChange={e => setVideoName(e.target.value)} 
                      className="rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase">Tartib raqami (Order)</Label>
                    <Input 
                      type="number" 
                      placeholder="Masalan: 1" 
                      value={videoOrder} 
                      onChange={e => setVideoOrder(e.target.value)} 
                      className="rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase">Video Fayl (MP4)</Label>
                    <Input 
                      type="file" 
                      accept="video/*" 
                      onChange={e => setVideoFile(e.target.files?.[0] || null)} 
                      className="rounded-xl h-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-xl h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base mt-2">
                    Yaratish va Joylash
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            {videos.map(vid => (
              <div key={vid.id} className="flex items-center justify-between p-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 block">{vid.name}</span>
                    <span className="text-xs text-zinc-500 font-medium">Order: {vid.order} • Modul: {modules.find(m => m.id === vid.moduleId)?.name}</span>
                  </div>
                </div>
                <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {videos.length === 0 && <div className="p-8 text-center text-zinc-500 font-medium">Videolar yo'q</div>}
          </div>
        </div>
      )}

      {/* CONTENT: TESTS */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                  <Plus className="w-4 h-4" /> Yangi test qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] w-[95vw] h-[90vh] flex flex-col p-0 rounded-2xl">
                <DialogHeader className="p-6 pb-2">
                  <DialogTitle className="text-xl font-black">Yangi Test Yaratish</DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
                  {/* General Test Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label className="text-xs font-bold text-zinc-500 uppercase">Modulni tanlang</Label>
                      <Select value={selectedModuleForTest} onValueChange={setSelectedModuleForTest}>
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue placeholder="Modul tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-xs font-bold text-zinc-500 uppercase">Test Nomi</Label>
                      <Input 
                        placeholder="Masalan: Nazariy test" 
                        value={testTitle} 
                        onChange={e => setTestTitle(e.target.value)} 
                        className="rounded-xl h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1"><ListOrdered className="w-3 h-3" /> Tartib raqami (Order)</Label>
                      <Input 
                        type="number" 
                        placeholder="Masalan: 3" 
                        value={testOrder} 
                        onChange={e => setTestOrder(e.target.value)} 
                        className="rounded-xl h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Vaqt (daqiqa)</Label>
                      <Input 
                        type="number" 
                        placeholder="Masalan: 10" 
                        value={testDuration} 
                        onChange={e => setTestDuration(e.target.value)} 
                        className="rounded-xl h-12"
                      />
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-zinc-900">Savollar</h3>
                    </div>

                    {questions.map((q, qIndex) => (
                      <div key={q.id} className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <Label className="text-xs font-bold text-zinc-500 uppercase">{qIndex + 1}-Savol</Label>
                            <Textarea 
                              placeholder="Savol matnini kiriting..." 
                              value={q.text}
                              onChange={(e) => updateQuestionText(q.id, e.target.value)}
                              className="rounded-xl min-h-[80px] bg-white resize-none"
                            />
                          </div>
                          <button onClick={() => removeQuestion(q.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 pl-4 border-l-2 border-emerald-100">
                          {q.options.map((opt, optIndex) => (
                            <div key={opt.id} className="flex items-center gap-3">
                              <button 
                                type="button"
                                onClick={() => setCorrectOption(q.id, opt.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${q.correctOptionId === opt.id ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-zinc-300 hover:border-emerald-500'}`}
                              >
                                {q.correctOptionId === opt.id && <CheckCircle2 className="w-4 h-4" />}
                              </button>
                              
                              <Input 
                                placeholder={`Variant ${optIndex + 1}`} 
                                value={opt.text}
                                onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                                className={`flex-1 rounded-xl h-10 ${q.correctOptionId === opt.id ? 'border-emerald-200 bg-emerald-50' : 'bg-white'}`}
                              />
                              
                              <button type="button" onClick={() => removeOption(q.id, opt.id)} className="p-2 text-zinc-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          <Button type="button" variant="ghost" onClick={() => addOption(q.id)} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold gap-1 h-8 rounded-lg">
                            <Plus className="w-3 h-3" /> Variant qo'shish
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addQuestion} className="w-full rounded-xl border-dashed border-2 h-14 font-bold text-zinc-600 hover:bg-zinc-50 gap-2">
                      <Plus className="w-5 h-5" /> Yangi savol qo'shish
                    </Button>
                  </div>

                </div>

                <DialogFooter className="p-6 pt-4 border-t border-zinc-100 bg-white rounded-b-2xl">
                  <Button onClick={handleAddTest} className="w-full rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base">
                    Testni Yaratish va Saqlash
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            {tests.map(test => (
              <div key={test.id} className="flex items-center justify-between p-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 block">Nazariy test ({test.duration} daqiqa)</span>
                    <span className="text-xs text-zinc-500 font-medium">Order: {test.order} • Modul: {modules.find(m => m.id === test.moduleId)?.name} • {test.qCount} ta savol</span>
                  </div>
                </div>
                <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {tests.length === 0 && <div className="p-8 text-center text-zinc-500 font-medium">Testlar yo'q</div>}
          </div>
        </div>
      )}

    </div>
  );
};
