import InterviewClient from "./InterviewClient";
import { prisma } from "@/lib/prisma";

interface PageProps {
    params: Promise<{ interviewId: string }>;
}

export default async function InterviewPage({ params }: PageProps) {
    const { interviewId } = await params;

    const interview = await prisma.mockInterview.findUnique({
        where: { mockId: interviewId },
    });

    return (
        <InterviewClient
            interviewId={interviewId}
            jobPosition={interview?.jobPosition || "N/A"}
            jobDesc={interview?.jobDesc || "N/A"}
            jobExperience={interview?.jobExperience || "N/A"}
        />
    );
}