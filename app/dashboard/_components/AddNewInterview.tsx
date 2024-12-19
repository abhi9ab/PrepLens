'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);

    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        const InputPrompt = "Job position: " 
                            + jobPosition + 
                            ", Job Description: " 
                            + jobDesc + 
                            ", Years of Experience: " 
                            + jobExperience + 
                            ".Depending on the provided Job Position, Job Description, and Years of Experience, give us "
                            + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT! + 
                            " interview questions along with short and accurate answers in JSON format with fields 'question' and 'answer'.";

        try {
            const result = await chatSession.sendMessage(InputPrompt);
            console.log(result.response.text());
            const MockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');

            setJsonResponse(JSON.parse(MockJsonResp));

            if (MockJsonResp) {
                const response = await fetch('/api/interviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jobPosition,
                        jobDesc,
                        jobExperience,
                        MockJsonResp,
                        createdBy: user?.primaryEmailAddress?.emailAddress || 'anonymous',
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Inserted Mock ID:', data.mockId);
                    router.push('/dashboard/interview/' + data.mockId);
                } else {
                    console.error('Failed to insert data:', data.error);
                }
            } else {
                console.error('AI response is empty.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setLoading(false);
            setOpenDialog(false);
        }
    }
    return (
        <div>
            <div
                className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details about your job position/role, Job description and years of experience</h2>

                                    <div className='mt-7 my-3'>
                                        <label>Job Role/Job Position</label>
                                        <Input placeholder='Ex. Full Stack Developer' required onChange={(event) => setJobPosition(event.target.value)} />
                                    </div>

                                    <div className='my-3'>
                                        <label>Job Description/TechStack (In Short)</label>
                                        <Textarea placeholder='Ex. React, Angular, Flask, Springboot, etc' required onChange={(event) => setJobDesc(event.target.value)} />
                                    </div>

                                    <div className='my-3'>
                                        <label>Years of experience</label>
                                        <Input placeholder='Ex. 5' type='number' max="100" required onChange={(event) => setJobExperience(event.target.value)} />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type='button' variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button type='submit' disabled={loading}>
                                        {loading ?
                                            <>
                                                <LoaderCircle className='animate-spin' />Generating from AI
                                            </> : 'Start Interview'
                                        }
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddNewInterview