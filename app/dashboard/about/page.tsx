'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Info, Lightbulb, Code } from 'lucide-react';

const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-8"
        >
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            About Our Application
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Our application is a cutting-edge platform designed to prepare users for real-world interviews by providing a comprehensive and interactive experience. With AI-driven insights and real-time feedback, it ensures candidates are confident and job-ready.
                        </p>
                    </CardContent>
                </Card>

                <Separator className="my-6" />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Key Features
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Generate personalized interview questions and feedback using <Badge>Gemini API</Badge>.</li>
                            <li>Convert speech to text seamlessly with <Badge>React Speech-to-Text</Badge>.</li>
                            <li>Analyze and improve resumes with ATS scoring and keyword suggestions powered by <Badge>Gemini</Badge>.</li>
                            <li>Real-time facial expression and posture analysis using <Badge>Face-api.js</Badge>.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Separator className="my-6" />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Technologies Used
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                <span>next.js & typeScript</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-primary" />
                                <span>gemini API</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Code className="w-5 h-5 text-primary" />
                                <span>react-speech-to-text</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                <span>face-api.js</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-primary" />
                                <span>shadcn-ui</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="my-6" />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Our Mission
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            We aim to bridge the gap between traditional placement preparation and real-world success by providing an AI-powered platform that enhances technical and soft skills, builds confidence, and ensures candidates are prepared for every hiring challenge.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default AboutPage;
