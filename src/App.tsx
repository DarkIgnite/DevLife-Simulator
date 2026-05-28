import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Code, 
  TrendingUp, 
  Coins, 
  Heart, 
  Brain, 
  Compass, 
  BookOpen, 
  Award, 
  Smile, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Terminal, 
  Briefcase, 
  User,
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  History,
  Trophy
} from "lucide-react";
import { Profile, Stats, Phase, Choice, EventLog } from "./types";
import { ONBOARDING_QUESTIONS } from "./data";

export default function App() {
  const [stage, setStage] = useState<"landing" | "onboarding" | "compiling" | "timeline" | "ending">("landing");
  
  // Onboarding phase selection states
  const [profile, setProfile] = useState<Profile>({
    major: "",
    habits: "",
    coping: "",
    philosophy: ""
  });
  const [questionIndex, setQuestionIndex] = useState(0);

  // Stats setup
  const [stats, setStats] = useState<Stats>({
    money: 25,
    stress: 15,
    codingSkill: 30,
    reputation: 10,
    motivation: 80
  });

  // Keep track of stat delta changes to animate them
  const [statDeltas, setStatDeltas] = useState<Partial<Stats> | null>(null);
  const [showDeltas, setShowDeltas] = useState(false);

  // Timeline list state - starts empty, compiles Year 1, Year 3, Year 5, Year 10
  const [phases, setPhases] = useState<Phase[]>([]);
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0); // tracks which index prompt query we are at
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Timeline UI scroll reference
  const activePhaseRef = useRef<HTMLDivElement>(null);
  const timelineEndRef = useRef<HTMLDivElement>(null);

  // Loading quotes & logs for compiling state
  const compilingLogs = [
    "Merancang jalur keputusan berdasarkan minat teknologimu...",
    "Menakar asupan kafein dan merancang ketahanan mental...",
    "Menganalisis proyeksi ekonomi dan tren pasar dev terbaru...",
    "Menghitung skor kontribusi open-source dan reputasi ekosistem...",
    "Menyiapkan bumbu tantangan dadakan: server down dan bug misterius...",
    "Menyusun timeline Tahun 1: Medan perjuangan baru sudah siap..."
  ];

  // Auto increment log lines in "compiling" stage
  useEffect(() => {
    if (stage === "compiling") {
      setCompilingStep(0);
      const interval = setInterval(() => {
        setCompilingStep(prev => {
          if (prev >= compilingLogs.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Synchronize browser tab document title with current simulator progress
  useEffect(() => {
    if (stage === "landing") {
      document.title = "DevLife";
    } else if (stage === "ending") {
      document.title = "Perjalanan Kariermu — DevLife";
    } else {
      document.title = "Menyusun Masa Depan...";
    }
  }, [stage]);

  // Smooth scroll to the newest phase card when it loads
  useEffect(() => {
    if (stage === "timeline" && activePhaseRef.current) {
      activePhaseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [phases, stage]);

  // Restart the whole simulation back to state zero
  const handleRestart = () => {
    setProfile({
      major: "",
      habits: "",
      coping: "",
      philosophy: ""
    });
    setStats({
      money: 25,
      stress: 15,
      codingSkill: 30,
      reputation: 10,
      motivation: 80
    });
    setPhases([]);
    setCurrentProposalIndex(0);
    setQuestionIndex(0);
    setErrorText(null);
    setStage("landing");
  };

  // Skip to specific stage with dummy values for dev evaluation easily
  const handleLoadDemo = () => {
    setProfile({
      major: "Full-Stack Web & Interfaces",
      habits: "Pembuat Side Project (Indie Builder)",
      coping: "Kopi & Sesi Larut Malam",
      philosophy: "Keindahan Rekayasa Teknis"
    });
    setStats({
      money: 45,
      stress: 25,
      codingSkill: 55,
      reputation: 35,
      motivation: 75
    });
    setPhases([
      {
        year: "Year 1",
        title: "Codebase Monolit Kuno",
        narrative: "Kamu melangkah masuk ke sebuah startup logistik Seri A di Jakarta sebagai junior web developer baru. Tugas pertamamu di repositori adalah sistem monolitik 2,5 juta baris kode yang rumit tanpa uji unit tunggal. Arsitek utamanya baru saja resign tiga hari lalu. Kebiasaan minum kopi larut malam menjagamu tetap terjaga, tetapi utang teknis (tech debt) sistem ini begitu mencekik.",
        statChanges: { money: 10, stress: 15, codingSkill: 20, reputation: 5, motivation: -5 },
        chosenId: "A",
        choices: [
          { id: "A", text: "Refaktor inti autentikasi di akhir pekan", flavorText: "Buktikan dedikasi luar biasa dengan menulis ulang kode asli" },
          { id: "B", text: "Presentasikan arsitektur server baru", flavorText: "Fokus pada penyelarasan korporat, slide presentasi, dan pengaruh kepemimpinan" },
          { id: "C", text: "Terapkan perbaikan tambal-sulam minimalis sembari belajar framework baru secara mandiri", flavorText: "Lindungi kesehatan mental sambil mengasah keahlian pribadi" }
        ]
      }
    ]);
    setCurrentProposalIndex(1);
    setStage("timeline");
  };

  // Submit onboarding selections to pull initial year phase
  const triggerCompilation = async (finalProfile: Profile) => {
    setStage("compiling");
    setIsApiLoading(true);
    setErrorText(null);

    try {
      const response = await fetch("/api/generate-first-phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: finalProfile })
      });

      if (!response.ok) {
        throw new Error("Mesin narasi backend mendeteksi kendala saat menyusun garis waktu. Silakan coba lagi.");
      }

      const year1Data: Phase = await response.json();
      
      // Update core stats by the Year 1 changes
      if (year1Data.statChanges) {
        setStats(prev => {
          const updated = {
            money: Math.max(0, Math.min(100, prev.money + (year1Data.statChanges?.money || 0))),
            stress: Math.max(0, Math.min(100, prev.stress + (year1Data.statChanges?.stress || 0))),
            codingSkill: Math.max(0, Math.min(100, prev.codingSkill + (year1Data.statChanges?.codingSkill || 0))),
            reputation: Math.max(0, Math.min(100, prev.reputation + (year1Data.statChanges?.reputation || 0))),
            motivation: Math.max(0, Math.min(100, prev.motivation + (year1Data.statChanges?.motivation || 0)))
          };
          
          setStatDeltas(year1Data.statChanges || null);
          setShowDeltas(true);
          setTimeout(() => setShowDeltas(false), 4500);
 
          return updated;
        });
      }

      // Briefly wait to let compilation logs show
      setTimeout(() => {
        setPhases([year1Data]);
        setCurrentProposalIndex(1); // ready for next phase
        setStage("timeline");
        setIsApiLoading(false);
      }, 3500);

    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Gagal tersambung ke API utama. Harap periksa apakah server dev berjalan dan kunci API dikonfigurasi.");
      setStage("onboarding");
      setIsApiLoading(false);
    }
  };

  // Handle onboarding single question selection
  const handleOnboardingSelect = (value: string) => {
    const currentQuestion = ONBOARDING_QUESTIONS[questionIndex];
    const updatedProfile = {
      ...profile,
      [currentQuestion.field]: value
    };
    
    setProfile(updatedProfile);

    if (questionIndex < ONBOARDING_QUESTIONS.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      // Completed last onboarding step, launch simulation
      triggerCompilation(updatedProfile);
    }
  };

  // User submits choice on active timeline card
  const handleTimelineChoice = async (phaseIndex: number, choice: Choice) => {
    if (isApiLoading) return;

    // Save choice in target phase
    const updatedPhases = [...phases];
    updatedPhases[phaseIndex].chosenId = choice.id;
    setPhases(updatedPhases);

    setIsApiLoading(true);
    setErrorText(null);

    // Calculate target next phase index:
    // year 1 chose -> next is year 3 (index 1)
    // year 3 chose -> next is year 5 (index 2)
    // year 5 chose -> next is year 10 (index 3)
    // year 10 chose -> next is year 15/Ending (index 4)
    const nextIndex = currentProposalIndex;

    try {
      const response = await fetch("/api/generate-next-phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile,
          currentStats: stats,
          history: updatedPhases,
          nextPhaseIndex: nextIndex
        })
      });

      if (!response.ok) {
        throw new Error("Gagal memuat cabang narasi berikutnya. Periksa koneksi internet atau kunci API Anda.");
      }

      const nextPhaseData: Phase = await response.json();

      // Apply statistical delta updates if any
      if (nextPhaseData.statChanges) {
        setStats(prev => {
          const updated = {
            money: Math.max(0, Math.min(100, prev.money + (nextPhaseData.statChanges?.money || 0))),
            stress: Math.max(0, Math.min(100, prev.stress + (nextPhaseData.statChanges?.stress || 0))),
            codingSkill: Math.max(0, Math.min(100, prev.codingSkill + (nextPhaseData.statChanges?.codingSkill || 0))),
            reputation: Math.max(0, Math.min(100, prev.reputation + (nextPhaseData.statChanges?.reputation || 0))),
            motivation: Math.max(0, Math.min(100, prev.motivation + (nextPhaseData.statChanges?.motivation || 0)))
          };
          
          setStatDeltas(nextPhaseData.statChanges || null);
          setShowDeltas(true);
          setTimeout(() => setShowDeltas(false), 4500);

          return updated;
        });
      }

      if (nextPhaseData.isEnding) {
        // Appended ending card
        setPhases(prev => [...prev, nextPhaseData]);
        setTimeout(() => {
          setStage("ending");
        }, 1200);
      } else {
        // Appended upcoming path card
        setPhases(prev => [...prev, nextPhaseData]);
        setCurrentProposalIndex(prev => prev + 1);
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Ujung alur narasi kehilangan konteks. Sangat disarankan untuk mencoba kembali pilihan Anda.");
    } finally {
      setIsApiLoading(false);
    }
  };

  // Helper utility to match real calendar projection based on phase
  const getCalendarSubLabel = (yearStr: string) => {
    switch (yearStr) {
      case "Year 1": return "Kuartal 3 2027 • Level Masuk Awal (Junior)";
      case "Year 3": return "Kuartal 2 2029 • Ambang Arsitektural (Mid/Senior)";
      case "Year 5": return "Kuartal 4 2031 • Cakrawala Pertengahan Karier";
      case "Year 10": return "Kuartal 1 2036 • Persimpangan Elit / Principal";
      case "Year 15 (Ending)": return "Kuartal 2 2041 • Status Warisan Utama (Legacy)";
      default: return "Pergeseran Garis Waktu Masa Depan";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans selection:bg-neutral-200/60 leading-relaxed overflow-x-hidden antialiased">
      
      {/* Editorial Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-neutral-200/50 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleRestart}>
            <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center p-1.5 shadow-sm text-white transition-transform duration-300 hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full" fill="none">
                <path d="M 190 120 L 190 392" stroke="#ffffff" strokeWidth="42" strokeLinecap="round" />
                <path d="M 190 120 C 290 120, 370 170, 370 256 C 370 342, 290 392, 190 392" stroke="#ffffff" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 190 256 C 245 256, 320 295, 360 345" stroke="#a3a3a3" strokeWidth="32" strokeLinecap="round" />
                <circle cx="190" cy="120" r="16" fill="#ffffff" />
                <circle cx="190" cy="256" r="14" fill="#a3a3a3" />
                <circle cx="190" cy="392" r="16" fill="#ffffff" />
                <circle cx="360" cy="345" r="14" fill="#ffffff" />
              </svg>
            </div>
            <span className="font-display font-semibold tracking-tight text-neutral-900 text-sm">
              DevLife
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-wide text-neutral-400 bg-neutral-100 rounded-full py-1 px-3 ml-2">
              v1.5.2-generatif
            </span>
            {stage !== "landing" && (
              <button 
                id="header_restart_btn"
                onClick={handleRestart}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors py-1 px-3 border border-neutral-200 hover:border-neutral-800 rounded-md bg-white shadow-xs"
              >
                Reset Cerita
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="relative pb-24">
        
        {/* LANDING PAGE STAGE */}
        {stage === "landing" && (
          <div className="max-w-4xl mx-auto px-6 sm:px-12 pt-16 sm:pt-28 text-center animate-fade-in">
            {/* Minimal Intro Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5 text-neutral-800 animate-pulse" />
              <span>Simulator Karier Developer API v3</span>
            </div>

            {/* Cinematic Headings */}
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1] max-w-3xl mx-auto mb-6">
              Masa depan kariermu di bidang tech dikompilasi secara <span className="underline decoration-neutral-300 underline-offset-8">real-time</span>.
            </h1>
            
            <p className="text-neutral-500 font-sans text-md sm:text-lg max-w-2xl mx-auto mb-12 font-normal leading-relaxed">
              DevLife adalah simulator karier berbasis narasi AI. Dengan mengevaluasi fokus teknologi, kebiasaan belajar, dan impian utamamu, kami merajut proyeksi 15 tahun perjalanan kariermu yang penuh rintangan, pencapaian, dan warisan legendaris.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
              <button
                id="btn_start_simulation"
                onClick={() => setStage("onboarding")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-sm py-3.5 px-8 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Mulai Perjalanan
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="btn_load_demo"
                onClick={handleLoadDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-sm py-3.5 px-6 rounded-lg transition-colors border border-transparent hover:border-neutral-300/40"
              >
                <History className="w-4 h-4 text-neutral-500" />
                Coba Demo Sandbox
              </button>
            </div>

            {/* High-fidelity editorial mockup cards to build trust & curiosity */}
            <div className="border border-neutral-200/60 bg-white p-8 rounded-2xl shadow-xs text-left max-w-2xl mx-auto border-t-4 border-t-neutral-900 transition-all hover:shadow-md duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-neutral-400">SIMULASI KEPUTUSAN</span>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 animate-pulse"></span>
              </div>
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-1">Tahun 3 • Arsitektur Sistem</h3>
              <p className="text-xs text-neutral-400 font-mono mb-4">KATEGORI: REKAYASA SISTEM</p>
              
              <p className="text-neutral-500 text-sm italic mb-6 leading-relaxed">
                &ldquo;Setelah berhasil merombak codebase utama yang lambat, karyamu ramai dibahas di komunitas software engineer tingkat tinggi. Kamu dapat tawaran: jadi konsultan freelance sistem kelas kakap, join startup fintech yang baru dapat pendanaan besar, atau tetap bertahan di kantor lama...&rdquo;
              </p>
              
              <div className="space-y-2">
                <div className="p-3 bg-neutral-50/70 border border-neutral-200/50 rounded-lg text-xs font-mono text-neutral-600 flex items-center justify-between">
                  <span>Opsi A: Ajukan penulisan ulang modul C++ inti demi performa maksimal</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <div className="p-3 bg-neutral-50/70 border border-neutral-200/50 rounded-lg text-xs font-mono text-neutral-400 flex items-center justify-between">
                  <span>Opsi B: Terima investasi awal dan mulai petualangan baru di SCBD</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                </div>
              </div>
            </div>

            {/* Subtle, elegant, cinematic footer */}
            <footer className="mt-32 max-w-md mx-auto text-center opacity-65">
              <p className="text-[11px] font-sans text-neutral-400 tracking-wide leading-relaxed font-normal">
                No simulation can predict your future perfectly.
                <span className="block mt-1 text-neutral-400/50 font-medium">But every choice still matters.</span>
              </p>
            </footer>
          </div>
        )}


        {/* ONBOARDING FLOW */}
        {stage === "onboarding" && (
          <div className="max-w-2xl mx-auto px-6 pt-12 animate-fade-in">
            {/* Progress Step Header */}
            <div className="flex items-center justify-between mb-8 border-b border-neutral-200/50 pb-4">
              <span className="font-mono text-xs text-neutral-400 tracking-widest uppercase">
                Onboarding Profil — Langkah {questionIndex + 1} dari {ONBOARDING_QUESTIONS.length}
              </span>
              <div className="flex gap-1">
                {ONBOARDING_QUESTIONS.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === questionIndex ? "w-8 bg-neutral-900" : "w-2 bg-neutral-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Question Body */}
            <div className="mb-10 text-left animate-slide-up">
              <h2 className="font-display text-2xl sm:text-3.5xl font-bold text-neutral-900 tracking-tight leading-snug mb-3">
                {ONBOARDING_QUESTIONS[questionIndex].title}
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base font-sans">
                {ONBOARDING_QUESTIONS[questionIndex].subtitle}
              </p>
            </div>

            {/* Error messaging state if any */}
            {errorText && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200/60 text-red-700 text-xs flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorText}</span>
              </div>
            )}

            {/* Elegant Row Options Stacked */}
            <div className="space-y-3.5" id={`question_${questionIndex}_options`}>
              {ONBOARDING_QUESTIONS[questionIndex].options.map((option, idx) => {
                const isSelected = profile[ONBOARDING_QUESTIONS[questionIndex].field] === option.value;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOnboardingSelect(option.value)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-300 group flex items-start gap-4 cursor-pointer outline-none bg-white ${
                      isSelected 
                        ? "border-neutral-950 shadow-sm ring-1 ring-neutral-920" 
                        : "border-neutral-200/70 hover:border-neutral-400/85 hover:shadow-xs"
                    }`}
                  >
                    <div className="mt-0.5 w-[20px] h-[20px] rounded-full border border-neutral-300 flex items-center justify-center text-xs text-white shrink-0 group-hover:border-neutral-800 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 scale-0 group-hover:scale-100 transition-transform duration-200" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display font-semibold text-[15px] sm:text-[16px] text-neutral-900">
                        {option.label}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans group-hover:text-neutral-600">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back Button Navigation if applicable */}
            {questionIndex > 0 && (
              <button
                id="btn_back_onboarding"
                onClick={() => setQuestionIndex(prev => prev - 1)}
                className="mt-6 text-xs text-neutral-400 hover:text-neutral-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                ← Kembali ke pertanyaan sebelumnya
              </button>
            )}
          </div>
        )}


        {/* SYSTEM TIMELINE COMPLIER STAGE (CINEMATIC SIM LOGS) */}
        {stage === "compiling" && (
          <div className="max-w-md mx-auto px-6 pt-24 text-center animate-fade-in">
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full bg-neutral-100 animate-ping opacity-70 w-16 h-16 m-auto"></div>
              <div className="relative w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center text-white">
                <Terminal className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-neutral-950 mb-2 tracking-tight">
              Menyusun Proyeksi Jalur Kariermu
            </h3>
            <p className="text-neutral-400 text-xs font-mono mb-8 tracking-widest uppercase">
              DEVLIFE ENGINE IS ACTIVE
            </p>

            {/* Modern micro-terminal display */}
            <div className="bg-[#1f1f1f] text-[#ebebeb] text-left p-5 rounded-lg font-mono text-[11px] sm:text-[12px] shadow-lg leading-6 border border-neutral-800/80 max-w-md mx-auto min-h-[180px] flex flex-col justify-between">
              <div>
                <p className="text-neutral-500 select-none pb-2 border-b border-neutral-800 mb-2">SYSTEM COMPILE LOGS</p>
                {compilingLogs.slice(0, compilingStep + 1).map((logLine, index) => (
                  <div key={index} className="flex gap-2 text-wrap break-all items-start animate-fade-in">
                    <span className="text-[#a0a0a0] shrink-0 font-medium select-none">&rsaquo;</span>
                    <span className={index === compilingStep ? "text-emerald-400" : "text-neutral-300"}>
                      {logLine}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[#888] text-[10px] text-right mt-4 pt-2 border-t border-neutral-800/60 font-mono">
                ALLOCATING DYNAMIC CONTEXT
              </div>
            </div>

            <p className="text-xs text-neutral-500 font-sans mt-8 italic">
              Harap tunggu sebentar. Sistem kami sedang meraba masa depanmu secara real-time.
            </p>
          </div>
        )}


        {/* THE CORE TIMELINE EXPERIENCE */}
        {stage === "timeline" && (
          <div className="max-w-5xl mx-auto px-6 sm:px-12 pt-8">
            
            {/* Visual Header Grid for Profile + Live Vitals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* Profile Blueprint metadata summary (left) */}
              <div className="lg:col-span-4 bg-white border border-neutral-200/50 p-8 rounded-2xl flex flex-col justify-between shadow-xs">
                <div>
                  <h4 className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase mb-5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    Cetak Biru Dev
                  </h4>
                  
                  <div className="space-y-5">
                    <div>
                      <p className="text-[10px] text-neutral-400 tracking-wider font-mono">FOKUS TEKNOLOGI</p>
                      <p className="text-sm font-semibold text-neutral-800 mt-1">{profile.major}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 tracking-wider font-mono">GAYA BELAJAR & PROJECT</p>
                      <p className="text-sm font-semibold text-neutral-800 mt-1">{profile.habits}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 tracking-wider font-mono">SISTEM PENDUKUNG</p>
                      <p className="text-sm font-semibold text-neutral-800 mt-1">{profile.coping}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 tracking-wider font-mono">ARAH TUJUAN</p>
                      <p className="text-sm font-semibold text-neutral-800 mt-1">{profile.philosophy}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100/70 pt-4 mt-8 text-[10px] text-neutral-400 flex items-center justify-between font-mono">
                  <span>Koneksi Narasi: Stabil</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              {/* Stat HUD Display Card (right) */}
              <div className="lg:col-span-8 bg-white border border-neutral-200/50 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                      Status Karaktermu
                    </h4>
                    
                    {/* Floating Notification of latest Stat Delta impacts */}
                    {showDeltas && statDeltas && (
                      <div className="absolute top-4 right-8 bg-neutral-900 text-white rounded-md px-3 py-1 text-[10px] font-mono animate-bounce flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        <span>Statistikmu terpengaruh keputusan baru!</span>
                      </div>
                    )}
                  </div>

                  {/* Grid of stats progress levels - Beautifully wide, breathable, borderless columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
                    
                    {/* Money Stat */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {/* Elegant typography featuring percentage first */}
                        <span className="block font-sans text-3xl sm:text-4xl font-light tracking-tight text-neutral-950 mb-2">
                          {stats.money}%
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5 mb-1.5">
                          <Coins className="w-3.5 h-3.5 text-neutral-400" />
                          Finansial
                        </span>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed tracking-normal">
                          Isi dompet &amp; aset
                        </p>
                      </div>
                      <div className="w-full mt-6">
                        <div className="h-[2px] bg-neutral-100 rounded-full overflow-hidden w-full">
                          <div className="h-full bg-neutral-700 rounded-full transition-all duration-1000" style={{ width: `${stats.money}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Stress Stat */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <span className={`block font-sans text-3xl sm:text-4xl font-light tracking-tight mb-2 ${stats.stress > 70 ? "text-rose-600 animate-pulse font-medium" : "text-neutral-950"}`}>
                          {stats.stress}%
                        </span>
                        <span className={`text-xs font-semibold flex items-center gap-1.5 mb-1.5 ${stats.stress > 70 ? "text-rose-700" : "text-neutral-800"}`}>
                          <Brain className={`w-3.5 h-3.5 ${stats.stress > 70 ? "text-rose-500" : "text-neutral-400"}`} />
                          Beban Mental
                        </span>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed tracking-normal">
                          {stats.stress > 70 ? "Awas, hampir burnout!" : "Tingkat stress harian"}
                        </p>
                      </div>
                      <div className="w-full mt-6">
                        <div className="h-[2px] bg-neutral-100 rounded-full overflow-hidden w-full">
                          <div className={`h-full rounded-full transition-all duration-1000 ${stats.stress > 70 ? "bg-rose-500/85" : "bg-neutral-700"}`} style={{ width: `${stats.stress}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Coding Skill Stat */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <span className="block font-sans text-3xl sm:text-4xl font-light tracking-tight text-neutral-950 mb-2">
                          {stats.codingSkill}%
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5 mb-1.5">
                          <Code className="w-3.5 h-3.5 text-neutral-400" />
                          Skill Dev
                        </span>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed tracking-normal">
                          Kemampuan nulis kode
                        </p>
                      </div>
                      <div className="w-full mt-6">
                        <div className="h-[2px] bg-neutral-100 rounded-full overflow-hidden w-full">
                          <div className="h-full bg-neutral-700 rounded-full transition-all duration-1000" style={{ width: `${stats.codingSkill}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Reputation Stat */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <span className="block font-sans text-3xl sm:text-4xl font-light tracking-tight text-neutral-950 mb-2">
                          {stats.reputation}%
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5 mb-1.5">
                          <Award className="w-3.5 h-3.5 text-neutral-400" />
                          Reputasi
                        </span>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed tracking-normal">
                          Nama baik di ekosistem
                        </p>
                      </div>
                      <div className="w-full mt-6">
                        <div className="h-[2px] bg-neutral-100 rounded-full overflow-hidden w-full">
                          <div className="h-full bg-neutral-700 rounded-full transition-all duration-1000" style={{ width: `${stats.reputation}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Motivation Stat */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <span className="block font-sans text-3xl sm:text-4xl font-light tracking-tight text-neutral-950 mb-2">
                          {stats.motivation}%
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5 mb-1.5">
                          <Smile className="w-3.5 h-3.5 text-neutral-400" />
                          Ambisi
                        </span>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed tracking-normal">
                          Gairah belajar &amp; berkarya
                        </p>
                      </div>
                      <div className="w-full mt-6">
                        <div className="h-[2px] bg-neutral-100 rounded-full overflow-hidden w-full">
                          <div className="h-full bg-neutral-700 rounded-full transition-all duration-1000" style={{ width: `${stats.motivation}%` }} />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Highly reduced, minimalist bottom legend */}
                <div className="flex justify-between items-center mt-10 pt-4 border-t border-neutral-100 text-[10px] text-neutral-400 font-sans tracking-wide">
                  <span>Keputusan memengaruhi vitalitas karakter secara dinamis • Rentang 0–100%</span>
                </div>
              </div>
            </div>

            {/* ERROR NOTIFICATION BAR */}
            {errorText && (
              <div className="p-4 mb-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  {errorText}
                </span>
                <button 
                  onClick={() => {
                    if (phases.length > 0) {
                      // Attempt to re-issue current step choice
                      const latestPhase = phases[phases.length - 1];
                    }
                    setErrorText(null);
                  }}
                  className="font-bold underline text-[11px]"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* DYNAMIC SCROLLABLE EDITORIAL GENERAL TIMELINE SEQUENCE */}
            <div className="max-w-3xl mx-auto space-y-12 relative">
              
              {/* Spine connection line down the center of the timeline cards */}
              <div className="absolute left-0 right-0 sm:left-4 top-[50px] bottom-0 w-[1px] bg-neutral-200/80 -z-10" />

              {phases.map((phase, idx) => {
                const isActive = idx === phases.length - 1;
                const isSelected = phase.chosenId !== undefined;
                
                return (
                  <div 
                    key={idx}
                    ref={isActive ? activePhaseRef : null}
                    className={`relative transition-all duration-500 flex flex-col items-stretch ${
                      isActive ? "scale-100 opacity-100" : "scale-[0.98] opacity-50 filter "
                    }`}
                  >
                    
                    {/* Tiny chronological year pill */}
                    <div className="flex items-center gap-4 mb-3 sm:pl-8">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 border-4 border-[#fafafa] flex items-center justify-center text-white shrink-0 shadow-sm">
                        <span className="font-mono text-[10px] font-bold">{idx + 1}</span>
                      </div>
                      
                      <div>
                        <span className="font-mono text-xs text-neutral-400 tracking-wider font-semibold">
                          {getCalendarSubLabel(phase.year)}
                        </span>
                      </div>
                    </div>

                    {/* Timeline card styled with exquisite whitespace & custom border */}
                    <div className={`sm:ml-8 bg-white border rounded-xl p-6 sm:p-8 shadow-xs ${
                      isActive ? "border-neutral-900/40 ring-1 ring-neutral-300/30" : "border-neutral-200/60"
                    }`}>
                      
                      {/* Interactive Headline */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 border-b border-neutral-100 pb-3">
                        <h3 className="font-display font-black text-xl sm:text-2.5xl text-neutral-900 tracking-tight leading-tight">
                          {phase.title}
                        </h3>
                        {/* Status Label if is ending archetype */}
                        {phase.endingArchetype && (
                          <span className="font-sans text-[11px] font-extrabold uppercase tracking-wide bg-neutral-950 text-white rounded-md px-2 py-1 select-none">
                            {phase.endingArchetype}
                          </span>
                        )}
                      </div>

                      {/* Large readable narrative paragraph */}
                      <p className="text-[#3b3b3b] text-base sm:text-md font-sans leading-relaxed mb-6 font-normal">
                        {phase.narrative}
                      </p>

                      {/* Stat summary highlights associated in this narrative phase */}
                      {phase.statChanges && !isSelected && (
                        <div className="mb-6 py-2 px-3 bg-neutral-50 rounded-lg flex items-center gap-3">
                          <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-widest">DAMPAK TERHADAP STATISTIK:</span>
                          <div className="flex flex-wrap gap-2 text-[10px] font-mono text-neutral-500 font-bold">
                            {phase.statChanges.money >= 0 && <span>Finansial +{phase.statChanges.money}</span>}
                            {phase.statChanges.money < 0 && <span className="text-red-500">Finansial {phase.statChanges.money}</span>}
                            {phase.statChanges.stress >= 0 && <span className="text-amber-500">Beban Mental +{phase.statChanges.stress}</span>}
                            {phase.statChanges.stress < 0 && <span className="text-[#333]">Beban Mental {phase.statChanges.stress}</span>}
                            {phase.statChanges.codingSkill >= 0 && <span>Skill Dev +{phase.statChanges.codingSkill}</span>}
                            {phase.statChanges.reputation >= 0 && <span>Reputasi +{phase.statChanges.reputation}</span>}
                          </div>
                        </div>
                      )}

                      {/* IF ENDING / FINAL LEGACY (show custom ending parameters inside card) */}
                      {phase.isEnding && phase.lessonsLearned && (
                        <div className="mt-6 border-t border-neutral-200/80 pt-6 animate-fade-in">
                          <h4 className="font-display font-medium text-xs text-neutral-400 uppercase tracking-wider mb-4">
                            Pelajaran Berharga Selama Proses Ini:
                          </h4>
                          <div className="space-y-2.5 mb-6">
                            {phase.lessonsLearned.map((lesson, lessonIdx) => (
                              <div key={lessonIdx} className="flex gap-2.5 items-start text-xs sm:text-sm text-neutral-600">
                                <span className="w-2.5 h-2.5 bg-yellow-500 text-white shrink-0 rounded-full flex items-center justify-center font-bold text-[8px] mt-1" />
                                <span className="leading-relaxed">{lesson}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <button
                              id="btn_ending_share"
                              onClick={() => {
                                alert("Tautan ke catatan karier berhasil disalin! Bagikan ke rekan-rekanmu.");
                              }}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs py-2.5 px-5 rounded-lg shadow-xs cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Bagikan Hasil Karier
                            </button>
                            
                            <button
                              id="btn_restart_ending"
                              onClick={handleRestart}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs py-2.5 px-5 rounded-lg border border-neutral-200/50 cursor-pointer"
                            >
                              Coba Jalur Baru
                            </button>
                          </div>
                        </div>
                      )}

                      {/* THE THREE CHOICE BUTTONS (Active card Only) */}
                      {isActive && !isSelected && !phase.isEnding && phase.choices && (
                        <div id={`phase_${idx}_choices`} className="mt-8 pt-6 border-t border-neutral-100 space-y-3 animate-fade-in">
                          <p className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider mb-3">
                            Pilih keputusan terbaik langkah berikutnya:
                          </p>
                          <div className="grid grid-cols-1 gap-3">
                            {phase.choices.map((choice) => (
                              <button
                                key={choice.id}
                                disabled={isApiLoading}
                                onClick={() => handleTimelineChoice(idx, choice)}
                                className="w-full text-left p-4 rounded-lg border border-neutral-200 hover:border-neutral-800 hover:bg-neutral-50/50 transition-all duration-300 cursor-pointer flex flex-col gap-1 outline-none relative group disabled:opacity-50"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-semibold text-neutral-500 group-hover:text-neutral-900 border border-neutral-200 group-hover:border-neutral-900 rounded py-0.5 px-1.5 block leading-none mr-2 bg-[#ffffff]">
                                    {choice.id}
                                  </span>
                                  <span className="font-display font-medium text-sm text-neutral-800 group-hover:text-neutral-950 transition-colors">
                                    {choice.text}
                                  </span>
                                </div>
                                <span className="text-[11px] sm:text-[12px] text-neutral-400 font-sans group-hover:text-neutral-500 pl-0 sm:pl-[44px] italic leading-tight">
                                  &ldquo;{choice.flavorText}&rdquo;
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SELECTED DECISION SUMMARY (If previous card) */}
                      {isSelected && (
                        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                          <span className="font-mono">KEPUTUSAN DIKUNCI</span>
                          <span className="font-sans font-medium text-neutral-700 bg-neutral-100 rounded px-2 py-0.5">
                            Mengambil Opsi {phase.chosenId}
                          </span>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

              {/* Cinematic Small Loading Indicator bottom of active timeline while API fetches downstream and compiles */}
              {isApiLoading && (
                <div className="flex items-center gap-3 sm:ml-8 p-6 bg-white border border-neutral-200/50 rounded-xl max-w-3xl animate-pulse">
                  <div className="w-5 h-5 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin shrink-0" />
                  <span className="font-mono text-xs text-neutral-400">
                    Menganalisis keputusan... menghitung proyeksi masa depan...
                  </span>
                </div>
              )}

              <div ref={timelineEndRef} />
            </div>

          </div>
        )}


        {/* DETAILED LEGACY SUMMARY PAGE (ONLY IF STAGE === ending) */}
        {stage === "ending" && (
          <div className="max-w-3xl mx-auto px-6 pt-16 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center p-4 bg-neutral-900 text-white rounded-full mb-6 shadow-sm">
              <Trophy className="w-8 h-8 text-yellow-300 animate-bounce" />
            </div>

            <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest leading-none mb-2">HASIL SIMULASI</p>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight mb-8">
              Lembar Perjalanan Kariermu Selesai Ditulis.
            </h2>

            {/* Printout of full legacy details */}
            <div className="bg-white border border-neutral-200/80 p-6 sm:p-10 rounded-2xl shadow-sm text-left max-w-2xl mx-auto border-t-8 border-t-neutral-950">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-4 mb-6">
                <div>
                  <h3 className="font-mono text-xs text-neutral-400 uppercase tracking-wider mb-1">
                    ARKETIPE UTAMA KAMU
                  </h3>
                  <p className="font-display font-extrabold text-[#111111] text-2xl tracking-tight uppercase">
                    {phases[phases.length - 1]?.endingArchetype || "Arsitek Karier"}
                  </p>
                </div>
                
                {/* Visual stats footprint summary */}
                <div className="mt-4 sm:mt-0 font-mono text-[11px] text-right space-y-1 text-neutral-500">
                  <p className="leading-none">STATISTIK KHUSUS</p>
                  <p className="leading-none font-bold">FINANSIAL: {stats.money}% | BEBAN MENTAL: {stats.stress}%</p>
                  <p className="leading-none text-neutral-400">SKILL DEV: {stats.codingSkill}% | REPUTASI: {stats.reputation}%</p>
                </div>
              </div>

              {/* Main review paragraph */}
              <p className="text-neutral-700 text-[15px] sm:text-[16px] leading-relaxed font-sans mb-8">
                {phases[phases.length - 1]?.narrative}
              </p>

              {/* Retro learnings stack listed out */}
              {phases[phases.length - 1]?.lessonsLearned && (
                <div className="border-t border-neutral-100 pt-6">
                  <h4 className="font-mono text-xs text-neutral-400 uppercase mb-4 tracking-wider">
                    Retrospektif Karier Selama 15 Tahun
                  </h4>
                  <ul className="space-y-3">
                    {phases[phases.length - 1].lessonsLearned?.map((lesson, index) => (
                      <li key={index} className="flex gap-3 items-start text-xs sm:text-sm text-neutral-600">
                        <span className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center font-mono font-bold text-[10px] text-neutral-700 shrink-0 mt-0.5">
                          0{index + 1}
                        </span>
                        <span className="leading-relaxed">{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mini developer footprint blueprint list again */}
              <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-4 text-[11px] text-neutral-400 font-mono">
                <div>
                  <p>STACK: {profile.major}</p>
                </div>
                <div>
                  <p>AMBISI: {profile.habits}</p>
                </div>
              </div>
            </div>

            {/* Restart simulated path controls */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="btn_restart_legacy"
                onClick={handleRestart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm py-3 px-8 rounded-lg shadow-sm hover:shadow transition-colors cursor-pointer"
              >
                Coba Jalur Karier Lain
                <RefreshCw className="w-4 h-4 text-neutral-300" />
              </button>
              
              <button
                id="btn_share_record_copy"
                onClick={() => {
                  alert("Detail simulasi berhasil disalin ke papan klip!");
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white border border-neutral-200 hover:border-neutral-800 text-neutral-700 font-semibold text-sm py-3 px-8 rounded-lg shadow-xs hover:shadow-sm transition-colors cursor-pointer"
              >
                Salin Ringkasan Karier
              </button>
            </div>

            {/* Subtle, elegant, cinematic footer */}
            <footer className="mt-28 max-w-md mx-auto text-center opacity-65">
              <p className="text-[11px] font-sans text-neutral-400 tracking-wide leading-relaxed font-normal">
                No simulation can predict your future perfectly.
                <span className="block mt-1 text-neutral-400/50 font-medium">But every choice still matters.</span>
              </p>
            </footer>

          </div>
        )}

      </main>
    </div>
  );
}
