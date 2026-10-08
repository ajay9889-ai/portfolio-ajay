'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function OrbitCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [visitorCount] = useState(5);
  const [shape, setShape] = useState<'icosa' | 'knot' | 'ring' | 'orb'>('icosa');

  useEffect(() => {
    const handleShape = (e: any) => {
      if (e.detail) setShape(e.detail);
    };
    window.addEventListener('orbit-shape-change', handleShape);
    return () => window.removeEventListener('orbit-shape-change', handleShape);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Fixed reliable dimensions with fallback
    const width = container.clientWidth > 0 ? container.clientWidth : 460;
    const height = container.clientHeight > 0 ? container.clientHeight : 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Glowing Lights (Accent #8B7CFF glow)
    const keyLight = new THREE.PointLight(0x8B7CFF, 4.5, 25);
    keyLight.position.set(3.5, 3.5, 4.5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x6C5CE7, 3.0, 20);
    rimLight.position.set(-3.5, -3.0, -2.0);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xECEBE7, 1.4);
    fillLight.position.set(2, 4, 3);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Geometries
    const icosaGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.38, 128, 32);
    const ringGeo = new THREE.TorusGeometry(1.4, 0.28, 32, 100);
    const orbGeo = new THREE.SphereGeometry(1.4, 32, 32);

    let activeGeo = icosaGeo;

    // Solid inner core material
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x14141A,
      metalness: 0.7,
      roughness: 0.25,
      flatShading: true,
    });
    const solidMesh = new THREE.Mesh(activeGeo, solidMat);
    scene.add(solidMesh);

    // Glowing wireframe cage
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8B7CFF,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(activeGeo, wireMat);
    wireMesh.scale.setScalar(1.02);
    scene.add(wireMesh);

    // Outer constellation particles
    const particleCount = 85;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const yOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 1.9 + Math.random() * 1.6;
      speeds[i] = 0.006 + Math.random() * 0.009;
      yOffsets[i] = (Math.random() - 0.5) * 1.8;

      positions[i * 3] = Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = yOffsets[i];
      positions[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x8B7CFF,
      size: 0.07,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Shape switch listener
    const onShapeChange = (e: any) => {
      const type = e.detail;
      let nextGeo = icosaGeo;
      if (type === 'knot') nextGeo = knotGeo;
      else if (type === 'ring') nextGeo = ringGeo;
      else if (type === 'orb') nextGeo = orbGeo;

      activeGeo = nextGeo;
      solidMesh.geometry = activeGeo;
      wireMesh.geometry = activeGeo;
    };
    window.addEventListener('orbit-shape-change', onShapeChange);

    // Cursor Follow Parallax
    let targetRotX = 0;
    let targetRotY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 1.2;
      targetRotX = (e.clientY / window.innerHeight - 0.5) * 1.2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Continuous gentle rotation
      solidMesh.rotation.x += 0.005;
      solidMesh.rotation.y += 0.007;

      // Parallax smooth interpolation
      solidMesh.rotation.y += (targetRotY - solidMesh.rotation.y * 0.1) * 0.05;
      solidMesh.rotation.x += (targetRotX - solidMesh.rotation.x * 0.1) * 0.05;

      wireMesh.rotation.copy(solidMesh.rotation);

      // Subtle breathing pulse
      const pulse = 1 + Math.sin(elapsed * 1.5) * 0.02;
      wireMesh.scale.setScalar(1.02 * pulse);

      // Update orbiting particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        angles[i] += speeds[i];
        posAttr.setX(i, Math.cos(angles[i]) * radii[i]);
        posAttr.setZ(i, Math.sin(angles[i]) * radii[i]);
      }
      posAttr.needsUpdate = true;

      particles.rotation.y += 0.002;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('orbit-shape-change', onShapeChange);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      icosaGeo.dispose();
      knotGeo.dispose();
      ringGeo.dispose();
      orbGeo.dispose();
      particleGeo.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] flex items-center justify-center select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center" />

      {/* Subtle Glow Backdrop */}
      <div className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      {/* Orbit Live Indicator */}
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full border border-line bg-bg/80 backdrop-blur-md text-[11px] font-mono text-muted flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span>{visitorCount} orbiting now</span>
      </div>
    </div>
  );
}
