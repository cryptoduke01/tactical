'use client'
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ThreeJSBattleSceneProps {
  isActive: boolean;
  onSceneReady?: () => void;
}

export function ThreeJSBattleScene({ isActive, onSceneReady }: ThreeJSBattleSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current || !isActive) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Add tactical grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x1a1a1a, 0x2a2a2a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Add military terrain
    const terrainGeometry = new THREE.PlaneGeometry(40, 40, 20, 20);
    const terrainMaterial = new THREE.MeshLambertMaterial({
      color: 0x2d3748,
      wireframe: false
    });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Add tactical cover objects
    const createCoverObject = (x: number, z: number, type: 'wall' | 'barrier' | 'tower') => {
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;

      switch (type) {
        case 'wall':
          geometry = new THREE.BoxGeometry(2, 3, 0.5);
          material = new THREE.MeshLambertMaterial({ color: 0x4a5568 });
          break;
        case 'barrier':
          geometry = new THREE.BoxGeometry(1.5, 1, 1.5);
          material = new THREE.MeshLambertMaterial({ color: 0x718096 });
          break;
        case 'tower':
          geometry = new THREE.CylinderGeometry(1, 1, 4, 8);
          material = new THREE.MeshLambertMaterial({ color: 0x2d3748 });
          break;
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, type === 'tower' ? 2 : 1.5, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    };

    // Add strategic cover positions
    createCoverObject(-8, -8, 'wall');
    createCoverObject(8, -8, 'wall');
    createCoverObject(-8, 8, 'barrier');
    createCoverObject(8, 8, 'barrier');
    createCoverObject(0, -12, 'tower');
    createCoverObject(0, 12, 'tower');

    // Add particle effects for atmosphere
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = Math.random() * 20;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      particleSizes[i] = Math.random() * 2 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 1,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Add tactical HUD elements in 3D space
    const hudGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const hudMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.8
    });

    // Add status indicators around the battlefield
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const hudElement = new THREE.Mesh(hudGeometry, hudMaterial);
      hudElement.position.set(x, 0.1, z);
      hudElement.rotation.x = -Math.PI / 2;
      scene.add(hudElement);
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particles.rotation.y += 0.001;

      // Animate HUD elements
      scene.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.material === hudMaterial) {
          child.material.opacity = 0.4 + Math.sin(Date.now() * 0.003 + index) * 0.4;
        }
      });

      // Camera movement
      const time = Date.now() * 0.0005;
      camera.position.x = Math.sin(time) * 20;
      camera.position.z = Math.cos(time) * 20;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !renderer) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Scene is ready
    setIsLoading(false);
    onSceneReady?.();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, [isActive, onSceneReady]);

  if (!isActive) {
    return (
      <div className="tactical-panel p-8 text-center">
        <div className="text-2xl font-bold text-white mb-4 font-mono tracking-wider">
          BATTLE SCENE INACTIVE
        </div>
        <p className="text-slate-300 font-mono">
          Activate the battle scene to view 3D tactical environment
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-400 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-emerald-400 text-lg font-semibold mt-4 font-mono tracking-wider">
              RENDERING TACTICAL ENVIRONMENT
            </p>
            <div className="mt-2 text-slate-400 text-sm font-mono">INITIALIZING 3D GRAPHICS</div>
          </div>
        </div>
      )}

      <div
        ref={mountRef}
        className="w-full h-96 rounded-lg overflow-hidden border border-emerald-400/30"
        style={{ minHeight: '400px' }}
      />

      {/* 3D Scene Controls */}
      <div className="mt-4 flex justify-center gap-4">
        <div className="hud-element">
          <div className="hud-label">RENDER MODE</div>
          <div className="hud-value">THREE.JS ACTIVE</div>
        </div>
        <div className="hud-element">
          <div className="hud-label">SCENE STATUS</div>
          <div className="hud-value">{isLoading ? 'LOADING' : 'READY'}</div>
        </div>
        <div className="hud-element">
          <div className="hud-label">GRAPHICS API</div>
          <div className="hud-value">WEBGL 2.0</div>
        </div>
      </div>
    </div>
  );
} 