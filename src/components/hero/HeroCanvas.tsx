"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 4;

    // Particle density / DPR adapt to screen size (mobile = lighter scene)
    const isSmallScreen = Math.min(width, height) < 768;

    // Renderer — antialias off + capped DPR: big GPU/CPU win on mobile
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSmallScreen ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 1.5));

    // Particle Field — fewer particles on small/low-power screens
    const count = isSmallScreen ? 1200 : 2500;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      velocities[i * 3] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.022,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Floating Wireframe Core
    const meshGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const meshMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const floatingMesh = new THREE.Mesh(meshGeometry, meshMaterial);
    scene.add(floatingMesh);

    // Secondary Inner Core
    const innerGeometry = new THREE.OctahedronGeometry(0.7, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Mouse & Touch Tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      targetX = (clientX / window.innerWidth - 0.5) * 2;
      targetY = (clientY / window.innerHeight - 0.5) * -2;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop — paused while offscreen (saves main thread during scroll)
    let animationFrameId: number;
    let running = true;
    let clock = new THREE.Clock();

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!running) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Rotate and float meshes
      floatingMesh.rotation.x = elapsedTime * 0.1 + currentY * 0.3;
      floatingMesh.rotation.y = elapsedTime * 0.15 + currentX * 0.3;
      floatingMesh.position.y = Math.sin(elapsedTime * 0.6) * 0.15;

      innerMesh.rotation.x = -elapsedTime * 0.2 - currentY * 0.2;
      innerMesh.rotation.y = -elapsedTime * 0.25 - currentX * 0.2;
      innerMesh.position.y = Math.sin(elapsedTime * 0.6) * 0.15;

      // Animate Particles
      const posArray = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        posArray[i3] += velocities[i3] + Math.sin(elapsedTime * 0.2 + i) * 0.0003;
        posArray[i3 + 1] += velocities[i3 + 1] + Math.cos(elapsedTime * 0.2 + i) * 0.0003;
        posArray[i3 + 2] += velocities[i3 + 2];

        // Soft mouse repulsion
        const dx = currentX * 3 - posArray[i3];
        const dy = currentY * 3 - posArray[i3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.8) {
          posArray[i3] -= dx * 0.002;
          posArray[i3 + 1] -= dy * 0.002;
        }

        // Wrap around boundaries
        if (Math.abs(posArray[i3]) > 6) posArray[i3] *= -0.98;
        if (Math.abs(posArray[i3 + 1]) > 6) posArray[i3 + 1] *= -0.98;
        if (Math.abs(posArray[i3 + 2]) > 3) posArray[i3 + 2] *= -0.98;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.015 + currentX * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      particleGeometry.dispose();
      particleMaterial.dispose();
      meshGeometry.dispose();
      meshMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      io.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
