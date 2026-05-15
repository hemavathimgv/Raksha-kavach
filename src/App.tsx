
import { useState, useEffect } from 'react';
import { 
  HardHat, 
  ShieldAlert, 
  ClipboardCheck, 
  AlertTriangle, 
  Info, 
  History, 
  CheckCircle2,
  XCircle,
  Play,
  User,
  ShieldCheck,
  Zap,
  Footprints,
  Hand,
  Eye,
  Shirt,
  Anchor,
  Coffee,
  LogOut,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginPage } from './components/LoginPage';
import { SafetyQuiz } from './components/SafetyQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { TASKS, PPE_LIST } from '@/constants';
import { Task, PPE } from '@/types';

const PPE_ICONS: Record<string, any> = {
  helmet: HardHat,
  gloves: Hand,
  boots: Footprints,
  goggles: Eye,
  vest: Shirt,
  harness: Anchor,
};

export default function App() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(TASKS[0].id);
  const [checkedPPE, setCheckedPPE] = useState<Record<string, boolean>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [safetyScore, setSafetyScore] = useState(() => {
    const saved = localStorage.getItem('safetyScore');
    return saved ? parseInt(saved) : 85;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved) : 12;
  });

  useEffect(() => {
    localStorage.setItem('safetyScore', safetyScore.toString());
  }, [safetyScore]);

  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const [incidentReport, setIncidentReport] = useState("");

  useEffect(() => {
    // Start-of-Day Safety Reminder
    toast.info("Start-of-Day Safety Reminder", {
      description: "Welcome shift supervisor. Please ensure all workers are equipped with their required PPE before commencing operations.",
      duration: 10000,
      icon: <Coffee className="w-5 h-5 text-industrial-yellow" />,
    });
  }, []);

  const currentTask = TASKS.find(t => t.id === selectedTaskId) || TASKS[0];

  useEffect(() => {
    const initialPPE: Record<string, boolean> = {};
    PPE_LIST.forEach(p => initialPPE[p.id] = false);
    setCheckedPPE(initialPPE);
  }, [selectedTaskId]);

  const handlePPEChange = (ppeId: string, checked: boolean) => {
    setCheckedPPE(prev => ({ ...prev, [ppeId]: checked }));
  };

  const calculateRisk = () => {
    const required = currentTask.requiredPPE;
    const checkedCount = required.filter(id => checkedPPE[id]).length;
    if (required.length === 0) return 0;
    
    const completionRate = checkedCount / required.length;
    // Inherent risk is reduced by 85% when all PPE is equipped
    const reducedRisk = currentTask.baseRisk * (1 - (0.85 * completionRate));
    return Math.round(reducedRisk);
  };

  const getRiskStatus = (risk: number) => {
    if (risk < 30) return { label: 'LOW', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (risk < 60) return { label: 'MODERATE', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const handleSubmitDaily = () => {
    const required = currentTask.requiredPPE;
    const missing = required.filter(id => !checkedPPE[id]);
    
    if (missing.length > 0) {
      toast.error("Safety check failed!", {
        description: `Missing required gear: ${missing.map(m => PPE_LIST.find(p => p.id === m)?.name).join(', ')}`,
      });
      return;
    }

    toast.success("Safe to proceed!", { description: "Continue to safety intelligence check." });
    setStreak(s => s + 1);
    setSafetyScore(prev => Math.min(100, prev + 2));
    setCurrentStep(3); // Go to Quiz
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setCurrentStep(4);
    if (score >= 80) {
      setSafetyScore(prev => Math.min(100, prev + 5));
      toast.success("Excellent Result!", { description: "Extra safety points awarded." });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentStep(1);
    toast.info("Session Ended", {
      description: "You have been securely logged out."
    });
  };

  if (!user) {
    return (
      <>
        <LoginPage onLogin={setUser} />
        <Toaster position="bottom-right" richColors />
      </>
    );
  }

  const riskValue = calculateRisk();
  const riskStatus = getRiskStatus(riskValue);

  const steps = [
    { title: 'Job Select', icon: Play },
    { title: 'Gear Check', icon: ShieldCheck },
    { title: 'AI Quiz', icon: Brain },
    { title: 'Risk Audit', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-industrial-yellow p-2 rounded-lg text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-industrial-black">RAKSHA-KAVACH</h1>
              <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Worker Safety Auditor</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Score</p>
              <p className="text-lg font-black text-industrial-yellow">{safetyScore}%</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-right flex items-center gap-2">
              <Zap className="w-4 h-4 text-industrial-yellow animate-pulse" />
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Streak</p>
                <p className="text-lg font-black text-industrial-yellow">{streak}D</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={handleLogout}
              className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stepper Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const StepIcon = s.icon;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            
            return (
              <button 
                key={s.title}
                onClick={() => setCurrentStep(stepNum)}
                className="relative z-10 flex flex-col items-center gap-2 group transition-all"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                  isActive ? 'bg-industrial-yellow border-amber-100 text-white hover:scale-110' : 
                  isCompleted ? 'bg-industrial-black border-gray-100 text-white' : 
                  'bg-white border-gray-100 text-gray-300'
                }`}>
                  <StepIcon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-industrial-yellow' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area (Slides) */}
      <main className="max-w-2xl mx-auto p-6 pt-12">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-800">What's your task today?</h2>
                <p className="text-gray-500 mt-2 text-sm italic">Selecting the correct job ensures we verify the right safety protocols.</p>
              </div>
              <div className="grid gap-4">
                {TASKS.map(task => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setCurrentStep(2);
                    }}
                    className={`p-6 text-left border-2 rounded-2xl transition-all flex items-center justify-between group ${
                      selectedTaskId === task.id ? 'border-industrial-yellow bg-amber-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-lg text-gray-800 uppercase tracking-tight">{task.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest opacity-60">Base Risk: {task.baseRisk}%</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-industrial-yellow transition-colors">
                      <Play className={`w-4 h-4 ${selectedTaskId === task.id ? 'text-industrial-yellow' : 'text-gray-400'} group-hover:text-white transition-colors`} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-800">Equip Safety Gear</h2>
                <p className="text-gray-500 mt-2 text-sm italic">Check off each item to see its impact on your live risk level.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-3">
                  {PPE_LIST.map(ppe => {
                    const isRequired = currentTask.requiredPPE.includes(ppe.id);
                    const Icon = PPE_ICONS[ppe.id] || Info;
                    return (
                      <div 
                        key={ppe.id}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                          !isRequired ? 'opacity-20 pointer-events-none grayscale' :
                          checkedPPE[ppe.id] ? 'border-industrial-yellow bg-amber-50' : 'border-gray-100 bg-white shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox 
                            id={ppe.id}
                            checked={!!checkedPPE[ppe.id]}
                            onCheckedChange={(checked) => handlePPEChange(ppe.id, !!checked)}
                            className="w-6 h-6 border-industrial-yellow/30 data-[state=checked]:bg-industrial-yellow"
                          />
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${checkedPPE[ppe.id] ? 'text-industrial-yellow' : 'text-gray-300'}`} />
                            <label htmlFor={ppe.id} className={`font-bold text-sm uppercase ${checkedPPE[ppe.id] ? 'text-industrial-yellow' : 'text-gray-700'}`}>
                              {ppe.name}
                            </label>
                          </div>
                        </div>
                        {isRequired && !checkedPPE[ppe.id] && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-center">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">3D Safe-Suit Active</h4>
                  <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl border-4 border-gray-100 flex items-center justify-center p-8">
                    <User className="w-full h-full text-gray-200" />
                    <AnimatePresence>
                      {checkedPPE.helmet && (
                        <motion.div key="sim-helmet" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4">
                          <HardHat className="w-20 h-20 text-industrial-yellow drop-shadow-lg" />
                        </motion.div>
                      )}
                      {checkedPPE.vest && (
                        <motion.div key="sim-vest" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-1/4">
                          <Shirt className="w-28 h-28 text-industrial-yellow drop-shadow-lg" />
                        </motion.div>
                      )}
                      {checkedPPE.gloves && (
                        <div className="absolute top-1/2 flex justify-between w-full px-6" key="gloves-sim">
                          <motion.div key="hand-l" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}><Hand className="w-16 h-16 text-industrial-yellow drop-shadow-lg" /></motion.div>
                          <motion.div key="hand-r" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}><Hand className="w-16 h-16 text-industrial-yellow drop-shadow-lg" /></motion.div>
                        </div>
                      )}
                      {checkedPPE.boots && (
                        <div className="absolute bottom-6 flex justify-around w-full" key="boots-sim">
                          <motion.div key="boot-l" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Footprints className="w-16 h-16 text-industrial-yellow drop-shadow-lg" /></motion.div>
                          <motion.div key="boot-r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Footprints className="w-16 h-16 text-industrial-yellow drop-shadow-lg" /></motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className={`p-4 rounded-2xl border-2 transition-all ${riskStatus.bg} ${riskStatus.border}`}>
                    <p className={`text-[10px] font-black tracking-widest ${riskStatus.color}`}>RISK LEVEL: {riskStatus.label}</p>
                    <p className={`text-3xl font-black ${riskStatus.color}`}>{riskValue}%</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 h-16 rounded-xl text-gray-500 font-bold border-gray-100" onClick={() => setCurrentStep(1)}>
                   BACK
                </Button>
                <Button className="flex-[2] high-vis-button h-16 rounded-xl" onClick={handleSubmitDaily}>
                  SUBMIT GEAR CHECK
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-800">Intelligence Check</h2>
                <p className="text-gray-500 mt-2 text-sm italic">Our AI auditor has generated a custom quiz based on your assigned task.</p>
              </div>
              <SafetyQuiz taskName={currentTask.name} onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl text-center space-y-6">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-industrial-black tracking-tight">READY FOR OPS</h2>
                  <p className="text-gray-500 mt-2">Safety check successful. Digital seal issued for today.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                  <div className="bg-gray-50 p-6 rounded-3xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Safety Streak</p>
                    <p className="text-3xl font-black text-industrial-black">{streak} DAYS</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quiz Score</p>
                    <p className="text-3xl font-black text-industrial-yellow">{quizScore}%</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Factor</p>
                    <p className={`text-3xl font-black ${riskStatus.color}`}>{riskValue}%</p>
                  </div>
                </div>

                <div className="space-y-4 text-left p-6 bg-gray-50 rounded-3xl">
                  <h4 className="text-xs font-bold text-gray-800 uppercase flex items-center gap-2">
                    <History className="w-4 h-4 text-industrial-yellow" /> Incident Log
                  </h4>
                  <textarea
                    value={incidentReport}
                    onChange={(e) => setIncidentReport(e.target.value)}
                    placeholder="Report a near miss..."
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-100 outline-none transition-all h-24"
                  />
                  <Button 
                    className="w-full bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 rounded-xl"
                    onClick={() => {
                      if(incidentReport) {
                        toast.success("Incident Logged", { description: "Report transmitted to supervisor." });
                        setIncidentReport("");
                      }
                    }}
                  >
                    LOG INCIDENT
                  </Button>
                </div>

                <Button className="w-full h-20 text-xl font-black high-vis-button" onClick={() => setCurrentStep(1)}>
                  FINISH SESSION
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="py-12 mt-20 text-center border-t border-gray-100">
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-300">Raksha-Kavach Auditor • Powered by Gemini AI</p>
      </footer>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
