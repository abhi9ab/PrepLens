import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, WebcamIcon, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import * as faceapi from 'face-api.js';

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
    const webcamRef = useRef<Webcam>(null);
    const [isInFrame, setIsInFrame] = useState(true);
    const [eyeContact, setEyeContact] = useState(true);
    const [emotion, setEmotion] = useState('neutral');
    const [speakingPace, setSpeakingPace] = useState('normal');
    const [lastWordTimestamp, setLastWordTimestamp] = useState(Date.now());

    // Face detection interval
    const analysisPeriod = 1000; // Check every second

    const {
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
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

    // Initialize face-api models
    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/models')
                ]);
                toast.success('Interview analysis ready');
            } catch (err) {
                toast.error('Failed to load interview analysis models');
            }
        };
        loadModels();
    }, []);

    // Real-time face analysis
    useEffect(() => {
        let interval: NodeJS.Timeout;

        const analyzeFace = async () => {
            if (webcamRef.current && webcamRef.current.video!.readyState === 4) {
                const video = webcamRef.current.video;
                const detection = await faceapi
                    .detectSingleFace(video!, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();

                if (!detection) {
                    if (isInFrame) {
                        setIsInFrame(false);
                        toast.warning('Please stay in frame during the interview');
                    }
                } else {
                    if (!isInFrame) {
                        setIsInFrame(true);
                    }

                    // Check eye contact (based on face angle)
                    const landmarks = detection.landmarks;
                    const nose = landmarks.getNose();
                    const jawline = landmarks.getJawOutline();
                    const faceAngle = Math.abs(Math.atan2(
                        jawline[16].y - jawline[0].y,
                        jawline[16].x - jawline[0].x
                    ) * (180 / Math.PI));

                    const hasEyeContact = faceAngle < 15;
                    if (!hasEyeContact && eyeContact) {
                        setEyeContact(false);
                        toast.warning('Try to maintain eye contact');
                    } else if (hasEyeContact && !eyeContact) {
                        setEyeContact(true);
                    }

                    // Analyze emotions
                    const expressions = detection.expressions;
                    const dominantEmotion = Object.keys(expressions).reduce((a, b) =>
                        expressions[a] > expressions[b] ? a : b
                    );

                    if (dominantEmotion !== emotion) {
                        setEmotion(dominantEmotion);
                        if (dominantEmotion === 'angry' || dominantEmotion === 'disgusted') {
                            toast.warning('Try to maintain a positive expression');
                        }
                    }
                }
            }
        };

        if (isRecording) {
            interval = setInterval(analyzeFace, analysisPeriod);
        }

        return () => clearInterval(interval);
    }, [isRecording, isInFrame, eyeContact, emotion]);

    // Monitor speaking pace
    useEffect(() => {
        if (results.length > 0) {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastWordTimestamp;
            const wordsSpoken = results[results.length - 1].transcript.split(' ').length;
            const wordsPerMinute = (wordsSpoken / timeDiff) * 60000;

            if (wordsPerMinute > 160) {
                setSpeakingPace('fast');
                toast.warning('Try to speak a bit slower');
            } else if (wordsPerMinute < 120) {
                setSpeakingPace('slow');
                toast.warning('Try to speak a bit faster');
            } else {
                setSpeakingPace('normal');
            }

            setLastWordTimestamp(currentTime);
        }
    }, [results]);

    // Original useEffect and functions...
    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ))
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            updateUserAnswer();
        }
    }, [userAnswer]);

    const startStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            if (!isInFrame) {
                toast.error('Please position yourself in frame before starting');
                return;
            }
            startSpeechToText();
        }
    };

    const updateUserAnswer = async () => {
        setLoading(true);

        const behavioralAnalysis = {
            eyeContact: eyeContact ? 'Good' : 'Needs improvement',
            emotion: emotion,
            speakingPace: speakingPace
        }

        const feedbackPrompt = `Question: ${interviewQuestions[activeQuestionIndex]?.question}, 
        User Answer: ${userAnswer}
        Behavioral Analysis: ${JSON.stringify(behavioralAnalysis)}.
        Please provide a rating (1-10) and comprehensive feedback in JSON format with fields "rating", "feedback", and "behavioralFeedback". Ensure that feedback and behavioralFeedback are of the type 'string'.`;

        try {
            const result = await chatSession.sendMessage(feedbackPrompt);
            const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
            const JsonFeedbackResp = JSON.parse(mockJsonResp);

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
                    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    behavioralFeedback: JsonFeedbackResp?.behavioralFeedback,
                    behavioralMetrics: behavioralAnalysis
                }),
            });

            if (response.ok) {
                toast.success('Answer and behavioral analysis saved!');
                setUserAnswer('');
                setResults([]);
            } else {
                const error = await response.json();
                toast.error(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setUserAnswer('');
            setResults([]);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative flex flex-col justify-center items-center bg-secondary rounded-lg p-5 py-20 mt-10">
                <WebcamIcon className="absolute" />
                <Webcam
                    ref={webcamRef}
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                        borderRadius: 30,
                    }}
                />
                {!isInFrame && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 rounded-t-lg text-center">
                        <AlertCircle className="inline mr-2" />
                        Please position yourself in frame
                    </div>
                )}
            </div>
            <div className="mt-4 text-sm text-gray-600">
                {isRecording && (
                    <div className="space-y-1">
                        <p>Eye Contact: {eyeContact ? '👍' : '👀'}</p>
                        <p>Expression: {emotion === 'neutral' ? '😐' : emotion === 'happy' ? '😊' : '🤨'}</p>
                        <p>Speaking Pace: {speakingPace === 'normal' ? '✅' : speakingPace === 'fast' ? '⚡' : '🐌'}</p>
                    </div>
                )}
            </div>
            <Button
                disabled={loading}
                variant="outline"
                className="my-10"
                onClick={startStopRecording}
            >
                {isRecording ? (
                    <h2 className="text-red-500 animate-pulse flex gap-2 items-center">
                        <StopCircle /><span>Stop Recording</span>
                    </h2>
                ) : (
                    <h2 className="flex gap-2 items-center">
                        <Mic /><span>Record</span>
                    </h2>
                )}
            </Button>
        </div>
    );
};

export default RecordAnswerSection;