'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function OrbitCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [visitorCount] = useState(4);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 360;
    let height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lights
    const keyLight = new THREE.PointLight(0x7189ff, 3.5, 20);
    keyLight.position.set(4, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Geometries
    const knotGeo = new THREE.TorusKnotGeometry(1.3, 0.4, 120, 24);
    const ringGeo = new THREE.TorusGeometry(1.5, 0.32, 32, 100);
    const orbGeo = new THREE.IcosahedronGeometry(1.6, 4);

    let currentGeo: THREE.BufferGeometry = knotGeo;

    const material = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      metalness: 0.6,
      roughness: 0.28,
    });

    const mesh = new THREE.Mesh(knotGeo, material);
    scene.add(mesh);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7189ff,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const wireMesh = new THREE.Mesh(knotGeo, wireMat);
    scene.add(wireMesh);

    // Particle field
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 2.2 + Math.random() * 1.5;
      speeds[i] = 0.005 + Math.random() * 0.01;

      positions[i * 3] = Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
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

    // Event listener for shape morph
    const onShapeChange = (e: any) => {
      const type = e.detail;
      let nextGeo = knotGeo;
      if (type === 'ring') nextGeo = ringGeo;
      else if (type === 'orb') nextGeo = orbGeo;

      currentGeo = nextGeo;
      mesh.geometry = currentGeo;
      wireMesh.geometry = currentGeo;
    };
    window.addEventListener('orbit-shape-change', onShapeChange);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', onMouseMove);

    let reqId: number;
    const animate = () => {
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.007;

      wireMesh.rotation.x = mesh.rotation.x;
      wireMesh.rotation.y = mesh.rotation.y;

      // Parallax easing
      mesh.rotation.y += (mouseX - mesh.rotation.y * 0.1) * 0.04;
      mesh.rotation.x += (mouseY - mesh.rotation.x * 0.1) * 0.04;

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
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('orbit-shape-change', onShapeChange);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      knotGeo.dispose();
      ringGeo.dispose();
      orbGeo.dispose();
      particleGeo.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-2 right-2 px-3 py-1 rounded-full border border-line bg-bg/85 backdrop-blur-md text-[11px] font-mono text-muted flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span>{visitorCount} orbiting now</span>
      </div>
    </div>
  );
}
