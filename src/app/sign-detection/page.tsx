'use client'

import SignDetection from '@/components/sign/SignDetection'
import AppLayout from '@/components/layout/AppLayout'

export default function SignDetectionPage() {
    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Sign <span className="gradient-text-blue">Detection Camera</span>
                </h1>
                <p className="text-gray-400">Show your hand signs to the camera and get real-time ISL recognition</p>
            </div>
            <SignDetection />
        </AppLayout>
    )
}
