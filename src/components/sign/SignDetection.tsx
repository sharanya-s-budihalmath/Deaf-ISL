'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Camera,
  CameraOff,
  Hand,
  Sparkles,
  Wifi,
  WifiOff,
  Trash2,
  Activity,
  Zap,
  Eye,
  Type,
} from 'lucide-react'

// ========== MediaPipe 21 Hand Landmark Connections ==========
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
]

const FINGER_COLORS: Record<string, string> = {
  wrist: '#ffffff',
  thumb: '#ff6b6b',
  index: '#ffd93d',
  middle: '#6bcb77',
  ring: '#4d96ff',
  pinky: '#9b59b6',
}

function getLandmarkColor(i: number): string {
  if (i === 0) return FINGER_COLORS.wrist
  if (i <= 4) return FINGER_COLORS.thumb
  if (i <= 8) return FINGER_COLORS.index
  if (i <= 12) return FINGER_COLORS.middle
  if (i <= 16) return FINGER_COLORS.ring
  return FINGER_COLORS.pinky
}

function getConnectionColor(a: number, b: number): string {
  const m = Math.max(a, b)
  if (m <= 4) return FINGER_COLORS.thumb
  if (m <= 8) return FINGER_COLORS.index
  if (m <= 12) return FINGER_COLORS.middle
  if (m <= 16) return FINGER_COLORS.ring
  return FINGER_COLORS.pinky
}

const LANDMARK_NAMES = [
  'Wrist',
  'Thumb CMC', 'Thumb MCP', 'Thumb IP', 'Thumb Tip',
  'Index MCP', 'Index PIP', 'Index DIP', 'Index Tip',
  'Middle MCP', 'Middle PIP', 'Middle DIP', 'Middle Tip',
  'Ring MCP', 'Ring PIP', 'Ring DIP', 'Ring Tip',
  'Pinky MCP', 'Pinky PIP', 'Pinky DIP', 'Pinky Tip',
]

// ========== Types ==========
interface LandmarkPoint {
  x: number
  y: number
  z: number
}

interface DetectionResult {
  letter: string
  confidence: number
  timestamp: Date
  source: string
}

interface BackendStatus {
  connected: boolean
  modelLoaded: boolean
  handDetectorLoaded: boolean
  labelsCount: number
}

// ========== Draw landmarks on canvas ==========
function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: LandmarkPoint[],
  w: number,
  h: number,
  mirrored: boolean
) {
  ctx.clearRect(0, 0, w, h)
  if (!landmarks || landmarks.length < 21) return

  // Draw bones
  ctx.lineWidth = 3
  for (const [a, b] of HAND_CONNECTIONS) {
    const la = landmarks[a], lb = landmarks[b]
    const ax = mirrored ? (1 - la.x) * w : la.x * w
    const ay = la.y * h
    const bx = mirrored ? (1 - lb.x) * w : lb.x * w
    const by = lb.y * h

    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.strokeStyle = getConnectionColor(a, b)
    ctx.globalAlpha = 0.7
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Draw joints
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i]
    const x = mirrored ? (1 - lm.x) * w : lm.x * w
    const y = lm.y * h
    const col = getLandmarkColor(i)

    // Glow
    ctx.beginPath()
    ctx.arc(x, y, 9, 0, Math.PI * 2)
    ctx.fillStyle = col
    ctx.globalAlpha = 0.25
    ctx.fill()

    // Dot
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = col
    ctx.fill()

    // Center
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
  }
}

// ========== Confidence Gauge ==========
function ConfidenceGauge({ value, size = 100 }: { value: number; size?: number }) {
  const pct = Math.round(value * 100)
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const off = circ - value * circ
  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span key={pct} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-bold text-white">
          {pct}%
        </motion.span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Confidence</span>
      </div>
    </div>
  )
}

// ========== Main Component ==========
export default function SignDetection() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handLandmarkerRef = useRef<any>(null)
  const animFrameRef = useRef<number>(0)
  const lastVideoTimeRef = useRef<number>(-1)

  const [isCameraOn, setIsCameraOn] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [mediapipeReady, setMediapipeReady] = useState(false)
  const [handDetected, setHandDetected] = useState(false)
  const [handsCount, setHandsCount] = useState(0)
  const [liveLandmarks, setLiveLandmarks] = useState<LandmarkPoint[] | null>(null)

  const [predictedLetter, setPredictedLetter] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [description, setDescription] = useState('')
  const [tips, setTips] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [word, setWord] = useState('')
  const [detectionHistory, setDetectionHistory] = useState<DetectionResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [processingTime, setProcessingTime] = useState(0)
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    connected: false, modelLoaded: false, handDetectorLoaded: false, labelsCount: 0,
  })

  // ===== Backend health check =====
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/predict-sign', { cache: 'no-store' })
        const data = await res.json()
        setBackendStatus({
          connected: data.backendStatus === 'connected',
          modelLoaded: data.modelLoaded ?? false,
          handDetectorLoaded: data.handDetectorLoaded ?? false,
          labelsCount: data.labelsCount ?? 0,
        })
        if (data.backendStatus === 'connected') setError(null)
      } catch {
        setBackendStatus({ connected: false, modelLoaded: false, handDetectorLoaded: false, labelsCount: 0 })
      }
    }
    check()
    const iv = setInterval(check, 15000)
    return () => clearInterval(iv)
  }, [])

  // ===== Initialize MediaPipe HandLandmarker in the browser =====
  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const vision = await import('@mediapipe/tasks-vision')
        const { HandLandmarker, FilesetResolver } = vision

        const fileset = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        const landmarker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.3,
          minHandPresenceConfidence: 0.3,
          minTrackingConfidence: 0.3,
        })

        if (!cancelled) {
          handLandmarkerRef.current = landmarker
          setMediapipeReady(true)
        }
      } catch (err) {
        console.error('MediaPipe init error:', err)
        if (!cancelled) setError('Failed to load MediaPipe hand detection model')
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  // ===== Real-time detection loop =====
  const detectLoop = useCallback(() => {
    const video = webcamRef.current?.video
    const canvas = canvasRef.current
    const landmarker = handLandmarkerRef.current

    if (!video || !canvas || !landmarker || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detectLoop)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      animFrameRef.current = requestAnimationFrame(detectLoop)
      return
    }

    // Resize canvas to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }

    const now = performance.now()

    // Only process if we have a new frame
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime

      try {
        const results = landmarker.detectForVideo(video, now)

        if (results.landmarks && results.landmarks.length > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw landmarks for ALL detected hands
          for (let h = 0; h < results.landmarks.length; h++) {
            const lms: LandmarkPoint[] = results.landmarks[h].map((lm: any) => ({
              x: lm.x, y: lm.y, z: lm.z,
            }))
            drawLandmarks(ctx, lms, canvas.width, canvas.height, true)
          }

          const firstHandLms: LandmarkPoint[] = results.landmarks[0].map((lm: any) => ({
            x: lm.x, y: lm.y, z: lm.z,
          }))
          setHandDetected(true)
          setHandsCount(results.landmarks.length)
          setLiveLandmarks(firstHandLms)
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          setHandDetected(false)
          setHandsCount(0)
          setLiveLandmarks(null)
        }
      } catch (e) {
        // Silently ignore occasional detection errors
      }
    }

    animFrameRef.current = requestAnimationFrame(detectLoop)
  }, [])

  // Start/stop detection loop based on camera state
  useEffect(() => {
    if (isCameraOn && cameraReady && mediapipeReady) {
      lastVideoTimeRef.current = -1
      animFrameRef.current = requestAnimationFrame(detectLoop)
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isCameraOn, cameraReady, mediapipeReady, detectLoop])

  // ===== Periodic backend prediction (every 1s) =====
  const captureAndPredict = useCallback(async () => {
    if (!webcamRef.current || isProcessing || !backendStatus.connected) return
    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    setIsProcessing(true)
    try {
      const res = await fetch('/api/predict-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc }),
      })
      const data = await res.json()

      if (data.success) {
        setPredictedLetter(data.predictedLetter)
        setConfidence(data.confidence)
        setDescription(data.description || '')
        setTips(data.tips || '')
        setProcessingTime(data.processingTimeMs || 0)
        setError(null)

        if (data.predictedLetter && data.predictedLetter !== '?') {
          setDetectionHistory(prev => [{
            letter: data.predictedLetter,
            confidence: data.confidence,
            timestamp: new Date(),
            source: data.source,
          }, ...prev].slice(0, 20))
        }
      } else {
        if (data.error) setError(data.error)
      }
    } catch {
      setError('Network error — is the ML backend running?')
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing, backendStatus.connected])

  useEffect(() => {
    if (!isCameraOn || !backendStatus.connected) return
    const iv = setInterval(captureAndPredict, 1000)
    return () => clearInterval(iv)
  }, [isCameraOn, captureAndPredict, backendStatus.connected])

  // ===== Word controls =====
  const addLetterToWord = () => {
    if (predictedLetter && predictedLetter !== '?') setWord(prev => prev + predictedLetter)
  }
  const addSpaceToWord = () => setWord(prev => prev + ' ')
  const clearWord = () => setWord('')
  const backspaceWord = () => setWord(prev => prev.slice(0, -1))

  // ===== Camera controls =====
  const startCamera = () => {
    setIsCameraOn(true)
    setError(null)
  }
  const stopCamera = () => {
    setIsCameraOn(false)
    setCameraReady(false)
    setPredictedLetter(null)
    setConfidence(0)
    setHandDetected(false)
    setHandsCount(0)
    setLiveLandmarks(null)
    setDescription('')
    setTips('')
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const onCameraReady = () => setCameraReady(true)

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Hand className="w-5 h-5 text-white" />
            </div>
            ISL Sign Detection
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Real-time ISL recognition &bull; <strong className="text-yellow-400">Use your RIGHT hand</strong> &bull; 21-point MediaPipe tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* MediaPipe Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${mediapipeReady
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
            }`}>
            <Eye className="w-3.5 h-3.5" />
            {mediapipeReady ? 'Hand Tracking Ready' : 'Loading MediaPipe...'}
          </div>
          {/* Backend Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${backendStatus.connected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
            {backendStatus.connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {backendStatus.connected ? 'ML Backend Connected' : 'ML Backend Offline'}
          </div>
          {backendStatus.connected && (
            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">{backendStatus.labelsCount} classes</Badge>
          )}
        </div>
      </div>

      {/* ===== Error Banner ===== */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ===== Camera + Canvas (2 cols) ===== */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-slate-800/60 border-white/10 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                {isCameraOn ? (
                  <>
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                      mirrored
                      onUserMedia={onCameraReady}
                      videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
                    />
                    {/* Canvas overlay for real-time hand landmarks */}
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 10 }}
                    />

                    {/* Top-left indicators */}
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <div className={`w-2 h-2 rounded-full ${handDetected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                        <span className={`text-xs font-medium ${handDetected ? 'text-green-300' : 'text-yellow-300'}`}>
                          {handDetected ? `✋ ${handsCount} Hand${handsCount > 1 ? 's' : ''} Detected` : '👉 Show Your Hands'}
                        </span>
                      </div>
                      {isProcessing && (
                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full" />
                          <span className="text-xs text-teal-300 font-medium">Classifying...</span>
                        </div>
                      )}
                    </div>

                    {/* Top-right stats */}
                    <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
                      {handDetected && (
                        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span className="text-xs text-cyan-300 font-medium">{handsCount * 21} Points Tracked ({handsCount} hand{handsCount > 1 ? 's' : ''})</span>
                        </div>
                      )}
                      {processingTime > 0 && (
                        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-300 font-medium">{processingTime.toFixed(0)}ms</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom-left: predicted letter */}
                    {predictedLetter && predictedLetter !== '?' && (
                      <div className="absolute bottom-3 left-3 z-20">
                        <motion.div key={predictedLetter} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3">
                          <span className="text-4xl font-black text-white">{predictedLetter}</span>
                          <div>
                            <span className="text-sm font-semibold text-teal-300">{Math.round(confidence * 100)}%</span>
                            <p className="text-[10px] text-gray-400 max-w-[150px] truncate">{description}</p>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center mb-4">
                      <Camera className="w-10 h-10 text-teal-400" />
                    </div>
                    <p className="text-lg text-gray-300 font-medium mb-2">Camera is ready</p>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 mb-2 max-w-xs">
                      <p className="text-sm text-yellow-400 font-medium text-center">✋ Show <strong>one or both hands</strong> for ISL signs</p>
                      <p className="text-xs text-yellow-400/60 text-center mt-0.5">Some letters need two hands — both will be tracked</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-1 max-w-xs text-center">
                      {mediapipeReady ? '✅ Hand tracking model loaded' : '⏳ Loading hand tracking model...'}
                    </p>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs text-center">
                      {backendStatus.connected ? '✅ ML backend connected' : '⚠️ Start ML backend: python app.py'}
                    </p>
                    <Button onClick={startCamera} disabled={!mediapipeReady}
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-2">
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                )}
              </div>

              {/* Controls bar */}
              {isCameraOn && (
                <div className="px-4 py-3 bg-slate-800/80 border-t border-white/5 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={stopCamera}
                      className="border-red-500/40 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                      <CameraOff className="w-4 h-4 mr-1.5" /> Stop
                    </Button>
                    <Button variant="outline" size="sm" onClick={captureAndPredict} disabled={isProcessing}
                      className="border-teal-500/40 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300">
                      <Sparkles className="w-4 h-4 mr-1.5" /> Detect Now
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Activity className="w-3.5 h-3.5" />
                    Hand tracking: real-time &bull; Classification: every 1s
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ===== Word Builder ===== */}
          <Card className="bg-slate-800/60 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-semibold text-white">Word Builder</span>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={addLetterToWord}
                    disabled={!predictedLetter || predictedLetter === '?'}
                    className="border-teal-500/40 text-teal-400 hover:bg-teal-500/20 text-xs h-7 px-2">
                    Add &ldquo;{predictedLetter || '-'}&rdquo;
                  </Button>
                  <Button variant="outline" size="sm" onClick={addSpaceToWord}
                    className="border-gray-600 text-gray-400 hover:bg-white/10 text-xs h-7 px-2">
                    Space
                  </Button>
                  <Button variant="outline" size="sm" onClick={backspaceWord}
                    className="border-gray-600 text-gray-400 hover:bg-white/10 text-xs h-7 px-2">
                    ←
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearWord}
                    className="border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs h-7 px-2">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="bg-slate-900/80 rounded-lg px-4 py-3 min-h-[48px] border border-white/5 font-mono text-xl text-white tracking-widest">
                {word || <span className="text-gray-600 not-italic text-sm tracking-normal font-sans">Detected letters will appear here...</span>}
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-teal-400 ml-0.5">|</motion.span>
              </div>
            </CardContent>
          </Card>

          {/* ===== Detection History ===== */}
          <Card className="bg-slate-800/60 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Detection History</span>
                <span className="text-xs text-gray-500 ml-auto">{detectionHistory.length} detections</span>
              </div>
              {detectionHistory.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {detectionHistory.map((det, i) => (
                    <motion.div key={`${i}-${det.letter}-${det.timestamp.getTime()}`}
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${det.confidence >= 0.8 ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-300'
                        : det.confidence >= 0.5 ? 'bg-yellow-500/15 border border-yellow-500/25 text-yellow-300'
                          : 'bg-red-500/15 border border-red-500/25 text-red-300'
                        }`}>
                      <span className="font-bold text-sm">{det.letter}</span>
                      <span className="opacity-70">{Math.round(det.confidence * 100)}%</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No detections yet — start the camera</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ===== Right Panel ===== */}
        <div className="space-y-4">
          {/* Current Detection */}
          <Card className="bg-slate-800/60 border-white/10 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Current Detection</span>
              </div>
              {predictedLetter && predictedLetter !== '?' ? (
                <div className="flex flex-col items-center">
                  <motion.div key={predictedLetter} initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="text-7xl font-black text-white mb-4 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 w-28 h-28 rounded-2xl flex items-center justify-center border border-teal-500/30">
                    {predictedLetter}
                  </motion.div>
                  <ConfidenceGauge value={confidence} />
                  <div className="w-full mt-4 bg-slate-700/40 rounded-lg p-3">
                    <p className="text-sm text-white font-medium">{description}</p>
                    {tips && <p className="text-xs text-gray-400 mt-1">💡 {tips}</p>}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-3">
                    <Hand className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm">{isCameraOn ? 'Show your RIGHT hand to detect signs' : 'Start camera to begin'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 21 Hand Landmarks Legend */}
          <Card className="bg-slate-800/60 border-white/10 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">21 Hand Landmarks</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { name: 'Wrist', range: '0', color: FINGER_COLORS.wrist },
                  { name: 'Thumb', range: '1–4', color: FINGER_COLORS.thumb },
                  { name: 'Index Finger', range: '5–8', color: FINGER_COLORS.index },
                  { name: 'Middle Finger', range: '9–12', color: FINGER_COLORS.middle },
                  { name: 'Ring Finger', range: '13–16', color: FINGER_COLORS.ring },
                  { name: 'Pinky Finger', range: '17–20', color: FINGER_COLORS.pinky },
                ].map(item => (
                  <div key={item.name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-white/5 transition-colors">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-300 flex-1">{item.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">pts {item.range}</span>
                  </div>
                ))}
              </div>

              {/* Live coordinates */}
              {liveLandmarks && liveLandmarks.length === 21 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-400 uppercase tracking-wider font-medium">Tracking Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[0, 4, 8, 12, 16, 20].map(idx => {
                      const lm = liveLandmarks[idx]
                      return (
                        <div key={idx} className="bg-slate-700/40 rounded px-2 py-1">
                          <p className="text-[9px] text-gray-500 truncate">{LANDMARK_NAMES[idx]}</p>
                          <p className="text-[10px] text-gray-300 font-mono">{lm.x.toFixed(2)}, {lm.y.toFixed(2)}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Info */}
          <Card className="bg-slate-800/60 border-white/10 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Model Info</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Hand Tracking', value: 'MediaPipe (Browser)' },
                  { label: 'Classification', value: 'Dense NN (Server)' },
                  { label: 'Features', value: '63 (21 × 3 coords)' },
                  { label: 'Classes', value: `${backendStatus.labelsCount || 35} (A-Z + 1-9)` },
                  { label: 'Validation Acc', value: '99.93%' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className="text-xs text-gray-300 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
