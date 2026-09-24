// API Route: Get AR Lessons
// Returns all available AR learning experiences

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Demo data for hackathon - In production, fetch from database
    const lessons = [
      {
        id: 'ar-001',
        name: 'Solar System',
        description: 'Explore the 8 planets of our solar system in 3D AR',
        sceneType: 'solar_system',
        thumbnail: '/ar/solar-system-thumb.png',
        qrCode: 'SOLAR-001',
        interactions: ['rotate', 'zoom', 'click-info'],
        assets: {
          models: ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'],
          labels: true,
          animations: ['orbit', 'rotate']
        }
      },
      {
        id: 'ar-002',
        name: 'Human Body',
        description: 'Learn about human body parts and organs',
        sceneType: 'human_body',
        thumbnail: '/ar/human-body-thumb.png',
        qrCode: 'BODY-001',
        interactions: ['rotate', 'click-info', 'xray'],
        assets: {
          models: ['skeleton', 'organs', 'muscles'],
          labels: true,
          animations: ['breathe', 'heartbeat']
        }
      },
      {
        id: 'ar-003',
        name: 'Animal Kingdom',
        description: 'See wild animals in 3D AR',
        sceneType: 'animals',
        thumbnail: '/ar/animals-thumb.png',
        qrCode: 'ANIMAL-001',
        interactions: ['rotate', 'zoom', 'sound'],
        assets: {
          models: ['lion', 'elephant', 'giraffe', 'tiger'],
          labels: true,
          animations: ['walk', 'idle']
        }
      },
      {
        id: 'ar-004',
        name: 'Plant Life Cycle',
        description: 'Watch how plants grow from seed to flower',
        sceneType: 'plants',
        thumbnail: '/ar/plants-thumb.png',
        qrCode: 'PLANT-001',
        interactions: ['play-animation', 'click-info'],
        assets: {
          models: ['seed', 'sprout', 'plant', 'flower'],
          labels: true,
          animations: ['grow']
        }
      },
      {
        id: 'ar-005',
        name: 'Geometric Shapes',
        description: 'Learn 3D shapes and geometry',
        sceneType: 'geometry',
        thumbnail: '/ar/geometry-thumb.png',
        qrCode: 'GEOM-001',
        interactions: ['rotate', 'explode', 'combine'],
        assets: {
          models: ['cube', 'sphere', 'pyramid', 'cylinder', 'cone'],
          labels: true,
          animations: ['rotate', 'transform']
        }
      },
      {
        id: 'ar-006',
        name: 'Water Cycle',
        description: 'Understand how water moves on Earth',
        sceneType: 'water_cycle',
        thumbnail: '/ar/water-cycle-thumb.png',
        qrCode: 'WATER-001',
        interactions: ['play-animation', 'click-info'],
        assets: {
          models: ['sun', 'cloud', 'rain', 'mountain', 'ocean'],
          labels: true,
          animations: ['evaporation', 'condensation', 'precipitation']
        }
      }
    ]

    return NextResponse.json({
      success: true,
      count: lessons.length,
      lessons
    })
  } catch (error) {
    console.error('Error fetching AR lessons:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AR lessons' },
      { status: 500 }
    )
  }
}
