import { useState, useEffect, useRef } from 'react';

// --- COMPONENTE: Computadora ASCII Animada ---
const AsciiComputer = () => {
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
    <div className="relative font-mono text-sky-400 text-[10px] sm:text-xs md:text-sm leading-tight bg-[#0f172a] border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl shadow-indigo-500/10">
      <pre className="whitespace-pre-wrap">
{`   .=================================.
   | ............................... |
   | .                             . |
   | .  >_ Hello_                  . |
   | .                             . |
   | .  ${text}${cursorVisible ? '█' : ' '} `}
{/* Espacios vacíos para mantener la altura */}
{`  . |
   | .                             . |
   | ............................... |
   '================================='
               ||     ||
            ___||_____||___
           /###############\\
          /=================\\
`}
      </pre>
      {/* Reflejo sutil en la "pantalla" */}
      <div className="absolute top-8 left-8 right-8 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-sm" />
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#0b1120] text-slate-300 font-sans selection:bg-indigo-500/30 relative flex flex-col w-full overflow-x-hidden"
    >
      {/* Fondo Interactivo Suave */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 hidden lg:block"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.05), transparent 40%)`
        }}
      />

      {/* Fallback estático para móviles */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0b1120] to-[#0b1120] lg:hidden" />

      {/* Estilos Globales */}
      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          background-color: #0b1120 !important;
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
        }
        @keyframes swing {
          0% { transform: rotate(3deg); }
          50% { transform: rotate(-3deg); }
          100% { transform: rotate(3deg); }
        }
      `}} />

      <main className="relative z-10 w-full flex flex-col items-center pb-12 md:pb-20">
    
        {/* --- 1. SECCIÓN HERO --- */}
        <section className="relative flex items-center justify-center min-h-[100dvh] px-4 sm:px-6 w-full max-w-7xl mx-auto py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 lg:gap-8">
            
            {/* Izquierda: Texto */}
            <div className="w-full lg:w-[55%] text-left flex flex-col items-start pt-12 lg:pt-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <p className="text-sky-300 text-xs font-medium tracking-widest uppercase">
                  Fortress Web Studio
                </p>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                Modern Web Development
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mt-2">
                  Built for Growing Businesses
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
                Fortress Web Studio is a remote web development team focused on
                creating modern websites, custom digital solutions, and scalable
                online experiences that help businesses strengthen their presence,
                attract new customers, and achieve long-term growth.
              </p>
            </div>

            {/* Derecha: Computadora ASCII */}
            <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
              <div className="animate-[swing_6s_ease-in-out_infinite] origin-top">
                <AsciiComputer />
              </div>
            </div>

          </div>
        </section>

        {/* Icono de scroll */}
        <div className="flex justify-center pb-12 md:pb-24 w-full">
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* --- 2. SECCIÓN: WHO WE ARE (Diseño limpio y central) --- */}
        <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-12 mx-auto">
          <div className="mb-8 md:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Who We Are
            </h3>
            <div className="h-[2px] w-16 bg-indigo-500 mt-4"></div>
          </div>
        
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
        </section>


        {/* --- 3. SECCIÓN: MISSION & VALUES (Grid asimétrico para romper monotonía) --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* Mission (Izquierda - Ocupa más espacio) */}
            <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  Our Mission
                </h3>
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
            </div>

            {/* Values (Derecha - Ocupa menos espacio pero con contraste) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#161f33] to-[#111827] border border-slate-700/50 rounded-3xl p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Our Values
              </h3>
              <p className="text-slate-400 leading-relaxed mb-8">
                The foundation of Fortress Web Studio is built on principles that
                guide every decision, project, and client relationship.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  'Commitment', 'Transparency', 'Organization',
                  'Communication', 'Innovation', 'Reliability',
                  'Quality', 'Professionalism', 'Collaboration', 'Growth',
                ].map((value) => (
                  <span
                    key={value}
                    className="px-4 py-2 bg-[#0b1120] border border-slate-700 text-sky-300 text-sm rounded-full transition-colors"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* --- 4. SECCIÓN: HOW WE WORK (Tarjetas tipográficas sin iconos) --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mx-auto">
          <div className="mb-8 md:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              How We Work
            </h3>
            <div className="h-[2px] w-16 bg-sky-500 mt-4"></div>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="group relative bg-[#111827] hover:bg-[#161f33] border border-slate-800 transition-all duration-300 rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h4 className="text-sky-400 text-xl font-semibold mb-4">
                Remote Collaboration
              </h4>
              <p className="text-slate-400 leading-relaxed text-base">
                Operating remotely allows us to work with businesses from different
                locations while maintaining flexibility, responsiveness, and
                efficient communication throughout every stage of a project.
              </p>
            </div>
        
            <div className="group relative bg-[#111827] hover:bg-[#161f33] border border-slate-800 transition-all duration-300 rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h4 className="text-sky-400 text-xl font-semibold mb-4">
                Organized Process
              </h4>
              <p className="text-slate-400 leading-relaxed text-base">
                Every project follows a structured workflow with clear milestones,
                transparent planning, regular updates, and defined objectives that
                keep progress measurable and predictable.
              </p>
            </div>
        
            <div className="group relative bg-[#111827] hover:bg-[#161f33] border border-slate-800 transition-all duration-300 rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h4 className="text-sky-400 text-xl font-semibold mb-4">
                Commitment to Excellence
              </h4>
              <p className="text-slate-400 leading-relaxed text-base">
                We are committed to delivering dependable solutions, providing
                ongoing support, and maintaining high standards of quality,
                performance, and professionalism in every project.
              </p>
            </div>
        
          </div>
        </section>
        
      </main>
    </div>
  );
}