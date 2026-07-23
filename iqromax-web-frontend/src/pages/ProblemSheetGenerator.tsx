import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { PageBackground } from '@/components/layout/PageBackground';
import { useSound } from '@/hooks/useSound';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, FileText, Save, FolderOpen, Trash2, Loader2, Share2, Copy, Globe, Lock, Columns, Hash, Calculator, Layers, LayoutGrid, ClipboardList, Sparkles, ArrowRight, CheckCircle2, Printer, BookOpen } from 'lucide-react';
import { generateProblem, getLegacyFormulas, FORMULA_LABELS, validateProblemSequence } from '@/lib/sorobanEngine';
import { ProblemSheetTable } from '@/components/ProblemSheetTable';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


interface Problem {
  id: number;
  sequence: number[];
  answer: number;
}

interface GeneratedSheet {
  problems: Problem[];
  settings: {
    digitCount: number;
    operationCount: number;
    formulaType: string;
    problemCount: number;
  };
}

interface SavedSheet {
  id: string;
  title: string;
  digit_count: number;
  operation_count: number;
  formula_type: string;
  problem_count: number;
  columns_per_row: number;
  problems: Problem[];
  created_at: string;
  is_public: boolean;
  share_code: string | null;
}

const settingsConfig = [
  { id: 'digitCount', label: 'Xona soni', icon: Hash },
  { id: 'operationCount', label: 'Ustun soni', icon: Columns },
  { id: 'formulaType', label: 'Formula turi', icon: Calculator },
  { id: 'problemCount', label: 'Misollar soni', icon: Layers },
  { id: 'columnsPerRow', label: 'Qatorga ustun', icon: LayoutGrid },
];

const ProblemSheetGenerator = () => {
  const { soundEnabled, toggleSound, playSound } = useSound();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Settings
  const [digitCount, setDigitCount] = useState(1);
  const [operationCount, setOperationCount] = useState(8);
  const [formulaType, setFormulaType] = useState('formulasiz');
  const [problemCount, setProblemCount] = useState(50);
  const [columnsPerRow, setColumnsPerRow] = useState(10);
  
  // Generated sheet
  const [sheet, setSheet] = useState<GeneratedSheet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Saved sheets
  const [savedSheets, setSavedSheets] = useState<SavedSheet[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [savingSheet, setSavingSheet] = useState(false);
  const [sheetTitle, setSheetTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [currentShareSheet, setCurrentShareSheet] = useState<SavedSheet | null>(null);
  const [updatingShare, setUpdatingShare] = useState(false);
  
  const playClick = () => playSound('tick');
  
  // Load shared sheet from URL
  useEffect(() => {
    const shareCode = searchParams.get('code');
    if (shareCode) {
      loadSharedSheet(shareCode);
    }
  }, [searchParams]);
  
  const loadSharedSheet = async (code: string) => {
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from('problem_sheets')
      .select('*')
      .eq('share_code', code)
      .eq('is_public', true)
      .single();
    
    if (error || !data) {
      toast.error("Varaq topilmadi yoki yopiq");
    } else {
      const savedSheet = { ...data, problems: data.problems as unknown as Problem[] };
      setDigitCount(savedSheet.digit_count);
      setOperationCount(savedSheet.operation_count);
      setFormulaType(savedSheet.formula_type);
      setProblemCount(savedSheet.problem_count);
      setColumnsPerRow(savedSheet.columns_per_row);
      setSheet({
        problems: savedSheet.problems,
        settings: {
          digitCount: savedSheet.digit_count,
          operationCount: savedSheet.operation_count,
          formulaType: savedSheet.formula_type,
          problemCount: savedSheet.problem_count,
        },
      });
      toast.success(`"${savedSheet.title}" yuklandi`);
    }
    setLoadingSaved(false);
  };
  
  const fetchSavedSheets = useCallback(async () => {
    if (!user) return;
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from('problem_sheets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sheets:', error);
    } else {
      setSavedSheets((data || []).map(d => ({ ...d, problems: d.problems as unknown as Problem[] })));
    }
    setLoadingSaved(false);
  }, [user]);
  
  useEffect(() => {
    if (showLoadDialog) fetchSavedSheets();
  }, [showLoadDialog, fetchSavedSheets]);
  
  const saveSheet = async () => {
    if (!user || !sheet) return;
    if (!sheetTitle.trim()) { toast.error("Iltimos, varaq nomini kiriting"); return; }
    setSavingSheet(true);
    const { error } = await supabase
      .from('problem_sheets')
      .insert([{
        user_id: user.id, title: sheetTitle.trim(),
        digit_count: digitCount, operation_count: operationCount,
        formula_type: formulaType, problem_count: problemCount,
        columns_per_row: columnsPerRow,
        problems: JSON.parse(JSON.stringify(sheet.problems)),
      }]);
    if (error) { toast.error("Saqlashda xatolik yuz berdi"); }
    else { toast.success("Varaq muvaffaqiyatli saqlandi!"); setShowSaveDialog(false); setSheetTitle(''); }
    setSavingSheet(false);
  };
  
  const loadSheet = (savedSheet: SavedSheet) => {
    setDigitCount(savedSheet.digit_count);
    setOperationCount(savedSheet.operation_count);
    setFormulaType(savedSheet.formula_type);
    setProblemCount(savedSheet.problem_count);
    setColumnsPerRow(savedSheet.columns_per_row);
    setSheet({
      problems: savedSheet.problems,
      settings: {
        digitCount: savedSheet.digit_count, operationCount: savedSheet.operation_count,
        formulaType: savedSheet.formula_type, problemCount: savedSheet.problem_count,
      },
    });
    setShowLoadDialog(false);
    toast.success(`"${savedSheet.title}" yuklandi`);
  };
  
  const deleteSheet = async (id: string) => {
    const { error } = await supabase.from('problem_sheets').delete().eq('id', id);
    if (error) { toast.error("O'chirishda xatolik"); }
    else { setSavedSheets(prev => prev.filter(s => s.id !== id)); toast.success("Varaq o'chirildi"); }
  };
  
  const generateShareCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };
  
  const toggleSheetPublic = async (sheet: SavedSheet, makePublic: boolean) => {
    setUpdatingShare(true);
    const shareCode = makePublic && !sheet.share_code ? generateShareCode() : sheet.share_code;
    const { error } = await supabase
      .from('problem_sheets')
      .update({ is_public: makePublic, share_code: makePublic ? shareCode : sheet.share_code })
      .eq('id', sheet.id);
    if (error) { toast.error("Xatolik yuz berdi"); }
    else {
      setSavedSheets(prev => prev.map(s => s.id === sheet.id ? { ...s, is_public: makePublic, share_code: shareCode } : s));
      setCurrentShareSheet(prev => prev ? { ...prev, is_public: makePublic, share_code: shareCode } : null);
      toast.success(makePublic ? "Varaq ommaviy qilindi" : "Varaq yopiq qilindi");
    }
    setUpdatingShare(false);
  };
  
  const copyShareLink = (shareCode: string) => {
    const url = `${window.location.origin}/problem-sheet?code=${shareCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Havola nusxalandi!");
  };
  
  const openShareDialog = (sheet: SavedSheet) => {
    setCurrentShareSheet(sheet);
    setShowShareDialog(true);
  };
  
  const generateSheet = useCallback(() => {
    playClick();
    setIsGenerating(true);
    setTimeout(() => {
      const problems: GeneratedSheet['problems'] = [];
      const allowedFormulas = getLegacyFormulas(formulaType);
      for (let i = 0; i < problemCount; i++) {
        const problem = generateProblem({ digitCount, operationCount, allowedFormulas, ensurePositiveResult: true });
        const fullSequence = [problem.startValue, ...problem.sequence];
        const isLengthOk = fullSequence.length === operationCount;
        const hasEmpty = fullSequence.some(n => n === undefined || n === null || Number.isNaN(n));
        const validation = validateProblemSequence(fullSequence, allowedFormulas);
        if (isLengthOk && !hasEmpty && validation.isValid) {
          problems.push({ id: i + 1, sequence: fullSequence, answer: problem.finalAnswer });
        } else { i--; }
      }
      setSheet({ problems, settings: { digitCount, operationCount, formulaType, problemCount } });
      setIsGenerating(false);
    }, 100);
  }, [digitCount, operationCount, formulaType, problemCount, playClick]);
  
  const downloadPDF = useCallback(() => {
    if (!sheet) return;
    playClick();

    // ============ BRAND COLORS ============
    const ORANGE: [number, number, number] = [249, 115, 22];
    const ORANGE_DEEP: [number, number, number] = [194, 65, 12];
    const ORANGE_LIGHT: [number, number, number] = [254, 215, 170];
    const ORANGE_VERY_LIGHT: [number, number, number] = [255, 247, 237];
    const AMBER: [number, number, number] = [251, 191, 36];
    const AMBER_LIGHT: [number, number, number] = [254, 243, 199];
    const AMBER_VERY_LIGHT: [number, number, number] = [255, 251, 235];
    const EMERALD: [number, number, number] = [16, 185, 129];
    const EMERALD_DEEP: [number, number, number] = [4, 120, 87];
    const EMERALD_LIGHT: [number, number, number] = [167, 243, 208];
    const EMERALD_VERY_LIGHT: [number, number, number] = [236, 253, 245];
    const PURPLE: [number, number, number] = [168, 85, 247];
    const PURPLE_LIGHT: [number, number, number] = [243, 232, 255];
    const SLATE_DARK: [number, number, number] = [15, 23, 42];
    const SLATE: [number, number, number] = [100, 116, 139];
    const SLATE_LIGHT: [number, number, number] = [241, 245, 249];
    const ALT_ROW: [number, number, number] = [249, 250, 252];
    const WHITE: [number, number, number] = [255, 255, 255];
    const BORDER: [number, number, number] = [226, 232, 240];
    const BORDER_LIGHT: [number, number, number] = [241, 245, 249];

    const formulaLabel = FORMULA_LABELS[formulaType]?.label || formulaType;
    const title = `${sheet.settings.operationCount} ustun · ${formulaLabel} · ${sheet.settings.digitCount} xona`;
    const dateStr = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
    const fileName = `IQROMAX_misollar_${sheet.settings.operationCount}u_${sheet.settings.digitCount}x_${new Date().toISOString().slice(0, 10)}.pdf`;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;

    // ============ HELPER: Watermark math symbols background ============
    const drawWatermark = () => {
      doc.setFontSize(48);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(252, 211, 161); // very light orange
      const symbols = [
        { ch: '+', x: 28, y: 90, rot: -15 },
        { ch: '×', x: pageWidth - 35, y: 120, rot: 12 },
        { ch: '÷', x: 35, y: 200, rot: -8 },
        { ch: '−', x: pageWidth - 30, y: 220, rot: 5 },
        { ch: '=', x: pageWidth / 2, y: 260, rot: -3 },
      ];
      symbols.forEach((s) => {
        // Set very faint
        doc.setGState(doc.GState({ opacity: 0.06 }));
        doc.text(s.ch, s.x, s.y, { angle: s.rot });
      });
      doc.setGState(doc.GState({ opacity: 1 }));
    };

    // ============ HELPER: Gradient simulation (multiple thin rectangles) ============
    const drawGradientBar = (
      x: number,
      y: number,
      w: number,
      h: number,
      from: [number, number, number],
      to: [number, number, number]
    ) => {
      const steps = 30;
      const stepW = w / steps;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const r = Math.round(from[0] + (to[0] - from[0]) * t);
        const g = Math.round(from[1] + (to[1] - from[1]) * t);
        const b = Math.round(from[2] + (to[2] - from[2]) * t);
        doc.setFillColor(r, g, b);
        doc.rect(x + i * stepW, y, stepW + 0.2, h, 'F');
      }
    };

    // ============ HELPER: Decorative dots pattern ============
    const drawDecorativeDots = (cx: number, cy: number, color: [number, number, number]) => {
      doc.setFillColor(...color);
      const dots = [
        { dx: -4, dy: -4, r: 0.8 },
        { dx: 4, dy: -4, r: 0.6 },
        { dx: -4, dy: 4, r: 0.6 },
        { dx: 4, dy: 4, r: 0.8 },
        { dx: 0, dy: -6, r: 0.4 },
        { dx: 0, dy: 6, r: 0.4 },
      ];
      dots.forEach((d) => {
        doc.circle(cx + d.dx, cy + d.dy, d.r, 'F');
      });
    };

    // ============ HELPER: Brand header (gradient band + logo + decorations) ============
    const drawBrandHeader = (pageTitle: string, accentColor: [number, number, number], accentDeep: [number, number, number]) => {
      // ==== Top gradient banner (thin) ====
      drawGradientBar(0, 0, pageWidth, 5, accentColor, accentDeep);

      // ==== Logo card (rounded square with brand mark) ====
      const logoX = margin;
      const logoY = 11;
      const logoSize = 11;

      // Logo glow shadow
      doc.setFillColor(...accentColor);
      doc.setGState(doc.GState({ opacity: 0.2 }));
      doc.roundedRect(logoX - 0.5, logoY - 0.5, logoSize + 1, logoSize + 1, 2.5, 2.5, 'F');
      doc.setGState(doc.GState({ opacity: 1 }));

      // Logo body
      drawGradientBar(logoX, logoY, logoSize, logoSize, ORANGE, ORANGE_DEEP);
      // Re-add rounded corners overlay (white triangles in corners are tricky in jsPDF, use rect)
      doc.setFillColor(...accentColor);
      doc.roundedRect(logoX, logoY, logoSize, logoSize, 2.5, 2.5, 'S'); // stroke only

      doc.setTextColor(...WHITE);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('IM', logoX + logoSize / 2, logoY + 7.5, { align: 'center' });

      // ==== Brand name + tagline ====
      doc.setTextColor(...SLATE_DARK);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('IQROMAX', logoX + logoSize + 3, logoY + 4.5);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...accentColor);
      doc.text("BILIM · NATIJA · DAROMAD", logoX + logoSize + 3, logoY + 9);

      // ==== Right side info card (date + ID) ====
      const sheetId = `№${Date.now().toString().slice(-5)}`;
      const dateW = 42;
      const infoX = pageWidth - margin - dateW;
      const infoY = 11;

      // Background
      doc.setFillColor(...SLATE_LIGHT);
      doc.roundedRect(infoX, infoY, dateW, 11, 2, 2, 'F');

      // Date
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...SLATE);
      doc.text("SANA", infoX + 3, infoY + 4);
      doc.setFontSize(8);
      doc.setTextColor(...SLATE_DARK);
      doc.text(dateStr, infoX + dateW - 3, infoY + 4, { align: 'right' });

      // Divider
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.2);
      doc.line(infoX + 2, infoY + 5.5, infoX + dateW - 2, infoY + 5.5);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...SLATE);
      doc.text("VARAQ", infoX + 3, infoY + 9);
      doc.setFontSize(8);
      doc.setTextColor(...accentColor);
      doc.text(sheetId, infoX + dateW - 3, infoY + 9, { align: 'right' });

      // ==== Title section ====
      const titleY = 31;

      // Decorative line accent
      doc.setFillColor(...accentColor);
      doc.roundedRect(pageWidth / 2 - 18, titleY - 3, 36, 1.2, 0.6, 0.6, 'F');

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...accentDeep);
      doc.text(pageTitle, pageWidth / 2, titleY + 4, { align: 'center' });

      // Subtitle
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...SLATE);
      doc.text(title, pageWidth / 2, titleY + 9, { align: 'center' });

      // ==== Info pills row ====
      const pillY = titleY + 13;
      const pills = [
        { label: `${sheet.settings.problemCount} misol`, color: ORANGE_DEEP, bg: ORANGE_VERY_LIGHT },
        { label: `${sheet.settings.operationCount} ustun`, color: PURPLE, bg: PURPLE_LIGHT },
        { label: `${sheet.settings.digitCount} xona`, color: EMERALD_DEEP, bg: EMERALD_VERY_LIGHT },
        { label: formulaLabel, color: AMBER[0] - 50 > 0 ? [180, 120, 0] as [number, number, number] : AMBER, bg: AMBER_VERY_LIGHT },
      ];
      // Center the pills
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      const totalPillsW = pills.reduce((s, p) => s + doc.getTextWidth(p.label) + 7, 0) + (pills.length - 1) * 3;
      let pillX = (pageWidth - totalPillsW) / 2;
      pills.forEach((p) => {
        const w = doc.getTextWidth(p.label) + 7;
        doc.setFillColor(...p.bg);
        doc.roundedRect(pillX, pillY, w, 5.5, 2.75, 2.75, 'F');
        doc.setTextColor(...p.color);
        doc.text(p.label, pillX + w / 2, pillY + 3.7, { align: 'center' });
        pillX += w + 3;
      });

      // ==== Student info box (Ism / Sinf / Ball) ====
      const studentY = pillY + 9;
      const studentH = 11;

      doc.setFillColor(...WHITE);
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, studentY, pageWidth - 2 * margin, studentH, 2, 2, 'FD');

      const fieldW = (pageWidth - 2 * margin - 6) / 4;
      const fields = ['Ism', 'Sinf', 'Sana', 'Ball'];
      fields.forEach((label, i) => {
        const fx = margin + 3 + i * fieldW;
        // Label
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...SLATE);
        doc.text(label.toUpperCase(), fx + 2, studentY + 3.5);
        // Underline (where student writes)
        doc.setDrawColor(...BORDER);
        doc.setLineWidth(0.4);
        doc.line(fx + 2, studentY + studentH - 2.5, fx + fieldW - 4, studentY + studentH - 2.5);
        // Vertical divider
        if (i > 0) {
          doc.setDrawColor(...BORDER_LIGHT);
          doc.setLineWidth(0.2);
          doc.line(fx - 1, studentY + 2, fx - 1, studentY + studentH - 2);
        }
      });

      return studentY + studentH + 5;
    };

    // ============ HELPER: Footer with page number and decorative elements ============
    const drawFooter = (pageNum: number, totalPages: number) => {
      const footerY = pageHeight - 11;

      // Decorative divider with center diamond
      const lineY = footerY + 1;
      doc.setDrawColor(...ORANGE_LIGHT);
      doc.setLineWidth(0.4);
      doc.line(margin, lineY, pageWidth / 2 - 6, lineY);
      doc.line(pageWidth / 2 + 6, lineY, pageWidth - margin, lineY);

      // Center diamond
      doc.setFillColor(...ORANGE);
      doc.setDrawColor(...ORANGE);
      const diamondCX = pageWidth / 2;
      const diamondCY = lineY;
      const diamondR = 1.5;
      doc.triangle(diamondCX, diamondCY - diamondR, diamondCX + diamondR, diamondCY, diamondCX, diamondCY + diamondR, 'F');
      doc.triangle(diamondCX, diamondCY - diamondR, diamondCX - diamondR, diamondCY, diamondCX, diamondCY + diamondR, 'F');

      // Footer text
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...SLATE);
      doc.text("IQROMAX · iqromax.uz", margin, pageHeight - 5);

      doc.setTextColor(...ORANGE_DEEP);
      doc.setFont('helvetica', 'bold');
      doc.text("Bilim · Natija · Daromad", pageWidth / 2, pageHeight - 5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...SLATE);
      doc.text(`Sahifa ${pageNum} / ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
    };

    // ============ HELPER: Decorative corner ornaments ============
    const drawCornerOrnaments = (color: [number, number, number]) => {
      const ornSize = 8;
      doc.setDrawColor(...color);
      doc.setLineWidth(0.6);
      // Top-left corner
      doc.line(margin - 3, 8, margin - 3 + ornSize, 8);
      doc.line(margin - 3, 8, margin - 3, 8 + ornSize);
      // Top-right corner
      doc.line(pageWidth - margin + 3 - ornSize, 8, pageWidth - margin + 3, 8);
      doc.line(pageWidth - margin + 3, 8, pageWidth - margin + 3, 8 + ornSize);
      // Bottom-left corner
      doc.line(margin - 3, pageHeight - 8, margin - 3 + ornSize, pageHeight - 8);
      doc.line(margin - 3, pageHeight - 8 - ornSize, margin - 3, pageHeight - 8);
      // Bottom-right corner
      doc.line(pageWidth - margin + 3 - ornSize, pageHeight - 8, pageWidth - margin + 3, pageHeight - 8);
      doc.line(pageWidth - margin + 3, pageHeight - 8 - ornSize, pageWidth - margin + 3, pageHeight - 8);
    };

    // ============ PAGE 1: PROBLEMS ============
    drawWatermark();
    let yPos = drawBrandHeader('Misollar', ORANGE, ORANGE_DEEP);

    const totalGridRows = Math.ceil(sheet.problems.length / columnsPerRow);
    const cellWidth = (pageWidth - 2 * margin) / columnsPerRow;
    const cellHeight = 7.5;

    for (let row = 0; row < totalGridRows; row++) {
      const startIdx = row * columnsPerRow;
      const rowProblems = sheet.problems.slice(startIdx, startIdx + columnsPerRow);
      if (rowProblems.length === 0) continue;
      const maxOps = Math.max(...rowProblems.map((p) => p.sequence.length));
      const tableHeight = (maxOps + 2) * cellHeight + 5;

      if (yPos + tableHeight > pageHeight - 16) {
        drawCornerOrnaments(ORANGE_LIGHT);
        doc.addPage();
        drawWatermark();
        yPos = drawBrandHeader('Misollar (davomi)', ORANGE, ORANGE_DEEP);
      }

      const blockX = margin;
      const blockY = yPos;
      const blockW = pageWidth - 2 * margin;
      const blockH = (maxOps + 2) * cellHeight;

      // Drop shadow simulation (offset light gray)
      doc.setFillColor(...BORDER_LIGHT);
      doc.roundedRect(blockX + 0.6, blockY + 0.8, blockW, blockH, 3, 3, 'F');

      // Block background with subtle border
      doc.setFillColor(...WHITE);
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.4);
      doc.roundedRect(blockX, blockY, blockW, blockH, 3, 3, 'FD');

      // ===== Row header (orange gradient bar with problem numbers) =====
      drawGradientBar(blockX, blockY, blockW, cellHeight, ORANGE, ORANGE_DEEP);
      // Re-apply rounded top corners on top of gradient
      doc.setFillColor(...ORANGE);
      doc.setDrawColor(...ORANGE_DEEP);
      doc.setLineWidth(0.2);

      doc.setTextColor(...WHITE);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      rowProblems.forEach((p, idx) => {
        const x = blockX + idx * cellWidth;
        // Number circle
        const circleX = x + cellWidth / 2;
        const circleY = blockY + cellHeight / 2;
        doc.setFillColor(...WHITE);
        doc.setGState(doc.GState({ opacity: 0.2 }));
        doc.circle(circleX, circleY, 2.6, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        doc.setTextColor(...WHITE);
        doc.text(`${p.id}`, circleX, blockY + cellHeight - 2.5, { align: 'center' });
        // Vertical separator
        if (idx > 0) {
          doc.setDrawColor(255, 255, 255);
          doc.setGState(doc.GState({ opacity: 0.3 }));
          doc.setLineWidth(0.2);
          doc.line(x, blockY + 1.5, x, blockY + cellHeight - 1.5);
          doc.setGState(doc.GState({ opacity: 1 }));
        }
      });

      // ===== Sequence rows =====
      doc.setTextColor(...SLATE_DARK);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');

      for (let opIdx = 0; opIdx < maxOps; opIdx++) {
        const rowY = blockY + cellHeight + opIdx * cellHeight;
        const isEven = opIdx % 2 === 0;

        if (isEven) {
          doc.setFillColor(...ALT_ROW);
          doc.rect(blockX + 0.4, rowY, blockW - 0.8, cellHeight, 'F');
        }

        rowProblems.forEach((p, idx) => {
          const x = blockX + idx * cellWidth;
          // Vertical separator
          if (idx > 0) {
            doc.setDrawColor(...BORDER_LIGHT);
            doc.setLineWidth(0.25);
            doc.line(x, rowY, x, rowY + cellHeight);
          }
          const value = p.sequence[opIdx];
          if (value !== undefined && value !== null) {
            const isFirstNum = opIdx === 0;
            // Color: first = dark slate (start value); positive = dark slate; negative = orange (red-ish)
            doc.setTextColor(...(isFirstNum ? SLATE_DARK : value >= 0 ? SLATE_DARK : ORANGE_DEEP));

            // Show + or - prefix (skip for first number)
            const display = isFirstNum
              ? String(value)
              : value >= 0
              ? `+${value}`
              : `${value}`;
            doc.text(display, x + cellWidth / 2, rowY + cellHeight - 2, { align: 'center' });
          }
        });
      }

      // ===== Answer row (gradient amber bar with empty answer slots) =====
      const answerY = blockY + cellHeight + maxOps * cellHeight;
      drawGradientBar(blockX + 0.4, answerY, blockW - 0.8, cellHeight, AMBER_LIGHT, AMBER_VERY_LIGHT);

      // Top edge of answer row (dashed amber)
      doc.setDrawColor(...AMBER);
      doc.setLineWidth(0.5);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(blockX + 1, answerY, blockX + blockW - 1, answerY);
      doc.setLineDashPattern([], 0);

      // Answer line for student to write on
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      rowProblems.forEach((_, idx) => {
        const x = blockX + idx * cellWidth;
        // Vertical separator
        if (idx > 0) {
          doc.setDrawColor(...AMBER);
          doc.setGState(doc.GState({ opacity: 0.3 }));
          doc.setLineWidth(0.3);
          doc.line(x, answerY + 1, x, answerY + cellHeight - 1);
          doc.setGState(doc.GState({ opacity: 1 }));
        }
        // Equal sign
        doc.setTextColor(180, 120, 0);
        doc.setFontSize(10);
        doc.text('=', x + 4, answerY + cellHeight - 2.5);
        // Writing line for answer
        doc.setDrawColor(180, 120, 0);
        doc.setLineWidth(0.4);
        doc.line(x + 7, answerY + cellHeight - 2, x + cellWidth - 2.5, answerY + cellHeight - 2);
      });

      yPos += blockH + 6;
    }

    drawCornerOrnaments(ORANGE_LIGHT);

    // ============ ANSWERS PAGE ============
    doc.addPage();
    drawWatermark();
    let answersYPos = drawBrandHeader("Javoblar varag'i", EMERALD, EMERALD_DEEP);

    // Decorative success banner
    doc.setFillColor(...EMERALD_VERY_LIGHT);
    doc.setDrawColor(...EMERALD_LIGHT);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, answersYPos, pageWidth - 2 * margin, 9, 2, 2, 'FD');
    doc.setTextColor(...EMERALD_DEEP);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text("Javoblarni tekshirib ko'ring va o'qituvchiga topshiring", pageWidth / 2, answersYPos + 5.5, { align: 'center' });
    answersYPos += 13;

    const answersPerRow = 10;
    const answerCellWidth = (pageWidth - 2 * margin) / answersPerRow;
    const answerCellHeight = 9;
    const answerRows = Math.ceil(sheet.problems.length / answersPerRow);

    for (let row = 0; row < answerRows; row++) {
      const startIdx = row * answersPerRow;
      const rowProblems = sheet.problems.slice(startIdx, startIdx + answersPerRow);
      const blockH = answerCellHeight * 2;

      if (answersYPos + blockH + 4 > pageHeight - 16) {
        drawCornerOrnaments(EMERALD_LIGHT);
        doc.addPage();
        drawWatermark();
        answersYPos = drawBrandHeader("Javoblar (davomi)", EMERALD, EMERALD_DEEP);
      }

      const blockX = margin;
      const blockW = pageWidth - 2 * margin;

      // Drop shadow
      doc.setFillColor(...BORDER_LIGHT);
      doc.roundedRect(blockX + 0.6, answersYPos + 0.8, blockW, blockH, 3, 3, 'F');

      // Outer block
      doc.setFillColor(...WHITE);
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.4);
      doc.roundedRect(blockX, answersYPos, blockW, blockH, 3, 3, 'FD');

      // Top: number row (emerald gradient)
      drawGradientBar(blockX, answersYPos, blockW, answerCellHeight, EMERALD, EMERALD_DEEP);

      doc.setTextColor(...WHITE);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      rowProblems.forEach((p, idx) => {
        const x = blockX + idx * answerCellWidth;
        doc.text(`${p.id}`, x + answerCellWidth / 2, answersYPos + answerCellHeight - 3, { align: 'center' });
        if (idx > 0) {
          doc.setDrawColor(255, 255, 255);
          doc.setGState(doc.GState({ opacity: 0.3 }));
          doc.setLineWidth(0.2);
          doc.line(x, answersYPos + 1.5, x, answersYPos + answerCellHeight - 1.5);
          doc.setGState(doc.GState({ opacity: 1 }));
        }
      });

      // Bottom: answer values (emerald light bg)
      const valueY = answersYPos + answerCellHeight;
      doc.setFillColor(...EMERALD_VERY_LIGHT);
      doc.rect(blockX + 0.4, valueY, blockW - 0.8, answerCellHeight - 0.4, 'F');

      doc.setTextColor(...EMERALD_DEEP);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      rowProblems.forEach((p, idx) => {
        const x = blockX + idx * answerCellWidth;
        if (idx > 0) {
          doc.setDrawColor(...EMERALD_LIGHT);
          doc.setLineWidth(0.3);
          doc.line(x, valueY, x, valueY + answerCellHeight);
        }
        doc.text(String(p.answer), x + answerCellWidth / 2, valueY + answerCellHeight - 3, { align: 'center' });
      });

      answersYPos += blockH + 5;
    }

    drawCornerOrnaments(EMERALD_LIGHT);

    // ============ Add footers to all pages ============
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawFooter(i, totalPages);
    }

    doc.save(fileName);
    toast.success("PDF muvaffaqiyatli yuklab olindi!");
  }, [sheet, formulaType, columnsPerRow, playClick]);
  
  return (
    <PageBackground className="min-h-screen pb-20 sm:pb-24 bg-gradient-to-br from-orange-50/40 via-background to-amber-50/30 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <main className="container mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* HERO */}
          <section className="rounded-3xl bg-gradient-to-br from-orange-50/80 via-amber-50/40 to-white dark:from-orange-950/30 dark:via-amber-950/20 dark:to-card border border-orange-200/60 dark:border-orange-800/40 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 px-5 sm:px-7 py-6 sm:py-8">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-500 text-white shadow-sm mb-3">
                  <ClipboardList className="h-3 w-3" />
                  MASALA VARAQLARI
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                  Misol <span className="text-orange-500">varaqi</span> generatori
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Soroban metodikasi asosida tayyor misollar varag'ini generatsiya qiling, saqlang va
                  bosib chiqarish uchun PDF formatida yuklab oling.
                </p>

                {/* Inline quick badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                    <CheckCircle2 className="h-3 w-3" /> Avtomatik tekshiruv
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/40">
                    <Printer className="h-3 w-3" /> A4 PDF eksport
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                    <Share2 className="h-3 w-3" /> Ulashish mumkin
                  </span>
                </div>
              </div>

              {/* Right summary */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                {sheet ? (
                  <div>
                    <div className="font-display font-black text-xl text-orange-600">{sheet.problems.length}</div>
                    <div className="text-[11px] text-muted-foreground">misol tayyor</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Generatsiya qilindi
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-display font-bold text-base">Tayyor</div>
                    <div className="text-[11px] text-muted-foreground">Sozlamalarni tanlang</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* QUICK STATS PREVIEW */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { ic: Hash, value: `${digitCount}`, label: 'Xona soni', sub: 'masala', bg: 'bg-emerald-100 dark:bg-emerald-900/40', fg: 'text-emerald-600' },
              { ic: Columns, value: operationCount, label: 'Ustun soni', sub: 'misolda', bg: 'bg-orange-100 dark:bg-orange-900/40', fg: 'text-orange-600' },
              { ic: Calculator, value: FORMULA_LABELS[formulaType]?.label?.split(' ')[0] || formulaType, label: 'Formula', sub: 'turi', bg: 'bg-purple-100 dark:bg-purple-900/40', fg: 'text-purple-600' },
              { ic: Layers, value: problemCount, label: 'Jami misollar', sub: 'varaqda', bg: 'bg-amber-100 dark:bg-amber-900/40', fg: 'text-amber-600' },
              { ic: LayoutGrid, value: columnsPerRow, label: 'Qatorga', sub: 'ustun', bg: 'bg-blue-100 dark:bg-blue-900/40', fg: 'text-blue-600' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/40 p-3 sm:p-4 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                  <s.ic className={`h-4 w-4 ${s.fg}`} />
                </div>
                <div className={`text-base sm:text-lg font-display font-black ${s.fg} leading-tight truncate`}>
                  {s.value}
                </div>
                <div className="text-[10px] font-semibold mt-0.5">{s.label}</div>
                <div className="text-[9px] text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </section>

          {/* SETTINGS CARD */}
          <Card className="border-border/40 shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>Generatsiya sozlamalari</span>
                </CardTitle>
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  Variantni tanlab "Generatsiya" tugmasini bosing
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Digit Count */}
                <div className="space-y-2">
                  <Label htmlFor="digitCount" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Xona soni
                  </Label>
                  <Select value={String(digitCount)} onValueChange={(v) => setDigitCount(Number(v))}>
                    <SelectTrigger id="digitCount" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 xonali</SelectItem>
                      <SelectItem value="2">2 xonali</SelectItem>
                      <SelectItem value="3">3 xonali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Operation Count */}
                <div className="space-y-2">
                  <Label htmlFor="operationCount" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Columns className="w-3.5 h-3.5" /> Ustun soni
                  </Label>
                  <Select value={String(operationCount)} onValueChange={(v) => setOperationCount(Number(v))}>
                    <SelectTrigger id="operationCount" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 6, 7, 8, 9, 10, 12, 15].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} ta</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Formula Type */}
                <div className="space-y-2">
                  <Label htmlFor="formulaType" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" /> Formula turi
                  </Label>
                  <Select value={formulaType} onValueChange={setFormulaType}>
                    <SelectTrigger id="formulaType" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formulasiz">📘 Formulasiz</SelectItem>
                      <SelectItem value="kichik_dost">🔢 Kichik do'st (5)</SelectItem>
                      <SelectItem value="katta_dost">🔟 Katta do'st (10)</SelectItem>
                      <SelectItem value="mix">🎯 Aralash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Problem Count */}
                <div className="space-y-2">
                  <Label htmlFor="problemCount" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Misollar soni
                  </Label>
                  <Select value={String(problemCount)} onValueChange={(v) => setProblemCount(Number(v))}>
                    <SelectTrigger id="problemCount" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[20, 30, 40, 50, 60, 80, 100].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} ta</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Columns Per Row */}
                <div className="space-y-2">
                  <Label htmlFor="columnsPerRow" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <LayoutGrid className="w-3.5 h-3.5" /> Qatorga ustun
                  </Label>
                  <Select value={String(columnsPerRow)} onValueChange={(v) => setColumnsPerRow(Number(v))}>
                    <SelectTrigger id="columnsPerRow" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 8, 10, 12].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} ta</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-border/40">
                <Button
                  onClick={generateSheet}
                  disabled={isGenerating}
                  size="lg"
                  className="gap-2 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/25"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generatsiya...' : 'Generatsiya qilish'}
                  {!isGenerating && <ArrowRight className="w-4 h-4" />}
                </Button>

                <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2 h-11 rounded-xl">
                      <FolderOpen className="w-4 h-4" />
                      Saqlangan varaqlar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-orange-500" />
                        Saqlangan varaqlar
                      </DialogTitle>
                    </DialogHeader>
                    {loadingSaved ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                      </div>
                    ) : savedSheets.length === 0 ? (
                      <div className="text-center py-12">
                        <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">Saqlangan varaqlar yo'q</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Birinchi varaqni generatsiya qiling va saqlang</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {savedSheets.map((s) => (
                          <div
                            key={s.id}
                            className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-800/40 transition-all cursor-pointer"
                            onClick={() => loadSheet(s)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-orange-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h4 className="font-bold text-sm truncate">{s.title}</h4>
                                  {s.is_public ? (
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-[10px] px-1.5 shrink-0 border-emerald-500/20">
                                      <Globe className="w-2.5 h-2.5 mr-0.5" /> Ommaviy
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0">
                                      <Lock className="w-2.5 h-2.5 mr-0.5" /> Yopiq
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                  {s.digit_count} xona · {s.operation_count} ustun · {s.problem_count} misol · {FORMULA_LABELS[s.formula_type]?.label || s.formula_type}
                                </p>
                                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                                  {new Date(s.created_at).toLocaleDateString('uz-UZ')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600"
                                onClick={(e) => { e.stopPropagation(); openShareDialog(s); }}>
                                <Share2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                                onClick={(e) => { e.stopPropagation(); deleteSheet(s.id); }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {sheet && (
                  <>
                    <div className="w-px h-8 bg-border/50 hidden sm:block mx-1" />
                    <Button variant="outline" size="lg" onClick={downloadPDF} className="gap-2 h-11 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                      <Download className="w-4 h-4" />
                      PDF yuklab olish
                    </Button>

                    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="gap-2 h-11 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                          <Save className="w-4 h-4" />
                          Saqlash
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Save className="w-5 h-5 text-emerald-500" />
                            Varaqni saqlash
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="sheetTitle">Varaq nomi</Label>
                            <Input
                              id="sheetTitle"
                              placeholder="Masalan: 8 ustun oddiy 1-xona"
                              value={sheetTitle}
                              onChange={(e) => setSheetTitle(e.target.value)}
                              className="h-11"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">{digitCount} xona</Badge>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{operationCount} ustun</Badge>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">{problemCount} misol</Badge>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">{FORMULA_LABELS[formulaType]?.label || formulaType}</Badge>
                          </div>
                          <Button onClick={saveSheet} disabled={savingSheet || !sheetTitle.trim()} className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white">
                            {savingSheet ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {savingSheet ? 'Saqlanmoqda...' : 'Saqlash'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Share Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Varaqni ulashish
                </DialogTitle>
              </DialogHeader>
              {currentShareSheet && (
                <div className="space-y-4 pt-2">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                    <h4 className="font-semibold text-sm">{currentShareSheet.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentShareSheet.digit_count} xona • {currentShareSheet.operation_count} ustun • {currentShareSheet.problem_count} misol
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-2">
                      {currentShareSheet.is_public ? (
                        <Globe className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">
                        {currentShareSheet.is_public ? "Ommaviy" : "Yopiq"}
                      </span>
                    </div>
                    <Switch
                      checked={currentShareSheet.is_public}
                      onCheckedChange={(checked) => toggleSheetPublic(currentShareSheet, checked)}
                      disabled={updatingShare}
                    />
                  </div>
                  
                  {currentShareSheet.is_public && currentShareSheet.share_code && (
                    <div className="space-y-2">
                      <Label className="text-xs">Ulashish havolasi</Label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={`${window.location.origin}/problem-sheet?code=${currentShareSheet.share_code}`}
                          className="text-xs h-10"
                        />
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0"
                          onClick={() => copyShareLink(currentShareSheet.share_code!)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Generated Sheet Preview */}
          {sheet && (
            <Card className="border-border/40 shadow-sm rounded-2xl animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span>Generatsiya natijasi</span>
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="font-mono text-[10px] bg-orange-50 dark:bg-orange-900/20 text-orange-700 border-orange-200">
                      {sheet.problems.length} misol
                    </Badge>
                    <Badge variant="outline" className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 border-emerald-200">
                      {sheet.settings.digitCount} xona
                    </Badge>
                    <Badge variant="outline" className="font-mono text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-700 border-purple-200">
                      {sheet.settings.operationCount} ustun
                    </Badge>
                    <Badge variant="outline" className="font-mono text-[10px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 border-amber-200">
                      {FORMULA_LABELS[sheet.settings.formulaType]?.label || sheet.settings.formulaType}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <ProblemSheetTable
                  problems={sheet.problems}
                  columnsPerRow={columnsPerRow}
                />
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!sheet && (
            <div className="rounded-2xl bg-card border border-dashed border-border/60 p-10 sm:p-16 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg mb-1">
                Hali misol generatsiya qilinmagan
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-5">
                Yuqoridagi sozlamalarni tanlab "Generatsiya qilish" tugmasini bosing.
                Tayyor varaqni PDF qilib yuklab olish va saqlashingiz mumkin.
              </p>
              <Button
                onClick={generateSheet}
                disabled={isGenerating}
                size="lg"
                className="gap-2 h-11 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/25"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Hoziroq generatsiya qilish
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* CTA banner */}
          {sheet && (
            <section className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-amber-200" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg sm:text-xl mb-1">
                      Varaq tayyor — endi nima qilamiz?
                    </h3>
                    <p className="text-sm text-white/85">
                      PDF qilib yuklab oling, saqlang yoki o'quvchilaringizga ulashing.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <Button
                    onClick={downloadPDF}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-orange-600 hover:bg-white/95 text-sm font-bold shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-bold backdrop-blur-sm"
                  >
                    <Save className="h-4 w-4" />
                    Saqlash
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </PageBackground>
  );
};

export default ProblemSheetGenerator;
