import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { MessageCircle, Mail } from 'lucide-react';

// Asegúrate de que las rutas a tus imágenes sean correctas
import miFoto from '../images/photo.png';
import fondo from '../images/fondo.png';

// --- COMPONENTE: Animación de Scroll (Aparición/Desaparición) ---
const FadeInSection = ({ children, delay = 'delay-0' }: { children: ReactNode, delay?: string }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setVisible(entry.isIntersecting);
      });
    }, { threshold: 0.15 });

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
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
    >
      {children}
    </div>
  );
};

// --- COMPONENTE: Gafete Interactivo con Físicas (Péndulo y Resorte) ---
const DraggableBadge = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  
  const isDragging = useRef(false);
  const pos = useRef({ x: 0, y: 0 }); // Posición actual de arrastre
  const vel = useRef({ x: 0, y: 0 }); // Velocidad para el rebote
  const startMouse = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Actualiza el DOM directamente (sin re-renders de React) para 60fps ultra fluidos
  const updateTransform = () => {
    if (!containerRef.current || !badgeRef.current || !ropeRef.current) return;

    // Movimiento X genera rotación desde arriba (Efecto péndulo)
    const angle = pos.current.x * 0.12; 
    
    // Movimiento Y genera traslación del gafete y estiramiento de la cuerda
    const translateY = pos.current.y;
    
    // Altura promedio aproximada de la cuerda (para calcular cuánto se estira)
    const ropeBaseHeight = 80; 
    const scaleY = Math.max(0.1, (ropeBaseHeight + translateY) / ropeBaseHeight);

    // Aplicar transformaciones aisladas para no deformar la foto
    containerRef.current.style.transform = `rotate(${angle}deg)`;
    badgeRef.current.style.transform = `translateY(${translateY}px)`;
    ropeRef.current.style.transform = `scaleY(${scaleY})`;
  };

  // Motor de físicas para el rebote y balanceo al soltar el mouse
  const animatePhysics = () => {
    if (isDragging.current) return;

    // Físicas X (Balanceo tipo péndulo)
    vel.current.x += -pos.current.x * 0.04; // Tensión (Qué tan fuerte regresa)
    vel.current.x *= 0.94; // Fricción (Qué tanto tarda en detenerse)

    // Físicas Y (Rebote tipo liga/resorte)
    vel.current.y += -pos.current.y * 0.15; // Mayor tensión vertical
    vel.current.y *= 0.82; // Fricción más alta para que el rebote pare antes

    pos.current.x += vel.current.x;
    pos.current.y += vel.current.y;

    updateTransform();

    // Detener la animación cuando los valores son muy pequeños (ya se estabilizó)
    if (
      Math.abs(vel.current.x) > 0.1 || Math.abs(vel.current.y) > 0.1 || 
      Math.abs(pos.current.x) > 0.5 || Math.abs(pos.current.y) > 0.5
    ) {
      animationRef.current = requestAnimationFrame(animatePhysics);
    } else {
      // Regresar a la normalidad y reactivar la animación flotante CSS
      pos.current = { x: 0, y: 0 };
      updateTransform();
      containerRef.current?.classList.add('animate-swing');
    }
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    containerRef.current?.classList.remove('animate-swing');

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    startMouse.current = {
      x: clientX - pos.current.x,
      y: clientY - pos.current.y
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const newX = clientX - startMouse.current.x;
      const newY = clientY - startMouse.current.y;

      // Limitar distancias para que se sienta pesado/resistente
      pos.current.x = Math.max(-250, Math.min(250, newX * 0.6));
      pos.current.y = Math.max(-20, Math.min(180, newY * 0.6)); // No deja subirlo mucho, pero sí bajarlo

      updateTransform();
    };

    const handleUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      // Iniciar físicas de regreso al soltar
      animationRef.current = requestAnimationFrame(animatePhysics);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center mb-8 z-20 animate-[fade-in_1s_ease-out]">
      {/* "Clavo" invisible para darle realismo visual al punto de anclaje */}
      <div className="absolute -top-1 w-2.5 h-2.5 bg-slate-800 border border-slate-600 rounded-full shadow-inner z-10"></div>
      
      {/* Contenedor que Rota (Péndulo) */}
      <div 
        ref={containerRef}
        className="flex flex-col items-center origin-top select-none animate-swing"
        style={{ willChange: 'transform' }}
      >
        {/* Cuerda que se Estira */}
        <div 
          ref={ropeRef}
          className="w-[1.5px] h-16 md:h-20 bg-gradient-to-b from-slate-600 to-cyan-500/80 pointer-events-none origin-top"
          style={{ willChange: 'transform' }}
        ></div>
        
        {/* Gafete que Traslada (Más grande como lo pediste) */}
        <div 
          ref={badgeRef}
          onMouseDown={handleDown}
          onTouchStart={handleDown}
          className="relative bg-slate-900 border border-slate-700 rounded-2xl p-2.5 shadow-[0_0_30px_-10px_rgba(45,212,191,0.2)] backdrop-blur-md flex flex-col items-center cursor-grab active:cursor-grabbing hover:border-cyan-500/50 transition-colors"
          style={{ willChange: 'transform' }}
        >
          {/* Contenedor de la foto */}
          <div className="w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-xl overflow-hidden bg-slate-800 relative group pointer-events-none">
            <img 
              src={miFoto} 
              alt="Erick Alexander Castillo" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 border border-slate-700/50 rounded-xl"></div>
          </div>
          {/* Texto Restaurado */}
          <div className="text-[9px] md:text-[10px] text-slate-400 tracking-[0.15em] text-center font-mono mt-3 mb-1 uppercase font-semibold pointer-events-none">
            Computer Engineer - 2026
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function AboutMe() {
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
      
      {/* Fondo Interactivo Suave */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 hidden lg:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.04), transparent 40%)`
        }}
      />

      {/* Fallback estático para móviles */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/5 via-slate-950 to-slate-950 lg:hidden"></div>

      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth !important; }
        body {
          background-color: #020617 !important;
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
        }

        /* Animación suave para el estado inactivo del gafete */
        @keyframes swing {
          0% { transform: rotate(2deg); }
          50% { transform: rotate(-2deg); }
          100% { transform: rotate(2deg); }
        }
        .animate-swing {
          animation: swing 6s ease-in-out infinite;
          transform-origin: top center;
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
        <section className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 w-full max-w-5xl mx-auto pt-16 pb-10">
          
          <div className="w-full flex flex-col items-center justify-center flex-grow">
            
            {/* NUEVO GAFETE INTERACTIVO */}
            <DraggableBadge />

            {/* Textos y Botones */}
            <div className="text-center w-full max-w-3xl mx-auto animate-[fade-in_1.5s_ease-out]">
              <p className="text-slate-400 text-xs sm:text-sm md:text-base tracking-[0.2em] md:tracking-[0.25em] font-medium uppercase mb-4">
                Welcome to my portfolio
              </p>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight leading-tight">
                Erick Alexander Castillo
              </h1>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-8 tracking-tight">
                Full-Stack Developer
              </h2>
              
              <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-sm sm:max-w-2xl mx-auto mb-10">
                I build atmospheric, high-performance web experiences with React, 
                Node.js and modern AI integrations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 w-full sm:w-auto">
                <a
                  href="https://www.linkedin.com/in/erick-alexander-castillo-chavez-987121426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base shadow-lg"
                >
                  <span className="font-extrabold font-serif">in</span>
                  LinkedIn
                </a>

                <a
                  href="https://wa.me/523328317497?text=Hi,%20I'm%20interested."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-violet-500/50 text-violet-400 hover:bg-violet-500/10 px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base shadow-lg"
                >
                  <MessageCircle size={18} className="md:w-[20px] md:h-[20px]" />
                  WhatsApp
                </a>

                <a
                  href="mailto:erick.castillodesign@gmail.com?subject=Contacto%20desde%20tu%20web"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800 px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base shadow-lg"
                >
                  <Mail size={18} className="md:w-[20px] md:h-[20px]" />
                  Email
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-8 w-full mt-auto">
            <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center pt-2">
                <div className="w-1.5 h-2 bg-violet-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </section>

        {/* LÍNEA DIVISORA */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        {/* --- 2. SECCIÓN MISIÓN --- */}
        <section className="w-full bg-slate-900 py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInSection>
              <div className="mb-10 md:mb-14 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  My Mission
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-violet-400 mt-6 rounded-full"></div>
              </div>
            </FadeInSection>
          
            <div className="space-y-8 text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose text-left md:text-center">
              <FadeInSection delay="delay-100">
                <p>
                  I decided to begin my journey as an independent web developer with a clear
                  purpose: <span className="text-cyan-400 font-medium">
                  helping businesses build meaningful connections with the people they serve.</span>
                </p>
              </FadeInSection>

              <FadeInSection delay="delay-200">
                <p>
                  I believe technology should do more than automate processes. It should
                  create trust, improve communication, and strengthen relationships between
                  brands and their communities.
                </p>
              </FadeInSection>
          
              <FadeInSection delay="delay-300">
                <p>
                  Through modern web development, intuitive design, and intelligent digital
                  solutions, my goal is to transform ideas into experiences that bring
                  businesses and people closer together while driving long-term growth.
                </p>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* LÍNEA DIVISORA */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        {/* --- 3. SECCIÓN SOBRE MÍ --- */}
        <section className="w-full bg-slate-950 py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <div className="mb-12 md:mb-16 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
                  About Me & Academic Trajectory
                </h3>
                <div className="h-1 w-32 bg-gradient-to-r from-violet-400 to-cyan-400 mt-6 rounded-full"></div>
              </div>
            </FadeInSection>

            <FadeInSection delay="delay-100">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl w-full">
                <div className="h-48 sm:h-64 md:h-[350px] lg:h-[400px] relative bg-slate-950 w-full border-b border-slate-800">
                  <img 
                    src={fondo} 
                    alt="CUCEI Architecture" 
                    className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 md:bottom-8 md:left-10 bg-slate-950/80 px-5 py-2.5 rounded-xl backdrop-blur-md border border-slate-800">
                    <span className="text-xs sm:text-sm md:text-base text-violet-400 font-mono tracking-widest uppercase">
                      Alma mater • CUCEI UDG
                    </span>
                  </div>
                </div>
                
                <div className="p-8 md:p-12 lg:p-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                      I'm a Computer engineer graduate with a strong university foundation in software engineering, algorithms and 
                      distributed systems. During my studies I specialized in modern web development, focusing on <span className="text-cyan-400 font-medium">React</span> and <span className="text-cyan-400 font-medium">Node.js</span>, and led several academic projects around machine learning and AI integration.
                    </p>
                    <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                      Today I bring 2 years of experience to designing and shipping full-stack products that combine clean architecture with AI-powered features — from intelligent automation pipelines to high-performance systems — always with an obsession for detail, performance, and great user experience.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-10 md:mt-12">
                    {['React', 'Node.js', 'TypeScript', 'AI Integration', 'PostgreSQL', 'Tailwind CSS'].map((skill) => (
                      <span key={skill} className="px-5 py-2.5 bg-slate-950 border border-slate-700 text-slate-200 text-sm md:text-base rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* LÍNEA DIVISORA */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        {/* --- 4. SECCIÓN EXPERIENCIA --- */}
        <section className="w-full bg-slate-900 py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <FadeInSection>
              <div className="mb-12 md:mb-16 flex flex-col items-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
                  Professional Experience
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-violet-400 mt-6 rounded-full"></div>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 w-full">
              
              <FadeInSection delay="delay-100">
                <div className="bg-slate-950 border-t-4 border-t-cyan-400 border-x border-b border-slate-800 rounded-3xl p-8 md:p-10 flex flex-col h-full shadow-lg">
                  <div className="mb-6">
                    <span className="inline-block px-4 py-1.5 bg-slate-900 text-slate-400 text-xs md:text-sm rounded-full border border-slate-800 mb-6">
                      2026 — Present
                    </span>
                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">Data Analyst Intern</h4>
                    <h5 className="text-cyan-400 text-lg md:text-xl font-medium">Eaton Cooper Power Series</h5>
                  </div>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 flex-grow">
                    Accelerated workflow efficiency through targeted data reporting, database 
                    administration, and advanced Office-based information management.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Data Analysis', 'Database Admin', 'Reporting', 'Management'].map((tech) => (
                      <span key={tech} className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection delay="delay-200">
                <div className="bg-slate-950 border-t-4 border-t-violet-400 border-x border-b border-slate-800 rounded-3xl p-8 md:p-10 flex flex-col h-full shadow-lg">
                  <div className="mb-6">
                    <span className="inline-block px-4 py-1.5 bg-slate-900 text-slate-400 text-xs md:text-sm rounded-full border border-slate-800 mb-6">
                      2024 — 2026
                    </span>
                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">Assistant Programmer</h4>
                    <h5 className="text-violet-400 text-lg md:text-xl font-medium">DIVTIC LAB, UDG</h5>
                  </div>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 flex-grow">
                    Supported development activities related to databases, web applications, 
                    and mobile programming. Applied academic knowledge to real technical projects 
                    in a collaborative lab environment.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Web Dev', 'Databases', 'Mobile', 'Problem Solving'].map((tech) => (
                      <span key={tech} className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}