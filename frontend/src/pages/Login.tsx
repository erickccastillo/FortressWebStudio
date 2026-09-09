import { useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../images/logo.png"; // Asegúrate de tener esta ruta

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Autenticar usuario
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Obtener el rol del usuario desde la tabla profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      // 3. Redirigir según el rol
      if (profileData.role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/client-dashboard');
      }

    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-cyan-900/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.08)]">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#121b29] border border-cyan-900/40 flex items-center justify-center mb-4 overflow-hidden">
              <img src={logo} alt="Fortress" className="w-full h-full object-contain p-2" />
            </div>
            <h1 className="text-2xl font-bold text-white">Fortress Web Studio</h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-300 mb-2">Email Address</label>
              <div className="flex items-center gap-3 bg-[#111827] border border-slate-700 rounded-xl px-4 py-3 focus-within:border-cyan-500 transition-colors">
                <Mail size={18} className="text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Password</label>
              <div className="flex items-center gap-3 bg-[#111827] border border-slate-700 rounded-xl px-4 py-3 focus-within:border-cyan-500 transition-colors">
                <Lock size={18} className="text-cyan-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
            </button>

            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="text-cyan-400 hover:text-cyan-300">
                Forgot password?
              </Link>
              <Link to="/" className="text-slate-400 hover:text-white">
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}