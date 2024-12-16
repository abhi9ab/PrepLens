import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export async function POST(req: Request) {
    try {
        const { jobPosition, jobDesc, jobExperience, MockJsonResp, createdBy } = await req.json();

        const response = await prisma.mockInterview.create({
            data: {
                mockId: uuidv4(),
                jsonMockResp: MockJsonResp,
                jobPosition,
                jobDesc,
                jobExperience,
                createdBy,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
            select: {
                mockId: true,
            },
        });

        return NextResponse.json({ mockId: response.mockId });
    } catch (error) {
        console.error('Error submitting data:', error);
        return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
    }
}
