import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Zap className={className} />;
  return <IconComponent className={className} />;
};

import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Trophy, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  ChevronLeft,
  X,
  LogOut,
  TrendingUp,
  Target,
  Zap,
  Star,
  ChevronRight,
  Plus,
  Filter,
  BarChart3,
  MessageSquare,
  Globe,
  Shield,
  Upload,
  ImageIcon,
  Sparkles,
  Hash,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FAQManager } from '@/components/FAQManager';
import { FeedbackManager } from '@/components/FeedbackManager';
import { CourseApplicationsManager } from '@/components/CourseApplicationsManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error("Iltimos, avval tizimga kiring!");
      navigate('/admin/login');
    }
  }, [navigate]);

  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [totalAdsCount, setTotalAdsCount] = useState(0);
  const [totalFeaturesCount, setTotalFeaturesCount] = useState(0);
  const [totalNewsCount, setTotalNewsCount] = useState(0);
  const [totalFaqsCount, setTotalFaqsCount] = useState(0);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [totalSuggestionsCount, setTotalSuggestionsCount] = useState(0);
  const [recentApplicationsList, setRecentApplicationsList] = useState<any[]>([]);
  const [readAppsPercentage, setReadAppsPercentage] = useState(0);
  const [readSuggsPercentage, setReadSuggsPercentage] = useState(0);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [isAddAdModalOpen, setIsAddAdModalOpen] = useState(false);
  const [isEditAdModalOpen, setIsEditAdModalOpen] = useState(false);
  const [isAddFeatureModalOpen, setIsAddFeatureModalOpen] = useState(false);
  const [isEditFeatureModalOpen, setIsEditFeatureModalOpen] = useState(false);
  const [isAddFeatureDetailModalOpen, setIsAddFeatureDetailModalOpen] = useState(false);
  const [isEditFeatureDetailModalOpen, setIsEditFeatureDetailModalOpen] = useState(false);
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [isEditNewsModalOpen, setIsEditNewsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [editingFeatureDetail, setEditingFeatureDetail] = useState<any>(null);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
   const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(null);
  const [featureName, setFeatureName] = useState("");
  const [detailSteps, setDetailSteps] = useState([{ name: "", desc: "" }, { name: "", desc: "" }, { name: "", desc: "" }]);
  const [ads, setAds] = useState<any[]>([]);
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [adOverlayColor, setAdOverlayColor] = useState('white');
  const [adTextColor, setAdTextColor] = useState('dark');
  
  // New dynamic states
  const [features, setFeatures] = useState<any[]>([]);
  const [featureDetails, setFeatureDetails] = useState<any[]>([]);
  const [featureIcon, setFeatureIcon] = useState("Zap");
  const [featureColor, setFeatureColor] = useState("emerald");
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>("");
  const [detailImageFile, setDetailImageFile] = useState<File | null>(null);

  // News / Blog dynamic states
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'ads') {
      fetchAds();
    } else if (activeTab === 'features') {
      fetchFeatures();
    } else if (activeTab === 'feature-details') {
      fetchFeatures();
      fetchFeatureDetails();
    } else if (activeTab === 'news') {
      fetchNews();
    }
  }, [activeTab]);

  const fetchAds = async () => {
    try {
      const res = await api.get('ads/');
      setAds(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Reklamalarni yuklashda xatolik yuz berdi");
    }
  };

  const fetchFeatures = async () => {
    try {
      const res = await api.get('features/');
      setFeatures(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Xususiyatlarni yuklashda xatolik yuz berdi");
    }
  };

  const fetchFeatureDetails = async () => {
    try {
      const res = await api.get('feature-details/');
      setFeatureDetails(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Xususiyat tafsilotlarini yuklashda xatolik yuz berdi");
    }
  };

  const fetchNews = async () => {
    try {
      const res = await api.get('blogs/');
      setNewsList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Yangiliklarni yuklashda xatolik yuz berdi");
    }
  };

  const fetchDashboardStats = async () => {
    setDashboardLoading(true);
    try {
      const adsRes = await api.get('ads/');
      setTotalAdsCount(adsRes.data.length);

      const featuresRes = await api.get('features/');
      setTotalFeaturesCount(featuresRes.data.length);

      const newsRes = await api.get('blogs/');
      setTotalNewsCount(newsRes.data.length);

      const faqsRes = await api.get('faqs/');
      setTotalFaqsCount(faqsRes.data.length);

      const feedbackRes = await api.get('feedback/');
      const allFeedback = feedbackRes.data || [];
      
      const apps = allFeedback.filter((item: any) => item.subject && item.subject.startsWith('Kursga ariza'));
      const suggs = allFeedback.filter((item: any) => !item.subject || !item.subject.startsWith('Kursga ariza'));

      setTotalApplicationsCount(apps.length);
      setTotalSuggestionsCount(suggs.length);
      
      const sortedApps = [...apps].sort((a: any, b: any) => b.id - a.id);
      setRecentApplicationsList(sortedApps.slice(0, 5));

      const readApps = apps.filter((a: any) => a.is_read).length;
      setReadAppsPercentage(apps.length > 0 ? Math.round((readApps / apps.length) * 100) : 0);

      const readSuggs = suggs.filter((s: any) => s.is_read).length;
      setReadSuggsPercentage(suggs.length > 0 ? Math.round((readSuggs / suggs.length) * 100) : 0);
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  const stats = [
    { label: "Kurs arizalari", value: totalApplicationsCount, growth: "Real", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Izoh va Takliflar", value: totalSuggestionsCount, growth: "Real", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Yangiliklar", value: totalNewsCount, growth: "Real", icon: Globe, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Ko'p so'raladiganlar", value: totalFaqsCount, growth: "Real", icon: HelpCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];


  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'home', 
      label: 'Bosh sahifa', 
      icon: Globe, 
      subItems: [
        { id: 'ads', label: 'Reklama', icon: Star },
        { 
          id: 'features-group', 
          label: 'Xususiyatlar', 
          icon: Zap,
          subItems: [
            { id: 'features', label: 'Asosiy', icon: Zap },
            { id: 'feature-details', label: 'Detail sahifasi', icon: BookOpen },
          ]
        },
        { id: 'news', label: 'Yangiliklar', icon: Globe },
        { id: 'faq', label: 'Ko\'p beriladigan savollar', icon: HelpCircle },
      ]
    },
    { id: 'abacus', label: 'Abakus', icon: Shield },
    { id: 'feedback', label: 'Izoh yoki taklif', icon: MessageSquare },
    { id: 'applications', label: 'Kursga arizalar', icon: BookOpen },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success("Tizimdan chiqildi");
    navigate('/admin/login');
  };

  const handleMenuClick = (item: any) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActiveTab(item.id);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.id === 'detail-image-upload' || e.target.id === 'edit-detail-image-upload') {
        setDetailImageFile(file);
      } else if (e.target.id === 'news-image-upload' || e.target.id === 'edit-news-image-upload') {
        setNewsImageFile(file);
      } else {
        setAdImageFile(file);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.querySelector('#title') as HTMLInputElement).value;
    const desc = (form.querySelector('#desc') as HTMLTextAreaElement).value;
    const section = (form.querySelector('#section') as HTMLInputElement).value;

    if (!adImageFile) {
      toast.error("Iltimos, reklama rasmini yuklang");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('tag', section);
    formData.append('image', adImageFile);
    formData.append('overlay_color', adOverlayColor);
    formData.append('text_color', adTextColor);

    try {
      await api.post('ads/', formData);
      toast.success("Reklama muvaffaqiyatli qo'shildi");
      setIsAddAdModalOpen(false);
      setImagePreview(null);
      setAdImageFile(null);
      setAdOverlayColor('white');
      setAdTextColor('dark');
      fetchAds();
    } catch (err) {
      console.error(err);
      toast.error("Reklama qo'shishda xatolik yuz berdi");
    }
  };

  const handleEditClick = (ad: any) => {
    setEditingAd(ad);
    setImagePreview(ad.image);
    setAdOverlayColor(ad.overlay_color || 'white');
    setAdTextColor(ad.text_color || 'dark');
    setIsEditAdModalOpen(true);
  };

  const handleUpdateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.querySelector('#edit-title') as HTMLInputElement).value;
    const desc = (form.querySelector('#edit-desc') as HTMLTextAreaElement).value;
    const section = (form.querySelector('#edit-section') as HTMLInputElement).value;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('tag', section);
    formData.append('overlay_color', adOverlayColor);
    formData.append('text_color', adTextColor);
    if (adImageFile) {
      formData.append('image', adImageFile);
    }

    try {
      await api.patch(`ads/${editingAd.id}/`, formData);
      toast.success("Reklama muvaffaqiyatli tahrirlandi");
      setIsEditAdModalOpen(false);
      setEditingAd(null);
      setImagePreview(null);
      setAdImageFile(null);
      setAdOverlayColor('white');
      setAdTextColor('dark');
      fetchAds();
    } catch (err) {
      console.error(err);
      toast.error("Reklamani tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDeleteAd = async (id: number) => {
    if (!confirm("Haqiqatdan ham ushbu reklamani o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`ads/${id}/`);
      toast.success("Reklama muvaffaqiyatli o'chirildi");
      fetchAds();
    } catch (err) {
      console.error(err);
      toast.error("Reklamani o'chirishda xatolik yuz berdi");
    }
  };


  const handleGenerateIcon = () => {
    const nameLower = featureName.toLowerCase();
    let selectedIcon = "Zap";
    let selectedColor = "emerald";

    if (nameLower.includes("o'yin") || nameLower.includes("game") || nameLower.includes("qiziqarli") || nameLower.includes("mashq") || nameLower.includes("play")) {
      selectedIcon = "Gamepad2";
      selectedColor = "emerald";
    } else if (nameLower.includes("daraja") || nameLower.includes("level") || nameLower.includes("xp") || nameLower.includes("tez") || nameLower.includes("hisob") || nameLower.includes("tizim")) {
      selectedIcon = "Zap";
      selectedColor = "blue";
    } else if (nameLower.includes("reyting") || nameLower.includes("top") || nameLower.includes("musobaqa") || nameLower.includes("yutuq") || nameLower.includes("trophy") || nameLower.includes("peshqadam")) {
      selectedIcon = "Trophy";
      selectedColor = "amber";
    } else if (nameLower.includes("sertifikat") || nameLower.includes("mukofot") || nameLower.includes("badge") || nameLower.includes("diplom") || nameLower.includes("award") || nameLower.includes("yulduz")) {
      selectedIcon = "Award";
      selectedColor = "rose";
    } else if (nameLower.includes("maqsad") || nameLower.includes("kunlik") || nameLower.includes("target") || nameLower.includes("reja")) {
      selectedIcon = "Target";
      selectedColor = "violet";
    } else if (nameLower.includes("statistika") || nameLower.includes("grafik") || nameLower.includes("tahlil") || nameLower.includes("natija") || nameLower.includes("analitika") || nameLower.includes("hisobot")) {
      selectedIcon = "BarChart3";
      selectedColor = "cyan";
    }

    setFeatureIcon(selectedIcon);
    setFeatureColor(selectedColor);
    toast.success(`Nomingiz uchun mos icon (${selectedIcon}) va rang (${selectedColor}) tanlandi!`);
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#feature-name') as HTMLInputElement).value;
    const desc = (form.querySelector('#feature-desc') as HTMLTextAreaElement).value;

    try {
      await api.post('features/', {
        name,
        description: desc,
        icon: featureIcon,
        color: featureColor
      });
      toast.success("Xususiyat muvaffaqiyatli qo'shildi");
      setIsAddFeatureModalOpen(false);
      setFeatureName("");
      setFeatureIcon("Zap");
      setFeatureColor("emerald");
      fetchFeatures();
    } catch (err) {
      console.error(err);
      toast.error("Xususiyat qo'shishda xatolik yuz berdi");
    }
  };

  const handleEditFeature = (feature: any) => {
    setEditingFeature(feature);
    setFeatureName(feature.name);
    setFeatureIcon(feature.icon || "Zap");
    setFeatureColor(feature.color || "emerald");
    setIsEditFeatureModalOpen(true);
  };

  const handleUpdateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#edit-feature-name') as HTMLInputElement).value;
    const desc = (form.querySelector('#edit-feature-desc') as HTMLTextAreaElement).value;

    try {
      await api.patch(`features/${editingFeature.slug}/`, {
        name,
        description: desc,
        icon: featureIcon,
        color: featureColor
      });
      toast.success("Xususiyat muvaffaqiyatli tahrirlandi");
      setIsEditFeatureModalOpen(false);
      setEditingFeature(null);
      fetchFeatures();
    } catch (err) {
      console.error(err);
      toast.error("Xususiyatni tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDeleteFeature = async (slug: string) => {
    if (!confirm("Haqiqatdan ham ushbu xususiyatni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`features/${slug}/`);
      toast.success("Xususiyat muvaffaqiyatli o'chirildi");
      fetchFeatures();
    } catch (err) {
      console.error(err);
      toast.error("Xususiyatni o'chirishda xatolik yuz berdi");
    }
  };

  const handleEditFeatureDetail = (detail: any) => {
    setEditingFeatureDetail(detail);
    setImagePreview(detail.image);
    setSelectedFeatureId(detail.feature.toString());
    setDetailSteps([
      { name: detail.step1_title || "", desc: detail.step1_desc || "" },
      { name: detail.step2_title || "", desc: detail.step2_desc || "" },
      { name: detail.step3_title || "", desc: detail.step3_desc || "" }
    ]);
    setIsEditFeatureDetailModalOpen(true);
  };

  const handleUpdateFeatureDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const subtitle = (form.querySelector('input[placeholder="Detail nomi..."]') as HTMLInputElement).value;
    const desc = (form.querySelector('textarea[placeholder="Asosiy tavsif..."]') as HTMLTextAreaElement).value;

    const formData = new FormData();
    formData.append('feature', selectedFeatureId || editingFeatureDetail.feature.toString());
    if (detailImageFile) {
      formData.append('image', detailImageFile);
    }
    formData.append('subtitle', subtitle);
    formData.append('description', desc);

    // Steps
    formData.append('step1_title', detailSteps[0].name);
    formData.append('step1_desc', detailSteps[0].desc);
    formData.append('step2_title', detailSteps[1].name);
    formData.append('step2_desc', detailSteps[1].desc);
    formData.append('step3_title', detailSteps[2].name);
    formData.append('step3_desc', detailSteps[2].desc);

    try {
      await api.patch(`feature-details/${editingFeatureDetail.id}/`, formData, {
        headers: {  }
      });
      toast.success("Detail muvaffaqiyatli tahrirlandi");
      setIsEditFeatureDetailModalOpen(false);
      setEditingFeatureDetail(null);
      setImagePreview(null);
      setDetailImageFile(null);
      setSelectedFeatureId("");
      fetchFeatureDetails();
    } catch (err) {
      console.error(err);
      toast.error("Tafsilotni tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDeleteFeatureDetail = async (id: number) => {
    if (!confirm("Haqiqatdan ham ushbu tafsilotni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`feature-details/${id}/`);
      toast.success("Tafsilot muvaffaqiyatli o'chirildi");
      fetchFeatureDetails();
    } catch (err) {
      console.error(err);
      toast.error("Tafsilotni o'chirishda xatolik yuz berdi");
    }
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...detailSteps];
    (newSteps[index] as any)[field] = value;
    setDetailSteps(newSteps);
  };

  const handleAddFeatureDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const subtitle = (form.querySelector('input[placeholder="Detail nomi..."]') as HTMLInputElement).value;
    const desc = (form.querySelector('textarea[placeholder="Asosiy tavsif..."]') as HTMLTextAreaElement).value;

    if (!selectedFeatureId) {
      toast.error("Iltimos, asosiy xususiyatni tanlang");
      return;
    }

    if (!detailImageFile) {
      toast.error("Iltimos, rasm yuklang");
      return;
    }

    const formData = new FormData();
    formData.append('feature', selectedFeatureId);
    formData.append('image', detailImageFile);
    formData.append('subtitle', subtitle);
    formData.append('description', desc);

    // Steps
    formData.append('step1_title', detailSteps[0].name);
    formData.append('step1_desc', detailSteps[0].desc);
    formData.append('step2_title', detailSteps[1].name);
    formData.append('step2_desc', detailSteps[1].desc);
    formData.append('step3_title', detailSteps[2].name);
    formData.append('step3_desc', detailSteps[2].desc);

    try {
      await api.post('feature-details/', formData, {
        headers: {  }
      });
      toast.success("Xususiyat detali muvaffaqiyatli qo'shildi");
      setIsAddFeatureDetailModalOpen(false);
      setImagePreview(null);
      setDetailImageFile(null);
      setSelectedFeatureId("");
      setDetailSteps([{ name: "", desc: "" }, { name: "", desc: "" }, { name: "", desc: "" }]);
      fetchFeatureDetails();
    } catch (err) {
      console.error(err);
      toast.error("Xususiyat tafsilotini qo'shishda xatolik yuz berdi");
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsImageFile) {
      toast.error("Iltimos, asosiy rasmni yuklang");
      return;
    }

    const form = e.target as HTMLFormElement;
    const title = (form.querySelector('input[placeholder="Yangilik sarlavhasi..."]') as HTMLInputElement).value;
    const category = (form.querySelector('input[placeholder="Masalan: Musobaqa"]') as HTMLInputElement).value;
    const hashtags = (form.querySelector('input[placeholder="#yangilik #math"]') as HTMLInputElement).value;
    const author = (form.querySelector('input[placeholder="Ism sharif..."]') as HTMLInputElement).value;
    const content = (form.querySelector('textarea[placeholder="Batafsil ma\'lumot..."]') as HTMLTextAreaElement).value;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('hashtags', hashtags);
    formData.append('author', author);
    formData.append('content', content);
    formData.append('image', newsImageFile);
    if (authorImageFile) {
      formData.append('author_image', authorImageFile);
    }

    try {
      await api.post('blogs/', formData, {
        headers: {  }
      });
      toast.success("Yangilik muvaffaqiyatli qo'shildi");
      setIsAddNewsModalOpen(false);
      setImagePreview(null);
      setAuthorImagePreview(null);
      setNewsImageFile(null);
      setAuthorImageFile(null);
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Yangilik qo'shishda xatolik yuz berdi");
    }
  };

  const handleEditNews = (news: any) => {
    setEditingNews(news);
    setImagePreview(news.image);
    setAuthorImagePreview(news.author_image);
    setIsEditNewsModalOpen(true);
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    const form = e.target as HTMLFormElement;
    const title = (form.querySelector('input[placeholder="Yangilik sarlavhasi..."]') as HTMLInputElement).value;
    const category = (form.querySelector('input[placeholder="Masalan: Musobaqa"]') as HTMLInputElement).value;
    const hashtags = (form.querySelector('input[placeholder="#yangilik #math"]') as HTMLInputElement).value;
    const author = (form.querySelector('input[placeholder="Ism sharif..."]') as HTMLInputElement).value;
    const content = (form.querySelector('textarea[placeholder="Batafsil ma\'lumot..."]') as HTMLTextAreaElement).value;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('hashtags', hashtags);
    formData.append('author', author);
    formData.append('content', content);
    if (newsImageFile) {
      formData.append('image', newsImageFile);
    }
    if (authorImageFile) {
      formData.append('author_image', authorImageFile);
    }

    try {
      await api.patch(`blogs/${editingNews.slug}/`, formData, {
        headers: {  }
      });
      toast.success("Yangilik muvaffaqiyatli tahrirlandi");
      setIsEditNewsModalOpen(false);
      setEditingNews(null);
      setImagePreview(null);
      setAuthorImagePreview(null);
      setNewsImageFile(null);
      setAuthorImageFile(null);
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Yangilikni tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDeleteNews = async (slug: string) => {
    if (!confirm("Haqiqatan ham ushbu yangilikni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`blogs/${slug}/`);
      toast.success("Yangilik o'chirildi");
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Yangilikni o'chirishda xatolik yuz berdi");
    }
  };

  const renderContent = () => {
    if (activeTab === 'ads') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Reklamalar Boshqaruvi</h2>
              <p className="text-zinc-500 font-medium mt-1">Asosiy sahifadagi slayder reklamalarini boshqarish.</p>
            </div>
            
            <Dialog open={isAddAdModalOpen} onOpenChange={setIsAddAdModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Reklama Qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangi Reklama</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAd} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rasm Yuklash</Label>
                    <div 
                      className="relative h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                      onClick={() => document.getElementById('ad-image-upload')?.click()}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
                          </div>
                          <p className="text-[9px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Rasm tanlash</p>
                        </>
                      )}
                      <input 
                        id="ad-image-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sarlavha</Label>
                      <Input id="title" placeholder="Reklama nomi" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="section" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bo'lim</Label>
                      <Input id="section" placeholder="Masalan: Uy sahifasi" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                    <Textarea id="desc" placeholder="Ma'lumot..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[80px] text-sm resize-none" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Rang tanlash - Fon */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Fon rangi</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {[
                          { key: 'white',   bg: 'bg-white border-2 border-zinc-300',   label: 'Oq' },
                          { key: 'emerald', bg: 'bg-emerald-500',  label: 'Yashil' },
                          { key: 'blue',    bg: 'bg-blue-600',     label: 'Ko\'k' },
                          { key: 'violet',  bg: 'bg-violet-600',   label: 'Binafsha' },
                          { key: 'amber',   bg: 'bg-amber-400',    label: 'Sariq' },
                          { key: 'rose',    bg: 'bg-rose-600',     label: 'Qizil' },
                          { key: 'slate',   bg: 'bg-slate-800',    label: 'To\'q' },
                        ].map(c => (
                          <button
                            key={c.key}
                            type="button"
                            title={c.label}
                            onClick={() => setAdOverlayColor(c.key)}
                            className={`h-8 w-full rounded-xl ${c.bg} transition-all ${
                              adOverlayColor === c.key
                                ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110'
                                : 'hover:scale-105 opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Rang tanlash - Matn */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Matn rangi</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          { key: 'dark',    bg: 'bg-zinc-900', label: 'Qora' },
                          { key: 'white',   bg: 'bg-white border-2 border-zinc-300', label: 'Oq' },
                          { key: 'emerald', bg: 'bg-emerald-500', label: 'Yashil' },
                          { key: 'blue',    bg: 'bg-blue-600', label: 'Ko\'k' },
                          { key: 'amber',   bg: 'bg-amber-400', label: 'Sariq' },
                          { key: 'rose',    bg: 'bg-rose-600', label: 'Qizil' },
                        ].map(c => (
                          <button
                            key={c.key}
                            type="button"
                            title={c.label}
                            onClick={() => setAdTextColor(c.key)}
                            className={`h-8 w-full rounded-xl ${c.bg} transition-all ${
                              adTextColor === c.key
                                ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110'
                                : 'hover:scale-105 opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Ad Modal */}
            <Dialog open={isEditAdModalOpen} onOpenChange={(open) => {
              setIsEditAdModalOpen(open);
              if (!open) {
                setEditingAd(null);
                setImagePreview(null);
              }
            }}>
              <DialogContent className="sm:max-w-[440px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Reklamani Tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateAd} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rasm</Label>
                    <div 
                      className="relative h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                      onClick={() => document.getElementById('edit-ad-image-upload')?.click()}
                    >
                      <img src={imagePreview || editingAd?.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <input 
                        id="edit-ad-image-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="edit-title" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sarlavha</Label>
                      <Input id="edit-title" defaultValue={editingAd?.title} placeholder="Reklama nomi" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="edit-section" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bo'lim</Label>
                      <Input id="edit-section" defaultValue={editingAd?.tag || "Uy sahifasi"} placeholder="Masalan: Uy sahifasi" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                    <Textarea id="edit-desc" defaultValue={editingAd?.description} placeholder="Ma'lumot..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[80px] text-sm resize-none" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Rang tanlash - Fon (Edit) */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Fon rangi</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {[
                          { key: 'white',   bg: 'bg-white border-2 border-zinc-300',   label: 'Oq' },
                          { key: 'emerald', bg: 'bg-emerald-500',  label: 'Yashil' },
                          { key: 'blue',    bg: 'bg-blue-600',     label: 'Ko\'k' },
                          { key: 'violet',  bg: 'bg-violet-600',   label: 'Binafsha' },
                          { key: 'amber',   bg: 'bg-amber-400',    label: 'Sariq' },
                          { key: 'rose',    bg: 'bg-rose-600',     label: 'Qizil' },
                          { key: 'slate',   bg: 'bg-slate-800',    label: 'To\'q' },
                        ].map(c => (
                          <button
                            key={c.key}
                            type="button"
                            title={c.label}
                            onClick={() => setAdOverlayColor(c.key)}
                            className={`h-8 w-full rounded-xl ${c.bg} transition-all ${
                              adOverlayColor === c.key
                                ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110'
                                : 'hover:scale-105 opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Rang tanlash - Matn (Edit) */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Matn rangi</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          { key: 'dark',    bg: 'bg-zinc-900', label: 'Qora' },
                          { key: 'white',   bg: 'bg-white border-2 border-zinc-300', label: 'Oq' },
                          { key: 'emerald', bg: 'bg-emerald-500', label: 'Yashil' },
                          { key: 'blue',    bg: 'bg-blue-600', label: 'Ko\'k' },
                          { key: 'amber',   bg: 'bg-amber-400', label: 'Sariq' },
                          { key: 'rose',    bg: 'bg-rose-600', label: 'Qizil' },
                        ].map(c => (
                          <button
                            key={c.key}
                            type="button"
                            title={c.label}
                            onClick={() => setAdTextColor(c.key)}
                            className={`h-8 w-full rounded-xl ${c.bg} transition-all ${
                              adTextColor === c.key
                                ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110'
                                : 'hover:scale-105 opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-500" /> Mavjud Reklamalar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rasm</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sarlavha</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tavsif</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Qo'shilgan sana</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {ads.filter(ad => 
                      !globalSearchQuery ||
                      ad.title?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      ad.description?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      (ad.desc && ad.desc.toLowerCase().includes(globalSearchQuery.toLowerCase())) ||
                      ad.tag?.toLowerCase().includes(globalSearchQuery.toLowerCase())
                    ).map((ad) => (
                      <tr key={ad.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="w-16 h-10 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200 shadow-sm">
                            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-zinc-900">{ad.title}</p>
                          {ad.tag && (
                            <span className="inline-flex mt-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
                              {ad.tag}
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">{ad.description || ad.desc}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                            {ad.created_at ? new Date(ad.created_at).toLocaleDateString('uz-UZ') : ad.date}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleEditClick(ad)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-zinc-100"
                            >
                              <Settings className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button 
                              onClick={() => handleDeleteAd(ad.id)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'features') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Platforma Xususiyatlari</h2>
              <p className="text-zinc-500 font-medium mt-1">Sitedagi afzalliklar va xususiyatlarni boshqarish.</p>
            </div>
            
            <Dialog open={isAddFeatureModalOpen} onOpenChange={setIsAddFeatureModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Yangi Xususiyat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px] rounded-[32px] border-none shadow-2xl p-6">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangi Xususiyat</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFeature} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomi</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="feature-name" 
                        value={featureName}
                        onChange={(e) => setFeatureName(e.target.value)}
                        placeholder="Xususiyat nomi..." 
                        className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" 
                        required 
                      />
                      {featureName.length > 2 && (
                        <Button 
                          type="button"
                          onClick={handleGenerateIcon}
                          className="h-10 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 transition-all animate-in zoom-in duration-300"
                        >
                          <Sparkles className="w-4 h-4 mr-1" /> Generatsiya
                        </Button>
                      )}
                    </div>
                  </div>

                  {featureIcon && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 animate-in zoom-in duration-300">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Generatsiya qilingan Icon:</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                        <DynamicIcon name={featureIcon} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md border">{featureIcon} ({featureColor})</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="feature-desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                    <Textarea id="feature-desc" placeholder="Xususiyat haqida qisqacha..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[100px] text-sm resize-none" required />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Yaratish
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Feature Modal */}
            <Dialog open={isEditFeatureModalOpen} onOpenChange={(open) => {
              setIsEditFeatureModalOpen(open);
              if (!open) setEditingFeature(null);
            }}>
              <DialogContent className="sm:max-w-[440px] rounded-[32px] border-none shadow-2xl p-6">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Xususiyatni Tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateFeature} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-feature-name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomi</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="edit-feature-name" 
                        defaultValue={editingFeature?.name}
                        value={featureName}
                        onChange={(e) => setFeatureName(e.target.value)}
                        placeholder="Xususiyat nomi..." 
                        className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" 
                        required 
                      />
                      {featureName.length > 2 && (
                        <Button 
                          type="button"
                          onClick={handleGenerateIcon}
                          className="h-10 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 transition-all"
                        >
                          <Sparkles className="w-4 h-4 mr-1" /> Generatsiya
                        </Button>
                      )}
                    </div>
                  </div>

                  {featureIcon && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tanlangan Icon:</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                        <DynamicIcon name={featureIcon} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md border">{featureIcon}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="edit-feature-desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                    <Textarea id="edit-feature-desc" defaultValue={editingFeature?.description} placeholder="Xususiyat haqida qisqacha..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[100px] text-sm resize-none" required />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" /> Mavjud Xususiyatlar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16 text-center">#</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-20">Icon</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nomi</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tavsif</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Yaratildi</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {features.filter(f =>
                      !globalSearchQuery ||
                      f.name?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      f.description?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      f.slug?.toLowerCase().includes(globalSearchQuery.toLowerCase())
                    ).map((feature, index) => (
                      <tr key={feature.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4 text-center">
                          <span className="text-xs font-black text-zinc-400">{index + 1}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                            <DynamicIcon name={feature.icon} className="w-5 h-5" />
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-zinc-900">{feature.name}</p>
                          <span className="text-[9px] font-black text-zinc-400 uppercase bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{feature.slug}</span>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-xs text-zinc-500 line-clamp-1 max-w-[300px]">{feature.description}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-400">{new Date(feature.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleEditFeature(feature)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-zinc-100"
                            >
                              <Settings className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button 
                              onClick={() => handleDeleteFeature(feature.slug)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500"
                            >
                              <Trash2 className="w-4 h-4 text-zinc-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'feature-details') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Xususiyat Detallari</h2>
              <p className="text-zinc-500 font-medium mt-1">Xususiyatlar uchun batafsil ma'lumotlar va qadamlarni boshqarish.</p>
            </div>
            
            <Dialog open={isAddFeatureDetailModalOpen} onOpenChange={setIsAddFeatureDetailModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Detail Yaratish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangi Detail</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFeatureDetail} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rasm</Label>
                      <div 
                        className="relative h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('detail-image-upload')?.click()}
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-[9px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Rasm tanlash</p>
                          </>
                        )}
                        <input id="detail-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Xususiyatni tanlang</Label>
                      <Select onValueChange={(val) => setSelectedFeatureId(val)} value={selectedFeatureId}>
                        <SelectTrigger className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:ring-emerald-500/10 transition-all text-sm">
                          <SelectValue placeholder="Asosiy xususiyatni tanlang" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                          {features.map((feature) => (
                            <SelectItem key={feature.id} value={feature.id.toString()} className="text-sm font-medium py-2.5 rounded-xl">
                              {feature.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomi</Label>
                      <Input placeholder="Detail nomi..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                      <Textarea placeholder="Asosiy tavsif..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[80px] text-sm resize-none" required />
                    </div>
                  </div>

                  {/* Qanday ishlaydi section */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-black text-sm text-zinc-900 uppercase tracking-widest">Qanday ishlaydi?</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {detailSteps.map((step, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-zinc-50 space-y-3 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-zinc-100 rounded-bl-3xl flex items-center justify-center">
                            <span className="text-lg font-black text-zinc-300">{i + 1}</span>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Qadam nomi</Label>
                            <Input 
                              value={step.name} 
                              onChange={(e) => handleStepChange(i, 'name', e.target.value)}
                              placeholder={`Masalan: ${i === 0 ? 'Ball to\'plang' : i === 1 ? 'Reytingni kuzating' : 'Sovrin yuting'}`} 
                              className="h-9 rounded-lg border-white bg-white focus:bg-white transition-all text-sm" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Qadam tavsifi</Label>
                            <Input 
                              value={step.desc} 
                              onChange={(e) => handleStepChange(i, 'desc', e.target.value)}
                              placeholder="Qisqacha ma'lumot..." 
                              className="h-9 rounded-lg border-white bg-white focus:bg-white transition-all text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Yaratish
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Feature Detail Modal */}
            <Dialog open={isEditFeatureDetailModalOpen} onOpenChange={(open) => {
              setIsEditFeatureDetailModalOpen(open);
              if (!open) {
                setEditingFeatureDetail(null);
                setImagePreview(null);
              }
            }}>
              <DialogContent className="sm:max-w-[550px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Detailni Tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateFeatureDetail} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rasm</Label>
                      <div 
                        className="relative h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('edit-detail-image-upload')?.click()}
                      >
                        <img src={imagePreview || editingFeatureDetail?.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <input id="edit-detail-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Xususiyatni tanlang</Label>
                      <Select onValueChange={(val) => setSelectedFeatureId(val)} defaultValue={editingFeatureDetail?.feature?.toString()}>
                        <SelectTrigger className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:ring-emerald-500/10 transition-all text-sm">
                          <SelectValue placeholder="Asosiy xususiyatni tanlang" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                          {features.map((feature) => (
                            <SelectItem key={feature.id} value={feature.id.toString()} className="text-sm font-medium py-2.5 rounded-xl">
                              {feature.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomi</Label>
                      <Input defaultValue={editingFeatureDetail?.subtitle} placeholder="Detail nomi..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                      <Textarea defaultValue={editingFeatureDetail?.description} placeholder="Asosiy tavsif..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[80px] text-sm resize-none" required />
                    </div>
                  </div>

                  {/* Qanday ishlaydi section */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-black text-sm text-zinc-900 uppercase tracking-widest">Qanday ishlaydi?</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {detailSteps.map((step, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-zinc-50 space-y-3 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-zinc-100 rounded-bl-3xl flex items-center justify-center">
                            <span className="text-lg font-black text-zinc-300">{i + 1}</span>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Qadam nomi</Label>
                            <Input 
                              value={step.name} 
                              onChange={(e) => handleStepChange(i, 'name', e.target.value)}
                              placeholder="Qadam nomi..." 
                              className="h-9 rounded-lg border-white bg-white focus:bg-white transition-all text-sm" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Qadam tavsifi</Label>
                            <Input 
                              value={step.desc} 
                              onChange={(e) => handleStepChange(i, 'desc', e.target.value)}
                              placeholder="Qisqacha ma'lumot..." 
                              className="h-9 rounded-lg border-white bg-white focus:bg-white transition-all text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" /> Mavjud Detallar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16 text-center">#</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rasm</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nomi</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Xususiyat</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sana</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {featureDetails.filter(d =>
                      !globalSearchQuery ||
                      d.subtitle?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      d.description?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      d.feature_name?.toLowerCase().includes(globalSearchQuery.toLowerCase())
                    ).map((detail, index) => (
                      <tr key={detail.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4 text-center">
                          <span className="text-xs font-black text-zinc-400">{index + 1}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="w-12 h-8 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                            <img src={detail.image} alt={detail.subtitle} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-zinc-900">{detail.subtitle}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-widest">
                            {detail.feature_name}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-400">
                            {detail.created_at ? new Date(detail.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleEditFeatureDetail(detail)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-zinc-100"
                            >
                              <Settings className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button 
                              onClick={() => handleDeleteFeatureDetail(detail.id)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500"
                            >
                              <Trash2 className="w-4 h-4 text-zinc-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'news') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Yangiliklar Boshqaruvi</h2>
              <p className="text-zinc-500 font-medium mt-1">Platformadagi so'nggi yangilik va maqolalar.</p>
            </div>
            
            <Dialog open={isAddNewsModalOpen} onOpenChange={setIsAddNewsModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Yangilik Qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangi Yangilik</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddNews} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Main Image */}
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Asosiy Rasm</Label>
                      <div 
                        className="relative h-40 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('news-image-upload')?.click()}
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-[9px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Rasm tanlash</p>
                          </>
                        )}
                        <input id="news-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sarlavha</Label>
                      <Input placeholder="Yangilik sarlavhasi..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Yo'nalish</Label>
                      <Input placeholder="Masalan: Musobaqa" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heshteglar</Label>
                      <Input placeholder="#yangilik #math" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" />
                    </div>

                    {/* Author Info */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Muallif Rasmi</Label>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 cursor-pointer hover:border-emerald-500 transition-all"
                          onClick={() => document.getElementById('author-image-upload')?.click()}
                        >
                          {authorImagePreview ? (
                            <img src={authorImagePreview} className="w-full h-full object-cover" />
                          ) : <Users className="w-5 h-5 text-zinc-400" />}
                        </div>
                        <input id="author-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAuthorImageFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => setAuthorImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                        <p className="text-[10px] text-zinc-400 font-medium">Tanlash...</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Muallif Ismi</Label>
                      <Input placeholder="Ism sharif..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                      <Textarea placeholder="Batafsil ma'lumot..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[120px] text-sm resize-none" required />
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Yaratish
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit News Modal */}
            <Dialog open={isEditNewsModalOpen} onOpenChange={(open) => {
              setIsEditNewsModalOpen(open);
              if (!open) {
                setEditingNews(null);
                setImagePreview(null);
                setAuthorImagePreview(null);
              }
            }}>
              <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangilikni Tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateNews} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Main Image */}
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Asosiy Rasm</Label>
                      <div 
                        className="relative h-40 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('edit-news-image-upload')?.click()}
                      >
                        <img src={imagePreview || editingNews?.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <input id="edit-news-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sarlavha</Label>
                      <Input defaultValue={editingNews?.title} placeholder="Yangilik sarlavhasi..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Yo'nalish</Label>
                      <Input defaultValue={editingNews?.category} placeholder="Masalan: Musobaqa" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heshteglar</Label>
                      <Input defaultValue={editingNews?.hashtags} placeholder="#yangilik #math" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" />
                    </div>

                    {/* Author Info */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Muallif Rasmi</Label>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 cursor-pointer hover:border-emerald-500 transition-all"
                          onClick={() => document.getElementById('edit-author-image-upload')?.click()}
                        >
                          <img src={authorImagePreview || editingNews?.author_image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <input id="edit-author-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAuthorImageFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => setAuthorImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                        <p className="text-[10px] text-zinc-400 font-medium">O'zgartirish...</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Muallif Ismi</Label>
                      <Input defaultValue={editingNews?.author} placeholder="Ism sharif..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                      <Textarea defaultValue={editingNews?.content} placeholder="Batafsil ma'lumot..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[120px] text-sm resize-none" required />
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-500" /> Mavjud Yangiliklar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16 text-center">#</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rasm</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sarlavha</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Muallif</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sana</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {newsList.filter(n =>
                      !globalSearchQuery ||
                      n.title?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      n.category?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      n.author?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                      n.content?.toLowerCase().includes(globalSearchQuery.toLowerCase())
                    ).map((news, index) => (
                      <tr key={news.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4 text-center">
                          <span className="text-xs font-black text-zinc-400">{index + 1}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="w-12 h-8 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                            <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div>
                            <p className="text-sm font-bold text-zinc-900 line-clamp-1">{news.title}</p>
                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
                              {news.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200 flex items-center justify-center">
                              {news.author_image ? (
                                <img src={news.author_image} alt={news.author} className="w-full h-full object-cover" />
                              ) : <Users className="w-3.5 h-3.5 text-zinc-400" />}
                            </div>
                            <span className="text-xs font-bold text-zinc-600">{news.author}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-400">{new Date(news.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleEditNews(news)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-zinc-100"
                            >
                              <Settings className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button 
                              onClick={() => handleDeleteNews(news.slug)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500"
                            >
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'applications') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <CourseApplicationsManager searchQuery={globalSearchQuery} />
        </div>
      );
    }

    if (activeTab === 'feedback') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <FeedbackManager searchQuery={globalSearchQuery} />
        </div>
      );
    }

    if (activeTab === 'faq') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <FAQManager searchQuery={globalSearchQuery} />
        </div>
      );
    }

    // Default Dashboard view
    if (dashboardLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Icons.Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="text-zinc-500 text-sm font-bold tracking-tight">Real ma'lumotlar yuklanmoqda...</p>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Xayrli kun, Admin! 👋</h2>
            <p className="text-zinc-500 font-medium mt-1">Platformada bugungi real holat va yangiliklar.</p>
          </div>
          <Button 
            onClick={() => setActiveTab('applications')}
            className="rounded-2xl h-12 px-6 bg-zinc-900 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-zinc-900/10"
          >
            <Plus className="w-5 h-5" /> Arizalarni ko'rish
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden group hover:shadow-xl transition-all duration-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">{stat.growth}</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-zinc-900">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> So'nggi Kelib Tushgan Arizalar
              </CardTitle>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('applications')}
                className="text-xs font-bold text-zinc-400 hover:text-zinc-900"
              >
                Barchasi <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Arizachi</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sana</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right pr-12">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {recentApplicationsList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="h-40 text-center text-zinc-400 font-medium">
                          Hozircha arizalar kelib tushmagan.
                        </td>
                      </tr>
                    ) : (
                      recentApplicationsList.map((app) => {
                        const avatarLetters = app.name ? app.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AR';
                        return (
                          <tr key={app.id} className="hover:bg-zinc-50/30 transition-colors group">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black border border-emerald-100">
                                  {avatarLetters}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-zinc-900">{app.name}</p>
                                  <p className="text-[10px] text-zinc-400">{app.email || 'Aloqa ma\'lumoti yo\'q'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <span className="text-xs text-zinc-500 font-medium">
                                {new Date(app.created_at).toLocaleDateString('uz-UZ', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                                !app.is_read ? 'bg-blue-500/10 text-blue-600' : 'bg-zinc-200/50 text-zinc-500'
                              }`}>
                                {!app.is_read ? 'Yangi' : 'O\'qilgan'}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-right pr-12">
                              <Button 
                                onClick={() => setActiveTab('applications')} 
                                variant="ghost" 
                                size="icon" 
                                className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-zinc-900 text-white p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-none">Tezkor Tahlil</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Ko'rib chiqish holati</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-400">Arizalar Ko'rib Chiqilishi</span>
                    <span className="text-xs font-black text-emerald-400">{readAppsPercentage}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${readAppsPercentage}%` }}
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-400">Izoh va Takliflar tahlili</span>
                    <span className="text-xs font-black text-blue-400">{readSuggsPercentage}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${readSuggsPercentage}%` }}
                      className="h-full bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setActiveTab('feedback')}
                variant="outline" 
                className="w-full mt-8 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-zinc-900 transition-all font-black py-6"
              >
                Batafsil Tahlil <BarChart3 className="ml-2 w-4 h-4" />
              </Button>
            </Card>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-6 bg-emerald-500 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2">Premium Yordam</h3>
                <p className="text-white/80 text-xs font-medium mb-6">Tizim bo'yicha savollaringiz bormi? Texnik ko'mak har doim tayyor.</p>
                <Button className="w-full rounded-xl bg-zinc-900 text-white font-black hover:bg-white hover:text-zinc-900 transition-all">Bog'lanish</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-45 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-zinc-900 z-50 flex flex-col lg:hidden border-r border-zinc-800"
            >
              {/* Drawer Header */}
              <div className="h-20 flex items-center justify-between px-5 border-b border-zinc-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-white font-black text-lg tracking-tight">IQRO<span className="text-emerald-400">MAX</span></h1>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">Admin Portal</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-zinc-400 hover:text-white rounded-xl h-9 w-9 hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Drawer Menu */}
              <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => {
                        handleMenuClick(item);
                        if (!item.subItems) {
                          setMobileSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${
                        activeTab === item.id 
                          ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span className="font-bold text-sm">{item.label}</span>
                    </button>

                    {item.subItems && (
                      <div className="pl-6 pr-2 mt-2 space-y-1">
                        {item.subItems.map((sub) => (
                          <div key={sub.id} className="space-y-1">
                            <button
                              onClick={() => {
                                if (!sub.subItems) {
                                  setActiveTab(sub.id);
                                  setMobileSidebarOpen(false);
                                }
                              }}
                              className={`w-full flex items-center gap-3 py-2 text-xs font-bold transition-all rounded-xl px-3 ${
                                activeTab === sub.id 
                                  ? 'text-emerald-400 bg-emerald-500/10' 
                                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                              }`}
                            >
                              <sub.icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate text-xs font-bold">{sub.label}</span>
                            </button>
                            
                            {sub.subItems && (
                              <div className="pl-6 space-y-1 mt-1">
                                {sub.subItems.map((nested: any) => (
                                  <button
                                    key={nested.id}
                                    onClick={() => {
                                      setActiveTab(nested.id);
                                      setMobileSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-2 py-1.5 text-[10px] font-bold transition-all rounded-lg px-2 ${
                                      activeTab === nested.id 
                                        ? 'text-emerald-400' 
                                        : 'text-zinc-600 hover:text-zinc-400'
                                    }`}
                                  >
                                    <nested.icon className="w-3 h-3" />
                                    <span>{nested.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-zinc-800 mt-auto">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Chiqish</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-zinc-900 border-r border-zinc-800 hidden lg:flex flex-col relative z-20 h-full shrink-0"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-5 border-b border-zinc-800 shrink-0 gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-white font-black text-lg tracking-tight">IQRO<span className="text-emerald-400">MAX</span></h1>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">Admin Portal</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative"
            >
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${
                  activeTab === item.id 
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : ''}`} />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-bold text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
                {activeTab === item.id && !sidebarOpen && (
                  <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />
                )}
              </button>

              {/* Sub-menu on Hover */}
              <AnimatePresence>
                {hoveredItem === item.id && item.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="pl-12 pr-4 space-y-1 overflow-hidden"
                  >
                    {item.subItems.map((sub) => (
                      <div 
                        key={sub.id} 
                        className="space-y-1"
                        onMouseEnter={() => setHoveredSubItem(sub.id)}
                        onMouseLeave={() => setHoveredSubItem(null)}
                      >
                        <button
                          onClick={() => sub.subItems ? null : setActiveTab(sub.id)}
                          className={`w-full flex items-center gap-3 py-2 text-xs font-bold transition-all rounded-xl px-3 ${
                            activeTab === sub.id 
                              ? 'text-emerald-400 bg-emerald-500/10' 
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                          }`}
                        >
                          <sub.icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.label}</span>
                          {sub.subItems && (
                            <motion.div
                              animate={{ rotate: hoveredSubItem === sub.id ? 90 : 0 }}
                              className="ml-auto"
                            >
                              <ChevronRight className="w-3 h-3 opacity-50" />
                            </motion.div>
                          )}
                        </button>
                        
                        {/* Second Level Sub-menu - Only on Hover */}
                        <AnimatePresence>
                          {sub.subItems && hoveredSubItem === sub.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-6 space-y-1 border-l border-zinc-800 ml-4 mt-1 overflow-hidden"
                            >
                              {sub.subItems.map((nested: any) => (
                                <button
                                  key={nested.id}
                                  onClick={() => setActiveTab(nested.id)}
                                  className={`w-full flex items-center gap-2 py-1.5 text-[10px] font-bold transition-all rounded-lg px-2 ${
                                    activeTab === nested.id 
                                      ? 'text-emerald-400' 
                                      : 'text-zinc-600 hover:text-zinc-400'
                                  }`}
                                >
                                  <nested.icon className="w-3 h-3" />
                                  <span>{nested.label}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Sidebar Footer - Logout Button at the bottom */}
        <div className="mt-auto p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {sidebarOpen && <span className="font-bold text-sm">Chiqish</span>}
          </button>
        </div>
        
        {/* Toggle Button - floating at right edge */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-zinc-200 hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center text-zinc-500 hover:text-white transition-all duration-300 shadow-lg z-30"
          title={sidebarOpen ? 'Yopish' : 'Ochish'}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-4 sm:px-8 shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden h-10 w-10 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input 
                placeholder="Qidirish..." 
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="h-11 pl-12 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-emerald-500/10 transition-all border-none outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
