import { 
  ObservationRecord, 
  FeedbackRecord, 
  AcademicRecord, 
  AssessmentRecord, 
  TrainingRecord 
} from '../types';

// Keys
const DB_KEY_OBSERVATIONS = 'kpk_sl_observations';
const DB_KEY_FEEDBACK = 'kpk_sl_feedback';
const DB_KEY_ACADEMIC = 'kpk_sl_academic';
const DB_KEY_ASSESSMENT = 'kpk_sl_assessment';
const DB_KEY_TRAINING = 'kpk_sl_training';

// Helper to simulate async DB calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic getter/setter to reduce code duplication
async function getItems<T>(key: string): Promise<T[]> {
  await delay(100);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

async function addItem<T>(key: string, item: T): Promise<void> {
  await delay(300);
  const existing = await getItems<T>(key);
  const updated = [item, ...existing];
  localStorage.setItem(key, JSON.stringify(updated));
}

export const dbService = {
  // Observations
  async getAllObservations(): Promise<ObservationRecord[]> {
    return getItems<ObservationRecord>(DB_KEY_OBSERVATIONS);
  },
  async addObservation(record: ObservationRecord): Promise<void> {
    return addItem(DB_KEY_OBSERVATIONS, record);
  },

  // Feedback
  async getAllFeedback(): Promise<FeedbackRecord[]> {
    return getItems<FeedbackRecord>(DB_KEY_FEEDBACK);
  },
  async addFeedback(record: FeedbackRecord): Promise<void> {
    return addItem(DB_KEY_FEEDBACK, record);
  },

  // Academic
  async getAllAcademic(): Promise<AcademicRecord[]> {
    return getItems<AcademicRecord>(DB_KEY_ACADEMIC);
  },
  async addAcademic(record: AcademicRecord): Promise<void> {
    return addItem(DB_KEY_ACADEMIC, record);
  },

  // Assessment
  async getAllAssessment(): Promise<AssessmentRecord[]> {
    return getItems<AssessmentRecord>(DB_KEY_ASSESSMENT);
  },
  async addAssessment(record: AssessmentRecord): Promise<void> {
    return addItem(DB_KEY_ASSESSMENT, record);
  },

  // Training
  async getAllTraining(): Promise<TrainingRecord[]> {
    return getItems<TrainingRecord>(DB_KEY_TRAINING);
  },
  async addTraining(record: TrainingRecord): Promise<void> {
    return addItem(DB_KEY_TRAINING, record);
  },

  // Stats
  async getStats(): Promise<{ total: number, avg: number }> {
    const obs = await this.getAllObservations();
    if (obs.length === 0) return { total: 0, avg: 0 };
    
    const total = obs.length;
    const sum = obs.reduce((acc, curr) => acc + curr.rating, 0);
    return { total, avg: parseFloat((sum / total).toFixed(1)) };
  },

  // Sync
  async syncData(): Promise<boolean> {
    await delay(1000);
    return true; // Mock success
  }
};