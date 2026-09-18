"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SKILLS_DATA } from "@/lib/constants";

export default function SkillsOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSkill, setActiveSkill] = useState<(typeof SKILLS_DATA)[0] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.8);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.5);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Orbit Group
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Central Core
    const coreGeometry = new THREE.OctahedronGeometry(1.0, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.8,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    orbitGroup.add(coreMesh);

    // Inner Glowing Core
    const innerGeometry = new THREE.SphereGeometry(0.55, 24, 24);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    orbitGroup.add(innerSphere);

    // Orbit Rings
    const ringRadii = [2.6, 3.8, 5.0];
    const ringMaterials: THREE.MeshBasicMaterial[] = [];
    ringRadii.forEach((r, i) => {
      const ringGeo = new THREE.RingGeometry(r - 0.015, r + 0.015, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      ringMaterials.push(ringMat);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3 + i * 0.15;
      ringMesh.rotation.y = (i * Math.PI) / 6;
      orbitGroup.add(ringMesh);
    });

    // Color mapper
    const getCategoryColor = (cat: string) => {
      switch (cat) {
        case "core":
          return 0x00f0ff;
        case "creative":
          return 0xe040fb;
        case "backend":
          return 0x8b5cf6;
        case "ai":
          return 0x10b981;
        case "infra":
          return 0xf59e0b;
        default:
          return 0x00f0ff;
      }
    };

    // Skill Spheres
    const nodeData: Array<{
      mesh: THREE.Mesh;
      skill: (typeof SKILLS_DATA)[0];
      angle: number;
      radius: number;
      speed: number;
      yOffset: number;
    }> = [];

    SKILLS_DATA.forEach((skill, index) => {
      const ringIndex = index % 3;
      const radius = ringRadii[ringIndex];
      const speed = 0.22 - ringIndex * 0.04;
      const angle = (index / SKILLS_DATA.length) * Math.PI * 2;
      const yOffset = ((index % 5) - 2) * 0.35;
      const color = getCategoryColor(skill.category);

      const sphereGeo = new THREE.SphereGeometry(0.28, 20, 20);
      const sphereMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.7,
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      orbitGroup.add(mesh);

      nodeData.push({
        mesh,
        skill,
        angle,
        radius,
        speed,
        yOffset,
      });
    });

    // Interaction & Mouse tracking
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onPointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotationY += deltaX * 0.006;
        targetRotationX += deltaY * 0.006;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleMouseDown = (e: MouseEvent) => onPointerDown(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
    const handleMouseUp = () => onPointerUp();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => onPointerUp();

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Continuous slow rotation + drag lerp
      targetRotationY += 0.002;
      orbitGroup.rotation.y += (targetRotationY - orbitGroup.rotation.y) * 0.08;
      orbitGroup.rotation.x += (targetRotationX - orbitGroup.rotation.x) * 0.08;

      coreMesh.rotation.x = elapsed * 0.3;
      coreMesh.rotation.y = elapsed * 0.4;

      // Update skill node positions
      nodeData.forEach(({ mesh, angle, radius, speed, yOffset }) => {
        const t = elapsed * speed + angle;
        const x = Math.cos(t) * radius;
        const z = Math.sin(t) * radius;
        mesh.position.set(x, yOffset + Math.sin(t * 2) * 0.2, z);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ringMaterials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] md:h-[550px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050510]/80 my-12 md:my-16 shadow-2xl cursor-grab active:cursor-grabbing touch-pan-y"
    >
      {/* Header Info */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none">
        <div className="label text-[10px] sm:text-xs uppercase tracking-wider mb-1" style={{ color: "#00f0ff" }}>
          Constelação Técnica
        </div>
        <h4 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Skills Orbit 3D</h4>
        <p className="text-[11px] sm:text-xs font-mono text-zinc-400 mt-0.5">
          Arraste com o dedo ou mouse para explorar a constelação
        </p>
      </div>

      {/* Skills Badges Tray at Bottom */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[90px] overflow-y-auto no-scrollbar py-1">
          {SKILLS_DATA.map((skill) => (
            <button
              key={skill.name}
              onClick={() => setActiveSkill(activeSkill?.name === skill.name ? null : skill)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 backdrop-blur-md border ${
                activeSkill?.name === skill.name
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 scale-105"
                  : "bg-black/50 text-zinc-300 border-white/10 hover:border-cyan-500/40 hover:text-white"
              }`}
            >
              <span>{skill.name}</span>
              <span className="ml-1.5 text-[9px] opacity-70 font-semibold">{skill.level}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Skill Floating Pill */}
      {activeSkill && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-none">
          <div className="px-3 py-2 rounded-xl bg-black/80 border border-cyan-400/40 backdrop-blur-md shadow-xl text-right">
            <div className="text-xs font-bold text-white font-mono">{activeSkill.name}</div>
            <div className="text-[10px] text-cyan-400 font-mono">
              Nível: {activeSkill.level}% • {activeSkill.category.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
