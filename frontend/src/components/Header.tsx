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
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* Logo (Lado Izquierdo) */}
        <Link to="/" className="group flex items-center gap-3">
          {/* Contenedor limpio: sin fondo, sin bordes. Solo controla tamaño y añade un sutil efecto al pasar el mouse */}
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:brightness-125 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
            <img 
              src={logo} 
              alt="Fortress Web Studio" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-100 font-bold text-base md:text-lg tracking-tight transition-colors group-hover:text-white">
              Fortress
            </span>
            <span className="text-blue-400 text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold">
              Web Studio
            </span>
          </div>
        </Link>

        {/* Navegación y Acciones (ESCRITORIO) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/aboutme"
            className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-300 tracking-wide"
          >
            About Us
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-700 hover:border-blue-500/50 text-slate-200 hover:text-white hover:bg-blue-500/10 rounded-full transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]"
          >
            <LogIn size={18} />
            <span className="font-medium">Login</span>
          </Link>
        </div>

        {/* Botón Menú Hamburguesa (MÓVIL) */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-slate-300 hover:text-blue-400 transition-colors p-2"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Desplegable (MÓVIL) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 py-6 px-6 flex flex-col gap-6 shadow-2xl">
          <Link
            to="/aboutme"
            onClick={() => setIsMenuOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-blue-400 transition-colors tracking-wide text-center"
          >
            About Us
          </Link>

          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 mx-auto w-1/2 px-5 py-3 mt-2 bg-slate-900 border border-slate-700 hover:border-blue-500/50 text-slate-200 hover:text-white hover:bg-blue-500/10 rounded-full transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]"
          >
            <LogIn size={18} />
            <span className="font-medium">Login</span>
          </Link>
        </div>
      )}
    </header>
  );
}