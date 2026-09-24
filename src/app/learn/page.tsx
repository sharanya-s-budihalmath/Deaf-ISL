'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpen,
    Hand,
    Beaker,
    Calculator,
    Languages,
    Sparkles,
    ChevronRight,
    Star,
    Filter,
    Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'

const categories = [
    { id: 'all', label: 'All Lessons', icon: BookOpen },
    { id: 'isl', label: 'Sign Language', icon: Hand },
    { id: 'science', label: 'Science', icon: Beaker },
    { id: 'math', label: 'Mathematics', icon: Calculator },
    { id: 'vocab', label: 'Vocabulary', icon: Languages },
]

const lessons = [
    { title: "ISL Alphabet A-M", progress: 85, category: "isl", icon: "✋", difficulty: "Easy", featured: true, lessons: 13, duration: "30 min", description: "Learn first half of Indian Sign Language alphabet with visual guides" },
    { title: "ISL Alphabet N-Z", progress: 40, category: "isl", icon: "🤟", difficulty: "Easy", featured: false, lessons: 13, duration: "30 min", description: "Complete your ISL alphabet knowledge with the remaining letters" },
    { title: "ISL Numbers 1-10", progress: 20, category: "isl", icon: "🔢", difficulty: "Easy", featured: false, lessons: 10, duration: "20 min", description: "Learn to sign numbers from 1 to 10 in ISL" },
    { title: "ISL Greetings", progress: 0, category: "isl", icon: "🙏", difficulty: "Easy", featured: true, isNew: true, lessons: 8, duration: "15 min", description: "Essential greeting signs — Namaste, Thank You, Please, and more" },
    { title: "ISL Daily Words", progress: 60, category: "isl", icon: "📝", difficulty: "Medium", featured: false, lessons: 20, duration: "45 min", description: "Common everyday words in Indian Sign Language" },
    { title: "ISL Emotions", progress: 0, category: "isl", icon: "😊", difficulty: "Easy", featured: false, isNew: true, lessons: 12, duration: "25 min", description: "Express feelings and emotions through ISL signs" },
    { title: "Solar System", progress: 100, category: "science", icon: "🌍", difficulty: "Medium", featured: true, lessons: 9, duration: "40 min", description: "Explore planets, moons, and the sun with AR 3D models" },
    { title: "Human Body", progress: 0, category: "science", icon: "🧍", difficulty: "Medium", featured: false, lessons: 12, duration: "35 min", description: "Learn about body parts, organs, and systems visually" },
    { title: "Animal Kingdom", progress: 0, category: "science", icon: "🦁", difficulty: "Easy", featured: false, lessons: 15, duration: "30 min", description: "Discover different animals, their habitats, and ISL signs" },
    { title: "Plant Life", progress: 0, category: "science", icon: "🌱", difficulty: "Easy", featured: false, isNew: true, lessons: 10, duration: "25 min", description: "Learn about plants, flowers, and photosynthesis" },
    { title: "Numbers 11-20", progress: 0, category: "math", icon: "🔢", difficulty: "Medium", featured: false, lessons: 10, duration: "20 min", description: "Counting and signing numbers from 11 to 20" },
    { title: "Colors & Shapes", progress: 100, category: "vocab", icon: "🎨", difficulty: "Easy", featured: false, lessons: 15, duration: "30 min", description: "Learn ISL signs for colors and basic geometric shapes" },
    { title: "Family Words", progress: 0, category: "vocab", icon: "👨‍👩‍👧‍👦", difficulty: "Easy", featured: false, isNew: true, lessons: 12, duration: "20 min", description: "ISL signs for family members — mother, father, sibling, etc." },
    { title: "School Words", progress: 0, category: "vocab", icon: "🏫", difficulty: "Easy", featured: false, lessons: 15, duration: "25 min", description: "Signs for school items, subjects, and classroom vocabulary" },
    { title: "Food & Drinks", progress: 0, category: "vocab", icon: "🍎", difficulty: "Easy", featured: false, isNew: true, lessons: 14, duration: "25 min", description: "Common food and drink signs — chai, roti, rice, water, etc." },
]

export default function LearnPage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const filtered = lessons.filter(l => {
        const matchesCategory = activeCategory === 'all' || l.category === activeCategory
        const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const featured = lessons.filter(l => l.featured)

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Learn <span className="gradient-text">Everything</span>
                </h1>
                <p className="text-gray-400">Visual lessons designed for Deaf students — ISL, Science, Math, and more</p>
            </motion.div>

            {/* Featured */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Featured Lessons
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featured.map((lesson, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ y: -4 }}
                            className="group"
                        >
                            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-pink-600/10 border border-white/10 hover:border-purple-500/30 transition-all h-full">
                                <div className="absolute top-3 right-3">
                                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                                        <Star className="w-3 h-3 mr-1 fill-amber-400" /> Featured
                                    </Badge>
                                </div>
                                <span className="text-4xl block mb-3">{lesson.icon}</span>
                                <h3 className="text-lg font-semibold text-white mb-1">{lesson.title}</h3>
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{lesson.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                    <span>{lesson.lessons} lessons</span>
                                    <span>{lesson.duration}</span>
                                </div>
                                {lesson.progress > 0 && (
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="text-white font-medium">{lesson.progress}%</span>
                                        </div>
                                        <Progress value={lesson.progress} className="h-1.5" />
                                    </div>
                                )}
                                <Button className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10" size="sm">
                                    {lesson.progress === 0 ? 'Start' : lesson.progress === 100 ? 'Review' : 'Continue'}
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat.id
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <cat.icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lessons Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory + searchQuery}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filtered.map((lesson, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            whileHover={{ y: -4 }}
                            className="group"
                        >
                            <div className="glass-card p-5 h-full hover:border-white/15 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-3xl">{lesson.icon}</span>
                                    <div className="flex gap-1.5">
                                        {lesson.isNew && (
                                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                                                NEW
                                            </Badge>
                                        )}
                                        <Badge className={`text-[10px] ${lesson.difficulty === 'Easy'
                                                ? 'bg-green-500/15 text-green-400 border-green-500/20'
                                                : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {lesson.difficulty}
                                        </Badge>
                                    </div>
                                </div>
                                <h3 className="text-base font-semibold text-white mb-1">{lesson.title}</h3>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{lesson.description}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                    <span>{lesson.lessons} lessons</span>
                                    <span>•</span>
                                    <span>{lesson.duration}</span>
                                </div>
                                {lesson.progress > 0 && (
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="text-white font-medium">{lesson.progress}%</span>
                                        </div>
                                        <Progress value={lesson.progress} className="h-1.5" />
                                    </div>
                                )}
                                <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10" size="sm">
                                    {lesson.progress === 0 ? 'Start Lesson' : lesson.progress === 100 ? 'Review' : 'Continue'}
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <Filter className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No lessons found matching your criteria</p>
                    <Button variant="ghost" className="mt-4 text-purple-400" onClick={() => { setActiveCategory('all'); setSearchQuery('') }}>
                        Clear Filters
                    </Button>
                </div>
            )}
        </AppLayout>
    )
}
