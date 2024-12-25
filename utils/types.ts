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