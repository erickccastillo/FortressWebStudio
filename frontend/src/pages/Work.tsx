import { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import bazar from '../images/bazar.png'; 
// --- TIPO DE DATOS PARA TS ---
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  liveUrl: string;
  tags: string[];
}

// --- TUS PROYECTOS ---
const projects: Project[] = [
  {
    id: 1,
    title: "Fortress Bazar",
    category: "Web Development",
    description: "Fortress Bazar is a responsive, full-stack e-commerce web app for a streetwear store, featuring a dynamic catalog, direct WhatsApp ordering, and a secure admin dashboard for inventory management.",
    image: bazar,
    liveUrl: "https://fortressbazar.onrender.com/",
    tags: ["React", "Node.js", "Tailwind CSS"]
  }
];

export default function Work() {
  // --- LÓGICA DEL FONDO INTERACTIVO ---
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
      className="min-h-screen bg-[#050810] text-slate-200 font-sans selection:bg-cyan-500/30 relative flex flex-col w-full overflow-x-hidden pt-24 md:pt-32"
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

      {/* Estilos Globales de la vista */}
      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          background-color: #050810 !important;
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
          width: 100%;
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

      <main className="relative z-10 w-full flex flex-col items-center pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    
        {/* --- ENCABEZADO DE LA SECCIÓN --- */}
        <section className="w-full mb-12 md:mb-16">
          <div className="flex flex-col items-start">
            <p className="text-cyan-500 text-xs sm:text-sm tracking-[0.2em] font-medium uppercase mb-3">
              Portfolio
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Selected <span className="text-cyan-400">Work</span>
            </h1>
            <div className="h-[2px] w-16 bg-cyan-500 mt-6"></div>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mt-6">
              A collection of projects showcasing my focus on clean architecture, high performance, and AI-powered modern web experiences.
            </p>
          </div>
        </section>

        {/* --- GRID DE PROYECTOS --- */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-[#0d131f] border border-slate-800/80 rounded-2xl md:rounded-3xl flex flex-col overflow-hidden hover:border-cyan-900/50 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(6,182,212,0.05)] transition-all duration-300 group"
            >
              
              {/* Contenedor de la Imagen */}
              <div className="h-48 sm:h-56 relative bg-slate-900 w-full overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out"
                />
                {/* Gradiente inferior para fusionar la imagen con la tarjeta */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] via-[#0d131f]/40 to-transparent pointer-events-none"></div>
                
                {/* Pill Flotante (Categoría) */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 bg-[#050810]/80 backdrop-blur-md border border-cyan-900/50 text-cyan-400 text-[10px] md:text-xs font-mono uppercase tracking-widest rounded-lg">
                    {project.category}
                  </span>
                </div>
              </div>
              
              {/* Contenido de la Tarjeta */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>
                
                {/* Tags Tecnológicos */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1.5 bg-[#121b29] border border-slate-800 text-slate-300 text-xs rounded-lg group-hover:border-slate-700 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Botones de Enlace (Footer de la tarjeta) */}
                <div className="flex items-center gap-3 mt-auto pt-5 border-t border-slate-800/80">
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0f1623] border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm"
                  >
                    <ExternalLink size={16} />
                    <span>Live Preview</span>
                  </a>s
                </div>
              </div>

            </div>
          ))}
        </section>

      </main>
    </div>
  );
}