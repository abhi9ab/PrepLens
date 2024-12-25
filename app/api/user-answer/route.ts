import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data", data);

    const { mockIdRef, question, correctAnswer, userAnswer, feedback, rating, userEmail, createdAt } = data;

    if (!mockIdRef || !question || !userAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log("Prisma client", prisma)

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
      },
    });

    console.log("Database Save Successful:", newUserAnswer);
    return NextResponse.json(newUserAnswer, { status: 201 });
  } catch (error) {
    console.error('Error saving user answer:', error);
    return NextResponse.json({ error: 'Failed to save user answer' }, { status: 500 });
  }
}
