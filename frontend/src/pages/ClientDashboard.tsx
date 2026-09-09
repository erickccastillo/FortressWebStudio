import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Loader2, LogOut, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClientData {
  project: {
    name: string;
    status: string;
    total_budget: number;
    payment_percentage: number;
  };
  tasks: Array<{
    id: string;
    description: string;
    status: string;
  }>;
}

export default function ClientDashboard() {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    const token = localStorage.getItem("supabase_token");
    if (!token) return navigate("/");
    
    try {
      const res = await fetch("https://fortresswebstudio-backend.onrender.com/api/client/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("supabase_token");
    navigate("/");
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "finalizado": return <CheckCircle2 className="text-emerald-400" size={20} />;
      case "en curso": return <Clock className="text-cyan-400" size={20} />;
      default: return <CheckSquare className="text-slate-500" size={20} />;
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] flex justify-center items-center"><Loader2 className="animate-spin text-cyan-400" size={40} /></div>;
  if (!data?.project) return <div className="min-h-screen bg-[#050810] text-white flex justify-center items-center">No se encontró proyecto asignado.</div>;

  return (
    <div className="min-h-screen bg-[#050810] p-6 lg:p-12 relative overflow-hidden">
      {/* Glow de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a tu Proyecto</h1>
            <p className="text-slate-400">{data.project.name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <LogOut size={18} /> Salir
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-cyan-900/30 p-6 rounded-3xl">
            <p className="text-slate-400 text-sm mb-1">Estado General</p>
            <p className="text-2xl font-bold text-white capitalize">{data.project.status}</p>
          </div>
          <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-cyan-900/30 p-6 rounded-3xl">
            <p className="text-slate-400 text-sm mb-1">Avance de Pago</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-cyan-400">{data.project.payment_percentage}%</p>
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3">
              <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${data.project.payment_percentage}%` }} />
            </div>
          </div>
          <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-cyan-900/30 p-6 rounded-3xl">
            <p className="text-slate-400 text-sm mb-1">Presupuesto Total</p>
            <p className="text-2xl font-bold text-white">${data.project.total_budget}</p>
          </div>
        </div>

        {/* Tareas */}
        <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-cyan-900/30 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Seguimiento de Tareas</h2>
          <div className="space-y-4">
            {data.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between bg-[#111827] p-5 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-4">
                  {getStatusIcon(task.status)}
                  <span className="text-slate-200 font-medium">{task.description}</span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  task.status === "en espera" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                  task.status === "en curso" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}