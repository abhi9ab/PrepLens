import { prisma } from "@/lib/prisma";
import FeedbackClient from "./feedbackClient";

interface PageProps {
  params: Promise<{ interviewId: string }>;
}

export default async function FeedbackPage({ params }: PageProps) {
  const { interviewId } = await params;

  // Fetch data from Prisma
  const feedbackListRaw = await prisma.userAnswer.findMany({
    where: { mockIdRef: interviewId },
    orderBy: { id: "asc" },
  });

  // Transform the data to match the expected type
  const feedbackList = feedbackListRaw.map(item => ({
    ...item,
    behavioralFeedback: item.behavioralFeedback || "", // Convert null to empty string
  }));

  // Pass data to the client component
  return <FeedbackClient feedbackList={feedbackList} />;
}