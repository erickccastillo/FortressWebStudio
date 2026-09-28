import { useState, useEffect, useRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- COMPONENTE: Animación de Scroll (Aparición/Desaparición) ---
const FadeInSection = ({ children, delay = 'delay-0' }: { children: ReactNode, delay?: string }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setVisible(entry.isIntersecting);
      });
    }, { 
      threshold: 0.15 
    });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out will-change-[opacity,transform] ${delay} ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95'
      }`}
    >
      {children}
    </div>
  );
};

// --- COMPONENTE 3D: Red Neuronal ---
const NeuralWeb = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const PARTICLE_COUNT = 250; 
  const MAX_DISTANCE = 4.5;   
  const INNER_RADIUS = 5.0;   
  const OUTER_RADIUS = 25.0;  

  const { positions, velocities, scales, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const sca = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const cyan = new THREE.Color('#2dd4bf');
    const violet = new THREE.Color('#8b5cf6');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let radius = INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS);
      let theta = Math.random() * Math.PI * 2;
      let phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      sca[i] = Math.random() * 0.08 + 0.08;

      const mixedColor = cyan.clone().lerp(violet, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return { positions: pos, velocities: vel, scales: sca, colors: col };
  }, []);

  const maxLines = (PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current || !linesRef.current || !groupRef.current) return;

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;

    let lineIndex = 0;
    const currentLinePositions = linesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      positions[ix] += velocities[ix];
      positions[iy] += velocities[iy];
      positions[iz] += velocities[iz];

      const distFromCenter = Math.sqrt(positions[ix] ** 2 + positions[iy] ** 2 + positions[iz] ** 2);
      
      if (distFromCenter < INNER_RADIUS || distFromCenter > OUTER_RADIUS) {
        velocities[ix] *= -1.05;
        velocities[iy] *= -1.05;
        velocities[iz] *= -1.05;

        const speed = Math.sqrt(velocities[ix]**2 + velocities[iy]**2 + velocities[iz]**2);
        if (speed > 0.05) {
            velocities[ix] = (velocities[ix]/speed) * 0.02;
            velocities[iy] = (velocities[iy]/speed) * 0.02;
            velocities[iz] = (velocities[iz]/speed) * 0.02;
        }
      }

      dummy.position.set(positions[ix], positions[iy], positions[iz]);
      dummy.scale.set(scales[i], scales[i], scales[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, new THREE.Color(colors[ix], colors[iy], colors[iz]));

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const jx = j * 3;
        const jy = j * 3 + 1;
        const jz = j * 3 + 2;

        const dx = positions[ix] - positions[jx];
        const dy = positions[iy] - positions[jy];
        const dz = positions[iz] - positions[jz];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < MAX_DISTANCE * MAX_DISTANCE) {
          currentLinePositions[lineIndex++] = positions[ix];
          currentLinePositions[lineIndex++] = positions[iy];
          currentLinePositions[lineIndex++] = positions[iz];
          currentLinePositions[lineIndex++] = positions[jx];
          currentLinePositions[lineIndex++] = positions[jy];
          currentLinePositions[lineIndex++] = positions[jz];
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    linesRef.current.geometry.setDrawRange(0, lineIndex / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          roughness={0.2} 
          metalness={0.8} 
          transparent 
          opacity={0.85} 
        />
      </instancedMesh>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black text-zinc-300 selection:bg-white selection:text-black relative flex flex-col w-full overflow-x-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700;800&display=swap');
        html { scroll-behavior: smooth !important; overflow-x: hidden !important; }
        body {
          background-color: #000000 !important;
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}} />

      {/* --- BOTÓN FLOTANTE --- */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-white transition-all duration-500 hover:bg-white hover:text-black hover:scale-105 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <main className="relative z-10 w-full flex flex-col items-center">
    
        {/* --- 1. SECCIÓN HERO --- */}
        <section className="relative flex flex-col items-center justify-center min-h-[100dvh] w-full overflow-hidden pt-20 lg:pt-0">
          
          {/* FONDO 3D FULL SCREEN */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 20, 15]} intensity={1.5} color="#ffffff" />
              <pointLight position={[-10, -10, -10]} intensity={1} color="#2dd4bf" />
              <pointLight position={[15, -5, 5]} intensity={0.8} color="#8b5cf6" />
              <NeuralWeb />
            </Canvas>
          </div>

          {/* OVERLAY DEGRADADO (Más agresivo para limpieza visual) */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-black/80 to-black" />

          {/* CONTENIDO DEL HERO (Centrado) */}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-8 flex-grow relative z-20">
            
            <div className="w-full flex flex-col items-center animate-[fade-in_1s_ease-out]">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tighter leading-[1.05]">
                Modern Web
                <br className="hidden sm:block" /> Development
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mt-4 text-4xl sm:text-5xl lg:text-6xl">
                  Built for Growing Businesses
                </span>
              </h1>

              <p className="text-zinc-400 font-light text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mb-10">
                Fortress Web Studio is a remote web development team focused on
                creating modern websites, custom digital solutions, and scalable
                online experiences that help businesses strengthen their presence.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <a href="#who-we-are" className="px-8 py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors text-sm font-bold tracking-wide">
                  Who We Are
                </a>
                <a href="#mission-values" className="px-8 py-3.5 rounded-full border border-zinc-700 text-white hover:border-white hover:bg-white/5 transition-all text-sm font-bold tracking-wide">
                  Mission & Values
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* --- 2. SECCIÓN: WHO WE ARE --- */}
        <section id="who-we-are" className="w-full bg-black py-24 md:py-32 px-4 sm:px-6 relative z-10 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInSection>
              <div className="mb-12 md:mb-16 flex flex-col items-center">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                  Who We Are
                </h3>
              </div>
            </FadeInSection>
          
            <div className="space-y-10 text-zinc-400 font-light text-xl md:text-2xl leading-relaxed text-left md:text-center">
              <FadeInSection delay="delay-100">
                <p>
                  <strong className="text-white font-medium">Fortress Web Studio</strong> is a remote-first web development team
                  dedicated to helping businesses establish a professional and
                  effective digital presence. We specialize in designing and building
                  modern websites that blend great user experience with strong
                  technical foundations.
                </p>
              </FadeInSection>
              
              <FadeInSection delay="delay-200">
                <p>
                  Our team works collaboratively across projects, leveraging modern
                  technologies and streamlined workflows to ensure quality, efficiency,
                  and consistency in every solution we deliver.
                </p>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* --- 3. SECCIÓN: MISSION & VALUES --- */}
        <section id="mission-values" className="w-full bg-zinc-950 py-24 md:py-32 px-4 sm:px-6 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            <div className="lg:col-span-7">
              <FadeInSection>
                <div className="bg-black border border-zinc-800/50 rounded-3xl p-10 md:p-14 h-full shadow-2xl">
                  <div className="mb-10">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Our Mission</h3>
                  </div>
                  <p className="text-zinc-400 font-light text-lg sm:text-xl leading-relaxed mb-8">
                    At Fortress Web Studio, our mission is to empower businesses through
                    innovative web solutions that combine exceptional design, modern
                    technology, and strategic thinking.
                  </p>
                  <p className="text-zinc-400 font-light text-lg sm:text-xl leading-relaxed">
                    We believe a website should be more than an online presence. It should become a powerful tool that
                    supports business growth, improves customer engagement, and creates
                    lasting value.
                  </p>
                </div>
              </FadeInSection>
            </div>

            <div className="lg:col-span-5">
              <FadeInSection delay="delay-200">
                <div className="bg-black border border-zinc-800/50 rounded-3xl p-10 md:p-14 h-full shadow-2xl">
                  <div className="mb-10">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Our Values</h3>
                  </div>
                  <p className="text-zinc-400 font-light text-lg leading-relaxed mb-8">
                    The foundation of our work is built on principles that
                    guide every decision and client relationship.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['Commitment', 'Transparency', 'Organization', 'Communication', 'Innovation', 'Reliability', 'Quality', 'Professionalism'].map((value) => (
                      <span key={value} className="px-5 py-2.5 bg-zinc-900 text-white text-sm rounded-full font-medium tracking-wide">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            </div>

          </div>
        </section>

        {/* --- 4. SECCIÓN: HOW WE WORK --- */}
        <section id="how-we-work" className="w-full bg-black py-24 md:py-32 px-4 sm:px-6 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <div className="mb-16 md:mb-20 flex flex-col items-center text-center">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                  How We Work
                </h3>
              </div>
            </FadeInSection>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <FadeInSection delay="delay-100">
                <div className="bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-colors rounded-2xl p-10 h-full">
                  <h4 className="text-white text-2xl font-bold mb-5 tracking-tight">Remote Collaboration</h4>
                  <p className="text-zinc-400 font-light leading-relaxed text-lg">
                    Operating remotely allows us to work with businesses from different
                    locations while maintaining flexibility, responsiveness, and
                    efficient communication throughout every stage.
                  </p>
                </div>
              </FadeInSection>
          
              <FadeInSection delay="delay-200">
                <div className="bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-colors rounded-2xl p-10 h-full">
                  <h4 className="text-white text-2xl font-bold mb-5 tracking-tight">Organized Process</h4>
                  <p className="text-zinc-400 font-light leading-relaxed text-lg">
                    Every project follows a structured workflow with clear milestones,
                    transparent planning, regular updates, and defined objectives that
                    keep progress measurable.
                  </p>
                </div>
              </FadeInSection>
          
              <FadeInSection delay="delay-300">
                <div className="bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-colors rounded-2xl p-10 h-full">
                  <h4 className="text-white text-2xl font-bold mb-5 tracking-tight">Excellence</h4>
                  <p className="text-zinc-400 font-light leading-relaxed text-lg">
                    We are committed to delivering dependable solutions, providing
                    ongoing support, and maintaining high standards of quality,
                    performance, and professionalism.
                  </p>
                </div>
              </FadeInSection>
          
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}