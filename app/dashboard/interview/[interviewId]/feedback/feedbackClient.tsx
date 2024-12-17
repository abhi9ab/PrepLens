"use client";

import React from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FeedbackItem {
    id: number;
    question: string;
    rating: string;
    userAnswer: string;
    correctAnswer: string;
    feedback: string;
}

interface FeedbackClientProps {
    feedbackList: FeedbackItem[];
}

const FeedbackClient = ({ feedbackList }: FeedbackClientProps) => {
    const router = useRouter();

    const overallRating = Math.round(
        feedbackList.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / feedbackList.length || 0
    );

    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold">Congratulations!</h2>
            <h2 className="text-2xl font-bold">Here is your interview feedback</h2>
            <h2 className="text-primary text-lg my-3">
                Your overall interview rating: <strong>{overallRating}/10</strong>
            </h2>

            <h2 className="text-sm text-primary">
                Find below interview questions with correct answers, your answers and
                feedback for improvement
            </h2>
            {feedbackList &&
                feedbackList.map((item, index) => (
                    <Collapsible key={index} className="mt-7">
                        <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full">
                            {item.question}
                            <ChevronsUpDown className="h-5 w-5" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="flex flex-col gap-2">
                                <h2 className="p-2 border rounded-lg">
                                    <strong>Rating: </strong>
                                    {item.rating}
                                </h2>
                                <h2 className="p-2 border rounded-lg text-sm bg-secondary">
                                    <strong>Your Answer: </strong>
                                    {item.userAnswer}
                                </h2>
                                <h2 className="p-2 border rounded-lg text-sm bg-secondary">
                                    <strong>Correct Answer: </strong>
                                    {item.correctAnswer}
                                </h2>
                                <h2 className="p-2 border rounded-lg text-primary bg-secondary">
                                    <strong>Feedback: </strong>
                                    {item.feedback}
                                </h2>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}

            <Button onClick={() => router.replace("/dashboard")}>Home</Button>
        </div>
    );
};

export default FeedbackClient;
