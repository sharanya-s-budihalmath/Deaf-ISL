// API Route: Learning Progress Tracking
// Tracks user progress, achievements, and statistics

import { NextRequest, NextResponse } from 'next/server'

// Demo progress data
interface UserProgress {
  lessonId: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  timeSpent: number // in seconds
  lastAccessed: string
  completedAt?: string
}

interface UserStats {
  totalLessons: number
  completedLessons: number
  totalPoints: number
  streak: number
  totalTime: number
  achievements: string[]
}

// In-memory storage for demo (use database in production)
let userProgress: UserProgress[] = [
  { lessonId: 'lesson-001', status: 'completed', progress: 100, timeSpent: 1200, lastAccessed: '2025-01-15T10:00:00Z', completedAt: '2025-01-15T10:20:00Z' },
  { lessonId: 'lesson-002', status: 'in_progress', progress: 40, timeSpent: 480, lastAccessed: '2025-01-15T11:00:00Z' },
  { lessonId: 'lesson-003', status: 'completed', progress: 100, timeSpent: 1800, lastAccessed: '2025-01-14T14:00:00Z', completedAt: '2025-01-14T14:30:00Z' },
  { lessonId: 'lesson-004', status: 'in_progress', progress: 20, timeSpent: 180, lastAccessed: '2025-01-15T09:00:00Z' },
  { lessonId: 'lesson-005', status: 'not_started', progress: 0, timeSpent: 0, lastAccessed: '2025-01-10T08:00:00Z' },
  { lessonId: 'lesson-006', status: 'in_progress', progress: 60, timeSpent: 720, lastAccessed: '2025-01-15T12:00:00Z' }
]

const userStats: UserStats = {
  totalLessons: 6,
  completedLessons: 2,
  totalPoints: 450,
  streak: 5,
  totalTime: 4380,
  achievements: ['first_lesson', 'alphabet_master', 'streak_5']
}

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', points: 10 },
  { id: 'alphabet_master', name: 'Alphabet Master', description: 'Learn all ISL letters', icon: '🏆', points: 50 },
  { id: 'streak_5', name: '5 Day Streak', description: 'Learn for 5 days in a row', icon: '🔥', points: 25 },
  { id: 'ar_explorer', name: 'AR Explorer', description: 'Complete an AR lesson', icon: '🌟', points: 30 },
  { id: 'quiz_ace', name: 'Quiz Ace', description: 'Score 100% on a quiz', icon: '⭐', points: 20 },
  { id: 'speed_learner', name: 'Speed Learner', description: 'Complete 3 lessons in one day', icon: '⚡', points: 40 }
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  // Get achievements list
  if (action === 'achievements') {
    return NextResponse.json({
      success: true,
      achievements: ACHIEVEMENTS
    })
  }

  // Get user statistics
  if (action === 'stats') {
    return NextResponse.json({
      success: true,
      stats: userStats
    })
  }

  // Get progress for specific lesson
  const lessonId = searchParams.get('lessonId')
  if (lessonId) {
    const progress = userProgress.find(p => p.lessonId === lessonId)
    return NextResponse.json({
      success: true,
      lessonId,
      progress: progress || { lessonId, status: 'not_started', progress: 0, timeSpent: 0, lastAccessed: new Date().toISOString() }
    })
  }

  // Get all progress
  return NextResponse.json({
    success: true,
    stats: userStats,
    progress: userProgress,
    achievements: userStats.achievements.map(aId => ACHIEVEMENTS.find(a => a.id === aId)).filter(Boolean)
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, action, progress, timeSpent } = body

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    // Find or create progress entry
    let progressEntry = userProgress.find(p => p.lessonId === lessonId)
    
    if (!progressEntry) {
      progressEntry = {
        lessonId,
        status: 'not_started',
        progress: 0,
        timeSpent: 0,
        lastAccessed: new Date().toISOString()
      }
      userProgress.push(progressEntry)
    }

    // Update based on action
    switch (action) {
      case 'start':
        progressEntry.status = 'in_progress'
        progressEntry.lastAccessed = new Date().toISOString()
        break
      
      case 'progress':
        if (typeof progress === 'number') {
          progressEntry.progress = Math.min(100, Math.max(0, progress))
          if (progressEntry.progress > 0) {
            progressEntry.status = 'in_progress'
          }
        }
        if (typeof timeSpent === 'number') {
          progressEntry.timeSpent += timeSpent
        }
        progressEntry.lastAccessed = new Date().toISOString()
        break
      
      case 'complete':
        progressEntry.status = 'completed'
        progressEntry.progress = 100
        progressEntry.completedAt = new Date().toISOString()
        progressEntry.lastAccessed = new Date().toISOString()
        
        // Update stats
        userStats.completedLessons++
        userStats.totalPoints += 50 // Points for completing lesson
        
        // Check for achievements
        if (userStats.completedLessons === 1) {
          if (!userStats.achievements.includes('first_lesson')) {
            userStats.achievements.push('first_lesson')
            userStats.totalPoints += 10
          }
        }
        break
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Update total time
    userStats.totalTime = userProgress.reduce((sum, p) => sum + p.timeSpent, 0)

    return NextResponse.json({
      success: true,
      message: 'Progress updated',
      progress: progressEntry,
      stats: userStats
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
