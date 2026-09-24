'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Gamepad2,
    Brain,
    Zap,
    Camera,
    QrCode,
    Star,
    Clock,
    Users,
    ChevronRight,
    Play,
    Trophy,
    Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'

const games = [
    {
        title: "ISL Memory Match",
        description: "Flip cards to match ISL letters with their signs. Train your memory while learning ISL!",
        icon: <Brain className="w-8 h-8" />,
        gradient: "from-violet-500 to-purple-500",
        shadow: "shadow-violet-500/20",
        players: "1 Player",
        time: "5-10 min",
        difficulty: "Easy",
        xp: 25,
        status: "play",
    },
    {
        title: "Quick Quiz",
        description: "Test your ISL knowledge with timed multiple-choice questions. Beat your high score!",
        icon: <Zap className="w-8 h-8" />,
        gradient: "from-amber-500 to-orange-500",
        shadow: "shadow-amber-500/20",
        players: "1 Player",
        time: "3-5 min",
        difficulty: "Medium",
        xp: 30,
        status: "play",
    },
    {
        title: "Sign Challenge",
        description: "Race against time! Sign as many ISL letters as you can in 60 seconds using the camera.",
        icon: <Camera className="w-8 h-8" />,
        gradient: "from-blue-500 to-cyan-500",
        shadow: "shadow-blue-500/20",
        players: "1 Player",
        time: "1 min",
        difficulty: "Hard",
        xp: 50,
        href: "/practice",
        status: "play",
    },
    {
        title: "AR Exploration",
        description: "Scan QR codes and explore 3D models in augmented reality. Discover planets, animals, and more!",
        icon: <QrCode className="w-8 h-8" />,
        gradient: "from-emerald-500 to-green-500",
        shadow: "shadow-emerald-500/20",
        players: "1 Player",
        time: "10+ min",
        difficulty: "Easy",
        xp: 20,
        href: "/qr-codes",
        status: "play",
    },
    {
        title: "ISL Flashcards",
        description: "Swipe through flashcards to review ISL signs. Rate your confidence to track progress.",
        icon: <Layers className="w-8 h-8" />,
        gradient: "from-pink-500 to-rose-500",
        shadow: "shadow-pink-500/20",
        players: "1 Player",
        time: "5 min",
        difficulty: "Easy",
        xp: 15,
        status: "coming",
    },
    {
        title: "Word Builder",
        description: "Spell words by signing individual ISL letters in sequence. Great for sentence practice!",
        icon: <Star className="w-8 h-8" />,
        gradient: "from-indigo-500 to-blue-500",
        shadow: "shadow-indigo-500/20",
        players: "1 Player",
        time: "5-10 min",
        difficulty: "Hard",
        xp: 40,
        status: "coming",
    },
]

const leaderboard = [
    { name: "Aarav S.", xp: 1250, rank: 1 },
    { name: "Meera P.", xp: 1180, rank: 2 },
    { name: "Rohan K.", xp: 980, rank: 3 },
    { name: "Priya D.", xp: 890, rank: 4 },
    { name: "You", xp: 450, rank: 8 },
]

export default function GamesPage() {
    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Games & <span className="gradient-text-warm">Activities</span>
                </h1>
                <p className="text-gray-400">Learn ISL through fun games, challenges, and interactive activities</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Games Grid */}
                <div className="lg:col-span-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {games.map((game, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="group"
                            >
                                <div className={`glass-card p-5 h-full hover:border-white/15 transition-all ${game.shadow}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            {game.icon}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge className={`text-[10px] ${game.difficulty === 'Easy'
                                                    ? 'bg-green-500/15 text-green-400 border-green-500/20'
                                                    : game.difficulty === 'Medium'
                                                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                                                        : 'bg-red-500/15 text-red-400 border-red-500/20'
                                                }`}>
                                                {game.difficulty}
                                            </Badge>
                                            <span className="text-xs text-amber-400 font-medium">+{game.xp} XP</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-white mb-1">{game.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{game.description}</p>

                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {game.players}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {game.time}
                                        </span>
                                    </div>

                                    {game.status === 'play' ? (
                                        game.href ? (
                                            <Link href={game.href}>
                                                <Button className={`w-full bg-gradient-to-r ${game.gradient} text-white border-0 shadow-lg`} size="sm">
                                                    <Play className="w-4 h-4 mr-2" /> Play Now
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button className={`w-full bg-gradient-to-r ${game.gradient} text-white border-0 shadow-lg`} size="sm">
                                                <Play className="w-4 h-4 mr-2" /> Play Now
                                            </Button>
                                        )
                                    ) : (
                                        <Button disabled className="w-full bg-white/5 text-gray-500 border border-white/5" size="sm">
                                            Coming Soon
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Daily Challenge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-600/20 to-orange-600/10 border border-amber-500/20">
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-amber-500/30 text-amber-300 border-amber-500/40">
                                    🔥 Daily
                                </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Daily Challenge</h3>
                            <p className="text-sm text-gray-400 mb-4">Sign 5 ISL letters correctly in a row to earn bonus XP!</p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-gray-500">Progress</span>
                                <span className="text-xs font-medium text-amber-300">3/5 complete</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-black/20 mb-4">
                                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400" style={{ width: '60%' }} />
                            </div>
                            <Link href="/practice">
                                <Button className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30" size="sm">
                                    Continue Challenge <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
                            </div>
                            <div className="space-y-2">
                                {leaderboard.map((player, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${player.name === 'You'
                                                ? 'bg-purple-500/15 border border-purple-500/20'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 text-center font-bold text-sm ${player.rank === 1 ? 'text-yellow-400' :
                                                    player.rank === 2 ? 'text-gray-300' :
                                                        player.rank === 3 ? 'text-amber-600' :
                                                            'text-gray-500'
                                                }`}>
                                                {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : `#${player.rank}`}
                                            </span>
                                            <span className={`text-sm font-medium ${player.name === 'You' ? 'text-purple-300' : 'text-white'}`}>
                                                {player.name}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-400">{player.xp} XP</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    )
}
