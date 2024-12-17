import React from "react";
import InterviewItemCard from "./InterviewItemCard";

interface Interview {
  mockId: string;
  jobPosition: string;
  jobExperience: string;
  createdAt: string | null;
}

interface InterviewListClientProps {
  interviewList: Interview[];
}

const InterviewListClient = ({ interviewList }: InterviewListClientProps) => {
  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {interviewList &&
          interviewList.map((interview) => (
            <InterviewItemCard key={interview.mockId} interview={interview} />
          ))}
      </div>
    </div>
  );
};

export default InterviewListClient;
