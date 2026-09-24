import { useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
// 1. Importas el logo
import logo from "../images/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-cyan-900/20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* Logo (Lado Izquierdo) */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#0d1421] border border-cyan-900/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden">
            <img 
              src={logo} 
              alt="Fortress Web Studio" 
              className="w-full h-full object-contain p-1.5" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-base md:text-lg tracking-tight">
              Fortress
            </span>
            <span className="text-cyan-400 text-[10px] md:text-xs tracking-[0.2em] uppercase">
              Web Studio
            </span>
          </div>
        </Link>

        {/* Navegación y Acciones (ESCRITORIO) */}
        <div className="hidden md:flex items-center gap-6">
         

          <Link
            to="/aboutme"
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300 tracking-wide"
          >
            About Us
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0f1623] border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <LogIn size={18} />
            <span>Login</span>
          </Link>
        </div>

        {/* Botón Menú Hamburguesa (MÓVIL) */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors p-2"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Desplegable (MÓVIL) */}
      {/* Usamos una transición básica condicional para mostrar el menú */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#050810]/95 backdrop-blur-xl border-b border-cyan-900/20 py-6 px-6 flex flex-col gap-6 shadow-2xl">


          <Link
            to="/aboutme"
            onClick={() => setIsMenuOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-cyan-400 transition-colors tracking-wide text-center"
          >
            About Us
          </Link>

          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 mx-auto w-1/2 px-5 py-3 mt-2 bg-[#0f1623] border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white rounded-full transition-all"
          >
            <LogIn size={18} />
            <span>Login</span>
          </Link>
        </div>
      )}
    </header>
  );
}