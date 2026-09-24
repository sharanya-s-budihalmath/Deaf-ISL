'use client'

import { motion } from 'framer-motion'
import {
    BookOpen,
    Hand,
    QrCode,
    Star,
    Camera,
    Trophy,
    Flame,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Gamepad2,
    Lightbulb,
    Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'

const dailyTips = [
    "Practice ISL letter 'अ' today — it's the foundation of greetings!",
    "Try the AR Solar System experience — it's our most popular lesson!",
    "Challenge yourself: learn 3 new ISL signs before lunch!",
    "Flash cards help memorize faster — try the Memory Match game!",
]

export default function DashboardPage() {
    const tip = dailyTips[new Date().getDay() % dailyTips.length]

    const continueItems = [
        { title: "ISL Alphabet N-Z", category: "Sign Language", progress: 40, icon: "🤟", href: "/learn" },
        { title: "Daily Words", category: "Vocabulary", progress: 60, icon: "📝", href: "/learn" },
        { title: "Numbers 1-10", category: "Math", progress: 20, icon: "🔢", href: "/learn" },
    ]

    const quickActions = [
        { title: "Sign Detection", icon: Camera, gradient: "from-blue-500 to-cyan-500", href: "/sign-detection" },
        { title: "ISL Dictionary", icon: BookOpen, gradient: "from-violet-500 to-purple-500", href: "/dictionary" },
        { title: "AR Scanner", icon: QrCode, gradient: "from-orange-500 to-amber-500", href: "/qr-codes" },
        { title: "Play Games", icon: Gamepad2, gradient: "from-pink-500 to-rose-500", href: "/games" },
    ]

    const achievements = [
        { title: "First Sign", desc: "Learned your first ISL sign", icon: "✋", unlocked: true },
        { title: "Quick Learner", desc: "Complete 5 lessons", icon: "🚀", unlocked: true },
        { title: "Science Explorer", desc: "Complete Solar System AR", icon: "🌍", unlocked: true },
        { title: "Quiz Master", desc: "Score 90%+ on a quiz", icon: "🏆", unlocked: true },
        { title: "ISL Expert", desc: "Learn all 26 ISL letters", icon: "🤟", unlocked: false },
        { title: "7-Day Streak", desc: "Learn for 7 days in a row", icon: "🔥", unlocked: false },
    ]

    const weeklyActivity = [
        { day: "Mon", value: 75 },
        { day: "Tue", value: 60 },
        { day: "Wed", value: 90 },
        { day: "Thu", value: 45 },
        { day: "Fri", value: 80 },
        { day: "Sat", value: 30 },
        { day: "Sun", value: 0 },
    ]

    return (
        <AppLayout>
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-8 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/10"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 animate-gradient" />
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome Back! 👋</h1>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <span className="text-xs font-bold text-orange-300">5 day streak!</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                            <p className="text-sm">{tip}</p>
                        </div>
                    </div>
                    <Link href="/learn">
                        <Button className="bg-white/10 hover:bg-white/15 text-white border border-white/10 shrink-0">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Continue Learning
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Lessons Done", value: "12", icon: <BookOpen className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500", change: "+2 this week" },
                    { label: "ISL Letters", value: "18/26", icon: <Hand className="w-5 h-5" />, gradient: "from-purple-500 to-violet-500", change: "69% complete" },
                    { label: "AR Scans", value: "5", icon: <QrCode className="w-5 h-5" />, gradient: "from-orange-500 to-amber-500", change: "+1 today" },
                    { label: "Total XP", value: "450", icon: <Star className="w-5 h-5" />, gradient: "from-yellow-500 to-amber-500", change: "Level 5" },
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
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Continue Learning */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-400" />
                            Continue Learning
                        </h2>
                        <Link href="/learn">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {continueItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ x: 4 }}
                            >
                                <Link href={item.href}>
                                    <div className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-purple-500/30 transition-all">
                                        <span className="text-3xl">{item.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-medium text-white truncate">{item.title}</h3>
                                                <span className="text-sm font-medium text-purple-300">{item.progress}%</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                                            <Progress value={item.progress} className="h-1.5" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Weekly Activity */}
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Weekly Activity
                    </h2>
                    <div className="glass-card p-5">
                        <div className="flex items-end justify-between gap-2 h-32 mb-3">
                            {weeklyActivity.map((day, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1.5">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${day.value}%` }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        className={`w-full rounded-t-md ${day.value > 70 ? 'bg-gradient-to-t from-emerald-500 to-cyan-400' :
                                                day.value > 40 ? 'bg-gradient-to-t from-blue-500 to-indigo-400' :
                                                    day.value > 0 ? 'bg-gradient-to-t from-purple-500/50 to-purple-400/50' :
                                                        'bg-gray-700/30'
                                            }`}
                                        style={{ minHeight: day.value > 0 ? '8px' : '4px' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            {weeklyActivity.map((day, index) => (
                                <span key={index} className="flex-1 text-center text-[10px] text-gray-500 font-medium">{day.day}</span>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 text-center">
                            <p className="text-sm text-gray-400">Avg: <span className="font-semibold text-white">54 min/day</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Link href={action.href}>
                                <div className="glass-card p-4 text-center cursor-pointer hover:border-white/15 transition-all group">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform text-white`}>
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-white">{action.title}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Achievements */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Achievements
                    </h2>
                    <Link href="/progress">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {achievements.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            className={`glass-card p-4 text-center ${!badge.unlocked ? 'opacity-40' : ''}`}
                        >
                            <span className="text-3xl block mb-2">{badge.icon}</span>
                            <p className="text-xs font-semibold text-white mb-1">{badge.title}</p>
                            <p className="text-[10px] text-gray-500">{badge.desc}</p>
                            {badge.unlocked && (
                                <span className="inline-block mt-2 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    ✓ Unlocked
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </AppLayout>
    )
}
