'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Star,
  Trophy,
  RotateCcw,
  Clock,
  HelpCircle
} from 'lucide-react'

interface Question {
  id: string
  type: 'multiple_choice' | 'sign_match' | 'true_false'
  question: string
  options?: string[]
  correctAnswer: string
  image?: string
}

interface QuizResult {
  questionId: string
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

interface QuizProps {
  lessonId: string
  lessonTitle: string
  onComplete?: (score: number, passed: boolean) => void
}

export default function QuizSystem({ lessonId, lessonTitle, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [results, setResults] = useState<QuizResult[]>([])
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [timeStarted, setTimeStarted] = useState<Date | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz?lessonId=${lessonId}`)
        const data = await response.json()

        if (data.success) {
          setQuestions(data.questions)
          setTimeStarted(new Date())
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error)
        // Use demo questions
        setQuestions(getDemoQuestions(lessonId))
        setTimeStarted(new Date())
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuiz()
  }, [lessonId])

  // Timer
  useEffect(() => {
    if (!timeStarted || showResult) return

    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((new Date().getTime() - timeStarted.getTime()) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [timeStarted, showResult])

  // Demo questions fallback
  const getDemoQuestions = (id: string): Question[] => {
    if (id.includes('sign') || id.includes('isl')) {
      return [
        {
          id: 'q1',
          type: 'multiple_choice',
          question: 'How do you make the letter "A" in ISL?',
          options: ['Make a fist with thumb on side', 'Point index finger up', 'Make peace sign', 'Show open palm'],
          correctAnswer: 'Make a fist with thumb on side'
        },
        {
          id: 'q2',
          type: 'multiple_choice',
          question: 'Which letter has only the pinky finger pointing up?',
          options: ['A', 'I', 'L', 'Y'],
          correctAnswer: 'I'
        },
        {
          id: 'q3',
          type: 'multiple_choice',
          question: 'What shape does your hand make for letter "C"?',
          options: ['Flat hand', 'Fist', 'Curve like holding a ball', 'Peace sign'],
          correctAnswer: 'Curve like holding a ball'
        },
        {
          id: 'q4',
          type: 'multiple_choice',
          question: 'How do you make letter "L"?',
          options: ['Peace sign', 'Point thumb and index in L shape', 'Make a circle', 'Fist with thumb out'],
          correctAnswer: 'Point thumb and index in L shape'
        },
        {
          id: 'q5',
          type: 'multiple_choice',
          question: 'What does the letter "Y" look like?',
          options: ['Peace sign', 'Two fingers up', 'Thumb and pinky out (hang loose)', 'Three fingers up'],
          correctAnswer: 'Thumb and pinky out (hang loose)'
        }
      ]
    }

    // Solar system questions
    return [
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
        question: 'Which planet has beautiful rings?',
        options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        correctAnswer: 'Saturn'
      },
      {
        id: 'q5',
        type: 'multiple_choice',
        question: 'Which is the largest planet?',
        options: ['Saturn', 'Jupiter', 'Uranus', 'Neptune'],
        correctAnswer: 'Jupiter'
      }
    ]
  }

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)

    // Store answer
    setAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: answer
    }))

    // Move to next question after delay
    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        submitQuiz()
      }
    }, 1500)
  }

  // Submit quiz
  const submitQuiz = async () => {
    const finalAnswers = { ...answers }
    if (selectedAnswer) {
      finalAnswers[questions[currentIndex].id] = selectedAnswer
    }

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, answers: finalAnswers })
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        setScore(data.score)
        setPassed(data.passed)
        setShowResult(true)

        if (onComplete) {
          onComplete(data.score, data.passed)
        }
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error)

      // Calculate locally
      let correct = 0
      const localResults: QuizResult[] = questions.map(q => {
        const userAnswer = finalAnswers[q.id] || ''
        const isCorrect = userAnswer === q.correctAnswer
        if (isCorrect) correct++

        return {
          questionId: q.id,
          question: q.question,
          userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect
        }
      })

      const localScore = Math.round((correct / questions.length) * 100)
      setResults(localResults)
      setScore(localScore)
      setPassed(localScore >= 70)
      setShowResult(true)

      if (onComplete) {
        onComplete(localScore, localScore >= 70)
      }
    }
  }

  // Restart quiz
  const restartQuiz = () => {
    setCurrentIndex(0)
    setAnswers({})
    setShowResult(false)
    setResults([])
    setScore(0)
    setPassed(false)
    setTimeStarted(new Date())
    setTimeElapsed(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-white/10">
        <CardContent className="py-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading quiz...</p>
        </CardContent>
      </Card>
    )
  }

  // Result Screen
  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className={`border-2 ${passed ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {passed ? (
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              ) : (
                <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
              )}
            </motion.div>

            <CardTitle className={`text-3xl ${passed ? 'text-green-400' : 'text-red-400'}`}>
              {passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
            </CardTitle>
            <CardDescription className="text-lg">
              {passed
                ? 'You passed the quiz!'
                : 'You need 70% to pass. Try again!'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-5xl font-bold text-white">{score}%</p>
                  <p className="text-gray-400">Score</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-white">
                    {results.filter(r => r.isCorrect).length}/{questions.length}
                  </p>
                  <p className="text-gray-400">Correct</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-white">{formatTime(timeElapsed)}</p>
                  <p className="text-gray-400">Time</p>
                </div>
              </div>
            </div>

            {/* Points Earned */}
            {passed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 flex items-center justify-center gap-3"
              >
                <Star className="w-8 h-8 text-yellow-400" />
                <span className="text-xl text-white font-bold">+{score} Points Earned!</span>
              </motion.div>
            )}

            {/* Results Breakdown */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Question Review:</h4>
              {results.map((result, index) => (
                <motion.div
                  key={result.questionId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg flex items-start gap-3 ${result.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                >
                  {result.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm">{result.question}</p>
                    {!result.isCorrect && (
                      <p className="text-xs text-gray-400 mt-1">
                        Correct answer: <span className="text-green-400">{result.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={restartQuiz}
                variant="outline"
                className="flex-1 border-teal-500/50 text-teal-400"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              {passed && (
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Next Lesson
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Quiz Questions
  const currentQuestion = questions[currentIndex]

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-slate-800/50 border-white/10">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">{lessonTitle} Quiz</h3>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(timeElapsed)}
              </Badge>
              <span className="text-gray-400">
                {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>
          <Progress value={(currentIndex / questions.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card className="bg-slate-800/50 border-white/10">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {currentIndex + 1}
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    {currentQuestion.question}
                  </CardTitle>
                  {currentQuestion.image && (
                    <img
                      src={currentQuestion.image}
                      alt="Question"
                      className="mt-4 rounded-lg max-h-48 object-contain"
                    />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3">
                {currentQuestion.options?.map((option, index) => {
                  const isSelected = selectedAnswer === option
                  const isCorrect = option === currentQuestion.correctAnswer
                  const showCorrect = showFeedback && isCorrect
                  const showWrong = showFeedback && isSelected && !isCorrect

                  return (
                    <motion.button
                      key={index}
                      onClick={() => !showFeedback && handleAnswer(option)}
                      disabled={showFeedback}
                      whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                      whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                      className={`p-4 rounded-xl text-left transition-all ${showCorrect
                          ? 'bg-green-500/30 border-2 border-green-500'
                          : showWrong
                            ? 'bg-red-500/30 border-2 border-red-500'
                            : isSelected
                              ? 'bg-teal-500/30 border-2 border-teal-500'
                              : 'bg-slate-700/50 border-2 border-transparent hover:border-teal-500/50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${showCorrect
                            ? 'bg-green-500 text-white'
                            : showWrong
                              ? 'bg-red-500 text-white'
                              : isSelected
                                ? 'bg-teal-500 text-white'
                                : 'bg-slate-600 text-gray-300'
                          }`}>
                          {showCorrect ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : showWrong ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            String.fromCharCode(65 + index)
                          )}
                        </div>
                        <span className={`text-lg ${showCorrect
                            ? 'text-green-400'
                            : showWrong
                              ? 'text-red-400'
                              : 'text-white'
                          }`}>
                          {option}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Help Section */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 text-blue-300">
            <HelpCircle className="w-5 h-5" />
            <p className="text-sm">Take your time! There is no time limit for each question.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
