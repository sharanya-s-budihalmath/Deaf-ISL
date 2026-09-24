// API Route: ISL Sign Language Prediction
// Connects to the Python ML backend - NO demo/mock predictions

import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const mlBackendUrl = process.env.ML_BACKEND_URL || 'http://localhost:8000'

  try {
    const healthRes = await fetch(`${mlBackendUrl}/health`, { cache: 'no-store' })
    if (healthRes.ok) {
      const health = await healthRes.json()
      return NextResponse.json({
        success: true,
        message: 'ISL Sign Language Detection API',
        backendStatus: 'connected',
        modelLoaded: health.model_loaded,
        handDetectorLoaded: health.hand_detector_loaded,
        labelsCount: health.labels_count,
      })
    }
  } catch {
    // Backend not reachable
  }

  return NextResponse.json({
    success: true,
    message: 'ISL Sign Language Detection API',
    backendStatus: 'disconnected',
    modelLoaded: false,
    handDetectorLoaded: false,
    labelsCount: 0,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      )
    }

    const mlBackendUrl = process.env.ML_BACKEND_URL || 'http://localhost:8000'

    try {
      const mlResponse = await fetch(`${mlBackendUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, return_probabilities: true }),
      })

      if (mlResponse.ok) {
        const mlResult = await mlResponse.json()
        return NextResponse.json({
          success: true,
          predictedLetter: mlResult.predicted_letter,
          confidence: mlResult.confidence,
          description: mlResult.description || '',
          tips: mlResult.tips || '',
          landmarks: mlResult.landmarks || null,
          allProbabilities: mlResult.all_probabilities || null,
          processingTimeMs: mlResult.processing_time_ms,
          source: mlResult.source,
        })
      } else {
        const errText = await mlResponse.text()
        return NextResponse.json(
          { success: false, error: `ML backend error: ${errText}` },
          { status: 502 }
        )
      }
    } catch (mlError) {
      return NextResponse.json(
        {
          success: false,
          error: 'ML backend is not running. Start it with: python app.py',
        },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Sign prediction error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process sign prediction' },
      { status: 500 }
    )
  }
}
