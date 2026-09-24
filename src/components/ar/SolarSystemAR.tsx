'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Pause,
  VolumeX
} from 'lucide-react'

// Planet data with educational information
const PLANETS = [
  {
    name: 'Sun',
    radius: 5,
    color: 0xffdd00,
    emissive: 0xffaa00,
    distance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.001,
    info: {
      title: 'The Sun',
      description: 'The Sun is a star at the center of our Solar System. It is a hot ball of glowing gases that gives us light and heat.',
      facts: ['The Sun is 4.6 billion years old', 'It is 150 million km from Earth', 'The temperature is 5,500°C on the surface']
    }
  },
  {
    name: 'Mercury',
    radius: 0.4,
    color: 0x8c7853,
    distance: 10,
    orbitSpeed: 0.04,
    rotationSpeed: 0.005,
    info: {
      title: 'Mercury',
      description: 'Mercury is the smallest planet and closest to the Sun. It has no moons and no rings.',
      facts: ['One year on Mercury is 88 Earth days', 'Mercury has no atmosphere', 'It has extreme temperatures']
    }
  },
  {
    name: 'Venus',
    radius: 0.9,
    color: 0xffc649,
    distance: 15,
    orbitSpeed: 0.015,
    rotationSpeed: 0.002,
    info: {
      title: 'Venus',
      description: 'Venus is the hottest planet. It is covered in thick clouds that trap heat.',
      facts: ['Venus spins backwards', 'A day on Venus is longer than its year', 'It is called Earth\'s twin']
    }
  },
  {
    name: 'Earth',
    radius: 1,
    color: 0x6b93d6,
    distance: 20,
    orbitSpeed: 0.01,
    rotationSpeed: 0.02,
    info: {
      title: 'Earth',
      description: 'Earth is our home planet. It is the only planet known to have life.',
      facts: ['Earth has one moon', '70% of Earth is covered with water', 'Earth is 4.5 billion years old']
    }
  },
  {
    name: 'Mars',
    radius: 0.5,
    color: 0xc1440e,
    distance: 25,
    orbitSpeed: 0.008,
    rotationSpeed: 0.018,
    info: {
      title: 'Mars',
      description: 'Mars is called the Red Planet because of its red color. It has the largest volcano in the solar system.',
      facts: ['Mars has two small moons', 'It has seasons like Earth', 'A day on Mars is 24.6 hours']
    }
  },
  {
    name: 'Jupiter',
    radius: 2.5,
    color: 0xd8ca9d,
    distance: 35,
    orbitSpeed: 0.002,
    rotationSpeed: 0.04,
    info: {
      title: 'Jupiter',
      description: 'Jupiter is the largest planet. It is a gas giant with a famous Great Red Spot.',
      facts: ['Jupiter has 79 known moons', 'The Great Red Spot is a giant storm', 'Jupiter is made mostly of hydrogen']
    }
  },
  {
    name: 'Saturn',
    radius: 2.2,
    color: 0xead6b8,
    distance: 45,
    orbitSpeed: 0.0009,
    rotationSpeed: 0.038,
    hasRings: true,
    info: {
      title: 'Saturn',
      description: 'Saturn is famous for its beautiful rings made of ice and rock.',
      facts: ['Saturn has 82 known moons', 'The rings are very thin', 'Saturn could float in water']
    }
  },
  {
    name: 'Uranus',
    radius: 1.6,
    color: 0xd1e7e7,
    distance: 55,
    orbitSpeed: 0.0004,
    rotationSpeed: 0.03,
    info: {
      title: 'Uranus',
      description: 'Uranus is an ice giant that spins on its side. It has a blue-green color.',
      facts: ['Uranus has 27 known moons', 'It is the coldest planet', 'Uranus was discovered in 1781']
    }
  },
  {
    name: 'Neptune',
    radius: 1.5,
    color: 0x5b5ddf,
    distance: 65,
    orbitSpeed: 0.0001,
    rotationSpeed: 0.032,
    info: {
      title: 'Neptune',
      description: 'Neptune is the farthest planet from the Sun. It has the strongest winds in the solar system.',
      facts: ['Neptune has 14 known moons', 'Winds can reach 2,100 km/h', 'It takes 165 years to orbit the Sun']
    }
  }
]

interface PlanetMesh extends THREE.Mesh {
  userData: {
    name: string
    orbitSpeed: number
    rotationSpeed: number
    distance: number
    info: typeof PLANETS[0]['info']
  }
}

export default function SolarSystemAR() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const planetsRef = useRef<PlanetMesh[]>([])
  const animationRef = useRef<number>(0)
  
  const [selectedPlanet, setSelectedPlanet] = useState<typeof PLANETS[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [zoom, setZoom] = useState(1)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a1a)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 50, 100)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 20
    controls.maxDistance = 200

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 2, 300)
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    // Add stars background
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 2000
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600
      positions[i + 1] = (Math.random() - 0.5) * 600
      positions[i + 2] = (Math.random() - 0.5) * 600
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Create planets
    const planetMeshes: PlanetMesh[] = []
    
    PLANETS.forEach((planet) => {
      // Planet sphere
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: planet.color,
        emissive: planet.emissive || 0x000000,
        emissiveIntensity: planet.name === 'Sun' ? 1 : 0,
        roughness: 0.8,
        metalness: 0.2
      })
      
      const mesh = new THREE.Mesh(geometry, material) as PlanetMesh
      mesh.userData = {
        name: planet.name,
        orbitSpeed: planet.orbitSpeed,
        rotationSpeed: planet.rotationSpeed,
        distance: planet.distance,
        info: planet.info
      }
      
      // Initial position
      if (planet.distance > 0) {
        mesh.position.x = planet.distance
      }
      
      scene.add(mesh)
      planetMeshes.push(mesh)

      // Add orbit ring
      if (planet.distance > 0) {
        const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 64)
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x444444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3
        })
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
        orbit.rotation.x = Math.PI / 2
        scene.add(orbit)
      }

      // Add Saturn's rings
      if (planet.hasRings) {
        const ringGeometry = new THREE.RingGeometry(planet.radius + 1, planet.radius + 3, 64)
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xc9b896,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        })
        const rings = new THREE.Mesh(ringGeometry, ringMaterial)
        rings.rotation.x = Math.PI / 2.5
        mesh.add(rings)
      }
    })

    planetsRef.current = planetMeshes

    // Animation loop
    let angle = 0
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      if (isPlaying) {
        angle += 0.01
        
        planetMeshes.forEach((planet) => {
          // Rotation
          planet.rotation.y += planet.userData.rotationSpeed
          
          // Orbit
          if (planet.userData.distance > 0) {
            const orbitAngle = angle * planet.userData.orbitSpeed
            planet.position.x = Math.cos(orbitAngle) * planet.userData.distance
            planet.position.z = Math.sin(orbitAngle) * planet.userData.distance
          }
        })
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, cameraRef.current)
      const intersects = raycaster.intersectObjects(planetMeshes)

      if (intersects.length > 0) {
        const clicked = intersects[0].object as PlanetMesh
        const planetData = PLANETS.find(p => p.name === clicked.userData.name)
        if (planetData) {
          setSelectedPlanet(planetData)
        }
      }
    }

    containerRef.current.addEventListener('click', handleClick)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update animation state
  useEffect(() => {
    // Animation state is handled in the animation loop
  }, [isPlaying])

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.9)
      setZoom(zoom * 1.1)
    }
  }

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.1)
      setZoom(zoom * 0.9)
    }
  }

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 50, 100)
      cameraRef.current.lookAt(0, 0, 0)
      setZoom(1)
    }
  }

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-slate-900">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Control Panel */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="bg-slate-800/80 hover:bg-slate-700"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="bg-slate-800/80 hover:bg-slate-700"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="bg-slate-800/80 hover:bg-slate-700"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="bg-slate-800/80 hover:bg-slate-700"
          onClick={handleReset}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-lg px-4 py-2">
          🌍 Solar System AR
        </Badge>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <p className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          Click on any planet to learn more!
        </p>
      </div>

      {/* Planet Labels */}
      {showLabels && (
        <div className="absolute top-20 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3">
          <p className="text-white text-sm font-medium mb-2">Planets:</p>
          <div className="flex flex-wrap gap-1">
            {PLANETS.map((planet) => (
              <button
                key={planet.name}
                onClick={() => setSelectedPlanet(planet)}
                className={`px-2 py-1 rounded text-xs ${
                  selectedPlanet?.name === planet.name
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {planet.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Planet Info Panel */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute bottom-4 right-4 w-80"
          >
            <Card className="bg-slate-800/90 backdrop-blur-sm border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-xl">
                    {selectedPlanet.info.title}
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white h-8 w-8"
                    onClick={() => setSelectedPlanet(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-3">
                  {selectedPlanet.info.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-purple-400 font-medium">Fun Facts:</p>
                  {selectedPlanet.info.facts.map((fact, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-yellow-400">•</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
