import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Briefcase, 
  Users, 
  ChevronRight,
  Menu,
  X,
  Wallet,
  Activity,
  CheckCircle2,
  Plus,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className = '' }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados funcionales de la API
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [loading, setLoading] = useState(true);
  
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
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
    
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

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProjectsCount = projects.filter(p => p.status !== 'finalizado').length;
  const totalClientsCount = projects.length;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-[#070B14] w-full pt-[80px] ${className || 'h-screen'}`}>
        <Loader2 className="animate-spin text-cyan-400" size={40} />
      </div>
    );
  }

  return (
    // Agregamos pt-[80px] al contenedor principal para que todo baje respetando el Header
    <div className={`flex w-full bg-[#070B14] text-slate-300 font-sans overflow-hidden pt-[80px] ${className || 'h-screen'}`}>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity pt-[80px]"
          onClick={toggleSidebar}
        />
      )}

      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-cyan-600 text-white rounded-full shadow-lg hover:bg-cyan-500 transition-colors"
      >
        <Menu size={24} />
      </button>

      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-[#0F1521] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out pt-[80px] lg:pt-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-cyan-900/20' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="lg:hidden flex items-center justify-end p-4 border-b border-slate-800/50">
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        {/* Separación superior agregada en desktop (lg:mt-4) para estética */}
        <div className="flex-1 overflow-y-auto p-6 lg:mt-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#131B29] border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-semibold text-slate-400 mb-3 tracking-wide">Proyectos Activos</span>
              <span className="text-3xl font-bold text-cyan-400">{activeProjectsCount}</span>
            </div>
            
            <div className="bg-[#131B29] border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between shadow-sm">
               <span className="text-xs font-semibold text-slate-400 mb-3 tracking-wide">Total Clientes</span>
              <span className="text-3xl font-bold text-white">{totalClientsCount}</span>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar proyecto o cliente..."
              className="w-full bg-[#131B29] border border-slate-800/80 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-slate-200 placeholder-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
             {filteredProjects.length > 0 ? (
               filteredProjects.map((project) => (
                 <button
                   key={project.id}
                   onClick={() => loadProjectTasks(project)}
                   className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                     selectedProject?.id === project.id 
                       ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-white' 
                       : 'hover:bg-[#131B29] text-slate-400 hover:text-slate-200 border-l-2 border-transparent'
                   }`}
                 >
                   <div className="pr-4">
                     <p className="font-medium truncate text-sm leading-tight mb-1">{project.name}</p>
                     <p className={`text-xs ${selectedProject?.id === project.id ? 'text-cyan-300' : 'text-slate-500'}`}>
                       {project.profiles?.full_name || "Sin cliente asignado"}
                     </p>
                   </div>
                   <ChevronRight size={16} className={`shrink-0 transition-transform ${selectedProject?.id === project.id ? 'text-cyan-400 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                 </button>
               ))
             ) : (
               <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
                 No se encontraron resultados
               </div>
             )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#070B14] to-[#04060A] relative overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 relative min-h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/5 rounded-full blur-[150px] pointer-events-none"></div>

          {selectedProject ? (
             <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-300 relative z-10 my-auto">
               <div className="bg-[#0F1521]/80 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-6 lg:p-8 shadow-2xl">
                 
                 <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                   <div>
                     <h2 className="text-3xl font-bold text-white mb-2">
                       {selectedProject.name}
                     </h2>
                     <div className="flex items-center gap-2 text-cyan-400 font-medium">
                        <Users size={16} />
                        <span>{selectedProject.profiles?.full_name || "Desconocido"}</span>
                     </div>
                   </div>
                   <span className={`px-3 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider ${
                     selectedProject.status === 'finalizado' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                   }`}>
                     {selectedProject.status}
                   </span>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#131B29] border border-slate-800/60 p-5 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Presupuesto Total</p>
                        <p className="text-2xl font-bold text-white">${selectedProject.total_budget}</p>
                      </div>
                      <Wallet className="text-slate-600" size={28} />
                    </div>
                    <div className="bg-[#131B29] border border-slate-800/60 p-5 rounded-xl">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-slate-400 text-sm">Estado de Pago</p>
                        <span className="text-xl font-bold text-cyan-400">{selectedProject.payment_percentage}%</span>
                      </div>
                      <div className="w-full bg-[#0a0f1c] h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: `${selectedProject.payment_percentage}%` }} />
                      </div>
                    </div>
                 </div>
                 
                 <div className="border border-slate-800/80 rounded-xl flex flex-col h-[400px] bg-[#131B29]/30">
                    <div className="p-4 border-b border-slate-800/80 bg-[#131B29]/50">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity size={18} className="text-cyan-400" /> Tareas del Proyecto
                      </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
                      {tasks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                          <CheckCircle2 size={32} className="opacity-50 mb-2" />
                          <p className="text-sm">No hay tareas registradas.</p>
                        </div>
                      ) : (
                        tasks.map(t => (
                          <div key={t.id} className="flex items-center justify-between p-4 bg-[#0F1521] rounded-xl border border-slate-800/60 hover:border-cyan-900/40 transition-colors">
                            <span className="text-slate-300 text-sm">{t.description}</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ml-4 ${
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

                    <div className="p-4 border-t border-slate-800/80 bg-[#131B29]/50">
                      <form onSubmit={handleAddTask} className="flex gap-3">
                        <input
                          type="text"
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Escribe una nueva tarea..."
                          className="flex-1 bg-[#0F1521] border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-500"
                          required
                        />
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
                          <Plus size={18} /> <span className="hidden sm:inline">Agregar</span>
                        </button>
                      </form>
                    </div>
                 </div>
               </div>
             </div>
          ) : (
            <div className="max-w-xl text-center space-y-6 relative z-10 animate-in fade-in duration-700">
              <div className="relative mx-auto w-24 h-24 mb-10 flex items-center justify-center">
                <div className="absolute inset-0 border border-slate-700/50 rounded-full scale-[1.3] opacity-30"></div>
                <div className="absolute inset-0 border border-slate-600/30 rounded-full scale-[1.1] opacity-50"></div>
                <div className="relative flex items-center justify-center w-20 h-20 bg-[#0F1521] border border-slate-700/80 rounded-full shadow-lg z-10">
                  <Briefcase className="w-8 h-8 text-cyan-400" strokeWidth={1.5} />
                </div>
              </div>
              <div className="space-y-4 px-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Panel de Control Global
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                  Selecciona un proyecto del panel lateral para administrar sus
                  detalles, gestionar tareas y monitorear los avances financieros
                  de tus clientes.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}