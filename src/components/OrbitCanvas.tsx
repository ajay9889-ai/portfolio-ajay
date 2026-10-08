'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function OrbitCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeShape, setActiveShape] = useState<'knot' | 'ring' | 'orb'>('knot');
  const [visitorCount, setVisitorCount] = useState(3);

  useEffect(() => {
    const handleShapeChange = (e: any) => {
      if (e.detail) setActiveShape(e.detail);
    };
    window.addEventListener('orbit-shape-change', handleShapeChange);
    return () => window.removeEventListener('orbit-shape-change', handleShapeChange);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // 2. Lights
    const keyLight = new THREE.PointLight(0x7189ff, 3, 20);
    keyLight.position.set(4, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 3. Geometries
    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.42, 120, 24);
    const ringGeo = new THREE.TorusGeometry(1.6, 0.35, 32, 100);
    const orbGeo = new THREE.IcosahedronGeometry(1.7, 4);

    const material = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      metalness: 0.6,
      roughness: 0.28,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(knotGeo, material);
    scene.add(mesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7189ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(knotGeo, wireMat);
    scene.add(wireMesh);

    // 4. Orbiting Particle Constellation
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 2.4 + Math.random() * 1.6;
      speeds[i] = 0.005 + Math.random() * 0.01;

      positions[i * 3] = Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x7189ff,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Cursor Parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 6. Animation Loop
    let reqId: number;
    const animate = () => {
      mesh.rotation.x += 0.006;
      mesh.rotation.y += 0.008;

      wireMesh.rotation.x = mesh.rotation.x;
      wireMesh.rotation.y = mesh.rotation.y;

      // Parallax easing
      mesh.rotation.y += (mouseX - mesh.rotation.y * 0.1) * 0.05;
      mesh.rotation.x += (mouseY - mesh.rotation.x * 0.1) * 0.05;

      // Orbit particles update
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        angles[i] += speeds[i];
        posAttr.setX(i, Math.cos(angles[i]) * radii[i]);
        posAttr.setZ(i, Math.sin(angles[i]) * radii[i]);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      knotGeo.dispose();
      ringGeo.dispose();
      orbGeo.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] flex items-center justify-center">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbit Live Indicator */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full border border-line bg-bg/80 backdrop-blur-md text-[11px] font-mono text-muted flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span>{visitorCount} orbiting now</span>
      </div>
    </div>
  );
}
