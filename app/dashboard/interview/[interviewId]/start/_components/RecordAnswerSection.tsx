import React, { useEffect, useState, useRef, useCallback } from 'react';
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

    // Add state to track last notification times to prevent spam
    const [lastFrameWarning, setLastFrameWarning] = useState(0);
    const [lastEyeContactWarning, setLastEyeContactWarning] = useState(0);
    const [lastExpressionWarning, setLastExpressionWarning] = useState(0);
    const [lastPaceWarning, setLastPaceWarning] = useState(0);

    // Face detection interval
    const analysisPeriod = 1000; // Check every second
    const notificationCooldown = 5000; // 5 seconds between similar notifications

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
                toast.success('Interview analysis ready', {
                    duration: 2000,
                });
            } catch {
                toast.error('Failed to load interview analysis models');
            }
        };
        loadModels();
    }, []);

    // Memoize updateUserAnswer to avoid recreating on every render
    const updateUserAnswer = useCallback(async () => {
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
                toast.success('Answer and behavioral analysis saved!', {
                    duration: 3000,
                });
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
    }, [userAnswer, eyeContact, emotion, speakingPace, interviewQuestions, activeQuestionIndex, interviewId, user, setResults]);

    // Real-time face analysis with limited notifications
    useEffect(() => {
        let interval: NodeJS.Timeout;

        const analyzeFace = async () => {
            if (webcamRef.current && webcamRef.current.video!.readyState === 4) {
                const video = webcamRef.current.video;
                const detection = await faceapi
                    .detectSingleFace(video!, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();

                const now = Date.now();

                if (!detection) {
                    if (isInFrame) {
                        setIsInFrame(false);
                        // Only show notification if enough time has passed
                        if (now - lastFrameWarning > notificationCooldown) {
                            toast.warning('Please stay in frame during the interview', {
                                duration: 2000,
                            });
                            setLastFrameWarning(now);
                        }
                    }
                } else {
                    if (!isInFrame) {
                        setIsInFrame(true);
                    }

                    // Check eye contact (based on face angle)
                    const landmarks = detection.landmarks;
                    const jawline = landmarks.getJawOutline();
                    const faceAngle = Math.abs(Math.atan2(
                        jawline[16].y - jawline[0].y,
                        jawline[16].x - jawline[0].x
                    ) * (180 / Math.PI));

                    const hasEyeContact = faceAngle < 15;
                    if (!hasEyeContact && eyeContact) {
                        setEyeContact(false);
                        if (now - lastEyeContactWarning > notificationCooldown) {
                            toast.warning('Try to maintain eye contact', {
                                duration: 2000,
                            });
                            setLastEyeContactWarning(now);
                        }
                    } else if (hasEyeContact && !eyeContact) {
                        setEyeContact(true);
                    }

                    // Analyze emotions
                    const expressions = detection.expressions;
                    const emotionEntries = Object.entries(expressions) as [keyof typeof expressions, number][];
                    const dominantEmotion = emotionEntries.reduce((a, b) =>
                        expressions[a[0]] > expressions[b[0]] ? a : b
                    )[0];

                    if (dominantEmotion !== emotion) {
                        setEmotion(dominantEmotion);
                        if ((dominantEmotion === 'angry' || dominantEmotion === 'disgusted') &&
                            now - lastExpressionWarning > notificationCooldown) {
                            toast.warning('Try to maintain a positive expression', {
                                duration: 2000,
                            });
                            setLastExpressionWarning(now);
                        }
                    }
                }
            }
        };

        if (isRecording) {
            interval = setInterval(analyzeFace, analysisPeriod);
        }

        return () => clearInterval(interval);
    }, [isRecording, isInFrame, eyeContact, emotion, lastFrameWarning, lastEyeContactWarning, lastExpressionWarning]);

    // Monitor speaking pace with limited notifications
    useEffect(() => {
        if (results.length > 0) {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastWordTimestamp;
            const lastResult = results[results.length - 1];

            // Handle both string and ResultType
            const transcript = typeof lastResult === 'string' ? lastResult : lastResult.transcript;
            const wordsSpoken = transcript.split(' ').length;
            const wordsPerMinute = (wordsSpoken / timeDiff) * 60000;

            if (wordsPerMinute > 160) {
                setSpeakingPace('fast');
                if (currentTime - lastPaceWarning > notificationCooldown) {
                    toast.warning('Try to speak a bit slower', {
                        duration: 2000,
                    });
                    setLastPaceWarning(currentTime);
                }
            } else if (wordsPerMinute < 120) {
                setSpeakingPace('slow');
                if (currentTime - lastPaceWarning > notificationCooldown) {
                    toast.warning('Try to speak a bit faster', {
                        duration: 2000,
                    });
                    setLastPaceWarning(currentTime);
                }
            } else {
                setSpeakingPace('normal');
            }

            setLastWordTimestamp(currentTime);
        }
    }, [results, lastWordTimestamp, lastPaceWarning]);

    // Update user answer when speech results change
    useEffect(() => {
        results.forEach((result) => {
            const transcript = typeof result === 'string' ? result : result.transcript;
            setUserAnswer(prevAns => prevAns + transcript);
        });
    }, [results]);

    // Call updateUserAnswer when recording stops and answer is long enough
    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            updateUserAnswer();
        }
    }, [isRecording, userAnswer, updateUserAnswer]);

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
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 rounded-t-lg text-center z-20">
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
                        {!isInFrame && (
                            <p className="text-red-500 font-semibold animate-pulse">
                                ⚠️ Please stay in frame
                            </p>
                        )}
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