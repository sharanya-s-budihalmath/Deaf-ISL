'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QrCode, Download, Loader2 } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'

interface QRCodeItem {
    code: string
    name: string
    description: string
    targetUrl: string
    qrCode: string
}

export default function QRCodesPage() {
    const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchQRCodes() {
            try {
                const response = await fetch('/api/qr-generate')
                const data = await response.json()
                if (data.success) {
                    setQrCodes(data.qrCodes)
                } else {
                    setError('Failed to load QR codes')
                }
            } catch {
                setError('Failed to fetch QR codes')
            } finally {
                setLoading(false)
            }
        }
        fetchQRCodes()
    }, [])

    const downloadQR = (qrCode: string, name: string) => {
        const link = document.createElement('a')
        link.href = qrCode
        link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-qr.png`
        link.click()
    }

    const iconMap: Record<string, string> = {
        'SOLAR-001': '🌍',
        'BODY-001': '🧍',
        'ANIMAL-001': '🦁',
        'PLANT-001': '🌱',
        'GEOM-001': '📐',
        'WATER-001': '💧',
    }

    return (
        <AppLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mb-1">
                    <QrCode className="w-7 h-7 text-orange-400" />
                    AR Learning <span className="gradient-text-warm">QR Codes</span>
                </h1>
                <p className="text-gray-400">
                    Scan these QR codes with your phone to launch augmented reality learning experiences
                </p>
            </motion.div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                    <span className="ml-3 text-gray-400">Loading QR codes...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-20">
                    <p className="text-red-400 text-lg">{error}</p>
                    <Button
                        className="mt-4 bg-teal-600 hover:bg-teal-700"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* QR Codes Grid */}
            {!loading && !error && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {qrCodes.map((qr, index) => (
                        <motion.div
                            key={qr.code}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="glass-card p-5 hover:border-orange-500/30 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-4xl">{iconMap[qr.code] || '📱'}</span>
                                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                        {qr.code}
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">{qr.name}</h3>
                                <p className="text-sm text-gray-400 mb-4">{qr.description}</p>

                                {/* QR Code Image */}
                                <div className="bg-white rounded-xl p-4 mb-4 flex items-center justify-center">
                                    <img
                                        src={qr.qrCode}
                                        alt={`QR Code for ${qr.name}`}
                                        className="w-44 h-44"
                                    />
                                </div>

                                <p className="text-xs text-gray-600 text-center mb-4 truncate">
                                    {qr.targetUrl}
                                </p>

                                <Button
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
                                    onClick={() => downloadQR(qr.qrCode, qr.name)}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download QR Code
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Instructions */}
            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 glass-card p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-3">
                        📱 How to use these QR Codes
                    </h3>
                    <ol className="space-y-2 text-gray-400 text-sm">
                        <li className="flex gap-3"><span className="text-teal-400 font-bold">1.</span> Download or scan any QR code above</li>
                        <li className="flex gap-3"><span className="text-teal-400 font-bold">2.</span> Open your phone camera and point it at the QR code</li>
                        <li className="flex gap-3"><span className="text-teal-400 font-bold">3.</span> Tap the link that appears to open the AR experience</li>
                        <li className="flex gap-3"><span className="text-teal-400 font-bold">4.</span> Point your phone at a flat surface to place the 3D model</li>
                    </ol>
                </motion.div>
            )}
        </AppLayout>
    )
}
