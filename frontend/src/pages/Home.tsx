import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Html, OrbitControls } from '@react-three/drei';
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

// --- COMPONENTES 3D: Planeta y Computadora ---
const PlanetScene = ({ text, cursorVisible }: { text: string, cursorVisible: boolean }) => {
  const laptopRef = useRef<THREE.Group>(null);
  const planetRef1 = useRef<THREE.Mesh>(null);
  const planetRef2 = useRef<THREE.Mesh>(null);

  // Animaciones cuadro por cuadro
  useFrame((state, delta) => {
    // 1. La computadora ASCII es la protagonista que gira rápido en el centro
    if (laptopRef.current) {
      laptopRef.current.rotation.y -= delta * 0.5; // Giro constante
      laptopRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.1; // Leve balanceo
    }
    
    // 2. El planeta de fondo gira muy lentamente para dar contexto
    if (planetRef1.current) {
      planetRef1.current.rotation.y += delta * 0.05;
      planetRef1.current.rotation.x += delta * 0.02;
    }
    if (planetRef2.current) {
      planetRef2.current.rotation.y -= delta * 0.03;
      planetRef2.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <>
      {/* Esfera 1 (Planeta principal - Cyan) */}
      <Sphere ref={planetRef1} args={[2.5, 24, 24]}>
        <meshBasicMaterial color="#2dd4bf" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Esfera 2 (Planeta interior/atmósfera - Violeta) */}
      <Sphere ref={planetRef2} args={[2.3, 16, 16]}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.1} />
      </Sphere>

      {/* Grupo independiente para la computadora que gira */}
      <group ref={laptopRef}>
        {/* En lugar de scale, usamos distanceFactor=7.5 para mantener proporciones estables en 3D */}
        <Html transform center distanceFactor={7.5} zIndexRange={[100, 0]}>
          {/* w-max asegura que el ASCII no haga saltos de línea por falta de espacio */}
          <div className="w-max relative font-mono text-cyan-400 text-[10px] sm:text-xs leading-tight bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 p-6 md:p-8 rounded-2xl shadow-[0_0_50px_-10px_rgba(45,212,191,0.3)] pointer-events-none select-none">
            <pre className="whitespace-pre-wrap relative z-10 text-left">
{`   .=================================.
   | ............................... |
   | .                               . |
   | .  >_ Hello_                    . |
   | .                               . |
   | .  ${text}${cursorVisible ? '█' : ' '} `}
{/* Espacios vacíos para mantener la altura */}
{`  . |
   | .                               . |
   | ............................... |
   '================================='
                ||     ||
             ___||_____||___
            /###############\\
           /=================\\
`}
            </pre>
            <div className="absolute top-8 left-8 right-8 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-sm z-20" />
          </div>
        </Html>
      </group>
    </>
  );
};

// --- COMPONENTE: Computadora ASCII 3D (Contenedor) ---
const AsciiPlanetComputer = () => {
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = "Designing for humans...\nBuilding the web_";

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

  return (
    <div className="w-full h-[350px] sm:h-[400px] lg:h-[450px] relative cursor-move flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <PlanetScene text={text} cursorVisible={cursorVisible} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.05)_0%,transparent_60%)] pointer-events-none -z-10" />
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
      /* Nota: eliminamos overflow-x-hidden de este div principal porque puede entrar en conflicto con el renderizado CSS3D en Safari/Chrome */
      className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-violet-500/30 relative flex flex-col w-full"
    >
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
        <section className="relative flex flex-col items-center justify-center min-h-[100dvh] w-full pt-10 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 flex-grow">
            
            <div className="w-full lg:w-[55%] text-left flex flex-col items-start pt-12 lg:pt-0 animate-[fade-in_1s_ease-out] relative z-20">
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

            <div className="w-full lg:w-[45%] flex justify-center lg:justify-end pb-12 lg:pb-0 animate-[fade-in_1.5s_ease-out]">
              <AsciiPlanetComputer />
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
