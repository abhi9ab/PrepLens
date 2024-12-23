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
import { LoaderCircle } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAIModel';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

interface RenderPdfProps {
    pdfText: string | null;
}

interface JsonResponse {
    JDMatch: string;
    MissingKeywords: string[];
    ProfileSummary: string;
}

const AtsScore = ({ pdfText }: RenderPdfProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [jsonResponse, setJsonResponse] = useState<JsonResponse[]>([]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        console.log(pdfText);

        const InputPrompt = `
            Hey Act Like a skilled or very experience ATS(Application Tracking System)
            with a deep understanding of tech field, software engineering, data science, data analyst
            and big data engineer.Your task is to evaluate the resume based on the given job description.
            You must consider the job market is very competitive and you should provide 
            best assistance for improving thr resumes.Assign the percentage Matching based 
            on Jd and the missing keywords with high accuracy
            resume: ${pdfText}
            job position: ${jobPosition}
            job descritpion: ${jobDesc}
            job experience: ${jobExperience}

            I want the response in JSON format having the structure:
            { "JDMatch": "%", "MissingKeywords:[]", "ProfileSummary": "" }
        `
        try {
            const result = await chatSession.sendMessage(InputPrompt);
            console.log('Raw response:', await result.response.text());
            const MockJsonResp = (await result.response.text())
                .replace('```json', '')
                .replace('```', '');

            const parsedResponse = JSON.parse(MockJsonResp);

            // Ensure it's always an array
            const normalizedResponse = Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse];

            setJsonResponse(normalizedResponse);
        } catch (error) {
            console.error('Error submitting data:', error);
            setJsonResponse([]);
        } finally {
            setLoading(false);
            setOpenDialog(false);
        }
    }
    return (
        <div className='w-full mx-auto space-y-4'>
            <div
                className='p-2 w-fit border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='font-medium text-primary text-center'>Add Job Description</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details about the job position/role, Job description and years of experience needed</h2>

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
            <div>
                {Array.isArray(jsonResponse) && jsonResponse.map((item, index) => (
                    <Collapsible key={index} className="mt-7">
                        <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full">
                            Response
                            <ChevronsUpDown className="h-5 w-5" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="flex flex-col gap-2">
                                <h2 className="p-2 border rounded-lg">
                                    <strong>Rating: </strong>
                                    {item.JDMatch}
                                </h2>
                                <h2 className="p-2 border rounded-lg text-sm bg-secondary">
                                    <strong>Job Position </strong>
                                    {jobPosition}
                                </h2>
                                <h2 className="p-2 border rounded-lg text-sm bg-secondary">
                                    <strong>Job Description </strong>
                                    {jobDesc}
                                </h2>
                                <h2 className="p-2 border rounded-lg text-sm bg-secondary">
                                    <strong>Job Experience </strong>
                                    {jobExperience}
                                </h2>
                                <h2 className="p-2 border rounded-lg text-sm bg-secondary">
                                    <strong>Missing Keywords in your resume </strong>
                                    {item.MissingKeywords}
                                </h2>
                                <h2 className="p-2 border rounded-lg text-sm bg-secondary">
                                    <strong>Profile Summary </strong>
                                    {item.ProfileSummary}
                                </h2>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    )
}

export default AtsScore