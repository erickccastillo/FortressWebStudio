import { Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center px-6">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-cyan-900/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.08)]">
          
          {/* Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#121b29] border border-cyan-900/40 flex items-center justify-center mb-4">
              <span className="text-cyan-400 text-2xl font-bold">
                F
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white">
              Fortress Web Studio
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Sign in to your dashboard
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email Address
              </label>

              <div className="flex items-center gap-3 bg-[#111827] border border-slate-700 rounded-xl px-4 py-3 focus-within:border-cyan-500">
                <Mail size={18} className="text-cyan-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <div className="flex items-center gap-3 bg-[#111827] border border-slate-700 rounded-xl px-4 py-3 focus-within:border-cyan-500">
                <Lock size={18} className="text-cyan-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl transition-all"
            >
              Sign In
            </button>

            <div className="flex justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Forgot password?
              </Link>

              <Link
                to="/"
                className="text-slate-400 hover:text-white"
              >
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
