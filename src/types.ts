
export interface PPE {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Task {
  id: string;
  name: string;
  requiredPPE: string[]; // IDs of PPE
  baseRisk: number; // 0-100
  quiz?: QuizQuestion[];
}

export interface DailyLog {
  id: string;
  date: string;
  taskId: string;
  ppeStatus: { ppeId: string; status: boolean }[];
  incidentLogged: boolean;
  nearMissDescription?: string;
  safetyScore: number;
}
