export interface Interview {
    id: number;
    jsonMockResp: string;
    jobPosition: string;
    jobDesc: string;
    jobExperience: string;
    createdBy: string;
    createdAt: string | null;
    mockId: string;
  }

export interface Answer {
  id: number,    
  mockIdRef: string,
  question: string,
  correctAnswer: string,
  userAnswer: string,
  feedback: string,
  rating: string,
  userEmail: string,
  createdAt: string
}

export interface AnalysisResult {
  emotion: {
    dominant_emotion: string;
    emotions: {
      [key: string]: number;
    };
  };
  posture: {
    status: string;
    position?: {
      x_offset: number;
      y_offset: number;
    };
    feedback: string[];
  };
  behavior: {
    movement: string;
    confidence: number;
    feedback?: string;
  };
  feedback: string[];
}