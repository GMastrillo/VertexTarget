'use client';

import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { DEMO_SITES } from './laptop/laptop-data';
import { generateCustomSiteDemo } from './laptop/laptop-sandbox-generator';
import LaptopModeHeader from './laptop/LaptopModeHeader';
import LaptopChassisFrame from './laptop/LaptopChassisFrame';
import LaptopShowcaseTabs from './laptop/LaptopShowcaseTabs';
import LaptopSandboxBar from './laptop/LaptopSandboxBar';
import LaptopSandboxCta from './laptop/LaptopSandboxCta';

export default function Laptop3DShowcase() {
  const [mode, setMode] = useState<'showcase' | 'sandbox'>('showcase');
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const staticPose = mounted && reducedMotion;

  useEffect(() => setMounted(true), []);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados da Sandbox Interativa
  const [sandboxName, setSandboxName] = useState('Studio Alpha');
  const [sandboxNiche, setSandboxNiche] = useState('saude');
  const [sandboxCity, setSandboxCity] = useState('São Paulo, SP');

  useEffect(() => {
    if (isHovered || mode === 'sandbox' || reducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DEMO_SITES.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isHovered, mode, reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const currentSite =
    mode === 'sandbox'
      ? generateCustomSiteDemo(sandboxName, sandboxNiche, sandboxCity)
      : DEMO_SITES[activeIndex];

  const rotY = staticPose ? 0 : mousePos.x * 14;
  const rotX = staticPose ? 0 : 14 - mousePos.y * 10;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-5xl py-4 select-none"
    >
      {/* Seletor de Modo Principal */}
      <LaptopModeHeader mode={mode} onModeChange={setMode} />

      {/* Barra de Controles da Sandbox quando ativada */}
      {mode === 'sandbox' && (
        <LaptopSandboxBar
          businessName={sandboxName}
          nicheId={sandboxNiche}
          city={sandboxCity}
          onNameChange={setSandboxName}
          onNicheChange={setSandboxNiche}
          onCityChange={setSandboxCity}
        />
      )}

      {/* Frame 3D do Notebook */}
      <LaptopChassisFrame
        currentSite={currentSite}
        rotX={rotX}
        rotY={rotY}
        mode={mode}
      />

      {/* Modo Showcase: Botões de seleção dos 5 modelos */}
      {mode === 'showcase' && (
        <LaptopShowcaseTabs
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
        />
      )}

      {/* Modo Sandbox: CTA de Conversão e Publicação */}
      {mode === 'sandbox' && (
        <LaptopSandboxCta
          businessName={sandboxName}
          nicheId={sandboxNiche}
          city={sandboxCity}
        />
      )}
    </div>
  );
}
