'use client'
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

interface QuestionSectionProps {
    interviewQuestions: {
        question: string;
        answer: string;
    }[];
    activeQuestionIndex: number;
    interviewId: string;
}

const RecordAnswerSection = ({ interviewQuestions, activeQuestionIndex, interviewId }: QuestionSectionProps) => {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const {
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        crossBrowser: true,
        googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        useLegacyResults: false,
        speechRecognitionProperties: {
            lang: 'en-US',
            interimResults: true
        }
    });

    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ))
    }, [results])

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            updateUserAnswer();
        }
    }, [userAnswer])

    const startStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const updateUserAnswer = async () => {
        console.log("userAnswer", userAnswer);
        setLoading(true)
        const feedbackPrompt = `Question: ${interviewQuestions[activeQuestionIndex]?.question}, User Answer: ${userAnswer}.
        Depending on the answer given by the user to the respective interview question, please provide a rating (1-10) and feedback in JSON format with fields "rating" and "feedback".`;

        try {
            const result = await chatSession.sendMessage(feedbackPrompt);

            const mockJsonResp = result.response.text()
                .replace('```json', '')
                .replace('```', '');
            const JsonFeedbackResp = JSON.parse(mockJsonResp);
            console.log("JsonFeedbackResp",JsonFeedbackResp);

            const response = await fetch('/api/user-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mockIdRef: interviewId,
                    question: interviewQuestions[activeQuestionIndex]?.question,
                    correctAnswer: interviewQuestions[activeQuestionIndex]?.answer,
                    userAnswer,
                    feedback: JsonFeedbackResp?.feedback,
                    rating: JsonFeedbackResp?.rating,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (response.ok) {
                const responseBody = await response.text();
                console.log('Success response body:', responseBody);
                toast.success('Answer saved successfully!');
                setUserAnswer(''); // Reset answer for the next question
            } else {
                try {
                    const errorBody = await response.text();
                    const errorHeaders = Object.fromEntries(response.headers.entries());
                    console.error('Error status:', response.status);
                    console.error('Error headers:', errorHeaders);
                    console.error('Error response body:', errorBody);
                    
                    toast.error(`Error (${response.status}): ${errorBody || 'Unknown error occurred'}`);
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                    toast.error(`Unexpected error (${response.status})`);
                }
            }
        } catch (error) {
            console.error('Error generating feedback or saving answer:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setUserAnswer('');
            setLoading(false);
        }
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='flex flex-col justify-center items-center bg-secondary rounded-lg p-5 py-20 mt-10'>
                <WebcamIcon className='absolute' />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                        borderRadius: 30,
                    }}
                />
            </div>
            <Button
                disabled={loading}
                variant="outline"
                className='my-10'
                onClick={startStopRecording}
            >
                {isRecording ?
                    <h2 className='bg-red-500 animate-pulse flex gap-2 items-center'>
                        <StopCircle /><span>Stop Recording</span>
                    </h2>
                    :
                    <h2 className='flex gap-2 items-center'>
                        <Mic /><span>Record</span>
                    </h2>
                }
            </Button>
        </div>
    )
}

export default RecordAnswerSection