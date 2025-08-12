/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Star,
    TrendingUp,
    Eye,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    Download,
    Share2,
    Award
} from "lucide-react";
import Link from "next/link";

// Import the proper type from Prisma
import { JsonValue } from "@prisma/client/runtime/library";

interface FeedbackItem {
    id: number;
    question: string;
    rating: string;
    userAnswer: string;
    correctAnswer: string;
    feedback: string;
    behavioralFeedback: string;
    behavioralMetrics: JsonValue;
    mockIdRef: string;
    userEmail: string;
    createdAt: string;
}

interface FeedbackClientProps {
    feedbackList: FeedbackItem[];
}

const FeedbackClient = ({ feedbackList }: FeedbackClientProps) => {
    const [selectedTab, setSelectedTab] = useState("overview");

    if (feedbackList?.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center p-6">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Interview Feedback Found</h2>
                        <p className="text-gray-600 mb-4">
                            It looks like you haven&apos;t completed any interviews yet.
                        </p>
                        <Link href="/dashboard">
                            <Button>Start Your First Interview</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const overallRating = Math.round(
        feedbackList.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / feedbackList.length || 0
    );

    const getRatingColor = (rating: number) => {
        if (rating >= 8) return "text-green-600";
        if (rating >= 6) return "text-yellow-600";
        return "text-red-600";
    };

    const getRatingBadgeVariant = (rating: number) => {
        if (rating >= 8) return "default";
        if (rating >= 6) return "secondary";
        return "destructive";
    };

    const getPerformanceLevel = (rating: number) => {
        if (rating >= 9) return "Excellent";
        if (rating >= 8) return "Very Good";
        if (rating >= 6) return "Good";
        if (rating >= 4) return "Average";
        return "Needs Improvement";
    };

    const getBehavioralInsights = () => {
        const insights = {
            eyeContact: 0,
            positiveEmotion: 0,
            normalPace: 0,
            total: feedbackList.length
        };

        feedbackList.forEach(item => {
            if (item.behavioralMetrics && typeof item.behavioralMetrics === 'object') {
                const metrics = item.behavioralMetrics as any;
                if (metrics.eyeContact === 'Good') insights.eyeContact++;
                if (metrics.emotion === 'happy' || metrics.emotion === 'neutral') insights.positiveEmotion++;
                if (metrics.speakingPace === 'normal') insights.normalPace++;
            }
        });

        return insights;
    };

    const behavioralInsights = getBehavioralInsights();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Award className="h-8 w-8 text-blue-600 mr-2" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Interview Results
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Comprehensive feedback and analysis of your interview performance
                    </p>
                </div>

                {/* Overall Score Card */}
                <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-3 gap-6 items-center">
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-semibold mb-2">Overall Rating</h3>
                                <div className="flex items-center justify-center md:justify-start">
                                    <span className="text-5xl font-bold mr-2">{overallRating}</span>
                                    <span className="text-2xl">/10</span>
                                </div>
                                <p className="mt-2 text-blue-100">
                                    {getPerformanceLevel(overallRating)}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-blue-300"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={`${(overallRating / 10) * 351.86} 351.86`}
                                            className="text-white"
                                        />
                                    </svg>
                                    <span className="absolute text-2xl font-bold">{overallRating * 10}%</span>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center md:justify-end">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        <span>{feedbackList.length} Questions Completed</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-end">
                                        <Star className="h-5 w-5 mr-2" />
                                        <span>Detailed Analysis Available</span>
                                    </div>
                                    <div className="flex gap-2 justify-center md:justify-end mt-4">
                                        <Button variant="secondary" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export Report
                                        </Button>
                                        <Button variant="secondary" size="sm">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs Section */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
                    <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="detailed">Detailed</TabsTrigger>
                        <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Performance Metrics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                                        Performance Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {feedbackList.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm">Q{index + 1}</span>
                                                <div className="flex items-center">
                                                    <Progress
                                                        value={Number(item.rating) * 10}
                                                        className="w-16 mr-2"
                                                    />
                                                    <Badge variant={getRatingBadgeVariant(Number(item.rating))}>
                                                        {item.rating}/10
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Behavioral Analysis */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Eye className="h-5 w-5 mr-2 text-green-600" />
                                        Behavioral Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Eye Contact</span>
                                            <div className="flex items-center">
                                                <Progress
                                                    value={(behavioralInsights.eyeContact / behavioralInsights.total) * 100}
                                                    className="w-16 mr-2"
                                                />
                                                <span className="text-sm font-medium">
                                                    {Math.round((behavioralInsights.eyeContact / behavioralInsights.total) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Positive Expression</span>
                                            <div className="flex items-center">
                                                <Progress
                                                    value={(behavioralInsights.positiveEmotion / behavioralInsights.total) * 100}
                                                    className="w-16 mr-2"
                                                />
                                                <span className="text-sm font-medium">
                                                    {Math.round((behavioralInsights.positiveEmotion / behavioralInsights.total) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Speaking Pace</span>
                                            <div className="flex items-center">
                                                <Progress
                                                    value={(behavioralInsights.normalPace / behavioralInsights.total) * 100}
                                                    className="w-16 mr-2"
                                                />
                                                <span className="text-sm font-medium">
                                                    {Math.round((behavioralInsights.normalPace / behavioralInsights.total) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Next Steps</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href="/dashboard">
                                        <Button className="w-full" variant="outline">
                                            Practice More Interviews
                                        </Button>
                                    </Link>
                                    <Button className="w-full" variant="outline">
                                        Schedule Real Interview
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        View Improvement Tips
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Detailed Tab */}
                    <TabsContent value="detailed" className="space-y-4">
                        <div className="grid gap-4">
                            {feedbackList.map((item, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                                            <Badge variant={getRatingBadgeVariant(Number(item.rating))}>
                                                {item.rating}/10
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    View Detailed Feedback
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl">
                                                        Question {index + 1} - Detailed Analysis
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription asChild>
                                                    <div className="space-y-6">
                                                        {/* Question */}
                                                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                                            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                                                Question:
                                                            </h3>
                                                            <p className="text-blue-700 dark:text-blue-300">
                                                                {item.question}
                                                            </p>
                                                        </div>

                                                        {/* Rating */}
                                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <span className="font-semibold">Rating:</span>
                                                            <div className="flex items-center">
                                                                <div className="flex mr-2">
                                                                    {[...Array(10)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-4 w-4 ${i < Number(item.rating)
                                                                                    ? 'text-yellow-400 fill-current'
                                                                                    : 'text-gray-300'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <Badge variant={getRatingBadgeVariant(Number(item.rating))}>
                                                                    {item.rating}/10
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            {/* Your Answer */}
                                                            <div className="p-4 border rounded-lg">
                                                                <h3 className="font-semibold mb-2 text-green-600">
                                                                    Your Answer:
                                                                </h3>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                    {item.userAnswer}
                                                                </p>
                                                            </div>

                                                            {/* Ideal Answer */}
                                                            <div className="p-4 border rounded-lg">
                                                                <h3 className="font-semibold mb-2 text-blue-600">
                                                                    Ideal Answer:
                                                                </h3>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                    {item.correctAnswer}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Feedback */}
                                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                                            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                                                AI Feedback:
                                                            </h3>
                                                            <p className="text-yellow-700 dark:text-yellow-300">
                                                                {item.feedback}
                                                            </p>
                                                        </div>

                                                        {/* Behavioral Feedback */}
                                                        {item.behavioralFeedback && (
                                                            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                                                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                                                                    Behavioral Analysis:
                                                                </h3>
                                                                <p className="text-purple-700 dark:text-purple-300">
                                                                    {item.behavioralFeedback}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </DialogDescription>
                                            </DialogContent>
                                        </Dialog>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Behavioral Tab */}
                    <TabsContent value="behavioral" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Behavioral Analysis Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold mb-4">Performance Metrics</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Eye Contact Maintenance</span>
                                                    <span>{Math.round((behavioralInsights.eyeContact / behavioralInsights.total) * 100)}%</span>
                                                </div>
                                                <Progress value={(behavioralInsights.eyeContact / behavioralInsights.total) * 100} />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Positive Expression</span>
                                                    <span>{Math.round((behavioralInsights.positiveEmotion / behavioralInsights.total) * 100)}%</span>
                                                </div>
                                                <Progress value={(behavioralInsights.positiveEmotion / behavioralInsights.total) * 100} />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Optimal Speaking Pace</span>
                                                    <span>{Math.round((behavioralInsights.normalPace / behavioralInsights.total) * 100)}%</span>
                                                </div>
                                                <Progress value={(behavioralInsights.normalPace / behavioralInsights.total) * 100} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-4">Improvement Recommendations</h3>
                                        <div className="space-y-3 text-sm">
                                            {behavioralInsights.eyeContact / behavioralInsights.total < 0.8 && (
                                                <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded border-l-4 border-orange-400">
                                                    <p className="font-medium text-orange-800 dark:text-orange-200">Eye Contact</p>
                                                    <p className="text-orange-600 dark:text-orange-300">
                                                        Practice maintaining eye contact with the camera. This shows confidence and engagement.
                                                    </p>
                                                </div>
                                            )}
                                            {behavioralInsights.positiveEmotion / behavioralInsights.total < 0.7 && (
                                                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border-l-4 border-blue-400">
                                                    <p className="font-medium text-blue-800 dark:text-blue-200">Expression</p>
                                                    <p className="text-blue-600 dark:text-blue-300">
                                                        Try to maintain a more positive and enthusiastic expression during your responses.
                                                    </p>
                                                </div>
                                            )}
                                            {behavioralInsights.normalPace / behavioralInsights.total < 0.7 && (
                                                <div className="p-3 bg-green-50 dark:bg-green-950 rounded border-l-4 border-green-400">
                                                    <p className="font-medium text-green-800 dark:text-green-200">Speaking Pace</p>
                                                    <p className="text-green-600 dark:text-green-300">
                                                        Focus on speaking at a steady, moderate pace. Practice with a metronome if needed.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link href="/dashboard">
                        <Button size="lg" className="w-full sm:w-auto">
                            Practice Another Interview
                        </Button>
                    </Link>
                    <Link href="/dashboard/resume">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            Review Resume Tips
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeedbackClient;