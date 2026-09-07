import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-cyan-900/20">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0d1421] border border-cyan-900/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <span className="text-cyan-400 font-bold text-lg">F</span>
          </div>

          <div className="flex flex-col">
            <span className="text-white font-bold text-lg tracking-tight">
              Fortress
            </span>
            <span className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
              Web Studio
            </span>
          </div>
        </Link>

        {/* Login */}
        <Link
          to="/login"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f1623] border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        >
          <LogIn size={18} />
          <span>Login</span>
        </Link>
      </div>
    </header>
  );
}
