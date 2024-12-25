import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

interface QuestionSectionProps {
    interviewQuestions: {
        question: string;
        answer: string;
    }[];
    activeQuestionIndex: number;
}

const QuestionSection = ({ interviewQuestions, activeQuestionIndex }: QuestionSectionProps) => {

    const textToSpeech = (text: string) => {
        if('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech)
        } else {
            alert("Browser does not support text to speech");
        }
    }

    return interviewQuestions && (
        <div className='p-5 border rounded-lg my-10'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {interviewQuestions &&
                    interviewQuestions.map((question: { question: string; answer: string; }, index: number) => (
                        <h2 key={index}
                            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer
                                                ${activeQuestionIndex === index? `bg-black text-white` : `bg-secondary`}
                                            `}>
                            {`Question ${index + 1}`}
                        </h2>
                    ))
                }
            </div>
            <h2 className='my-5 text-sm md:text-md'>{interviewQuestions[activeQuestionIndex]?.question}</h2>
            <Volume2 className='cursor-pointer' onClick={() => textToSpeech(interviewQuestions[activeQuestionIndex]?.question)}/>

            <div className='border rounded-lg p-5 bg-secondary mt-20'>
                <h2 className='flex gap-5 items-center'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm my-2'>Click on Record Answer when you want to answer a question.
                    At the end of the interview, we will give you feedback
                    along with the correct answer for each of the questions.</h2>
            </div>
        </div>
    )
}

export default QuestionSection