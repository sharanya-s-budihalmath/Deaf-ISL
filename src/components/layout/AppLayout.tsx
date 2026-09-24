'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    BookOpen,
    Hand,
    Gamepad2,
    Trophy,
    QrCode,
    Users,
    Camera,
    Search,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Sparkles,
    GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
    { href: '/learn', label: 'Learn', icon: BookOpen, color: 'from-emerald-500 to-green-500' },
    { href: '/dictionary', label: 'ISL Dictionary', icon: Search, color: 'from-teal-500 to-cyan-500' },
    { href: '/practice', label: 'Practice', icon: Hand, color: 'from-amber-500 to-orange-500' },
    { href: '/sign-detection', label: 'Sign Camera', icon: Camera, color: 'from-pink-500 to-rose-500' },
    { href: '/games', label: 'Games', icon: Gamepad2, color: 'from-cyan-500 to-blue-500' },
    { href: '/progress', label: 'Progress', icon: Trophy, color: 'from-yellow-500 to-amber-500' },
    { href: '/qr-codes', label: 'AR / QR Codes', icon: QrCode, color: 'from-orange-500 to-red-500' },
    { href: '/community', label: 'Community', icon: Users, color: 'from-teal-500 to-cyan-500' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Hand className="w-5 h-5 text-white" />
                </div>
                <AnimatePresence>
                    {(!collapsed || isMobile) && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="overflow-hidden whitespace-nowrap"
                        >
                            <h1 className="text-lg font-bold text-white">Silent Learn</h1>
                            <p className="text-[10px] text-teal-300/70 -mt-0.5">Learning for Everyone</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Student Profile */}
            <div className={`mx-3 mb-4 p-3 rounded-xl glass-card ${collapsed && !isMobile ? 'items-center' : ''}`}>
                <div className={`flex items-center gap-3 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
                    <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                        S
                    </div>
                    {(!collapsed || isMobile) && (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">Student</p>
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span className="text-xs text-amber-300">450 XP</span>
                            </div>
                        </div>
                    )}
                </div>
                {(!collapsed || isMobile) && (
                    <div className="mt-2.5">
                        <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-gray-400">Level 5</span>
                            <span className="text-teal-300">Level 6</span>
                        </div>
                        <Progress value={65} className="h-1.5" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => isMobile && setMobileOpen(false)}
                        >
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    } ${collapsed && !isMobile ? 'justify-center' : ''}`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                                {(!collapsed || isMobile) && (
                                    <span className="text-sm font-medium truncate">{item.label}</span>
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom: Home link */}
            <div className="p-3 border-t border-white/5">
                <Link href="/">
                    <motion.div
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all ${collapsed && !isMobile ? 'justify-center' : ''
                            }`}
                    >
                        <GraduationCap className="w-5 h-5 shrink-0" />
                        {(!collapsed || isMobile) && <span className="text-sm font-medium">Home Page</span>}
                    </motion.div>
                </Link>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a]">
            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 256 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 bg-[#0d0d24]/90 border-r border-white/5"
            >
                <SidebarContent />
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-600 transition-colors"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </motion.aside>

            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass-strong flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Hand className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white">Silent Learn</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="text-white hover:bg-white/10"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/60 z-40"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed top-0 left-0 h-screen w-[280px] z-50 bg-[#0d0d24] border-r border-white/5"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main
                className={`flex-1 min-h-screen transition-all duration-200 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[256px]'
                    } pt-14 lg:pt-0`}
            >
                <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
