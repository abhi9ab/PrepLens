'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QuestionSection from './_components/QuestionSection'
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface InterviewQuestion {
    question: string;
    answer: string;
}

const StartInterview = () => {
    const { interviewId } = useParams();
    const validInterviewId = Array.isArray(interviewId) ? interviewId[0] : interviewId || '';

    const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/interviews/${validInterviewId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch interview data');
                }

                const data = await response.json();
                const parsedData = JSON.parse(data.jsonMockResp);

                if (parsedData) {
                    setInterviewQuestions(parsedData);
                } else {
                    throw new Error('Invalid JSON structure');
                }
                console.log(interviewQuestions);
            } catch (err) {
                console.error('Error:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='my-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QuestionSection
                    interviewQuestions={interviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                />

                <RecordAnswerSection
                    interviewQuestions={interviewQuestions}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewId={validInterviewId}
                />
            </div>
            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 && 
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
                {activeQuestionIndex !== interviewQuestions?.length - 1 && 
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
                {activeQuestionIndex === interviewQuestions?.length - 1 && 
                    <Link href={`/dashboard/interview/${interviewId}/feedback`}>
                        <Button>End Interview</Button>
                    </Link>
                    }
            </div>
        </div>
    )
}

export default StartInterview