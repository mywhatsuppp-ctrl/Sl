export enum Language {
  ENGLISH = 'en',
  URDU = 'ur'
}

export interface ObservationRecord {
  id: string;
  teacherName: string;
  subject: string;
  date: string;
  grade: string;
  indicators: {
    lessonPlan: boolean;
    avAids: boolean;
    studentEngagement: boolean;
    notebookCheck: boolean;
  };
  deficiencies: string;
  mentoringNotes: string;
  rating: number; // 1-5
}

export interface FeedbackRecord {
  id: string;
  teacherName: string;
  date: string;
  strengths: string;
  areasForImprovement: string;
  agreedActionPlan: string;
  followUpDate: string;
  status: 'Pending' | 'Completed';
}

export interface AcademicRecord {
  id: string;
  month: string; // YYYY-MM
  enrollmentBoys: number;
  enrollmentGirls: number;
  studentAttendance: number; // %
  teacherAttendance: number; // %
  ablActivities: boolean; // Activity Based Learning
  communityMeeting: boolean;
  notes: string;
}

export interface AssessmentRecord {
  id: string;
  date: string;
  grade: string;
  subject: string;
  totalStudents: number;
  passedStudents: number;
  sloTopic: string;
  remarks: string;
}

export interface TrainingRecord {
  id: string;
  teacherName: string;
  title: string;
  date: string;
  type: 'Induction' | 'CPD' | 'Mentoring';
  outcome: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  designation: string; // PST, CT, AT, etc.
  cnic: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type TranslationKey = 
  | 'appTitle'
  | 'dashboard'
  | 'observation'
  | 'feedback'
  | 'academic'
  | 'assessment'
  | 'training'
  | 'reports'
  | 'knowledge'
  | 'newObservation'
  | 'teacherName'
  | 'subject'
  | 'save'
  | 'cancel'
  | 'history'
  | 'lessonPlan'
  | 'avAids'
  | 'engagement'
  | 'notebooks'
  | 'deficiencies'
  | 'mentoring'
  | 'submitSuccess'
  | 'welcome'
  | 'aiAssistant'
  | 'aiPrompt'
  | 'printReport'
  | 'actionPlan'
  | 'followUp'
  | 'enrollment'
  | 'attendance'
  | 'community'
  | 'slo'
  | 'passRate'
  | 'trainingTitle';

export interface ReportData {
  totalObservations: number;
  avgRating: number;
  pendingActions: number;
}