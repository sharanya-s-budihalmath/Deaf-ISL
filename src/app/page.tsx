'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Hand,
  Camera,
  BookOpen,
  QrCode,
  Users,
  Accessibility,
  ChevronRight,
  Star,
  Play,
  Eye,
  VolumeX,
  Sparkles,
  Trophy,
  Gamepad2,
  ArrowRight,
  Heart,
  GraduationCap,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const start = 0
          const startTime = Date.now()
          const tick = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(start + (end - start) * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          tick()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return { count, ref }
}

export default function Home() {
  const stat1 = useCounter(500)
  const stat2 = useCounter(50)
  const stat3 = useCounter(26)
  const stat4 = useCounter(10)

  const features = [
    {
      icon: <Camera className="w-7 h-7" />,
      title: "ISL Sign Detection",
      description: "Real-time Indian Sign Language recognition using your camera with AI-powered feedback",
      gradient: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/20"
    },
    {
      icon: <QrCode className="w-7 h-7" />,
      title: "AR Learning",
      description: "Scan QR codes to explore 3D models of planets, human body, and more in augmented reality",
      gradient: "from-orange-500 to-amber-400",
      shadow: "shadow-orange-500/20"
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "Visual Lessons",
      description: "Learn with pictures, animations, and interactive content — completely sound-free",
      gradient: "from-emerald-500 to-green-400",
      shadow: "shadow-emerald-500/20"
    },
    {
      icon: <Gamepad2 className="w-7 h-7" />,
      title: "Fun Games",
      description: "Memory match, quizzes, and flashcard games to reinforce ISL learning through play",
      gradient: "from-pink-500 to-rose-400",
      shadow: "shadow-pink-500/20"
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: "Achievements",
      description: "Earn XP, unlock badges, and track streaks as you master new signs and lessons",
      gradient: "from-yellow-500 to-amber-400",
      shadow: "shadow-yellow-500/20"
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Community",
      description: "Connect with fellow learners, share progress, and find resources for parents & teachers",
      gradient: "from-teal-500 to-cyan-400",
      shadow: "shadow-teal-500/20"
    }
  ]

  const steps = [
    {
      icon: <Eye className="w-7 h-7" />,
      title: "Watch & Learn",
      desc: "Explore visual lessons, ISL dictionary, and AR experiences. Everything is designed without sound.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Hand className="w-7 h-7" />,
      title: "Practice Signs",
      desc: "Use the camera to practice ISL signs. Our AI detects your hand gestures and gives instant feedback.",
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: "Master & Earn",
      desc: "Complete lessons, take quizzes, and earn badges. Track your progress and level up your skills!",
      gradient: "from-amber-500 to-orange-500"
    }
  ]

  const testimonials = [
    {
      name: "Priya S.",
      role: "Class 8 Student, Delhi",
      text: "Silent Learn helped me learn ISL alphabets in just one week! The camera detection is so cool — it tells me if I'm doing the sign right!",
      avatar: "P"
    },
    {
      name: "Rajesh K.",
      role: "Teacher, Mumbai School for Deaf",
      text: "My students love the AR learning feature. Scanning QR codes to see 3D planets makes science class so exciting for them.",
      avatar: "R"
    },
    {
      name: "Ananya M.",
      role: "Parent, Bangalore",
      text: "Finally a platform that doesn't rely on audio! My daughter can learn at her own pace with visual lessons and games.",
      avatar: "A"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#071a1e] to-[#050510] overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] bg-teal-600/8 rounded-full blur-[80px] animate-glow-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Hand className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Silent Learn</h1>
              <p className="text-[10px] text-teal-300/60 font-medium tracking-wider uppercase">India&apos;s Deaf Learning Platform</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Link href="/dictionary">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5 hidden sm:flex">
                ISL Dictionary
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 border-0">
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Accessibility className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">100% Visual • No Sound Required</span>
            <VolumeX className="w-4 h-4 text-emerald-400" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Learn Without
            <br />
            <span className="gradient-text-warm">Sound Barriers</span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            India&apos;s first comprehensive learning platform for Deaf students.
            Master ISL, explore AR science lessons, and learn through
            <span className="text-white font-medium"> interactive visual experiences</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 hover:from-teal-600 hover:via-cyan-600 hover:to-sky-600 text-white text-lg px-8 py-6 h-auto shadow-xl shadow-teal-500/25 border-0 animate-gradient">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/sign-detection">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 text-lg px-8 py-6 h-auto bg-white/[0.02]">
                  <Camera className="w-5 h-5 mr-2" />
                  Try Sign Detection
                </Button>
              </motion.div>
            </Link>
          </div>

          <p className="text-xs text-gray-500">Free to use • Made for Indian Deaf students • No login required</p>
        </motion.div>

        {/* Floating Elements */}
        <div className="hidden md:block">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-32 left-[8%] text-5xl"
          >
            ✋
          </motion.div>
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-48 right-[8%] text-5xl"
          >
            🤟
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-32 left-[12%] text-4xl"
          >
            🌍
          </motion.div>
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-40 right-[15%] text-4xl"
          >
            📚
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Everything You Need to <span className="gradient-text">Learn</span>
          </h3>
          <p className="text-gray-400 max-w-lg mx-auto">
            A complete learning ecosystem designed from the ground up for Deaf students in India
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className={`glass-card p-6 h-full hover:border-white/15 transition-all duration-300 ${feature.shadow}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { ...stat1, suffix: '+', label: 'Students Learning', icon: <Users className="w-5 h-5" /> },
            { ...stat2, suffix: '+', label: 'Visual Lessons', icon: <BookOpen className="w-5 h-5" /> },
            { ...stat3, suffix: '', label: 'ISL Letters', icon: <Hand className="w-5 h-5" /> },
            { ...stat4, suffix: '+', label: 'AR Experiences', icon: <Globe className="w-5 h-5" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              ref={stat.ref}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-5 text-center"
            >
              <div className="text-teal-400 mx-auto mb-2 flex justify-center">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.count}{stat.suffix}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            How It <span className="gradient-text-blue">Works</span>
          </h3>
          <p className="text-gray-400">Three simple steps to start your learning journey</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="glass-card p-6 text-center h-full">
                <div className="text-xs font-bold text-teal-400/60 uppercase tracking-widest mb-3">
                  Step {index + 1}
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg text-white`}>
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
              {index < 2 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-5 h-5 text-teal-500/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Loved by <span className="gradient-text-warm">Students & Teachers</span>
          </h3>
          <p className="text-gray-400">See what our community is saying</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="glass-card p-6 h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-teal-600/20 via-cyan-600/20 to-sky-600/20 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 animate-gradient" />
            <div className="relative">
              <GraduationCap className="w-12 h-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to Start Learning?
              </h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join hundreds of students who are mastering ISL, exploring AR lessons,
                and building knowledge — all visually!
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-10 py-6 h-auto shadow-xl shadow-emerald-500/20 border-0">
                  <Play className="w-5 h-5 mr-2" />
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Hand className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-medium text-gray-400">Silent Learn</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/dictionary" className="hover:text-white transition-colors">Dictionary</Link>
              <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for Deaf Students in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
