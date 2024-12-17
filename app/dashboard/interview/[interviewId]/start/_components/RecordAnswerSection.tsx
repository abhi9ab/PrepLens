'use client'
import { Button } from '@/components/ui/button';
import { Mic, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';

interface QuestionSectionProps {
    interviewQuestions: {
        question: string;
        answer: string;
    }[];
    activeQuestionIndex: number;
}

const RecordAnswerSection = ({ interviewQuestions, activeQuestionIndex }: QuestionSectionProps) => {
    const [userAnswer, setUserAnswer] = useState('');
    const {
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        crossBrowser: true,
        useLegacyResults: false,
        speechRecognitionProperties: {
            lang: 'en-US',
            interimResults: true // Allows for displaying real-time speech results
        }
    });

    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ))
    }, [results])

    const SaveUserAnswer = async () => {
        if (isRecording) {
            stopSpeechToText();
            if (userAnswer.length < 10) {
                toast('Error while saving your answer. Please record again.')
                return;
            }
            const feedbackPrompt = "Question: " + interviewQuestions[activeQuestionIndex]?.question + ", User Answer: " + userAnswer +
                ", Depending on the answer given by the user to the respective interview question, please provide us rating (1-10) for the answer and feedback as areas of improvement if any, in just 3 to 5 lines." +
                "Your response should be in JSON format with rating and feedback as fields";

            const result = await chatSession.sendMessage(feedbackPrompt);

            const mockJsonResp = (result.response.text())
                .replace('```json', '')
                .replace('```', '');
            console.log(mockJsonResp);

            const JsonFeedbackResp = JSON.parse(mockJsonResp);
        } else {
            startSpeechToText();
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
            <Button variant="outline" className='my-10'
                onClick={SaveUserAnswer}
            >
                {isRecording ?
                    <h2 className='flex gap-2'>
                        <Mic /><span>Stop Recording</span>
                    </h2>
                    : 'Record Answer'
                }
            </Button>
            <div className='mt-4 p-4 border rounded'>
                <p>Recorded Text: {userAnswer}</p>
            </div>
            <Button onClick={() => console.log(userAnswer)}>show user answer</Button>
        </div>
    )
}

export default RecordAnswerSection