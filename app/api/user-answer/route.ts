import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data", data);

    const { 
      mockIdRef, 
      question, 
      correctAnswer, 
      userAnswer, 
      feedback, 
      rating, 
      userEmail, 
      createdAt 
    } = data;

    // Validate the required fields with more detailed validation
    if (!mockIdRef) {
      return NextResponse.json({ 
        error: 'Missing mockIdRef', 
        details: 'Interview ID is required' 
      }, { status: 400 });
    }

    if (!question) {
      return NextResponse.json({ 
        error: 'Missing question', 
        details: 'Question is required' 
      }, { status: 400 });
    }

    if (!userAnswer) {
      return NextResponse.json({ 
        error: 'Missing userAnswer', 
        details: 'User answer is required' 
      }, { status: 400 });
    }

    try {
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
    } catch (dbError) {
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === 'P2002') {
          return NextResponse.json({ 
            error: 'Duplicate entry', 
            details: 'A record with these details already exists' 
          }, { status: 409 });
        }
        
        console.error('Prisma Error:', dbError.code, dbError.message);
        return NextResponse.json({ 
          error: 'Database error', 
          details: dbError.message 
        }, { status: 500 });
      }

      console.error('Unexpected database error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to save user answer', 
        details: dbError instanceof Error ? dbError.message : 'Unknown error' 
      }, { status: 500 });
    }
  } catch (parseError) {
    console.error('Error parsing request body:', parseError);
    return NextResponse.json({ 
      error: 'Invalid request body', 
      details: parseError instanceof Error ? parseError.message : 'Could not parse request' 
    }, { status: 400 });
  }
}