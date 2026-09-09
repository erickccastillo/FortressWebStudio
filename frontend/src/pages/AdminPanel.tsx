import { useState, useEffect } from "react";
import { 
  Plus, Activity, Briefcase, Users, Search, 
  CheckCircle2, Loader2, Wallet
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  status: string;
  payment_percentage: number;
  total_budget: number;
  profiles?: {
    full_name: string;
  };
}

interface Task {
  id: string;
  project_id: string;
  description: string;
  status: string;
}

export default function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem("supabase_token");
    if (!token) return navigate("/");
    
    try {
      const res = await fetch("https://fortresswebstudio-backend.onrender.com/api/admin/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTasks = async (project: Project) => {
    setSelectedProject(project);
    const token = localStorage.getItem("supabase_token");
    try {
      const res = await fetch(`https://fortresswebstudio-backend.onrender.com/api/projects/${project.id}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newTaskDesc) return;
    
    const token = localStorage.getItem("supabase_token");
    try {
      const res = await fetch(`https://fortresswebstudio-backend.onrender.com/api/tasks`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ project_id: selectedProject.id, description: newTaskDesc, status: "en espera" })
      });
      
      const data = await res.json();
      if (res.ok) {
        setTasks([...tasks, data.task]);
        setNewTaskDesc("");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProjectsCount = projects.filter(p => p.status !== 'finalizado').length;

  if (loading) return <div className="h-[calc(100vh-80px)] w-full bg-[#050810] flex justify-center items-center"><Loader2 className="animate-spin text-cyan-400" size={40} /></div>;

  return (
    // Altura calculada restando el Navbar. El overflow-hidden evita la barra blanca nativa.
    <div className="h-[calc(100vh-80px)] w-full flex overflow-hidden bg-[#050810] text-slate-300 font-sans">
      
      {/* Sidebar - Lista de Proyectos */}
      <aside className="w-80 md:w-96 flex-shrink-0 bg-[#0a0f1c] border-r border-slate-800/60 flex flex-col h-full relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="p-6 pb-2 border-b border-transparent">
          <h2 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4 flex items-center gap-2">
            <Activity size={14} /> Resumen General
          </h2>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#111827] rounded-2xl p-4 border border-slate-800/60">
              <p className="text-slate-400 text-xs mb-1">Proyectos Activos</p>
              <p className="text-2xl font-bold text-cyan-400">{activeProjectsCount}</p>
            </div>
            <div className="bg-[#111827] rounded-2xl p-4 border border-slate-800/60">
              <p className="text-slate-400 text-xs mb-1">Total Clientes</p>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
            </div>
          </div>

          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar proyecto o cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111827] border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Scroll interno solo para la lista de proyectos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => loadProjectTasks(p)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group ${
                selectedProject?.id === p.id 
                  ? "bg-gradient-to-r from-cyan-900/40 to-transparent border-l-2 border-cyan-400" 
                  : "bg-transparent hover:bg-[#111827] border-l-2 border-transparent"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{p.name}</h3>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                  p.status === 'finalizado' ? 'text-emerald-400 bg-emerald-400/10' : 'text-cyan-400 bg-cyan-400/10'
                }`}>
                  {p.status}
                </span>
              </div>
              <p className="text-sm text-slate-400 flex items-center gap-1.5">
                <Users size={12} /> 
                {p.profiles?.full_name || "Cliente sin nombre"}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content - Detalles del Proyecto */}
      <main className="flex-1 relative h-full overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="p-8 lg:p-12 relative z-10 max-w-5xl mx-auto flex flex-col min-h-full">
          {selectedProject ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-300 mb-4">
                    <Briefcase size={14} className="text-cyan-400" /> Vista de Gestión
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">{selectedProject.name}</h2>
                  <p className="text-lg text-slate-400 flex items-center gap-2">
                    <Users className="text-slate-500" size={18} />
                    Cliente: <span className="text-white font-medium">{selectedProject.profiles?.full_name || "Desconocido"}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-slate-800/60 p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-900/50 transition-colors">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-sm font-medium">Presupuesto Total</p>
                    <Wallet className="text-cyan-400/50 group-hover:text-cyan-400 transition-colors" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-white">${selectedProject.total_budget}</p>
                </div>

                <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-slate-800/60 p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-900/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-sm font-medium">Estado de Pago</p>
                    <span className="text-2xl font-bold text-cyan-400">{selectedProject.payment_percentage}%</span>
                  </div>
                  <div className="w-full bg-[#111827] h-3 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full relative" 
                      style={{ width: `${selectedProject.payment_percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1421]/80 backdrop-blur-xl border border-slate-800/60 rounded-3xl overflow-hidden flex flex-col h-[400px]">
                <div className="p-6 border-b border-slate-800/60 bg-[#0a0f1c]/50">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity size={20} className="text-cyan-400" /> Control de Tareas
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                  {tasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                        <CheckCircle2 size={32} className="opacity-50" />
                      </div>
                      <p>No hay tareas registradas para este proyecto.</p>
                    </div>
                  ) : (
                    tasks.map(t => (
                      <div key={t.id} className="group flex items-center justify-between p-4 bg-[#111827] rounded-2xl border border-slate-800/60 hover:border-cyan-900/50 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${t.status === 'finalizado' ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                          <span className="text-slate-200 group-hover:text-white transition-colors">{t.description}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border flex-shrink-0 ${
                          t.status === "en espera" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                          t.status === "en curso" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-5 border-t border-slate-800/60 bg-[#0a0f1c]/50">
                  <form onSubmit={handleAddTask} className="flex gap-3">
                    <input
                      type="text"
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      placeholder="Escribe una nueva tarea..."
                      className="flex-1 bg-[#111827] border border-slate-700/50 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-500"
                      required
                    />
                    <button type="submit" className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      <Plus size={18} /> <span className="hidden sm:inline">Agregar</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 rounded-full bg-cyan-900/20 border border-cyan-900/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <Briefcase size={40} className="text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Panel de Control Global</h2>
              <p className="text-slate-400 max-w-md">
                Selecciona un proyecto del panel lateral para administrar sus detalles, gestionar tareas y monitorear los avances financieros de tus clientes.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}} />
    </div>
  );
}