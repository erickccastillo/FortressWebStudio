import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  GraduationCap, 
  Briefcase,
  Mail 
} from 'lucide-react';
import miFoto from '../images/photo.png';
import fondo from '../images/fondo.png';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#050810] text-slate-200 font-sans selection:bg-cyan-500/30 relative flex flex-col w-full overflow-x-hidden"
    >
      
      {/* Efecto de resplandor de fondo interactivo (Solo PC) */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 hidden lg:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.08), transparent 40%)`
        }}
      />
      
      {/* Fallback de fondo estático para móviles y tablets */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050810] to-[#050810] lg:hidden"></div>

      {/* Humo animado (se ajusta en móvil para no desbordar) */}
      <div className="fixed -left-[30%] md:-left-[10%] top-[10%] w-[80%] md:w-[40%] lg:w-[30%] h-[60%] bg-cyan-900/20 rounded-full blur-[80px] md:blur-[130px] pointer-events-none z-0 animate-smoke-left"></div>
      <div className="fixed -right-[30%] md:-right-[10%] top-[20%] w-[80%] md:w-[40%] lg:w-[30%] h-[60%] bg-cyan-900/20 rounded-full blur-[80px] md:blur-[130px] pointer-events-none z-0 animate-smoke-right"></div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Forzar el fondo oscuro y eliminar scroll horizontal a nivel global */
        html, body {
          background-color: #050810 !important;
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
          width: 100%;
        }

        @keyframes swing {
          0% { transform: rotate(3deg); }
          50% { transform: rotate(-3deg); }
          100% { transform: rotate(3deg); }
        }
        .animate-swing {
          animation: swing 4s ease-in-out infinite;
          transform-origin: top center;
        }
        
        @keyframes smoke-left {
          0% { transform: translateX(-10%) scale(1); opacity: 0.3; }
          50% { transform: translateX(10%) scale(1.1); opacity: 0.7; }
          100% { transform: translateX(-10%) scale(1); opacity: 0.3; }
        }
        @keyframes smoke-right {
          0% { transform: translateX(10%) scale(1); opacity: 0.3; }
          50% { transform: translateX(-10%) scale(1.1); opacity: 0.7; }
          100% { transform: translateX(10%) scale(1); opacity: 0.3; }
        }
        .animate-smoke-left {
          animation: smoke-left 12s ease-in-out infinite;
        }
        .animate-smoke-right {
          animation: smoke-right 15s ease-in-out infinite;
        }
      `}} />

      <main className="relative z-10 w-full flex flex-col items-center pb-12 md:pb-20">
    
        {/* --- SECCIÓN HERO --- */}
        <section className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-6 w-full max-w-[1200px] mx-auto py-10">
          
          {/* Foto colgante responsiva */}
          <div className="flex flex-col items-center mb-6 md:mb-8 animate-swing origin-top">
            <div className="w-[1px] h-12 md:h-16 lg:h-20 bg-gradient-to-b from-transparent to-cyan-500/50"></div>
            <div className="relative bg-[#0d1421] border border-cyan-900/40 rounded-2xl p-2 md:p-3 shadow-[0_0_40px_rgba(6,182,212,0.1)] backdrop-blur-md flex flex-col items-center">
              <div className="w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-xl overflow-hidden bg-slate-800 relative group">
                <img 
                  src={miFoto} 
                  alt="Erick Alexander Castillo" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 border border-cyan-500/30 rounded-xl pointer-events-none"></div>
              </div>
              <div className="text-[9px] md:text-[10px] text-cyan-500 tracking-[0.2em] text-center font-mono mt-2 md:mt-3 mb-1 uppercase font-semibold opacity-80">
                Computer Engineer - 2026
              </div>
            </div>
          </div>

          {/* Textos y Botones */}
          <div className="text-center w-full max-w-3xl mx-auto">
            <p className="text-cyan-500 text-xs sm:text-sm md:text-base tracking-[0.2em] md:tracking-[0.25em] font-medium uppercase mb-3 md:mb-4">
              Welcome to my portfolio
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight leading-tight">
              Erick Alexander Castillo
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-cyan-400 mb-6 md:mb-8 tracking-tight">
              Full-Stack Developer
            </h2>
            
            <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-sm sm:max-w-2xl mx-auto mb-8 md:mb-10">
              I build atmospheric, high-performance web experiences with React, 
              Node.js and modern AI integrations.
            </p>

            {/* Contenedor de botones adaptativo */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 w-full sm:w-auto">
              <a
                href="https://www.linkedin.com/in/erick-alexander-castillo-chavez-987121426"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 sm:px-8 py-3 md:py-3.5 rounded-full font-bold transition-all duration-200 text-sm md:text-base shadow-lg shadow-cyan-500/20 hover:-translate-y-1"
              >
                <span className="font-extrabold">in</span>
                LinkedIn
              </a>

              <a
                href="https://wa.me/523328317497?text=Hi,%20I'm%20interested."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0f1623] border border-slate-700 hover:border-slate-500 hover:bg-[#151e2f] text-white px-6 sm:px-8 py-3 md:py-3.5 rounded-full font-medium transition-all duration-200 text-sm md:text-base hover:-translate-y-1"
              >
                <MessageCircle size={18} className="md:w-[20px] md:h-[20px]" />
                WhatsApp
              </a>

              <a
                href="mailto:erick.castillodesign@gmail.com?subject=Contacto%20desde%20tu%20web"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0f1623] border border-slate-700 hover:border-slate-500 hover:bg-[#151e2f] text-white px-6 sm:px-8 py-3 md:py-3.5 rounded-full font-medium transition-all duration-200 text-sm md:text-base hover:-translate-y-1"
              >
                <Mail size={18} className="md:w-[20px] md:h-[20px]" />
                Email
              </a>
            </div>
          </div>
        </section>

        {/* Icono de scroll (Visible en todas las pantallas) */}
<div className="flex justify-center pb-12 md:pb-20 w-full">
  <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center pt-2">
      <div className="w-1.5 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
  </div>
</div>
    {/* --- SECCIÓN MISIÓN --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 mx-auto">
          <div className="mb-8 md:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              My Mission
            </h3>
            <div className="h-[2px] w-16 bg-cyan-500 mt-4"></div>
          </div>
        
          <div className="bg-[#0d131f] border border-slate-800 rounded-2xl md:rounded-3xl p-8 md:p-12 hover:border-cyan-900/50 transition-all">
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose max-w-5xl">
              I decided to begin my journey as an independent web developer with a clear
              purpose: <span className="text-cyan-400 font-medium">
              helping businesses build meaningful connections with the people they serve.</span>
              I believe technology should do more than automate processes. It should
              create trust, improve communication, and strengthen relationships between
              brands and their communities.
            </p>
        
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose max-w-5xl">
              Through modern web development, intuitive design, and intelligent digital
              solutions, my goal is to transform ideas into experiences that bring
              businesses and people closer together while driving long-term growth.
            </p>
          </div>
        </section>
        {/* --- SECCIÓN SOBRE MÍ --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 mx-auto">
          <div className="mb-8 md:mb-12">
            <h3 className="flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              <GraduationCap className="text-cyan-400 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
              <span className="leading-tight">About Me & Academic Trajectory</span>
            </h3>
            <div className="h-[2px] w-16 bg-cyan-500 mt-4"></div>
          </div>

          <div className="bg-[#0d131f] border border-slate-800/80 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl w-full transition-all hover:border-slate-700">
            <div className="h-48 sm:h-64 md:h-[350px] lg:h-[450px] relative bg-slate-900 w-full">
              <img 
                src={fondo} 
                alt="CUCEI Architecture" 
                className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] via-[#0d131f]/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 md:bottom-8 md:left-10 bg-[#0d131f]/80 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-800/50">
                <span className="text-xs sm:text-sm md:text-base text-cyan-400 font-mono tracking-widest uppercase">Alma mater • CUCEI UDG</span>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="space-y-5 md:space-y-8 text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed md:leading-loose max-w-5xl">
                <p>
                  I'm a Computer engineer graduate with a strong university foundation in software engineering, algorithms and 
                  distributed systems. During my studies I specialized in modern web development, focusing on <span className="text-cyan-400 font-medium">React</span> and <span className="text-cyan-400 font-medium">Node.js</span>, and led several academic projects around machine learning and AI integration.
                </p>
                <p>
                  Today I bring 2 years of experience to designing and shipping full-stack products that combine clean architecture with AI-powered features — from intelligent automation pipelines to high-performance systems — always with an obsession for detail, performance, and great user experience.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mt-8 md:mt-12">
                {['React', 'Node.js', 'TypeScript', 'AI Integration', 'PostgreSQL', 'Tailwind CSS'].map((skill) => (
                  <span key={skill} className="px-4 md:px-5 py-2 md:py-2.5 bg-[#121b29] border border-slate-700/50 text-cyan-300 text-xs sm:text-sm md:text-base rounded-full hover:bg-cyan-900/20 hover:border-cyan-500/50 transition-all cursor-default shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN EXPERIENCIA --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-20 mx-auto">
          <div className="mb-8 md:mb-12">
            <h3 className="flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              <Briefcase className="text-cyan-400 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
              <span>Professional Experience</span>
            </h3>
            <div className="h-[2px] w-16 bg-cyan-500 mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 w-full">
            
            <div className="bg-[#0d131f] border border-slate-800 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col hover:border-cyan-900/50 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(6,182,212,0.05)] transition-all duration-300 group">
              <div className="mb-5 md:mb-6">
                <span className="inline-block px-4 py-1.5 bg-[#121b29] text-slate-400 text-xs md:text-sm rounded-full border border-slate-800 mb-4 group-hover:border-cyan-900/50 group-hover:text-cyan-400 transition-colors">
                  2026 — Present
                </span>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Data Analyst Intern</h4>
                <h5 className="text-cyan-400 text-base sm:text-lg md:text-xl font-medium">Eaton Cooper Power Series</h5>
              </div>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed md:leading-loose mb-8 flex-grow">
                Accelerated workflow efficiency through targeted data reporting, database 
                administration, and advanced Office-based information management.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-auto">
                {['Data Analysis', 'Database Admin', 'Reporting', 'Management'].map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-[#121b29] border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-lg group-hover:border-slate-700 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#0d131f] border border-slate-800 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col hover:border-cyan-900/50 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(6,182,212,0.05)] transition-all duration-300 group">
              <div className="mb-5 md:mb-6">
                <span className="inline-block px-4 py-1.5 bg-[#121b29] text-slate-400 text-xs md:text-sm rounded-full border border-slate-800 mb-4 group-hover:border-cyan-900/50 group-hover:text-cyan-400 transition-colors">
                  2024 — 2026
                </span>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Assistant Programmer</h4>
                <h5 className="text-cyan-400 text-base sm:text-lg md:text-xl font-medium">DIVTIC LAB, UDG</h5>
              </div>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed md:leading-loose mb-8 flex-grow">
                Supported development activities related to databases, web applications, 
                and mobile programming. Applied academic knowledge to real technical projects 
                in a collaborative lab environment.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-auto">
                {['Web Dev', 'Databases', 'Mobile', 'Problem Solving'].map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-[#121b29] border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-lg group-hover:border-slate-700 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
