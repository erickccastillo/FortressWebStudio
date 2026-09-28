import { useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

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
      // Cambia esta URL por la de tu servicio en Render cuando subas el backend
      // Ejemplo: "https://tu-api-backend.onrender.com/api/login"
      const response = await fetch("https://fortresswebstudio-backend.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al conectar con el servidor.");
      }

      // Guardar el token de sesión (opcional, pero recomendado para mantener la sesión activa)
      if (data.session?.access_token) {
        localStorage.setItem("supabase_token", data.session.access_token);
      }

      // Redirección basada en el rol que devuelve tu backend
      if (data.role === "admin") {
        navigate("/adminpanel");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      {/* Glow de fondo actualizado a azul */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(96,165,250,0.08)]">
          
          {/* Branding */}
          <div className="flex flex-col items-center mb-8">
            {/* Logo limpio como en el Header */}
            <div className="w-16 h-16 flex items-center justify-center mb-4">
              <img 
                src={logo} 
                alt="Fortress Web Studio" 
                className="w-full h-full object-contain" 
              />
            </div>

            <h1 className="text-2xl font-bold text-white">
              Fortress Web Studio
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Sign in to your dashboard
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:shadow-[0_0_15px_rgba(96,165,250,0.15)] transition-all">
                <Mail size={18} className="text-blue-400" />
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:shadow-[0_0_15px_rgba(96,165,250,0.15)] transition-all">
                <Lock size={18} className="text-blue-400" />
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
              className="w-full flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 mt-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
            </button>

            <div className="flex justify-between text-sm mt-6 pt-4 border-t border-slate-800">
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
              <Link
                to="/"
                className="text-slate-400 hover:text-white transition-colors font-medium"
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