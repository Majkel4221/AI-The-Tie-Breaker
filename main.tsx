import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Scale, 
  Table as TableIcon, 
  Zap, 
  Loader2, 
  ChevronRight,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  Clock,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Download,
  Printer,
  FileText,
  Sun,
  Moon
} from 'lucide-react';
import Markdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { cn } from './lib/utils';

type AnalysisType = 'pros-cons' | 'comparison' | 'swot';

interface AnalysisResult {
  id: string;
  decision: string;
  content: string;
  type: AnalysisType;
  timestamp: number;
  lang?: 'pl' | 'en';
}

interface Template {
  text: string;
  category: string;
  icon: string;
  badgeColor: string;
}

const QUICK_TEMPLATES_PL: Template[] = [
  { 
    text: "Wynająć mieszkanie w centrum czy kupić dom na obrzeżach miasta?", 
    category: "Nieruchomości", 
    icon: "🏠",
    badgeColor: "bg-emerald-50/75 text-emerald-800 border-emerald-100/40 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40" 
  },
  { 
    text: "Przyjąć ofertę pracy w korporacji z wyższą płacą czy w dynamicznym startupie?", 
    category: "Kariera", 
    icon: "💼",
    badgeColor: "bg-teal-50/75 text-teal-800 border-teal-100/40 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40" 
  },
  { 
    text: "Czy firma powinna przenieść całą infrastrukturę do chmury obliczeniowej w tym kwartale?", 
    category: "Biznes / IT", 
    icon: "☁️",
    badgeColor: "bg-stone-100 text-stone-700 border-stone-200/50 dark:bg-[#1E2522] dark:text-stone-300 dark:border-[#2C3B35]/50" 
  },
  { 
    text: "Kupić w pełni elektryczny samochód czy pozostać przy ekonomicznej hybrydzie?", 
    category: "Życie codzienne", 
    icon: "⚡",
    badgeColor: "bg-emerald-105 bg-emerald-100/40 text-emerald-800 border-emerald-200/30 dark:bg-teal-950/35 dark:text-teal-300 dark:border-teal-800/40" 
  }
];

const QUICK_TEMPLATES_EN: Template[] = [
  { 
    text: "Should I rent an apartment in the city center or buy a house in the suburbs?", 
    category: "Real Estate", 
    icon: "🏠",
    badgeColor: "bg-emerald-50/75 text-emerald-800 border-emerald-100/40 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40" 
  },
  { 
    text: "Accept a high-paying corporate job or join a dynamic startup with equity?", 
    category: "Career", 
    icon: "💼",
    badgeColor: "bg-teal-50/75 text-teal-800 border-teal-100/40 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40" 
  },
  { 
    text: "Should our company migrate our entire software infrastructure to the cloud this quarter?", 
    category: "Business / IT", 
    icon: "☁️",
    badgeColor: "bg-stone-100 text-stone-700 border-stone-200/50 dark:bg-[#1E2522] dark:text-stone-300 dark:border-[#2C3B35]/50" 
  },
  { 
    text: "Buy a fully electric vehicle (EV) or stick to a highly efficient hybrid engine?", 
    category: "Daily Life", 
    icon: "⚡",
    badgeColor: "bg-emerald-105 bg-emerald-100/40 text-emerald-800 border-emerald-200/30 dark:bg-teal-950/35 dark:text-teal-300 dark:border-teal-800/40" 
  }
];

const translations = {
  pl: {
    subtitle: "Analiza decyzji i eliminowanie dylematów za pomocą AI",
    enterDilemma: "Wpisz dylemat decyzyjny",
    organizeThoughts: "Uporządkuj swoje myśli",
    textareaPlaceholder: "np. Skupić się na intensywnej ekspansji lokalnej nowej marki, czy od razu wejść na rynki zagraniczne w modelu SaaS?",
    chooseStrategy: "Wybierz strategię analizy",
    algorithmReady: "Algorytmy decyzyjne The Tie Breaker gotowe do wsparcia.",
    generating: "Generowanie analizy...",
    breakTie: "Przełam remis",
    quickScenarios: "Szybkie scenariusze testowe",
    chooseAndAnalyze: "Wybierz i analizuj",
    poprzednieRemisy: "Poprzednie Remisy",
    confirmClearHistory: "Czy na pewno chcesz wyczyścić całą historię?",
    filterDecisions: "Filtruj decyzje...",
    emptyHistoryTitle: "Twój dylematnik jest pusty",
    emptyHistoryDesc: "Zadaj dylemat powyżej, a Twoje raporty pojawią się w tym miejscu.",
    reportGenerated: "Raport wygenerowany",
    analyzedProblem: "Badany problem",
    quote: "Decyzja jest początkiem działania, a każde działanie daje informację zwrotną.",
    downloadMarkdown: "Pobierz (.md)",
    downloadPdf: "Pobierz PDF",
    printing: "Drukuj",
    copyReport: "Kopiuj raport",
    copied: "Skopiowano",
    footerText: "The Tie Breaker pomaga uporządkować myśli poprzez uporządkowaną i bezstronną analizę. Każda decyzja ostatecznie zależy od Ciebie.",
    errorPdf: "Wystąpił nieoczekiwany błąd podczas generowania pliku PDF.",
    pdfTitle: "THE TIE BREAKER",
    pdfReportType: "RAPORT ANALIZY DECYZYJNEJ AI",
    pdfDate: "Data",
    pdfDilemmaHeader: "BADANY PROBLEM / DYLEMAT:",
    prosConsLabel: "Zalety i Wady",
    comparisonLabel: "Tabela Porównawcza",
    swotLabel: "Analiza SWOT",
    prosConsDesc: "Proste zestawienie korzyści i potencjalnych minusów.",
    comparisonDesc: "Wielokryterialne porównanie dostępnych opcji.",
    swotDesc: "Mocne i słabe strony oraz szanse i zagrożenia rynkowe.",
    copiedToast: "Skopiowano do schowka!",
  },
  en: {
    subtitle: "AI-powered executive decision intelligence",
    enterDilemma: "Enter decision dilemma",
    organizeThoughts: "Organize your thoughts",
    textareaPlaceholder: "e.g. Focus on rapid local expansion of the new brand, or immediately expand globally using a SaaS model?",
    chooseStrategy: "Choose analysis strategy",
    algorithmReady: "The Tie Breaker decision algorithms stand ready to support.",
    generating: "Generating analysis...",
    breakTie: "Break the Tie",
    quickScenarios: "Quick test scenarios",
    chooseAndAnalyze: "Select & Analyze",
    poprzednieRemisy: "Previous Ties",
    confirmClearHistory: "Are you sure you want to clear the entire history?",
    filterDecisions: "Filter decisions...",
    emptyHistoryTitle: "Your decision log is empty",
    emptyHistoryDesc: "Submit a question above and your reports will appear here.",
    reportGenerated: "Report generated",
    analyzedProblem: "Analyzed problem",
    quote: "A decision is the spark of action, and every action yields feedback.",
    downloadMarkdown: "Download (.md)",
    downloadPdf: "Download PDF",
    printing: "Print",
    copyReport: "Copy report",
    copied: "Copied!",
    footerText: "The Tie Breaker helps structure your thoughts with structured and balanced analysis. Each decision is ultimately yours.",
    errorPdf: "An unexpected error occurred during PDF generation.",
    pdfTitle: "THE TIE BREAKER",
    pdfReportType: "AI DECISION ANALYSIS REPORT",
    pdfDate: "Date",
    pdfDilemmaHeader: "ANALYZED PROBLEM / DILEMMA:",
    prosConsLabel: "Pros and Cons",
    comparisonLabel: "Comparison Table",
    swotLabel: "SWOT Analysis",
    prosConsDesc: "Simple breakdown of advantages and potential drawbacks.",
    comparisonDesc: "A multi-criteria comparison matrix evaluating solutions.",
    swotDesc: "Assess Strengths, Weaknesses, Opportunities, and Threats.",
    copiedToast: "Copied to clipboard!",
  }
};

export default function App() {
  const [lang, setLang] = useState<'pl' | 'en'>(() => {
    try {
      const saved = localStorage.getItem('tie_breaker_lang');
      return (saved === 'en' || saved === 'pl') ? saved : 'pl';
    } catch (e) {
      return 'pl';
    }
  });
  
  const [decision, setDecision] = useState('');
  const [selectedType, setSelectedType] = useState<AnalysisType>('pros-cons');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [searchHistory, setSearchHistory] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tie_breaker_theme');
      return saved === 'dark' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
      return false;
    }
  });

  // Toggles the preferred language configuration
  useEffect(() => {
    try {
      localStorage.setItem('tie_breaker_lang', lang);
    } catch (e) {
      console.error("Could not write language setting", e);
    }
  }, [lang]);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Toggles the root HTML class selector
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tie_breaker_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tie_breaker_theme', 'light');
      }
    } catch (e) {
      console.error("Could not write theme configuration", e);
    }
  }, [darkMode]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tie_breaker_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not load history", e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (item: AnalysisResult) => {
    try {
      const updated = [item, ...history.filter(h => h.decision !== item.decision)].slice(0, 20);
      setHistory(updated);
      localStorage.setItem('tie_breaker_history', JSON.stringify(updated));
    } catch (e) {
      console.error("Could not save to history", e);
    }
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('tie_breaker_history', JSON.stringify(updated));
    if (result && result.id === id) {
      setResult(null);
    }
  };

  const clearHistory = () => {
    const confirmationText = translations[lang].confirmClearHistory;
    if (window.confirm(confirmationText)) {
      setHistory([]);
      localStorage.removeItem('tie_breaker_history');
    }
  };

  const handleAnalyze = async (overrideDecision?: string) => {
    const activeDecision = overrideDecision || decision;
    if (!activeDecision.trim()) return;

    setLoading(true);
    setError(null);
    setCopied(false);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: activeDecision, type: selectedType, lang }),
      });

      if (!response.ok) {
        throw new Error(lang === 'pl' ? 'Nie udało się pobrać analizy z serwera.' : 'Failed to fetch analysis from server.');
      }

      const data = await response.json();
      const newResult: AnalysisResult = {
        id: Math.random().toString(36).substring(2, 9),
        decision: activeDecision,
        content: data.analysis,
        type: selectedType,
        timestamp: Date.now(),
        lang,
      };
      
      setResult(newResult);
      saveToHistory(newResult);
      
      // Smooth scroll to results 
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (lang === 'pl' ? 'Wystąpił problem z połączeniem. Spróbuj ponownie.' : 'A connection error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const selectHistoryItem = (item: AnalysisResult) => {
    setDecision(item.decision);
    setSelectedType(item.type);
    setResult(item);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const triggerCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsMarkdown = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `The-Tie-Breaker-${result.type}-${new Date(result.timestamp).toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = async () => {
    if (!result) return;
    setPdfGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const fontFamily = 'Helvetica';

      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - (margin * 2);

      // Elegant Sage Green top banner
      doc.setFillColor(222, 235, 226); // Soft pale green
      doc.rect(0, 0, pageWidth, 42, 'F');
      doc.setFillColor(16, 185, 129); // Green emerald accent line
      doc.rect(0, 41, pageWidth, 1, 'F');

      // Title
      doc.setTextColor(15, 59, 46); // Deep forest green
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(22);
      doc.text("THE TIE BREAKER", margin, 18);

      const activeLang = result.lang || lang;

      doc.setFontSize(10);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(22, 101, 74);
      doc.text(translations[activeLang].pdfReportType, margin, 26);
      doc.text(`${translations[activeLang].pdfDate}: ${new Date(result.timestamp).toLocaleDateString(activeLang === 'pl' ? 'pl-PL' : 'en-US')}`, pageWidth - margin - 50, 26);

      const cleanStringForPDF = (str: string): string => {
        if (!str) return '';
        let cleaned = str
          .replace(/\*\*/g, '') // remove markdown bold
          .replace(/\*/g, '')   // remove single star indicators
          .replace(/👉/g, ' -> ')
          .replace(/✅/g, '[v] ')
          .replace(/❌/g, '[x] ')
          .replace(/💡/g, '• ')
          .replace(/🔥/g, '! ')
          .replace(/🔍/g, '* ')
          .replace(/📊/g, '')
          .replace(/⚖️/g, '')
          .replace(/🔑/g, '')
          .replace(/🏆/g, '')
          .replace(/🚨/g, '! ')
          .replace(/🚫/g, 'x ');

        // Safely transliterate Polish accents so Helvetica is perfectly clear and spaced
        const polishMap: { [key: string]: string } = {
          'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
          'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
        };
        cleaned = cleaned.split('').map(char => polishMap[char] || char).join('');

        // Exclude emojis and non-standard symbols to avoid Helvetica crashing or spacing bugs
        cleaned = cleaned.replace(/[\uD800-\uDFFF].|[^\x00-\x7F]/g, '');
        return cleaned.trim();
      };

      // Dilemma Panel with Dynamic Height
      const maxDilemmaWidth = contentWidth - 10;
      const dilemmaText = cleanStringForPDF(`"${result.decision}"`);
      const dilemmaLines = doc.splitTextToSize(dilemmaText, maxDilemmaWidth);
      const dilemmaLineHeight = 5.2;
      const dilemmaHeaderHeight = 10;
      const dilemmaPadding = 6;
      const dilemmaBoxHeight = dilemmaHeaderHeight + (dilemmaLines.length * dilemmaLineHeight) + dilemmaPadding;

      doc.setFillColor(242, 246, 243); // Creamy soft sage white
      doc.rect(margin, 52, contentWidth, dilemmaBoxHeight, 'F');
      doc.setDrawColor(52, 211, 153); // Emerald mint border
      doc.rect(margin, 52, contentWidth, dilemmaBoxHeight, 'S');

      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 120, 88); 
      doc.text(translations[activeLang].pdfDilemmaHeader, margin + 5, 58);

      doc.setFont(fontFamily, 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(28, 41, 36); // Forest dark text
      
      dilemmaLines.forEach((line: string, index: number) => {
        doc.text(line, margin + 5, 65 + (index * dilemmaLineHeight));
      });

      // Next element starts cleanly below the dynamic Dilemma box
      let y = 52 + dilemmaBoxHeight + 12;

      // Markdown parser logic
      doc.setFont(fontFamily, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(40, 50, 46); // Soft warm charcoal

      const rawLines = result.content.split('\n');

      let inTable = false;
      let tableCells: string[][] = [];

      const flushTable = () => {
        if (tableCells.length === 0) return;
        
        const colWidths = [42, 60, 60];
        const colXs = [margin + 1, margin + 45, margin + 107];

        tableCells.forEach((row, rowIndex) => {
          const isHeader = rowIndex === 0;
          
          const paddedRow = [
            row[0] || '',
            row[1] || '',
            row[2] || ''
          ];

          const cellLines = paddedRow.map((cell, colIdx) => {
            const width = colWidths[colIdx] || 50;
            return doc.splitTextToSize(cell, width);
          });

          const maxLines = Math.max(...cellLines.map(lines => lines.length), 1);
          const rowHeight = maxLines * 5 + (isHeader ? 5 : 3);

          if (y + rowHeight > 270) {
            doc.addPage();
            y = 25;
          }

          if (isHeader) {
            doc.setFillColor(240, 245, 242);
            doc.rect(margin, y - 1, contentWidth, rowHeight, 'F');
            doc.setFont(fontFamily, 'bold');
            doc.setFontSize(9);
            doc.setTextColor(15, 59, 46);
          } else {
            doc.setFont(fontFamily, 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(50, 60, 56);
            
            if (rowIndex % 2 === 1) {
              doc.setFillColor(250, 252, 251);
              doc.rect(margin, y - 1, contentWidth, rowHeight, 'F');
            }

            doc.setDrawColor(220, 228, 224);
            doc.setLineWidth(0.12);
            doc.line(margin, y + rowHeight - 1, margin + contentWidth, y + rowHeight - 1);
          }

          for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
            const printY = y + (isHeader ? 3.5 : 3) + (lineIdx * 5);
            for (let colIdx = 0; colIdx < 3; colIdx++) {
              const textLine = cellLines[colIdx]?.[lineIdx] || '';
              const xPos = colXs[colIdx] || margin;
              doc.text(textLine, xPos, printY);
            }
          }

          y += rowHeight;
        });

        tableCells = [];
        inTable = false;
        y += 6;
      };

      rawLines.forEach((line) => {
        const trimmed = line.trim();
        
        const isPotentialTableRow = trimmed.startsWith('|');
        const pipeCount = (trimmed.match(/\|/g) || []).length;

        if (isPotentialTableRow && pipeCount >= 3) {
          const isSeparator = /^\|[\s:-|]*\|$/.test(trimmed);
          if (isSeparator) {
            inTable = true;
            return;
          }

          const cells = trimmed
            .split('|')
            .map(c => cleanStringForPDF(c))
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

          if (cells.length > 0) {
            inTable = true;
            tableCells.push(cells);
          }
          return;
        } else if (inTable) {
          flushTable();
        }

        if (!trimmed) {
          y += 4;
          return;
        }

        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        if (trimmed.startsWith('###')) {
          if (y > 260) {
            doc.addPage();
            y = 20;
          }
          doc.setFont(fontFamily, 'bold');
          doc.setFontSize(12);
          doc.setTextColor(16, 115, 87); 
          const heading = cleanStringForPDF(trimmed.replace('###', ''));
          doc.text(heading, margin, y);
          y += 7;
        } else if (trimmed.startsWith('##')) {
          if (y > 255) {
            doc.addPage();
            y = 20;
          }
          doc.setFont(fontFamily, 'bold');
          doc.setFontSize(14);
          doc.setTextColor(13, 89, 67); 
          const heading = cleanStringForPDF(trimmed.replace('##', ''));
          doc.text(heading, margin, y);
          y += 8;
        } else if (trimmed.startsWith('#')) {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFont(fontFamily, 'bold');
          doc.setFontSize(16);
          doc.setTextColor(15, 59, 46);
          const heading = cleanStringForPDF(trimmed.replace('#', ''));
          doc.text(heading, margin, y);
          y += 9;
        } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          doc.setFont(fontFamily, 'normal');
          doc.setFontSize(10);
          doc.setTextColor(50, 60, 56);
          
          const cleanItem = "• " + cleanStringForPDF(trimmed.substring(1).replace(/\*/g, ''));
          const wrapped = doc.splitTextToSize(cleanItem, contentWidth - 5);
          wrapped.forEach((wLine: string) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.text(wLine, margin + 4, y);
            y += 5.5;
          });
        } else if (trimmed.startsWith('>')) {
          doc.setFont(fontFamily, 'italic');
          doc.setFontSize(10);
          doc.setTextColor(15, 59, 46); 
          
          const cleanQuote = cleanStringForPDF(trimmed.replace('>', '').replace(/\*/g, ''));
          const wrapped = doc.splitTextToSize(cleanQuote, contentWidth - 12);
          
          const startY = y - 2;
          const blockHeight = wrapped.length * 5.5;
          
          doc.setFillColor(242, 248, 245); 
          doc.rect(margin + 2, startY, contentWidth - 4, blockHeight + 3, 'F');
          
          doc.setDrawColor(245, 158, 11); 
          doc.setLineWidth(1.2);
          doc.line(margin + 2, startY, margin + 2, startY + blockHeight + 3);
          
          wrapped.forEach((wLine: string) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.text(wLine, margin + 6, y + 2.5);
            y += 5.5;
          });
          y += 5;
        } else {
          doc.setFont(fontFamily, 'normal');
          doc.setFontSize(10);
          doc.setTextColor(50, 60, 56);
          const cleanText = cleanStringForPDF(trimmed.replace(/\*/g, ''));
          const wrapped = doc.splitTextToSize(cleanText, contentWidth);
          wrapped.forEach((wLine: string) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.text(wLine, margin, y);
            y += 5.5;
          });
        }
      });

      if (inTable) {
        flushTable();
      }

      doc.save(`Tie-Breaker-Analysis-${result.type}-${new Date(result.timestamp).toLocaleDateString(activeLang === 'pl' ? 'pl-PL' : 'en-US')}.pdf`);
    } catch (e) {
      console.error("PDF generation failed", e);
      setError(translations[lang].errorPdf);
    } finally {
      setPdfGenerating(false);
    }
  };

  const filteredHistory = history.filter(item => 
    item.decision.toLowerCase().includes(searchHistory.toLowerCase())
  );

  const analysisTypes = [
    { 
      id: 'pros-cons' as AnalysisType, 
      label: translations[lang].prosConsLabel, 
      icon: Scale, 
      desc: translations[lang].prosConsDesc,
      activeColor: "border-amber-400 ring-amber-50/20 text-stone-900 bg-amber-50/45 dark:border-emerald-500/80 dark:ring-emerald-950/20 dark:text-emerald-300 dark:bg-emerald-950/30"
    },
    { 
      id: 'comparison' as AnalysisType, 
      label: translations[lang].comparisonLabel, 
      icon: TableIcon, 
      desc: translations[lang].comparisonDesc,
      activeColor: "border-teal-400 ring-teal-50/20 text-stone-900 bg-teal-50/30 dark:border-teal-500/80 dark:ring-teal-950/20 dark:text-teal-300 dark:bg-teal-950/30"
    },
    { 
      id: 'swot' as AnalysisType, 
      label: translations[lang].swotLabel, 
      icon: Zap, 
      desc: translations[lang].swotDesc,
      activeColor: "border-orange-400 ring-orange-55/20 text-stone-900 bg-orange-50/35 dark:border-emerald-500 dark:ring-emerald-950/35 dark:text-emerald-300 dark:bg-emerald-950/30"
    },
  ];

  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      {/* Warm Premium Header */}
      <header className="border-b border-emerald-100/30 dark:border-stone-900/60 bg-white/75 dark:bg-[#0c110e]/75 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-100/20 dark:shadow-none relative overflow-hidden group">
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Scale className="text-white w-5 h-5 relative z-10" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-stone-900 dark:text-stone-50 flex items-center gap-1.5 leading-none">
                The Tie Breaker
                <span className="hidden sm:inline-block text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-405 py-0.5 px-1.5 rounded-full font-bold uppercase tracking-wider">PRO v2</span>
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{translations[lang].subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'pl' ? 'en' : 'pl')}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-stone-200/80 bg-white/80 hover:bg-emerald-50/40 text-stone-700 dark:bg-[#151D1A] dark:border-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-800/80 dark:hover:text-emerald-405 transition-all duration-300 shadow-xs flex items-center gap-1.5 cursor-pointer"
              title={lang === 'pl' ? "Change language to English" : "Zmień język na Polski"}
            >
              <span className="text-[14px]">{lang === 'pl' ? '🇵🇱' : '🇬🇧'}</span>
              <span className="hidden sm:inline">{lang === 'pl' ? 'PL' : 'EN'}</span>
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-stone-200/80 bg-white/80 hover:bg-emerald-50/40 text-stone-605 dark:bg-[#151D1A] dark:border-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-800/80 dark:hover:text-emerald-405 transition-all duration-300 shadow-xs relative cursor-pointer"
              title={darkMode ? (lang === 'pl' ? "Tryb jasny" : "Light mode") : (lang === 'pl' ? "Tryb ciemny" : "Dark mode")}
            >
              {darkMode ? (
                <Sun className="w-4.5 h-4.5 text-emerald-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-stone-605" />
              )}
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/50 dark:bg-[#121A16] text-[11px] font-mono text-emerald-800 dark:text-emerald-405 border border-emerald-100/50 dark:border-stone-800/80">
              <span className="w-1.5 h-1.5 bg-emerald-505 rounded-full animate-ping" />
              Gemini 3.5 Ready
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Tilting Balance Scale Visual */}
        <div className="w-full flex justify-center mb-10 overflow-hidden py-4">
          <div className="relative flex flex-col items-center">
            <div className="flex items-center gap-4 text-xs font-mono font-semibold tracking-wider text-amber-800 dark:text-emerald-400 bg-amber-50/45 dark:bg-emerald-950/15 px-4 py-1.5 rounded-full shadow-xs border border-amber-100/40 dark:border-emerald-900/25">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>Balance of Logic</span>
            </div>
            
            <div className="w-64 h-24 mt-4 relative flex items-center justify-center">
              <motion.svg 
                width="140" 
                height="80" 
                viewBox="0 0 140 80"
                className="overflow-visible"
              >
                {/* Column Base */}
                <path d="M 65 50 L 75 50 L 72 15 L 68 15 Z" fill="#1D3E33" />
                <rect x="55" y="50" width="30" height="4" rx="2" fill="#0F2B22" />
                <circle cx="70" cy="15" r="4" fill="#0F2B22" />
                
                {/* Tilting Balance Bar */}
                <motion.g
                  animate={{ 
                    rotate: loading ? [-12, 12, -12, 12, 0] : result ? (result.type === 'swot' ? 8 : -8) : 0 
                  }}
                  transition={{ 
                    repeat: loading ? Infinity : 0, 
                    duration: loading ? 2.5 : 0.8,
                    ease: "easeInOut" 
                  }}
                  style={{ transformOrigin: "70px 15px" }}
                >
                  <line x1="20" y1="15" x2="120" y2="15" stroke="#0F2B22" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Left Hanging cords & plate */}
                  <line x1="20" y1="15" x2="10" y2="35" stroke="#10B981" strokeWidth="1" />
                  <line x1="20" y1="15" x2="30" y2="35" stroke="#10B981" strokeWidth="1" />
                  <path d="M 5 35 L 35 35 C 35 42, 5 42, 5 35 Z" fill="#E2EFE7" stroke="#0D5C45" strokeWidth="1" />
                  
                  {/* Right Hanging cords & plate */}
                  <line x1="120" y1="15" x2="110" y2="35" stroke="#10B981" strokeWidth="1" />
                  <line x1="120" y1="15" x2="130" y2="35" stroke="#10B981" strokeWidth="1" />
                  <path d="M 105 35 L 135 35 C 135 42, 105 42, 105 35 Z" fill="#E2EFE7" stroke="#0D5C45" strokeWidth="1" />

                  {/* Option tokens */}
                  <motion.circle cx="20" cy="33" r="5.5" fill="#10B981" animate={{ scale: result ? 1.25 : 1 }} />
                  <motion.circle cx="120" cy="33" r="5.5" fill="#14B8A6" animate={{ scale: result ? 0.9 : 1 }} />
                </motion.g>
              </motion.svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT 8 COLUMNS: Input */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-white dark:bg-[#121815] rounded-3xl border border-stone-200/60 dark:border-stone-850/60 shadow-md shadow-amber-900/[0.04] dark:shadow-none overflow-hidden duration-300 hover:shadow-lg hover:shadow-amber-900/[0.06]">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <label htmlFor="decision-text" className="block text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-emerald-500" />
                    {translations[lang].enterDilemma}
                  </label>
                  <span className="text-xs text-stone-400 dark:text-stone-505 font-semibold">{translations[lang].organizeThoughts}</span>
                </div>
                
                <textarea
                  id="decision-text"
                  rows={4}
                  className="w-full text-[17px] md:text-[21px] font-sans font-medium tracking-tight text-stone-900 dark:text-stone-100 bg-transparent border-0 border-b border-transparent focus:border-amber-100 dark:focus:border-emerald-900 focus:ring-0 placeholder:text-stone-400 dark:placeholder:text-stone-700 placeholder:font-normal resize-none transition-all outline-none leading-relaxed"
                  placeholder={translations[lang].textareaPlaceholder}
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                />
              </div>

              {/* Analysis strategy switch */}
              <div className="bg-[#FCFAF7] dark:bg-[#101714] border-t border-stone-200/50 dark:border-stone-850/40 p-6 md:p-8">
                <h3 className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-4">{translations[lang].chooseStrategy}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {analysisTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          "flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer",
                          isActive 
                            ? `${type.activeColor} border-2 shadow-xs scale-[1.01]` 
                            : "bg-white dark:bg-[#151D19] border-stone-200/60 dark:border-stone-800/80 hover:border-amber-300 dark:hover:border-emerald-800/80 hover:bg-amber-50/15 dark:hover:bg-emerald-950/5 text-stone-500 dark:text-stone-400"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center mb-4 transition-colors",
                          isActive ? "bg-white dark:bg-[#111714] shadow-xs" : "bg-amber-50/30 dark:bg-[#0D1210]"
                        )}>
                          <Icon className={cn("w-4.5 h-4.5", isActive ? "text-amber-600 dark:text-emerald-400" : "text-stone-450 dark:text-stone-505")} />
                        </div>
                        <span className="font-bold text-[14px] text-stone-800 dark:text-stone-200 mb-1.5 block">{type.label}</span>
                        <span className="text-xs text-stone-400 dark:text-stone-500 leading-snug font-medium">{type.desc}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 dark:text-stone-500">
                    <HelpCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                    <span>{translations[lang].algorithmReady}</span>
                  </div>

                  <button
                    onClick={() => handleAnalyze()}
                    disabled={loading || !decision.trim()}
                    className={cn(
                      "relative group h-13 px-8 rounded-full font-bold flex items-center justify-center transition-all duration-300 w-full sm:w-auto overflow-hidden shadow-sm",
                      loading || !decision.trim()
                        ? "bg-stone-100 dark:bg-stone-900/65 text-stone-400 dark:text-stone-600 border border-stone-200/60 dark:border-stone-850/60 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white cursor-pointer hover:shadow-md hover:shadow-emerald-100/10"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                           key="loading"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           className="flex items-center gap-2"
                        >
                           <Loader2 className="w-5 h-5 animate-spin" />
                           <span>{translations[lang].generating}</span>
                        </motion.div>
                      ) : (
                        <motion.div
                           key="static"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           className="flex items-center gap-2"
                        >
                           <span>{translations[lang].breakTie}</span>
                           <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK START TEMPLATES */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                <h4 className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-widest">{translations[lang].quickScenarios}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(lang === 'pl' ? QUICK_TEMPLATES_PL : QUICK_TEMPLATES_EN).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDecision(item.text);
                      handleAnalyze(item.text);
                    }}
                    disabled={loading}
                    className="flex flex-col text-left p-5 bg-white/60 dark:bg-[#121815]/50 hover:bg-white dark:hover:bg-[#141E1A] rounded-2xl border border-emerald-100/40 dark:border-stone-800/50 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-md hover:shadow-emerald-100/5 dark:hover:shadow-none hover:scale-[1.01] transition-all group cursor-pointer duration-200 text-stone-605 dark:text-stone-400"
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border leading-tight dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400", item.badgeColor)}>
                        {item.category}
                      </span>
                      <span className="text-base">{item.icon}</span>
                    </div>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-950 dark:group-hover:text-stone-100 transition-colors line-clamp-2 leading-relaxed flex-1">
                      {item.text}
                    </p>
                    <span className="text-[11px] font-bold text-emerald-700/80 dark:text-emerald-500 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1 mt-4">
                      {translations[lang].chooseAndAnalyze} <ArrowRight className="w-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/40 rounded-2xl flex items-center gap-3.5 text-emerald-900 dark:text-emerald-300 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <p className="font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT 4 COLUMNS: History */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#121815] rounded-3xl border border-stone-200/60 dark:border-stone-800/60 p-6 shadow-md shadow-amber-900/[0.04] dark:shadow-none flex flex-col h-[520px]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-emerald-500" />
                  <h3 className="font-bold text-[14px] text-stone-800 dark:text-stone-100">{translations[lang].poprzednieRemisy}</h3>
                  <span className="bg-amber-100/70 dark:bg-emerald-950/40 text-amber-800 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {history.length}
                  </span>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="p-1 text-stone-400 hover:text-red-700 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-amber-50 dark:hover:bg-stone-800/60 cursor-pointer"
                    title={lang === 'pl' ? "Wyczyść historię" : "Clear history"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* History Search */}
              <div className="relative mb-4">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={translations[lang].filterDecisions}
                  className="w-full text-xs font-medium pl-9 pr-3 h-9 bg-stone-50/70 dark:bg-[#0C110E]/50 border border-stone-200/50 dark:border-stone-850/60 rounded-xl focus:ring-1 focus:ring-amber-100 dark:focus:ring-emerald-950/20 focus:border-amber-200 dark:focus:border-emerald-900/60 dark:text-stone-200 dark:placeholder:text-stone-600 outline-none"
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                />
              </div>

              {/* List container */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                <AnimatePresence initial={false}>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => {
                      const itemLang = item.lang || lang;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onClick={() => selectHistoryItem(item)}
                          className={cn(
                            "group p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex items-start gap-3 relative overflow-hidden",
                            result?.id === item.id 
                              ? "bg-amber-50/50 border-amber-300 dark:bg-emerald-950/25 dark:border-emerald-800 shadow-xs"
                              : "bg-stone-50/40 hover:bg-amber-50/25 border-stone-150/50 hover:border-amber-200/40 dark:bg-[#101614]/40 dark:border-transparent dark:hover:bg-[#141B18] dark:hover:border-stone-850/50"
                          )}
                        >
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-500 dark:bg-emerald-500 mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0 pr-6">
                            <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed">
                              {item.decision}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 dark:text-stone-400">
                                {item.type === 'pros-cons' ? (itemLang === 'pl' ? 'Zalety/Wady' : 'Pros/Cons') : item.type === 'swot' ? 'SWOT' : (itemLang === 'pl' ? 'Tabela' : 'Matrix')}
                              </span>
                              <span className="text-[10px] text-stone-350 dark:text-stone-700">•</span>
                              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                                {new Date(item.timestamp).toLocaleDateString(itemLang === 'pl' ? 'pl-PL' : 'en-US')}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => deleteFromHistory(item.id, e)}
                            className="absolute right-2 top-3 p-1 rounded-lg text-stone-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-[#1A2521] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 dark:text-stone-550 py-12 px-4 space-y-3">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-100 dark:border-stone-880 flex items-center justify-center text-stone-300 dark:text-stone-600 text-lg">
                        ⏳
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-600 dark:text-stone-400">{translations[lang].emptyHistoryTitle}</p>
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">{translations[lang].emptyHistoryDesc}</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* RESULTS SECTION */}
        <div ref={resultsRef} className="scroll-mt-24 mt-16">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.section
                key={result.timestamp}
                initial={{ opacity: 0, scale: 0.98, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#F8FAF7] dark:bg-[#121815] border border-emerald-150/40 dark:border-stone-800/85 rounded-3xl p-8 md:p-12 shadow-md shadow-emerald-100/5 dark:shadow-none relative overflow-hidden"
              >
                {/* Decorative brand blur decoration */}
                <div className="absolute top-0 right-1/4 w-80 h-40 bg-gradient-to-br from-emerald-100/30 to-teal-100/10 dark:from-emerald-950/15 dark:to-teal-950/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

                {/* Return button */}
                <div className="absolute top-0 right-0 p-8">
                  <button 
                    onClick={() => {
                        setResult(null);
                        setDecision('');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-2.5 text-stone-400 hover:text-stone-900 dark:text-stone-300 dark:hover:text-emerald-400 transition-colors bg-emerald-50/30 dark:bg-[#1B2420] rounded-full cursor-pointer hover:shadow-xs border border-emerald-100/10 dark:border-[#2C3B35]"
                    title="Nowa analiza"
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="max-w-none relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="p-1 px-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-400 text-[10px] font-black uppercase rounded-lg tracking-wider">
                      {result.type === 'pros-cons' && (lang === 'pl' ? 'Zalety i Wady' : 'Pros & Cons')}
                      {result.type === 'comparison' && (lang === 'pl' ? 'Tabela Porównawcza' : 'Comparison Matrix')}
                      {result.type === 'swot' && 'SWOT'}
                    </span>
                    <div className="h-[1px] flex-1 bg-emerald-100/40 dark:bg-stone-850" />
                    <span className="text-xs font-mono text-stone-400 dark:text-stone-500">{translations[lang].reportGenerated}</span>
                  </div>
                  
                  {/* Dilemma Summary Panel */}
                  <div className="mb-10 p-6 bg-emerald-50/15 dark:bg-[#17211C]/30 rounded-2xl border border-emerald-150/25 dark:border-[#20312B]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-405 block mb-1">{translations[lang].analyzedProblem}</span>
                    <p className="text-stone-950 dark:text-stone-100 font-sans font-medium md:text-lg leading-relaxed">
                      "{result.decision}"
                    </p>
                  </div>

                  <div className="markdown-body">
                    <Markdown>{result.content}</Markdown>
                  </div>
                </div>

                {/* Footer Controls inside Report */}
                <div className="mt-14 pt-8 border-t border-emerald-100/50 dark:border-stone-850 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <p className="text-xs text-stone-400 dark:text-stone-500 italic font-serif max-w-sm">
                    "{translations[lang].quote}"
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={downloadAsMarkdown}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-stone-300 hover:border-emerald-300 dark:hover:border-emerald-600/75 hover:bg-emerald-50/20 dark:hover:bg-[#15201B] text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-400 text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {translations[lang].downloadMarkdown}
                    </button>
                    
                    <button 
                      onClick={downloadAsPDF}
                      disabled={pdfGenerating}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-250 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-750 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                    >
                      {pdfGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          {translations[lang].generating}
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          {translations[lang].downloadPdf}
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-stone-300/80 dark:border-stone-700 hover:bg-stone-50/50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-400 text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      {translations[lang].printing}
                    </button>
                    
                    <button 
                       onClick={triggerCopy}
                       className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider",
                          copied 
                            ? "bg-emerald-700 text-white border border-emerald-800 dark:bg-emerald-800 dark:text-emerald-100" 
                            : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-[#0F9D58] text-white active:scale-95"
                       )}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? translations[lang].copied : translations[lang].copyReport}
                    </button>
                  </div>
                </div>
              </motion.section>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Elegant warm Footer */}
      <footer className="py-16 border-t border-emerald-100/30 dark:border-stone-850 bg-stone-50/30 dark:bg-[#121715]/40">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="w-11 h-11 border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] shadow-xs rounded-full flex items-center justify-center text-stone-400 dark:text-stone-500 hover:border-emerald-400 hover:text-emerald-500 transition-all">
               <Scale className="w-4.5 h-4.5" />
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-500 font-medium max-w-md mx-auto leading-relaxed">
              The Tie Breaker pomaga uporządkować myśli poprzez uporządkowaną i bezstronną analizę. Każda decyzja ostatecznie zależy od Ciebie.
            </p>
          </div>
          <div className="mt-10 flex items-center justify-center gap-5 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
            <span>© 2026 The Tie Breaker Inc.</span>
            <div className="w-1.5 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full" />
            <span>AI Decision framework</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
