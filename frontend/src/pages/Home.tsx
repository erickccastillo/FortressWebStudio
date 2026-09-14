import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
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
          
        <div className="text-center w-full max-w-4xl mx-auto">
  <p className="text-cyan-500 text-xs sm:text-sm md:text-base tracking-[0.25em] font-medium uppercase mb-4">
    Fortress Web Studio
  </p>

  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
    Modern Web Development
    <span className="block text-cyan-400">
      Built for Growing Businesses
    </span>
  </h1>

  <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
    Fortress Web Studio is a remote web development team focused on
    creating modern websites, custom digital solutions, and scalable
    online experiences that help businesses strengthen their presence,
    attract new customers, and achieve long-term growth.
  </p>
</div>
        </section>

        {/* Icono de scroll (Visible en todas las pantallas) */}
<div className="flex justify-center pb-12 md:pb-20 w-full">
  <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center pt-2">
      <div className="w-1.5 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
  </div>
</div>

        
            <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 mx-auto">
          <div className="mb-8 md:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Our Mission
            </h3>
            <div className="h-[2px] w-16 bg-cyan-500 mt-4"></div>
          </div>
        
          <div className="bg-[#0d131f] border border-slate-800 rounded-3xl p-8 md:p-12">
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose">
              At Fortress Web Studio, our mission is to empower businesses through
              innovative web solutions that combine exceptional design, modern
              technology, and strategic thinking. We believe a website should be
              more than an online presence. It should become a powerful tool that
              supports business growth, improves customer engagement, and creates
              lasting value.
            </p>
        
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose mt-6">
              By combining technical expertise with a client-focused approach, we
              deliver digital products designed to meet real business needs while
              maintaining reliability, performance, and scalability.
            </p>
          </div>
        </section>


        
        {/* --- SECCIÓN SOBRE MÍ --- */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 mx-auto">
          <div className="mb-8 md:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Who We Are
            </h3>
            <div className="h-[2px] w-16 bg-cyan-500 mt-4"></div>
          </div>
        
          <div className="bg-[#0d131f] border border-slate-800 rounded-3xl p-8 md:p-12">
            <div className="space-y-6 text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose">
              <p>
                Fortress Web Studio is a remote-first web development company
                dedicated to helping businesses establish a professional and
                effective digital presence. We specialize in designing and building
                modern websites that blend great user experience with strong
                technical foundations.
              </p>
        
              <p>
                Our team works collaboratively across projects, leveraging modern
                technologies and streamlined workflows to ensure quality, efficiency,
                and consistency in every solution we deliver.
              </p>
        
              <p>
                Whether developing a company website, a custom platform, or a
                complete digital experience, our goal remains the same: creating
                reliable solutions that support business success.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN EXPERIENCIA --- */}
       <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 mx-auto">
      <div className="mb-8 md:mb-12">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          How We Work
        </h3>
        <div className="h-[2px] w-16 bg-cyan-500 mt-4"></div>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#0d131f] border border-slate-800 rounded-3xl p-8">
          <h4 className="text-cyan-400 text-xl font-semibold mb-4">
            Remote Collaboration
          </h4>
    
          <p className="text-slate-400 leading-relaxed">
            Operating remotely allows us to work with businesses from different
            locations while maintaining flexibility, responsiveness, and
            efficient communication throughout every stage of a project.
          </p>
        </div>
    
        <div className="bg-[#0d131f] border border-slate-800 rounded-3xl p-8">
          <h4 className="text-cyan-400 text-xl font-semibold mb-4">
            Organized Process
          </h4>
    
          <p className="text-slate-400 leading-relaxed">
            Every project follows a structured workflow with clear milestones,
            transparent planning, regular updates, and defined objectives that
            keep progress measurable and predictable.
          </p>
        </div>
    
        <div className="bg-[#0d131f] border border-slate-800 rounded-3xl p-8">
          <h4 className="text-cyan-400 text-xl font-semibold mb-4">
            Commitment to Excellence
          </h4>
    
          <p className="text-slate-400 leading-relaxed">
            We are committed to delivering dependable solutions, providing
            ongoing support, and maintaining high standards of quality,
            performance, and professionalism in every project.
          </p>
        </div>
    
      </div>
    </section>


        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-20 mx-auto">
  <div className="mb-8 md:mb-12">
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
      Our Values
    </h3>
    <div className="h-[2px] w-16 bg-cyan-500 mt-4"></div>
  </div>

  <div className="bg-[#0d131f] border border-slate-800 rounded-3xl p-8 md:p-12">
    <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
      The foundation of Fortress Web Studio is built on principles that
      guide every decision, project, and client relationship.
    </p>

    <div className="flex flex-wrap gap-4">
      {[
        'Commitment',
        'Transparency',
        'Organization',
        'Communication',
        'Innovation',
        'Reliability',
        'Quality',
        'Professionalism',
        'Collaboration',
        'Growth',
      ].map((value) => (
        <span
          key={value}
          className="px-5 py-2 bg-[#121b29] border border-slate-700 text-cyan-300 rounded-full"
        >
          {value}
        </span>
      ))}
    </div>
  </div>
</section>

        
      </main>
    </div>
  );
}
