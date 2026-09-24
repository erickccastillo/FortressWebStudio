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
      className={`transition-all duration-1000 ease-out will-change-[opacity,transform] ${delay}${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95'
      }`}
    >
      {children}
    </div>
  );
};

// --- COMPONENTE 3D: Red Neuronal (Esferas y Conexiones) ---
const NeuralWeb = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const PARTICLE_COUNT = 150; // Cantidad de neuronas (esferas)
  const MAX_DISTANCE = 3.5;   // Distancia para crear conexión (telaraña)
  const INNER_RADIUS = 4.5;   // Espacio hueco en el centro para el monitor ASCII
  const OUTER_RADIUS = 11.0;  // Límite exterior de la esfera de movimiento

  // Inicialización de posiciones, velocidades y tamaños
  const { positions, velocities, scales, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const sca = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const cyan = new THREE.Color('#2dd4bf');
    const violet = new THREE.Color('#8b5cf6');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Posición inicial aleatoria dentro de una esfera hueca
      let radius = INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS);
      let theta = Math.random() * Math.PI * 2;
      let phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Velocidades deliberadas
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Tamaños variables (las neuronas)
      sca[i] = Math.random() * 0.15 + 0.05;

      // Mezcla de colores aleatorios entre Cyan y Violeta
      const mixedColor = cyan.clone().lerp(violet, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return { positions: pos, velocities: vel, scales: sca, colors: col };
  }, []);

  // Geometría para las líneas (reservamos espacio suficiente)
  const maxLines = (PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const groupRef = useRef<THREE.Group>(null);

  // Animación frame por frame
  useFrame((state) => {
    if (!meshRef.current || !linesRef.current || !groupRef.current) return;

    // Rotación suave y global de toda la telaraña
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;

    let lineIndex = 0;
    const currentLinePositions = linesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Actualizar posición basado en la velocidad
      positions[ix] += velocities[ix];
      positions[iy] += velocities[iy];
      positions[iz] += velocities[iz];

      // Rebote esférico: mantenerlas fuera del centro (donde está el ASCII) y dentro del límite exterior
      const distFromCenter = Math.sqrt(positions[ix] ** 2 + positions[iy] ** 2 + positions[iz] ** 2);
      
      if (distFromCenter < INNER_RADIUS || distFromCenter > OUTER_RADIUS) {
        // Invertir velocidad y dar un pequeño empujón extra para evitar quedarse atrapadas en el borde
        velocities[ix] *= -1.05;
        velocities[iy] *= -1.05;
        velocities[iz] *= -1.05;

        // Limitar velocidad máxima
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

      // Calcular conexiones (telaraña)
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const jx = j * 3;
        const jy = j * 3 + 1;
        const jz = j * 3 + 2;

        const dx = positions[ix] - positions[jx];
        const dy = positions[iy] - positions[jy];
        const dz = positions[iz] - positions[jz];
        const distSq = dx * dx + dy * dy + dz * dz;

        // Si están lo suficientemente cerca, dibujar línea
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
      {/* Esferas de la red */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 16, 16]} />
        {/* Material translúcido para las neuronas */}
        <meshBasicMaterial transparent opacity={0.6} />
      </instancedMesh>

      {/* Telaraña / Conexiones */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
            
        {/* Material de la telaraña con un violeta/cyan sutil translúcido */}
        <lineBasicMaterial color="#6366f1" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
};

// --- COMPONENTE: Computadora ASCII (Diseño Detallado) ---
const AsciiDesktop = () => {
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = "Designing for humans...";

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  // Aseguramos que la línea mantenga un ancho fijo para que la caja ASCII no se deforme
  const maxTextLength = 23; 
  const currentTextLine = `${text}${cursorVisible ? '█' : ' '}`.padEnd(maxTextLength + 1, ' ');

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Brillo dinámico detrás de la PC */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.15)_0%,transparent_50%)] blur-xl pointer-events-none -z-10" />
      
      <pre 
        className="font-mono text-cyan-400 text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs leading-[1.1] text-left select-none relative z-20"
        style={{ textShadow: '0 0 5px rgba(45,212,191,0.8), 0 0 10px rgba(45,212,191,0.4)' }}
      >
{`           .-------------------------------------------.
 |  .-------------------------------------.  |
 |  |                                     |  |
 |  |                                     |  |
 |  |  >_ Fortress Web Studio             |  |
 |  |  >_ System Initialized              |  |
 |  |  >_ ${currentTextLine}       |  |
 |  |                                     |  |
 |  |                                     |  |
 |  '-------------------------------------'  |
 |             [===========]                 |
 '-------------------------------------------'
                       | |
                       | |
               .-------' '-------.
              /                   \\
             /_____________________\\
[  [Esc] [F1][F2][F3][F4] [F5][F6][F7]  ]
[  [\`][1][2][3][4][5][6][7][8][9][0][-][=]  ]
[  [Tab][Q][W][E][R][T][Y][U][I][O][P][ ]   ]
[  [Caps][A][S][D][F][G][H][J][K][L][;][']  ]
[  [Shift][Z][X][C][V][B][N][M][,][.][/]    ]
[  [Ctrl][Win][Alt][ Space ][Alt][Ctrl]     ]
'-------------------------------------------'`}
      </pre>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-violet-500/30 relative flex flex-col w-full overflow-x-hidden"
    >
      {/* Brillo radial del cursor */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 hidden lg:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.04), transparent 40%)`
        }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth !important; overflow-x: hidden !important; }
        body {
          background-color: #020617 !important;
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
        }
      `}} />

      {/* --- BOTÓN FLOTANTE --- */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_20px_-5px_rgba(45,212,191,0.3)] text-cyan-400 transition-all duration-500 hover:bg-slate-800 hover:scale-110 hover:border-cyan-500/50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <main className="relative z-10 w-full flex flex-col items-center">
    
        {/* --- 1. SECCIÓN HERO --- */}
        <section className="relative flex flex-col items-center justify-center min-h-[100dvh] w-full overflow-hidden pt-20 lg:pt-0">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 flex-grow">
            
            {/* TEXTO IZQUIERDO */}
            <div className="w-full lg:w-[50%] text-left flex flex-col items-start animate-[fade-in_1s_ease-out] relative z-20">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                Modern Web Development
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mt-2">
                  Built for Growing Businesses
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                Fortress Web Studio is a remote web development team focused on
                creating modern websites, custom digital solutions, and scalable
                online experiences that help businesses strengthen their presence,
                attract new customers, and achieve long-term growth.
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <a href="#who-we-are" className="px-6 py-2.5 rounded-full border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm font-medium tracking-wide">
                  Who We Are
                </a>
                <a href="#mission-values" className="px-6 py-2.5 rounded-full border border-violet-500/40 text-violet-400 hover:bg-violet-500/10 transition-colors text-sm font-medium tracking-wide">
                  Mission & Values
                </a>
                <a href="#how-we-work" className="px-6 py-2.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium tracking-wide">
                  How We Work
                </a>
              </div>
            </div>

            {/* ZONA DERECHA: COMPUTADORA + RED NEURONAL 3D */}
            <div className="w-full lg:w-[50%] h-[450px] lg:h-[650px] flex items-center justify-center relative animate-[fade-in_1.5s_ease-out]">
              
              {/* Capa 1: Canvas 3D de fondo */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                  <ambientLight intensity={1} />
                  <NeuralWeb />
                </Canvas>
              </div>
              
              {/* Capa 2: ASCII overlay por delante */}
              <div className="relative z-10 w-full flex justify-center items-center">
                <AsciiDesktop />
              </div>
              
            </div>

          </div>
        </section>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        {/* --- 2. SECCIÓN: WHO WE ARE --- */}
        <section id="who-we-are" className="w-full bg-slate-900 py-20 md:py-28 px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInSection>
              <div className="mb-10 md:mb-14 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Who We Are
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-violet-400 mt-6 rounded-full"></div>
              </div>
            </FadeInSection>
          
            <div className="space-y-8 text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose text-left md:text-center">
              <FadeInSection delay="delay-100">
                <p>
                  Fortress Web Studio is a remote-first web development company
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

              <FadeInSection delay="delay-300">
                <p>
                  Whether developing a company website, a custom platform, or a
                  complete digital experience, our goal remains the same: creating
                  reliable solutions that support business success.
                </p>
              </FadeInSection>
            </div>
          </div>
        </section>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        {/* --- 3. SECCIÓN: MISSION & VALUES --- */}
        <section id="mission-values" className="w-full bg-slate-950 py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            <div className="lg:col-span-7">
              <FadeInSection>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">Our Mission</h3>
                    <div className="h-[2px] w-16 bg-cyan-400 mt-4"></div>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    At Fortress Web Studio, our mission is to empower businesses through
                    innovative web solutions that combine exceptional design, modern
                    technology, and strategic thinking. We believe a website should be
                    more than an online presence. It should become a powerful tool that
                    supports business growth, improves customer engagement, and creates
                    lasting value.
                  </p>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    By combining technical expertise with a client-focused approach, we
                    deliver digital products designed to meet real business needs while
                    maintaining reliability, performance, and scalability.
                  </p>
                </div>
              </FadeInSection>
            </div>

            <div className="lg:col-span-5">
              <FadeInSection delay="delay-200">
                <div className="bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">Our Values</h3>
                    <div className="h-[2px] w-16 bg-violet-400 mt-4"></div>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    The foundation of Fortress Web Studio is built on principles that
                    guide every decision, project, and client relationship.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['Commitment', 'Transparency', 'Organization', 'Communication', 'Innovation', 'Reliability', 'Quality', 'Professionalism', 'Collaboration', 'Growth'].map((value) => (
                      <span key={value} className="px-4 py-2 bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-full font-medium">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            </div>

          </div>
        </section>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        {/* --- 4. SECCIÓN: HOW WE WORK --- */}
        <section id="how-we-work" className="w-full bg-slate-900 py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  How We Work
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-violet-400 to-cyan-400 mt-6 rounded-full"></div>
              </div>
            </FadeInSection>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <FadeInSection delay="delay-100">
                <div className="bg-slate-950 border-t-4 border-t-cyan-400 border-x border-b border-slate-800 rounded-2xl p-8 md:p-10 shadow-lg h-full">
                  <h4 className="text-white text-xl font-bold mb-4">Remote Collaboration</h4>
                  <p className="text-slate-400 leading-relaxed text-base">
                    Operating remotely allows us to work with businesses from different
                    locations while maintaining flexibility, responsiveness, and
                    efficient communication throughout every stage of a project.
                  </p>
                </div>
              </FadeInSection>
          
              <FadeInSection delay="delay-200">
                <div className="bg-slate-950 border-t-4 border-t-violet-400 border-x border-b border-slate-800 rounded-2xl p-8 md:p-10 shadow-lg h-full">
                  <h4 className="text-white text-xl font-bold mb-4">Organized Process</h4>
                  <p className="text-slate-400 leading-relaxed text-base">
                    Every project follows a structured workflow with clear milestones,
                    transparent planning, regular updates, and defined objectives that
                    keep progress measurable and predictable.
                  </p>
                </div>
              </FadeInSection>
          
              <FadeInSection delay="delay-300">
                <div className="bg-slate-950 border-t-4 border-t-cyan-400 border-x border-b border-slate-800 rounded-2xl p-8 md:p-10 shadow-lg h-full">
                  <h4 className="text-white text-xl font-bold mb-4">Commitment to Excellence</h4>
                  <p className="text-slate-400 leading-relaxed text-base">
                    We are committed to delivering dependable solutions, providing
                    ongoing support, and maintaining high standards of quality,
                    performance, and professionalism in every project.
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