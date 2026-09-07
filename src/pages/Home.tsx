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
      className="min-h-screen bg-[#050810] text-slate-200 font-sans selection:bg-cyan-500/30 relative overflow-x-hidden"
    >
      
      {/* Efecto de resplandor de fondo interactivo */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.08), transparent 40%)`
        }}
      />
      {/* Fallback de fondo para móviles sin hover */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050810] to-[#050810] md:hidden"></div>

      {/* Humo animado (se ajusta en móvil para no desbordar) */}
      <div className="fixed -left-[20%] md:-left-[10%] top-[10%] w-[50%] md:w-[30%] h-[60%] bg-cyan-900/20 rounded-full blur-[80px] md:blur-[130px] pointer-events-none z-0 animate-smoke-left"></div>
      <div className="fixed -right-[20%] md:-right-[10%] top-[20%] w-[50%] md:w-[30%] h-[60%] bg-cyan-900/20 rounded-full blur-[80px] md:blur-[130px] pointer-events-none z-0 animate-smoke-right"></div>

      <style dangerouslySetInnerHTML={{__html: `
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

      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* --- SECCIÓN HERO --- */}
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] pt-20 pb-16 px-4 sm:px-6 w-full max-w-[1400px]">
          
          <div className="flex flex-col items-center mb-8 md:mb-12 animate-swing origin-top">
  <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-transparent to-cyan-500/50"></div>
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

          <div className="text-center w-full">
            <p className="text-cyan-500 text-xs sm:text-sm md:text-base tracking-[0.2em] md:tracking-[0.25em] font-medium uppercase mb-3 md:mb-4">
              Welcome to my portfolio
            </p>
            {/* Tamaños de fuente fluidos para nombres largos */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 tracking-tight leading-tight px-2">
              Erick Alexander Castillo
            </h1>
            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-cyan-400 mb-6 md:mb-8 tracking-tight">
              Full-Stack Developer
            </h2>
            
            <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-sm sm:max-w-2xl mx-auto mb-8 md:mb-12 px-4">
              I build atmospheric, high-performance web experiences with React, 
              Node.js and modern AI integrations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4 w-full sm:w-auto">
              {/* Botón de LinkedIn */}
              <a
                href="https://www.linkedin.com/in/erick-alexander-castillo-chavez-987121426"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 py-3 md:py-3.5 rounded-full font-bold transition-colors duration-200 text-sm md:text-base shadow-lg shadow-cyan-500/20"
              >
                <span className="font-extrabold">in</span>
                LinkedIn
              </a>

              {/* Botón de WhatsApp */}
              <a
                href="https://wa.me/523328317497?text=Hi,%20I'm%20interested."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0f1623] border border-slate-700 hover:border-slate-500 text-white px-6 py-3 md:py-3.5 rounded-full font-medium transition-all duration-200 text-sm md:text-base"
              >
                <MessageCircle size={18} className="md:w-[20px] md:h-[20px]" />
                WhatsApp
              </a>

              {/* Botón de Email */}
              <a
                href="mailto:erick.castillodesign@example.com?subject=Contacto%20desde%20tu%20web"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0f1623] border border-slate-700 hover:border-slate-500 text-white px-6 py-3 md:py-3.5 rounded-full font-medium transition-all duration-200 text-sm md:text-base"
              >
                <Mail size={18} className="md:w-[20px] md:h-[20px]" />
                Email
              </a>
            </div>
          </div>
        </section>

        <div className="flex justify-center pb-12 md:pb-20 w-full hidden sm:flex">
          <div className="w-5 h-8 border border-slate-700 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* --- SECCIÓN SOBRE MÍ --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 py-12 md:py-16">
          <div className="mb-6 md:mb-8">
            <h3 className="flex items-center gap-2 md:gap-3 text-xl sm:text-2xl md:text-3xl font-bold text-white">
              <GraduationCap className="text-cyan-400 w-6 h-6 md:w-8 md:h-8" />
              About Me & Academic Trajectory
            </h3>
            <div className="h-[1px] w-12 bg-cyan-500 mt-3 md:mt-4"></div>
          </div>

          <div className="bg-[#0d131f] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full">
            <div className="h-40 sm:h-56 md:h-[400px] relative bg-slate-900 w-full">
              <img 
                src={fondo} 
                alt="CUCEI Architecture" 
                className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] via-[#0d131f]/60 to-transparent"></div>
              <div className="absolute bottom-3 left-4 md:bottom-6 md:left-8">
                <span className="text-[10px] sm:text-xs md:text-sm text-cyan-400 font-mono tracking-[0.1em] md:tracking-wider">Alma mater • CUCEI UDG</span>
              </div>
            </div>
            
            <div className="p-5 sm:p-8 md:p-12 lg:p-14">
              <div className="space-y-4 md:space-y-6 text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed md:leading-loose max-w-5xl">
                <p>
                  I'm a Computer engineer graduate with a strong university foundation in software engineering, algorithms and 
                  distributed systems. During my studies I specialized in modern web development, focusing on <span className="text-cyan-400 font-medium">React</span> and <span className="text-cyan-400 font-medium">Node.js</span>, and led several academic projects around machine learning and AI integration.
                </p>
                <p>
                  Today I bring 2 years of experience to designing and shipping full-stack products that combine clean architecture with AI-powered features — from intelligent automation pipelines to high-performance systems — always with an obsession for detail, performance, and great user experience.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-3 mt-6 md:mt-10">
                {['React', 'Node.js', 'TypeScript', 'AI Integration', 'PostgreSQL', 'Tailwind CSS'].map((skill) => (
                  <span key={skill} className="px-3 md:px-4 py-1 md:py-1.5 bg-[#121b29] border border-slate-700/50 text-cyan-300 text-xs sm:text-sm md:text-base rounded-full hover:bg-[#182436] hover:border-cyan-900/50 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN EXPERIENCIA --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 py-12 md:py-16 mb-12 md:mb-20">
          <div className="mb-8 md:mb-10">
            <h3 className="flex items-center gap-2 md:gap-3 text-xl sm:text-2xl md:text-3xl font-bold text-white">
              <Briefcase className="text-cyan-400 w-5 h-5 md:w-8 md:h-8" />
              Professional Experience
            </h3>
            <div className="h-[1px] w-12 bg-cyan-500 mt-3 md:mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 w-full">
            
            <div className="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col hover:border-cyan-900/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] transition-all duration-300 group">
              <div className="mb-4 md:mb-6">
                <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-[#121b29] text-slate-400 text-[10px] md:text-sm rounded-full border border-slate-800 mb-3 md:mb-4 group-hover:border-slate-700 transition-colors">
                  2026 — Present
                </span>
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Data Analyst Intern</h4>
                <h5 className="text-cyan-400 text-sm sm:text-base md:text-lg font-medium">Eaton Cooper Power Series</h5>
              </div>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed md:leading-loose mb-6 md:mb-8 flex-grow">
                Accelerated workflow efficiency through targeted data reporting, database 
                administration, and advanced Office-based information management.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-2.5">
                {['Data Analysis', 'Database Admin', 'Reporting', 'Information Management'].map((tech) => (
                  <span key={tech} className="px-2.5 md:px-3 py-1 md:py-1.5 bg-[#121b29] border border-slate-800 text-slate-300 text-[10px] sm:text-xs md:text-sm rounded-full group-hover:border-slate-700 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#0d131f] border border-slate-800 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col hover:border-cyan-900/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] transition-all duration-300 group">
              <div className="mb-4 md:mb-6">
                <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-[#121b29] text-slate-400 text-[10px] md:text-sm rounded-full border border-slate-800 mb-3 md:mb-4 group-hover:border-slate-700 transition-colors">
                  2024 — 2026
                </span>
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Assistant Programmer / Intern</h4>
                <h5 className="text-cyan-400 text-sm sm:text-base md:text-lg font-medium">DIVTIC LAB, University of Guadalajara</h5>
              </div>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed md:leading-loose mb-6 md:mb-8 flex-grow">
                Supported development activities related to databases, web applications, 
                and mobile programming. Applied academic knowledge to real technical projects 
                in a collaborative lab environment, contributing to software-related tasks 
                involving data handling, logic, and solution development.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-2.5">
                {['Web Dev', 'Databases', 'Mobile Programming', 'Problem Solving'].map((tech) => (
                  <span key={tech} className="px-2.5 md:px-3 py-1 md:py-1.5 bg-[#121b29] border border-slate-800 text-slate-300 text-[10px] sm:text-xs md:text-sm rounded-full group-hover:border-slate-700 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="w-full border-t border-slate-900 bg-[#03050a] py-6 md:py-8 px-4 sm:px-6">
          <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs md:text-sm text-center md:text-left">
              © 2026 Erick Alexander Castillo Chavez. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-6 text-slate-500 font-bold text-sm md:text-base">
              <a href="https://github.com/erickccastillo" className="hover:text-cyan-400 transition-colors">GH</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
