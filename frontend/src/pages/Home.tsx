import { useState, useEffect, useRef } from 'react';

// --- COMPONENTE: Computadora ASCII Animada ---
const AsciiComputer = () => {
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = "Diseñando para humanos...\nConstruyendo la web_";

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
      {/* Fondo Interactivo Suave (Más limpio y menos invasivo) */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 hidden lg:block"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.05), transparent 40%)`
        }}
      />

      {/* Fallback estático para móviles */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0b1120] to-[#0b1120] lg:hidden" />

      {/* Estilos Globales Ajustados */}
      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          background-color: #0b1120 !important;
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
        }
      `}} />

      <main className="relative z-10 w-full flex flex-col items-center pb-12 md:pb-20">
    
        {/* --- 1. SECCIÓN HERO (Dividida Izquierda / Derecha) --- */}
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
                Desarrollo web <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                  con toque humano.
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
                Somos un equipo remoto enfocado en crear sitios modernos y soluciones digitales escalables. No solo escribimos código; construimos herramientas que ayudan a tu negocio a conectar, crecer y destacar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button className="px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/20 text-sm md:text-base">
                  Inicia tu proyecto
                </button>
                <button className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-300 border border-slate-700 text-sm md:text-base">
                  Conoce más
                </button>
              </div>
            </div>

            {/* Derecha: Computadora ASCII */}
            <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
              <div className="animate-[swing_6s_ease-in-out_infinite]">
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

        {/* --- 2. SECCIÓN: CÓMO TRABAJAMOS (Tarjetas limpias) --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestra forma de trabajar
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Procesos claros y comunicación constante para que tu proyecto fluya sin estrés.
            </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group bg-[#111827] hover:bg-[#161f33] border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 rounded-3xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <span className="text-indigo-400 text-xl">🌍</span>
              </div>
              <h4 className="text-white text-xl font-semibold mb-3">Colaboración Remota</h4>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                Operamos de forma remota, permitiéndonos trabajar con negocios en cualquier lugar, manteniendo flexibilidad y comunicación ágil.
              </p>
            </div>
        
            {/* Card 2 */}
            <div className="group bg-[#111827] hover:bg-[#161f33] border border-slate-800 hover:border-sky-500/30 transition-all duration-300 rounded-3xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 border border-sky-500/20 group-hover:scale-110 transition-transform">
                <span className="text-sky-400 text-xl">📋</span>
              </div>
              <h4 className="text-white text-xl font-semibold mb-3">Proceso Organizado</h4>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                Cada proyecto sigue un flujo estructurado con hitos claros, planeación transparente y objetivos definidos para resultados predecibles.
              </p>
            </div>
        
            {/* Card 3 */}
            <div className="group bg-[#111827] hover:bg-[#161f33] border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 rounded-3xl p-8 shadow-xl">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <span className="text-indigo-400 text-xl">💎</span>
              </div>
              <h4 className="text-white text-xl font-semibold mb-3">Compromiso Total</h4>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                Entregamos soluciones confiables, brindamos soporte continuo y mantenemos altos estándares de calidad y profesionalismo.
              </p>
            </div>
          </div>
        </section>

        {/* --- 3. SECCIÓN: QUIÉNES SOMOS & MISIÓN (Diseño Asimétrico) --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mx-auto">
          <div className="bg-gradient-to-br from-[#111827] to-[#0d131f] border border-slate-800 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
            {/* Efecto de luz en la esquina */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h3 className="text-sm font-semibold tracking-widest text-sky-400 uppercase mb-3">
                  Nuestra Misión
                </h3>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Más que una página web,<br/> una herramienta de crecimiento.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  Creemos que un sitio web debe ser una extensión viva de tu negocio. En Fortress Web Studio empoderamos empresas mediante soluciones innovadoras que combinan diseño excepcional, tecnología moderna y pensamiento estratégico.
                </p>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Fusionamos nuestra experiencia técnica con un enfoque humano. Nuestro objetivo es entregarte productos digitales que resuelvan problemas reales, garantizando rendimiento y escalabilidad.
                </p>
              </div>

              {/* Valores (Píldoras) integrados visualmente a la derecha */}
              <div className="bg-[#0b1120]/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
                <h4 className="text-white font-medium mb-6">Valores que nos definen:</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Compromiso', 'Transparencia', 'Organización', 
                    'Comunicación', 'Innovación', 'Confiabilidad', 
                    'Calidad', 'Crecimiento'
                  ].map((value) => (
                    <span
                      key={value}
                      className="px-4 py-2 bg-slate-800/80 border border-slate-700 text-slate-300 text-sm rounded-xl hover:border-sky-500/50 hover:text-sky-300 transition-colors cursor-default"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}