import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Usaremos este icono para el botón de regreso

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 font-sans selection:bg-cyan-500/30 relative overflow-hidden flex justify-center items-center px-4">
      
      {}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[600px] h-[50%] bg-cyan-900/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[50%] md:w-[30%] h-[60%] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {}
      <div className="relative z-10 w-full max-w-2xl bg-[#0d1421]/80 backdrop-blur-md border border-cyan-900/40 rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col items-center text-center shadow-[0_0_50px_rgba(6,182,212,0.05)] animate-fade-in-up">
        
        {/* Línea de acento Cyan (reemplazo de la línea amarilla original) */}
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full mb-6"></div>

        {/* Número de error 404 con estilo brillante */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-white tracking-tighter drop-shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-2">
          404
        </h1>

        {/* Título en inglés */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-4 tracking-tight">
          Page Not Found :(
        </h2>

        {/* Descripción en inglés */}
        <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto mb-10">
          Sorry, the page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        {/* Botón de regreso usando el estilo del botón principal de tu portafolio */}
        <Link 
          to="/" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-8 py-3.5 rounded-full font-bold transition-all duration-200 text-sm md:text-base shadow-lg shadow-cyan-500/20 hover:scale-105"
        >
          <ArrowLeft size={20} className="stroke-[2.5]" />
          Return to Home
        </Link>
      </div>
      
    </div>
  );
};

export default NotFound;