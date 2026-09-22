import { useState, useEffect, useRef } from 'react';

// --- COMPONENTE: Computadora ASCII (Ahora estática) ---
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
    <div className="relative font-mono text-cyan-400 text-[10px] sm:text-xs md:text-sm leading-tight bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-2xl shadow-[0_0_40px_-10px_rgba(45,212,191,0.15)]">
      <pre className="whitespace-pre-wrap relative z-10">
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
      <div className="absolute top-8 left-8 right-8 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-sm z-20" />
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
      className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-violet-500/30 relative flex flex-col w-full overflow-x-hidden"
    >
      {/* Fondo Interactivo Suave */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 hidden lg:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.04), transparent 40%)`
        }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          background-color: #020617 !important; /* slate-950 */
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
        }
      `}} />

      <main className="relative z-10 w-full flex flex-col items-center">
    
        {/* --- 1. SECCIÓN HERO (Fondo slate-950) --- */}
        <section className="relative flex flex-col items-center justify-center min-h-[100dvh] w-full pt-10">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 flex-grow">
            
            {/* Izquierda: Texto */}
            <div className="w-full lg:w-[55%] text-left flex flex-col items-start pt-12 lg:pt-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-8 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-slate-300 text-xs font-semibold tracking-widest uppercase">
                  Fortress Web Studio
                </p>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                Modern Web Development
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mt-2">
                  Built for Growing Businesses
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
                Fortress Web Studio is a remote web development team focused on
                creating modern websites, custom digital solutions, and scalable
                online experiences that help businesses strengthen their presence,
                attract new customers, and achieve long-term growth.
              </p>
            </div>

            {/* Derecha: Computadora ASCII (Fija) */}
            <div className="w-full lg:w-[45%] flex justify-center lg:justify-end pb-12 lg:pb-0">
              <AsciiComputer />
            </div>
          </div>

          {/* Icono de scroll posicionado al fondo del Hero */}
          <div className="flex justify-center pb-8 w-full mt-auto">
            <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center pt-2">
                <div className="w-1.5 h-2 bg-violet-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </section>

        {/* LÍNEA DIVISORA BRILLANTE */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        {/* --- 2. SECCIÓN: WHO WE ARE (Fondo slate-900 alternado) --- */}
        <section className="w-full bg-slate-900 py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-10 md:mb-14 flex flex-col items-center">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Who We Are
              </h3>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-violet-400 mt-6 rounded-full"></div>
            </div>
          
            <div className="space-y-8 text-slate-300 text-lg md:text-xl leading-relaxed md:leading-loose text-left md:text-center">
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

        {/* LÍNEA DIVISORA BRILLANTE */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />


        {/* --- 3. SECCIÓN: MISSION & VALUES (Fondo slate-950) --- */}
        <section className="w-full bg-slate-950 py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* Mission */}
            <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Our Mission
                </h3>
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

            {/* Values */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Our Values
                </h3>
                <div className="h-[2px] w-16 bg-violet-400 mt-4"></div>
              </div>
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
                    className="px-4 py-2 bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-full font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* LÍNEA DIVISORA BRILLANTE */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        {/* --- 4. SECCIÓN: HOW WE WORK (Fondo slate-900 alternado) --- */}
        <section className="w-full bg-slate-900 py-20 md:py-28 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                How We Work
              </h3>
              <div className="h-1 w-24 bg-gradient-to-r from-violet-400 to-cyan-400 mt-6 rounded-full"></div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-950 border-t-4 border-t-cyan-400 border-x border-b border-slate-800 rounded-2xl p-8 md:p-10 shadow-lg">
                <h4 className="text-white text-xl font-bold mb-4">
                  Remote Collaboration
                </h4>
                <p className="text-slate-400 leading-relaxed text-base">
                  Operating remotely allows us to work with businesses from different
                  locations while maintaining flexibility, responsiveness, and
                  efficient communication throughout every stage of a project.
                </p>
              </div>
          
              <div className="bg-slate-950 border-t-4 border-t-violet-400 border-x border-b border-slate-800 rounded-2xl p-8 md:p-10 shadow-lg">
                <h4 className="text-white text-xl font-bold mb-4">
                  Organized Process
                </h4>
                <p className="text-slate-400 leading-relaxed text-base">
                  Every project follows a structured workflow with clear milestones,
                  transparent planning, regular updates, and defined objectives that
                  keep progress measurable and predictable.
                </p>
              </div>
          
              <div className="bg-slate-950 border-t-4 border-t-cyan-400 border-x border-b border-slate-800 rounded-2xl p-8 md:p-10 shadow-lg">
                <h4 className="text-white text-xl font-bold mb-4">
                  Commitment to Excellence
                </h4>
                <p className="text-slate-400 leading-relaxed text-base">
                  We are committed to delivering dependable solutions, providing
                  ongoing support, and maintaining high standards of quality,
                  performance, and professionalism in every project.
                </p>
              </div>
          
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}