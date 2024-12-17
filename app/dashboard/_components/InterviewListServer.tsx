import { prisma } from "@/lib/prisma";
import InterviewListClient from "./InterviewListClient";

interface InterviewListServerProps {
  userEmail: string | null;
}

const InterviewListServer = async ({ userEmail }: InterviewListServerProps) => {
  if (!userEmail) return <p>No interviews found.</p>;

  // Fetch interviews created by the user
  const interviewList = await prisma.mockInterview.findMany({
    where: { createdBy: userEmail },
    orderBy: { id: "desc" },
  });

  return <InterviewListClient interviewList={interviewList} />;
};

export default InterviewListServer;
