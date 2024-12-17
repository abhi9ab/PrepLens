import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { interviewId: string } }) {
    try {
        const { interviewId } = params;

        const interviewData = await prisma.mockInterview.findUnique({
            where: { mockId: interviewId },
            select: { jsonMockResp: true },
        });

        if (!interviewData) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        return NextResponse.json({ jsonMockResp: interviewData.jsonMockResp });
    } catch (error) {
        console.error('Error fetching interview data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
