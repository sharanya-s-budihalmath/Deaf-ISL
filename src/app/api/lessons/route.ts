// API Route: Learning Lessons
// Manages lesson content and categories

import { NextRequest, NextResponse } from 'next/server'

// Demo lessons data
const LESSONS = [
  {
    id: 'lesson-001',
    title: 'ISL Alphabet A-M',
    description: 'Learn the first half of Indian Sign Language alphabet',
    categoryId: 'sign-language',
    difficulty: 'beginner',
    duration: 15,
    thumbnail: '/lessons/isl-alpha-1.png',
    hasAR: false,
    hasQuiz: true,
    content: {
      sections: [
        { title: 'Introduction', type: 'video', url: '/videos/isl-intro.mp4' },
        { title: 'Letters A-E', type: 'interactive', signs: ['A', 'B', 'C', 'D', 'E'] },
        { title: 'Letters F-J', type: 'interactive', signs: ['F', 'G', 'H', 'I', 'J'] },
        { title: 'Letters K-M', type: 'interactive', signs: ['K', 'L', 'M'] },
        { title: 'Practice', type: 'practice', instructions: 'Practice each sign 5 times' }
      ]
    },
    order: 1
  },
  {
    id: 'lesson-002',
    title: 'ISL Alphabet N-Z',
    description: 'Learn the second half of Indian Sign Language alphabet',
    categoryId: 'sign-language',
    difficulty: 'beginner',
    duration: 15,
    thumbnail: '/lessons/isl-alpha-2.png',
    hasAR: false,
    hasQuiz: true,
    content: {
      sections: [
        { title: 'Letters N-R', type: 'interactive', signs: ['N', 'O', 'P', 'Q', 'R'] },
        { title: 'Letters S-W', type: 'interactive', signs: ['S', 'T', 'U', 'V', 'W'] },
        { title: 'Letters X-Z', type: 'interactive', signs: ['X', 'Y', 'Z'] },
        { title: 'Full Alphabet Review', type: 'practice', instructions: 'Practice full alphabet' }
      ]
    },
    order: 2
  },
  {
    id: 'lesson-003',
    title: 'Solar System AR',
    description: 'Explore planets and the sun with augmented reality',
    categoryId: 'science',
    difficulty: 'intermediate',
    duration: 20,
    thumbnail: '/lessons/solar-system.png',
    hasAR: true,
    hasQuiz: true,
    qrCode: 'SOLAR-001',
    content: {
      sections: [
        { title: 'What is the Solar System?', type: 'video', url: '/videos/solar-intro.mp4' },
        { title: 'The Sun', type: 'ar', model: 'sun', info: 'The Sun is a star at the center of our solar system' },
        { title: 'Inner Planets', type: 'ar', models: ['mercury', 'venus', 'earth', 'mars'] },
        { title: 'Outer Planets', type: 'ar', models: ['jupiter', 'saturn', 'uranus', 'neptune'] },
        { title: 'Planet Facts Quiz', type: 'quiz', questions: 8 }
      ]
    },
    order: 3
  },
  {
    id: 'lesson-004',
    title: 'Numbers 1-10',
    description: 'Learn to count using Indian Sign Language',
    categoryId: 'math',
    difficulty: 'beginner',
    duration: 10,
    thumbnail: '/lessons/numbers-1.png',
    hasAR: false,
    hasQuiz: true,
    content: {
      sections: [
        { title: 'Numbers 1-5', type: 'interactive', signs: ['1', '2', '3', '4', '5'] },
        { title: 'Numbers 6-10', type: 'interactive', signs: ['6', '7', '8', '9', '10'] },
        { title: 'Counting Practice', type: 'practice' },
        { title: 'Number Quiz', type: 'quiz', questions: 10 }
      ]
    },
    order: 4
  },
  {
    id: 'lesson-005',
    title: 'Human Body Parts',
    description: 'Learn names of body parts with AR',
    categoryId: 'science',
    difficulty: 'beginner',
    duration: 15,
    thumbnail: '/lessons/body-parts.png',
    hasAR: true,
    hasQuiz: true,
    qrCode: 'BODY-001',
    content: {
      sections: [
        { title: 'Head Parts', type: 'ar', models: ['head', 'eyes', 'ears', 'nose', 'mouth'] },
        { title: 'Upper Body', type: 'ar', models: ['shoulders', 'arms', 'hands', 'chest'] },
        { title: 'Lower Body', type: 'ar', models: ['legs', 'knees', 'feet'] },
        { title: 'Body Parts Quiz', type: 'quiz', questions: 10 }
      ]
    },
    order: 5
  },
  {
    id: 'lesson-006',
    title: 'Daily Words',
    description: 'Learn common everyday words in ISL',
    categoryId: 'vocabulary',
    difficulty: 'beginner',
    duration: 20,
    thumbnail: '/lessons/daily-words.png',
    hasAR: false,
    hasQuiz: true,
    content: {
      sections: [
        { title: 'Greetings', type: 'video', words: ['hello', 'goodbye', 'thank you', 'please'] },
        { title: 'Family', type: 'interactive', words: ['mother', 'father', 'sister', 'brother', 'family'] },
        { title: 'Food', type: 'interactive', words: ['water', 'food', 'hungry', 'thirsty'] },
        { title: 'Emotions', type: 'interactive', words: ['happy', 'sad', 'angry', 'scared'] }
      ]
    },
    order: 6
  }
]

// Categories
const CATEGORIES = [
  { id: 'sign-language', name: 'Sign Language', icon: '✋', color: 'purple', description: 'Learn Indian Sign Language' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'blue', description: 'Explore the world of science' },
  { id: 'math', name: 'Mathematics', icon: '🔢', color: 'green', description: 'Numbers and counting' },
  { id: 'vocabulary', name: 'Vocabulary', icon: '📝', color: 'orange', description: 'Common words and phrases' },
  { id: 'geography', name: 'Geography', icon: '🌍', color: 'teal', description: 'Learn about places' }
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const categoryId = searchParams.get('category')
  const lessonId = searchParams.get('id')

  // Get specific lesson
  if (lessonId) {
    const lesson = LESSONS.find(l => l.id === lessonId)
    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, lesson })
  }

  // Get categories
  if (searchParams.get('categories') === 'true') {
    return NextResponse.json({ success: true, categories: CATEGORIES })
  }

  // Filter by category
  let filteredLessons = LESSONS
  if (categoryId) {
    filteredLessons = LESSONS.filter(l => l.categoryId === categoryId)
  }

  return NextResponse.json({
    success: true,
    count: filteredLessons.length,
    categories: CATEGORIES,
    lessons: filteredLessons
  })
}
