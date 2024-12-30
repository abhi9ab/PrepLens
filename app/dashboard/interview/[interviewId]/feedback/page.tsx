import { prisma } from "@/lib/prisma";
import FeedbackClient from "./feedbackClient";

interface Params {
  params: { interviewId: string };
}

export default async function FeedbackPage({ params }: Params) {
  const { interviewId } = await params;

  // Fetch data from Prisma
  const feedbackList = await prisma.userAnswer.findMany({
    where: { mockIdRef: interviewId },
    orderBy: { id: "asc" },
  });

  // Pass data to the client component
  return <FeedbackClient feedbackList={feedbackList} />;
}
