'use client'

import { motion } from 'framer-motion'
import {
    Users,
    Heart,
    ExternalLink,
    BookOpen,
    GraduationCap,
    MessageSquare,
    Globe,
    Hand,
    Star,
    Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'

const studentStories = [
    {
        name: "Aarav Sharma",
        age: 14,
        location: "New Delhi",
        story: "Before Silent Learn, I struggled in science class because everything was explained through audio. Now with AR lessons, I can see 3D models of planets and the human body. I scored 85% in my last science exam!",
        avatar: "A",
        badge: "Science Explorer"
    },
    {
        name: "Meera Patel",
        age: 12,
        location: "Mumbai",
        story: "I learned the complete ISL alphabet in just 2 weeks using the sign detection camera. The instant feedback helped me correct my hand positions. Now I teach my younger brother too!",
        avatar: "M",
        badge: "ISL Champion"
    },
    {
        name: "Rohan Kumar",
        age: 15,
        location: "Bangalore",
        story: "The quiz games make learning so much fun! I compete with my friends to see who gets the highest score. My vocabulary has improved a lot since I started using Silent Learn.",
        avatar: "R",
        badge: "Quiz Master"
    },
]

const resources = [
    {
        title: "Indian Sign Language Research & Training Centre (ISLRTC)",
        desc: "Government of India's national centre for ISL research, training, and development",
        url: "https://islrtc.nic.in",
        icon: <GraduationCap className="w-5 h-5" />,
        category: "Government"
    },
    {
        title: "National Association of the Deaf (NAD India)",
        desc: "Advocacy organization for Deaf rights and education in India",
        url: "https://nadfindia.org",
        icon: <Users className="w-5 h-5" />,
        category: "Organization"
    },
    {
        title: "Rights of Persons with Disabilities Act, 2016",
        desc: "Legal framework ensuring equal rights and education for Deaf persons in India",
        url: "https://disabilityaffairs.gov.in",
        icon: <BookOpen className="w-5 h-5" />,
        category: "Legal"
    },
    {
        title: "National Institute of Speech & Hearing (NISH)",
        desc: "Training and rehabilitation centre based in Kerala",
        url: "https://nish.ac.in",
        icon: <GraduationCap className="w-5 h-5" />,
        category: "Education"
    },
    {
        title: "Deaf Enabled Foundation",
        desc: "Non-profit empowering Deaf individuals through skill development and employment",
        url: "https://deafenabledfoundation.org",
        icon: <Heart className="w-5 h-5" />,
        category: "Non-profit"
    },
]

const parentTips = [
    "Practice ISL signs with your child daily — even 10 minutes helps!",
    "Use the AR QR codes together — it's a great bonding activity",
    "Celebrate every badge your child earns to keep them motivated",
    "Set up a regular learning schedule for best results",
    "Connect with other parents of Deaf children for support",
    "Ensure your child's school is aware of available visual learning tools",
]

export default function CommunityPage() {
    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Community & <span className="gradient-text-blue">Resources</span>
                </h1>
                <p className="text-gray-400">Student stories, helpful resources, and tips for parents & teachers</p>
            </motion.div>

            {/* Student Stories */}
            <div className="mb-10">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Student Success Stories
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {studentStories.map((student, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="glass-card p-5 h-full">
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed mb-4 italic">&ldquo;{student.story}&rdquo;</p>
                                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                                        {student.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{student.name}, {student.age}</p>
                                        <p className="text-xs text-gray-500">{student.location}</p>
                                    </div>
                                    <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/20 text-[10px] shrink-0">
                                        {student.badge}
                                    </Badge>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-10">
                {/* Resources */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Globe className="w-5 h-5 text-blue-400" />
                        Helpful Resources
                    </h2>
                    <div className="space-y-3">
                        {resources.map((resource, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ x: 4 }}
                            >
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                                    <div className="glass-card p-4 flex items-start gap-4 hover:border-blue-500/30 transition-all cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
                                            {resource.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors truncate">{resource.title}</h3>
                                                <ExternalLink className="w-3 h-3 text-gray-600 shrink-0" />
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2">{resource.desc}</p>
                                        </div>
                                        <Badge className="bg-white/5 text-gray-400 border-white/10 text-[10px] shrink-0">{resource.category}</Badge>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tips for Parents */}
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Heart className="w-5 h-5 text-pink-400" />
                        Tips for Parents
                    </h2>
                    <div className="glass-card p-5 space-y-3">
                        {parentTips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.08 }}
                                className="flex gap-3 items-start"
                            >
                                <span className="w-6 h-6 rounded-full bg-pink-500/15 flex items-center justify-center text-[10px] font-bold text-pink-400 shrink-0 mt-0.5">
                                    {index + 1}
                                </span>
                                <p className="text-sm text-gray-400 leading-relaxed">{tip}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-white/10">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/20 shrink-0">
                            <Hand className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">About Silent Learn</h2>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                Silent Learn is India&apos;s dedicated learning platform for Deaf students. We believe every child deserves
                                equal access to quality education, regardless of hearing ability. Our platform uses cutting-edge AI for
                                ISL sign detection, augmented reality for immersive science lessons, and gamification to make learning
                                engaging and fun — all completely visual, with no sound required.
                            </p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                We work closely with the Deaf community, educators, and ISL experts to ensure our content is accurate,
                                culturally relevant, and truly accessible. Silent Learn is built by a passionate team that envisions an
                                inclusive India where Deaf students can learn, grow, and thrive.
                            </p>
                            <div className="flex gap-3">
                                <Link href="/dashboard">
                                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0" size="sm">
                                        Start Learning
                                    </Button>
                                </Link>
                                <Link href="/dictionary">
                                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" size="sm">
                                        ISL Dictionary
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    )
}
