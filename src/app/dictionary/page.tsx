'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Hand,
    Hash,
    MessageCircle,
    Heart,
    Smile,
    Camera,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'

const dictionaryCategories = [
    { id: 'alphabet', label: 'Alphabet', icon: Hand, count: 26 },
    { id: 'numbers', label: 'Numbers', icon: Hash, count: 20 },
    { id: 'greetings', label: 'Greetings', icon: MessageCircle, count: 10 },
    { id: 'emotions', label: 'Emotions', icon: Smile, count: 12 },
    { id: 'daily', label: 'Daily Words', icon: Heart, count: 30 },
]

const alphabetSigns = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => ({
    letter,
    category: 'alphabet',
    hint: `Form the ISL sign for "${letter}"`,
    learned: i < 18,
}))

const numberSigns = Array.from({ length: 20 }, (_, i) => ({
    letter: String(i + 1),
    category: 'numbers',
    hint: `Show ${i + 1} using ISL number sign`,
    learned: i < 10,
}))

const greetingSigns = [
    { letter: 'Namaste', category: 'greetings', hint: 'Join both palms together', learned: true },
    { letter: 'Thank You', category: 'greetings', hint: 'Touch chin and move hand forward', learned: true },
    { letter: 'Please', category: 'greetings', hint: 'Open palm gesture forward', learned: true },
    { letter: 'Sorry', category: 'greetings', hint: 'Fist on chest in circular motion', learned: false },
    { letter: 'Hello', category: 'greetings', hint: 'Wave with open hand', learned: true },
    { letter: 'Goodbye', category: 'greetings', hint: 'Wave hand side to side', learned: false },
    { letter: 'Yes', category: 'greetings', hint: 'Nod fist up and down', learned: true },
    { letter: 'No', category: 'greetings', hint: 'Extend index and middle finger, close them', learned: false },
    { letter: 'Help', category: 'greetings', hint: 'Thumbs up on open palm, lift up', learned: false },
    { letter: 'Good', category: 'greetings', hint: 'Thumbs up gesture', learned: true },
]

const emotionSigns = [
    { letter: 'Happy', category: 'emotions', hint: 'Brush palm up chest repeatedly', learned: true },
    { letter: 'Sad', category: 'emotions', hint: 'Drag fingers down face', learned: false },
    { letter: 'Angry', category: 'emotions', hint: 'Claw hands pulled from face', learned: false },
    { letter: 'Scared', category: 'emotions', hint: 'Fists open outward quickly', learned: false },
    { letter: 'Love', category: 'emotions', hint: 'Cross arms over chest', learned: true },
    { letter: 'Surprised', category: 'emotions', hint: 'Open fists near eyes', learned: false },
    { letter: 'Tired', category: 'emotions', hint: 'Fingers drop from chest', learned: false },
    { letter: 'Excited', category: 'emotions', hint: 'Alternating hands brush up chest', learned: false },
    { letter: 'Worried', category: 'emotions', hint: 'Alternating flat hands rotate near forehead', learned: false },
    { letter: 'Proud', category: 'emotions', hint: 'Thumb slides up chest', learned: false },
    { letter: 'Confused', category: 'emotions', hint: 'Claw hand rotates near forehead', learned: false },
    { letter: 'Calm', category: 'emotions', hint: 'Both palms press down slowly', learned: false },
]

const dailySigns = [
    { letter: 'Water', category: 'daily', hint: 'W-hand taps chin', learned: true },
    { letter: 'Food', category: 'daily', hint: 'Fingertips tap mouth', learned: true },
    { letter: 'Home', category: 'daily', hint: 'Flat hand by cheek + roof shape', learned: true },
    { letter: 'School', category: 'daily', hint: 'Clapping motion', learned: true },
    { letter: 'Book', category: 'daily', hint: 'Open palms like opening book', learned: true },
    { letter: 'Friend', category: 'daily', hint: 'Hooked index fingers together', learned: false },
    { letter: 'Mother', category: 'daily', hint: 'Open hand taps chin', learned: true },
    { letter: 'Father', category: 'daily', hint: 'Open hand taps forehead', learned: true },
    { letter: 'Teacher', category: 'daily', hint: 'Flat hands move forward from temples', learned: false },
    { letter: 'Time', category: 'daily', hint: 'Point to wrist', learned: false },
    { letter: 'Day', category: 'daily', hint: 'Index finger arcs overhead', learned: false },
    { letter: 'Night', category: 'daily', hint: 'Flat hand drops over other forearm', learned: false },
    { letter: 'Morning', category: 'daily', hint: 'Flat hand rises from other forearm', learned: false },
    { letter: 'Eat', category: 'daily', hint: 'Fingertips to mouth repeatedly', learned: true },
    { letter: 'Drink', category: 'daily', hint: 'C-hand tips toward mouth', learned: true },
    { letter: 'Sleep', category: 'daily', hint: 'Hand closes by tilting head', learned: false },
    { letter: 'Walk', category: 'daily', hint: 'Two fingers walk on other palm', learned: false },
    { letter: 'Read', category: 'daily', hint: 'V-hand moves across other palm', learned: false },
    { letter: 'Write', category: 'daily', hint: 'Pinch hand writes on other palm', learned: false },
    { letter: 'Play', category: 'daily', hint: 'Y-hands shake', learned: false },
    { letter: 'Today', category: 'daily', hint: 'Both palms drop in front of body', learned: false },
    { letter: 'Tomorrow', category: 'daily', hint: 'Thumb on cheek pivots forward', learned: false },
    { letter: 'Big', category: 'daily', hint: 'L-hands move apart', learned: false },
    { letter: 'Small', category: 'daily', hint: 'Flat hands move together', learned: false },
    { letter: 'Come', category: 'daily', hint: 'Index finger beckons', learned: false },
    { letter: 'Go', category: 'daily', hint: 'Index fingers point and arc away', learned: false },
    { letter: 'Stop', category: 'daily', hint: 'Flat hand chops onto other palm', learned: false },
    { letter: 'Bath', category: 'daily', hint: 'Fists rub chest up and down', learned: false },
    { letter: 'Clothes', category: 'daily', hint: 'Thumbs brush down chest', learned: false },
    { letter: 'Rain', category: 'daily', hint: 'Claw hands descend repeatedly', learned: false },
]

const allSigns = [...alphabetSigns, ...numberSigns, ...greetingSigns, ...emotionSigns, ...dailySigns]

export default function DictionaryPage() {
    const [activeCategory, setActiveCategory] = useState('alphabet')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSign, setSelectedSign] = useState<string | null>(null)

    const filtered = allSigns.filter(s => {
        const matchesCategory = s.category === activeCategory
        const matchesSearch = searchQuery === '' || s.letter.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && (searchQuery === '' ? true : matchesSearch)
    })

    // If searching, show all matching items regardless of category
    const displayItems = searchQuery
        ? allSigns.filter(s => s.letter.toLowerCase().includes(searchQuery.toLowerCase()))
        : filtered

    const selected = selectedSign ? allSigns.find(s => s.letter === selectedSign) : null

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    ISL <span className="gradient-text-blue">Dictionary</span>
                </h1>
                <p className="text-gray-400">Browse and learn Indian Sign Language signs — Alphabet, Numbers, Greetings, and more</p>
            </motion.div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search any sign... (e.g., 'Namaste', 'A', 'Water')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-base focus:outline-none focus:border-teal-500/50 transition-colors"
                />
            </div>

            {/* Category Tabs */}
            {!searchQuery && (
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {dictionaryCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); setSelectedSign(null) }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20'
                                : 'glass text-gray-400 hover:text-white'
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20' : 'bg-white/5'
                                }`}>
                                {cat.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Signs Grid */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory + searchQuery}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`grid gap-2 ${activeCategory === 'alphabet' && !searchQuery
                                ? 'grid-cols-5 sm:grid-cols-7 md:grid-cols-9'
                                : activeCategory === 'numbers' && !searchQuery
                                    ? 'grid-cols-5 sm:grid-cols-7 md:grid-cols-10'
                                    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                                }`}
                        >
                            {displayItems.map((sign, index) => {
                                const isAlphaOrNumber = sign.category === 'alphabet' || sign.category === 'numbers'
                                const isSelected = selectedSign === sign.letter
                                return (
                                    <motion.button
                                        key={sign.letter + sign.category}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.015 }}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedSign(isSelected ? null : sign.letter)}
                                        className={`relative rounded-xl p-3 text-center transition-all ${isSelected
                                            ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/50'
                                            : sign.learned
                                                ? 'glass-card text-white hover:border-teal-500/30'
                                                : 'glass-card text-gray-500 hover:border-white/15'
                                            } ${isAlphaOrNumber && !searchQuery ? 'aspect-square flex items-center justify-center' : ''}`}
                                    >
                                        <span className={`font-bold ${isAlphaOrNumber && !searchQuery ? 'text-xl' : 'text-sm'}`}>
                                            {sign.letter}
                                        </span>
                                        {sign.learned && !isSelected && (
                                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                                        )}
                                    </motion.button>
                                )
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        {selected ? (
                            <motion.div
                                key={selected.letter}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-teal-500/20">
                                    <span className="text-4xl font-bold text-white">{selected.letter}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {selected.category === 'alphabet' ? `Letter ${selected.letter}` : selected.letter}
                                </h3>
                                <Badge className={`mb-4 ${selected.learned
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                    }`}>
                                    {selected.learned ? '✓ Learned' : 'Not learned yet'}
                                </Badge>
                                <div className="glass p-4 rounded-xl mb-4 text-left">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">How to sign</p>
                                    <p className="text-sm text-gray-300">{selected.hint}</p>
                                </div>
                                <Link href="/practice">
                                    <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0">
                                        <Camera className="w-4 h-4 mr-2" />
                                        Practice This Sign
                                    </Button>
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="text-center py-8">
                                <Hand className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-400 mb-1">Select a Sign</h3>
                                <p className="text-sm text-gray-600">Click any letter or word to see details and practice</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
