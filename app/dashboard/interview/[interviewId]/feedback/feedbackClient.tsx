"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FeedbackItem {
    id: number;
    question: string;
    rating: string;
    userAnswer: string;
    correctAnswer: string;
    feedback: string;
    behavioralFeedback: string;
    behavioralMetrics: JSON;
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
            {feedbackList?.length === 0 ?
                <h2 className="font-bold text-xl">No Interview Feedback Record Found</h2>
                :
                <>
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
                            <Dialog key={index}>
                                <DialogTrigger className="my-5 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm p-2">Question {index + 1}</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{item.question}</DialogTitle>
                                        <DialogDescription>
                                            <div className="flex flex-col gap-4 mt-4 font-mono">
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
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        ))}
                </>
            }
        </div>
    );
};

export default FeedbackClient;
