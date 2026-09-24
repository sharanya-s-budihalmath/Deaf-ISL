// API Route: Quiz System
// Handles quiz questions, answers, and scoring

import { NextRequest, NextResponse } from 'next/server'

// Quiz questions for different lessons
const QUIZ_DATA: Record<string, { lessonId: string; questions: any[]; passingScore: number }> = {
  'lesson-001': {
    lessonId: 'lesson-001',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'Which letter is shown by making a fist with thumb on the side?',
        options: ['A', 'B', 'S', 'E'],
        correctAnswer: 'A',
        image: '/quiz/letter-a.png'
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'How do you make the letter C in ISL?',
        options: [
          'Make a fist',
          'Curve hand like holding a ball',
          'Point index finger up',
          'Make peace sign'
        ],
        correctAnswer: 'Curve hand like holding a ball'
      },
      {
        id: 'q3',
        type: 'sign_match',
        question: 'Show the letter D using sign language',
        expectedSign: 'D',
        image: '/quiz/letter-d-demo.png'
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        question: 'Which letter has only the pinky finger pointing up?',
        options: ['A', 'I', 'L', 'Y'],
        correctAnswer: 'I'
      },
      {
        id: 'q5',
        type: 'multiple_choice',
        question: 'The letter L is made by making an L shape with which fingers?',
        options: [
          'Middle and ring finger',
          'Index and middle finger',
          'Thumb and index finger',
          'Pinky and thumb'
        ],
        correctAnswer: 'Thumb and index finger'
      }
    ]
  },
  'lesson-003': {
    lessonId: 'lesson-003',
    passingScore: 60,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'Which planet is closest to the Sun?',
        options: ['Venus', 'Mercury', 'Earth', 'Mars'],
        correctAnswer: 'Mercury'
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'How many planets are in our solar system?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8'
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: 'Which planet is known as the Red Planet?',
        options: ['Jupiter', 'Venus', 'Mars', 'Saturn'],
        correctAnswer: 'Mars'
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        question: 'Which planet has rings around it?',
        options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        correctAnswer: 'Saturn'
      },
      {
        id: 'q5',
        type: 'multiple_choice',
        question: 'Which planet do we live on?',
        options: ['Mars', 'Venus', 'Earth', 'Mercury'],
        correctAnswer: 'Earth'
      },
      {
        id: 'q6',
        type: 'multiple_choice',
        question: 'What is at the center of our solar system?',
        options: ['Earth', 'Moon', 'Sun', 'Jupiter'],
        correctAnswer: 'Sun'
      },
      {
        id: 'q7',
        type: 'multiple_choice',
        question: 'Which is the largest planet?',
        options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
        correctAnswer: 'Jupiter'
      },
      {
        id: 'q8',
        type: 'multiple_choice',
        question: 'Which planet is called the "Blue Planet"?',
        options: ['Neptune', 'Uranus', 'Earth', 'Venus'],
        correctAnswer: 'Earth'
      }
    ]
  }
}

// Store quiz attempts (use database in production)
const quizAttempts: Record<string, any[]> = {}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lessonId = searchParams.get('lessonId')
  const attemptId = searchParams.get('attemptId')

  // Get specific attempt result
  if (attemptId) {
    for (const attempts of Object.values(quizAttempts)) {
      const attempt = attempts.find(a => a.id === attemptId)
      if (attempt) {
        return NextResponse.json({ success: true, attempt })
      }
    }
    return NextResponse.json(
      { success: false, error: 'Attempt not found' },
      { status: 404 }
    )
  }

  // Get quiz for specific lesson
  if (lessonId) {
    const quiz = QUIZ_DATA[lessonId]
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found for this lesson' },
        { status: 404 }
      )
    }

    // Return quiz without correct answers
    const questionsForUser = quiz.questions.map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      image: q.image
    }))

    return NextResponse.json({
      success: true,
      lessonId,
      passingScore: quiz.passingScore,
      totalQuestions: quiz.questions.length,
      questions: questionsForUser
    })
  }

  // Get all available quizzes
  return NextResponse.json({
    success: true,
    quizzes: Object.keys(QUIZ_DATA).map(lessonId => ({
      lessonId,
      questionCount: QUIZ_DATA[lessonId].questions.length,
      passingScore: QUIZ_DATA[lessonId].passingScore
    }))
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, answers } = body

    if (!lessonId || !answers) {
      return NextResponse.json(
        { success: false, error: 'Lesson ID and answers are required' },
        { status: 400 }
      )
    }

    const quiz = QUIZ_DATA[lessonId]
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Grade the quiz
    let correctCount = 0
    const results = quiz.questions.map(question => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) correctCount++
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      }
    })

    const score = Math.round((correctCount / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore

    // Create attempt record
    const attemptId = `attempt-${Date.now()}`
    const attempt = {
      id: attemptId,
      lessonId,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      results,
      completedAt: new Date().toISOString()
    }

    // Store attempt
    if (!quizAttempts[lessonId]) {
      quizAttempts[lessonId] = []
    }
    quizAttempts[lessonId].push(attempt)

    return NextResponse.json({
      success: true,
      attemptId,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      passingScore: quiz.passingScore,
      results
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}
