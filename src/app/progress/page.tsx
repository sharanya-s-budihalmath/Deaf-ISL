'use client'

import { motion } from 'framer-motion'
import {
    Trophy,
    Star,
    Flame,
    BookOpen,
    Hand,
    QrCode,
    Target,
    TrendingUp,
    Calendar,
    Award,
    Clock,
    Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/layout/AppLayout'

export default function ProgressPage() {
    const subjectProgress = [
        { subject: "Indian Sign Language", progress: 69, icon: "🤟", lessons: "18/26 letters", color: "from-teal-500 to-cyan-500" },
        { subject: "Science", progress: 35, icon: "🔬", lessons: "3/8 lessons", color: "from-blue-500 to-cyan-500" },
        { subject: "Mathematics", progress: 20, icon: "🔢", lessons: "1/5 lessons", color: "from-emerald-500 to-green-500" },
        { subject: "Vocabulary", progress: 45, icon: "📝", lessons: "4/9 lessons", color: "from-amber-500 to-orange-500" },
    ]

    const achievements = [
        { title: "First Sign", desc: "Learned your first ISL sign", icon: "✋", unlocked: true, date: "Jan 15" },
        { title: "Quick Learner", desc: "Complete 5 lessons", icon: "🚀", unlocked: true, date: "Jan 20" },
        { title: "Science Explorer", desc: "Complete Solar System AR lesson", icon: "🌍", unlocked: true, date: "Jan 25" },
        { title: "Quiz Master", desc: "Score 90%+ on any quiz", icon: "🏆", unlocked: true, date: "Feb 1" },
        { title: "Color Expert", desc: "Complete Colors & Shapes lesson", icon: "🎨", unlocked: true, date: "Feb 5" },
        { title: "Halfway There", desc: "Learn 13 ISL letters", icon: "⭐", unlocked: true, date: "Feb 8" },
        { title: "5-Day Streak", desc: "Learn for 5 consecutive days", icon: "🔥", unlocked: true, date: "Feb 12" },
        { title: "AR Pioneer", desc: "Complete 5 AR scans", icon: "📱", unlocked: true, date: "Feb 13" },
        { title: "ISL Expert", desc: "Learn all 26 ISL letters", icon: "🤟", unlocked: false, date: null },
        { title: "7-Day Streak", desc: "Learn for 7 days in a row", icon: "🔥", unlocked: false, date: null },
        { title: "Perfect Score", desc: "100% on 3 different quizzes", icon: "💯", unlocked: false, date: null },
        { title: "Social Learner", desc: "Share progress with a friend", icon: "👫", unlocked: false, date: null },
        { title: "30-Day Streak", desc: "Learn for 30 days in a row", icon: "🌟", unlocked: false, date: null },
        { title: "Master Scholar", desc: "Complete all available lessons", icon: "🎓", unlocked: false, date: null },
        { title: "Sign Ninja", desc: "Sign 100 letters correctly", icon: "🥷", unlocked: false, date: null },
        { title: "AR Master", desc: "Complete all AR experiences", icon: "🌐", unlocked: false, date: null },
    ]

    const streakCalendar = Array.from({ length: 28 }, (_, i) => {
        const day = i + 1
        if (day <= 13) {
            // Current month up to today
            const active = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(day)
            return { day, active, current: day === 13 }
        }
        return { day, active: false, current: false }
    })

    const unlockedCount = achievements.filter(a => a.unlocked).length

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Your <span className="gradient-text">Progress</span>
                </h1>
                <p className="text-gray-400">Track your learning journey, achievements, and streaks</p>
            </motion.div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total XP", value: "450", icon: <Star className="w-5 h-5" />, gradient: "from-yellow-500 to-amber-500", sub: "Level 5" },
                    { label: "Current Streak", value: "5 days", icon: <Flame className="w-5 h-5" />, gradient: "from-orange-500 to-red-500", sub: "Best: 5 days" },
                    { label: "Lessons Done", value: "12", icon: <BookOpen className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500", sub: "of 30+ available" },
                    { label: "Badges Earned", value: `${unlockedCount}/${achievements.length}`, icon: <Award className="w-5 h-5" />, gradient: "from-teal-500 to-cyan-500", sub: `${unlockedCount} unlocked` },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="glass-card p-4 sm:p-5"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 text-white shadow-lg`}>
                            {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{stat.sub}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Subject Progress */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Subject Progress
                    </h2>
                    <div className="space-y-3">
                        {subjectProgress.map((subject, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{subject.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-medium text-white">{subject.subject}</h3>
                                            <span className="text-sm font-bold text-white">{subject.progress}%</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">{subject.lessons}</p>
                                        <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${subject.progress}%` }}
                                                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                                className={`h-full rounded-full bg-gradient-to-r ${subject.color}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Streak Calendar */}
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-orange-400" />
                        February 2026
                    </h2>
                    <div className="glass-card p-5">
                        <div className="grid grid-cols-7 gap-1.5 mb-3">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className="text-center text-[10px] text-gray-600 font-medium">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                            {streakCalendar.map((day, index) => (
                                <div
                                    key={index}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${day.current
                                        ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white ring-2 ring-teal-400/50'
                                        : day.active
                                            ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/20'
                                            : day.day <= 13
                                                ? 'bg-red-500/10 text-red-400/50 border border-red-500/10'
                                                : 'bg-white/3 text-gray-700'
                                        }`}
                                >
                                    {day.day}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-emerald-500/25 border border-emerald-500/20" /> Active
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-red-500/10 border border-red-500/10" /> Missed
                            </span>
                        </div>
                    </div>

                    {/* XP Level */}
                    <div className="glass-card p-5 mt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-amber-400" />
                            <h3 className="font-semibold text-white">XP Progress</h3>
                        </div>
                        <div className="text-center mb-3">
                            <div className="text-4xl font-bold text-white mb-1">Level 5</div>
                            <p className="text-xs text-gray-500">450 / 600 XP to Level 6</p>
                        </div>
                        <Progress value={75} className="h-2.5 mb-2" />
                        <p className="text-xs text-gray-500 text-center">150 XP to go!</p>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Achievements & Badges
                    </h2>
                    <span className="text-sm text-gray-400">{unlockedCount} of {achievements.length} unlocked</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {achievements.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ scale: 1.08, y: -4 }}
                            className={`glass-card p-3 text-center cursor-default ${!badge.unlocked ? 'opacity-30 grayscale' : ''}`}
                        >
                            <span className="text-2xl block mb-1.5">{badge.icon}</span>
                            <p className="text-[10px] font-semibold text-white mb-0.5 leading-tight">{badge.title}</p>
                            <p className="text-[9px] text-gray-500 leading-tight">{badge.desc}</p>
                            {badge.unlocked && badge.date && (
                                <span className="inline-block mt-1.5 text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                    {badge.date}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </AppLayout>
    )
}
