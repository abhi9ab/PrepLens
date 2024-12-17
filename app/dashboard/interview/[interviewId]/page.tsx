'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WebcamIcon, Terminal, Ghost } from 'lucide-react';
import Webcam from "react-webcam";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Params {
    interviewId: string;
}

const Interview = ({ params }: { params: Params }) => {
    // Fetch interview data using Prisma server-side
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    console.log(params);
    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Lets Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5'>
                    <div className='flex flex-col p-5 rounded-lg border gap-5'>
                        <h2 className='text-md'><strong>Job Role/Job Position:</strong>{ }</h2>
                        <h2 className='text-md'><strong>Job Description/Tech Stack:</strong>{ }</h2>
                        <h2 className='text-md'><strong>Years of Experience:</strong>{ }</h2>
                    </div>
                    <div className='w-80'>
                        <Alert className='border rounded-lg bg-secondary w-full'>
                            <Terminal className="h-4 w-4"/>
                            <AlertTitle className='mb-2 text-lg'><strong>Information</strong></AlertTitle>
                            <AlertDescription>
                                Enable video web cam and microphone to start your mock interview.
                                <br />
                                <span className='mt-3'><strong>Note: </strong>We never record your video. Access can be denied at your will.</span>
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    {webCamEnabled ?
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{
                                width: 300,
                                height: 300
                            }}
                        />
                        :
                        <>
                            <WebcamIcon className='h-72 w-auto p-20 bg-secondary rounded-lg border mb-3' />
                            <Button variant={'ghost'} onClick={() => setWebCamEnabled(true)}>Enable webcam and microphone</Button>
                        </>
                    }
                </div>
            </div>
            <div className='flex justify-center items-center'>
                <Button>Start</Button>
            </div>
        </div>
    );
};

export default Interview;
