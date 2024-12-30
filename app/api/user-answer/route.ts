import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("data", data);
    const { mockIdRef, question, correctAnswer, userAnswer, feedback, rating, userEmail, createdAt, behavioralFeedback, behavioralMetrics } = data;

    if (!mockIdRef || !question || !userAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newUserAnswer = await prisma.userAnswer.create({
      data: {
        mockIdRef,
        question,
        correctAnswer: correctAnswer || '',
        userAnswer,
        feedback: feedback || '',
        rating: rating ? rating.toString() : '0',
        userEmail,
        createdAt: createdAt || new Date().toISOString(),
        behavioralFeedback: behavioralFeedback || '',
        behavioralMetrics: behavioralMetrics || ''
      },
    });

    return NextResponse.json(newUserAnswer, { status: 201 });
  } catch (error) {
    console.error('Error saving user answer:', error);
    return NextResponse.json({ error: 'Failed to save user answer' }, { status: 500 });
  }
}
