'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Hand,
    Camera,
    Trophy,
    Flame,
    Target,
    ChevronRight,
    RotateCcw,
    Sparkles,
    CheckCircle2,
    XCircle,
    Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'

const islLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function PracticePage() {
    const [mode, setMode] = useState<'menu' | 'challenge'>('menu')
    const [currentLetter, setCurrentLetter] = useState('')
    const [streak, setStreak] = useState(0)
    const [bestStreak, setBestStreak] = useState(3)
    const [score, setScore] = useState(0)
    const [totalAttempts, setTotalAttempts] = useState(0)
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
    const [challengeHistory, setChallengeHistory] = useState<Array<{ letter: string; correct: boolean }>>([])

    const pickRandomLetter = useCallback(() => {
        const letter = islLetters[Math.floor(Math.random() * islLetters.length)]
        setCurrentLetter(letter)
        setFeedback(null)
    }, [])

    const startChallenge = () => {
        setMode('challenge')
        setScore(0)
        setStreak(0)
        setTotalAttempts(0)
        setChallengeHistory([])
        pickRandomLetter()
    }

    const simulateAnswer = (correct: boolean) => {
        setTotalAttempts(prev => prev + 1)
        if (correct) {
            setScore(prev => prev + 10)
            setStreak(prev => {
                const newStreak = prev + 1
                if (newStreak > bestStreak) setBestStreak(newStreak)
                return newStreak
            })
            setFeedback('correct')
        } else {
            setStreak(0)
            setFeedback('wrong')
        }
        setChallengeHistory(prev => [...prev, { letter: currentLetter, correct }])
        setTimeout(() => pickRandomLetter(), 1500)
    }

    const accuracy = totalAttempts > 0 ? Math.round((score / 10) / totalAttempts * 100) : 0

    const practiceCategories = [
        {
            title: "Quick Challenge",
            desc: "Random ISL letters — sign as many as you can!",
            icon: <Zap className="w-7 h-7" />,
            gradient: "from-amber-500 to-orange-500",
            action: startChallenge
        },
        {
            title: "Full Sign Detection",
            desc: "Open the camera and practice freely with AI feedback",
            icon: <Camera className="w-7 h-7" />,
            gradient: "from-blue-500 to-cyan-500",
            href: "/sign-detection"
        },
        {
            title: "Alphabet Drill",
            desc: "Practice all 26 ISL letters in order, A to Z",
            icon: <Hand className="w-7 h-7" />,
            gradient: "from-teal-500 to-cyan-500",
            action: startChallenge
        }
    ]

    if (mode === 'challenge') {
        return (
            <AppLayout>
                <div className="max-w-2xl mx-auto">
                    {/* Challenge Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <span className="text-sm font-bold text-orange-300">{streak} streak</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                <Target className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-300">{accuracy}% accuracy</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30">
                                <Sparkles className="w-4 h-4 text-teal-400" />
                                <span className="text-sm font-bold text-teal-300">{score} XP</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Current Letter to Sign */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-8 text-center mb-6"
                    >
                        <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">Sign this letter</p>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentLetter}
                                initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                                transition={{ type: 'spring', damping: 15 }}
                                className="w-32 h-32 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/30"
                            >
                                <span className="text-6xl font-bold text-white">{currentLetter}</span>
                            </motion.div>
                        </AnimatePresence>

                        {/* Feedback */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`flex items-center justify-center gap-2 mb-4 ${feedback === 'correct' ? 'text-emerald-400' : 'text-red-400'
                                        }`}
                                >
                                    {feedback === 'correct' ? (
                                        <><CheckCircle2 className="w-5 h-5" /> Correct! +10 XP</>
                                    ) : (
                                        <><XCircle className="w-5 h-5" /> Try again!</>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="text-sm text-gray-400 mb-6">
                            Show the ISL sign for <span className="font-bold text-white">&quot;{currentLetter}&quot;</span> to your camera
                        </p>

                        {/* Demo buttons (in real use, camera detection would handle this) */}
                        <div className="flex gap-3 justify-center mb-4">
                            <Button
                                onClick={() => simulateAnswer(true)}
                                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> I Got It
                            </Button>
                            <Button
                                onClick={() => simulateAnswer(false)}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Skip
                            </Button>
                        </div>

                        <Link href="/sign-detection">
                            <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">
                                <Camera className="w-4 h-4 mr-2" />
                                Open Camera for Real Detection
                            </Button>
                        </Link>
                    </motion.div>

                    {/* History */}
                    {challengeHistory.length > 0 && (
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-semibold text-white mb-3">Recent Attempts</h3>
                            <div className="flex flex-wrap gap-2">
                                {challengeHistory.slice(-20).map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${item.correct
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}
                                    >
                                        {item.letter}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back button */}
                    <div className="text-center mt-6">
                        <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setMode('menu')}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Back to Practice Menu
                        </Button>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Practice <span className="gradient-text-warm">ISL Signs</span>
                </h1>
                <p className="text-gray-400">Challenge yourself and improve your Indian Sign Language skills</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-card p-4 text-center">
                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{bestStreak}</div>
                    <div className="text-xs text-gray-500">Best Streak</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <Hand className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">18/26</div>
                    <div className="text-xs text-gray-500">Letters Mastered</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">450</div>
                    <div className="text-xs text-gray-500">Total XP</div>
                </div>
            </div>

            {/* Practice Modes */}
            <h2 className="text-lg font-semibold text-white mb-4">Choose Practice Mode</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {practiceCategories.map((cat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {cat.href ? (
                            <Link href={cat.href}>
                                <div className="glass-card p-6 h-full cursor-pointer hover:border-white/15 transition-all text-center group">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg text-white group-hover:scale-110 transition-transform`}>
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{cat.title}</h3>
                                    <p className="text-sm text-gray-400">{cat.desc}</p>
                                </div>
                            </Link>
                        ) : (
                            <div
                                onClick={cat.action}
                                className="glass-card p-6 h-full cursor-pointer hover:border-white/15 transition-all text-center group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg text-white group-hover:scale-110 transition-transform`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{cat.title}</h3>
                                <p className="text-sm text-gray-400">{cat.desc}</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* ISL Letters Progress */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Your ISL Alphabet Progress</h2>
                <div className="glass-card p-5">
                    <div className="grid grid-cols-9 sm:grid-cols-13 gap-2">
                        {islLetters.map((letter, index) => {
                            const mastered = index < 18
                            return (
                                <motion.div
                                    key={letter}
                                    whileHover={{ scale: 1.15 }}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${mastered
                                        ? 'bg-gradient-to-br from-emerald-500/30 to-green-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-white/5 text-gray-600 border border-white/5 hover:border-purple-500/30 hover:text-gray-400'
                                        }`}
                                >
                                    {letter}
                                </motion.div>
                            )
                        })}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/30" /> Mastered
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-white/5 border border-white/5" /> Not yet
                            </span>
                        </div>
                        <span className="text-sm text-white font-medium">18/26 complete</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
