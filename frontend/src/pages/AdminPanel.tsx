import { useState, useEffect } from "react";
import { Plus, ListTodo, ChevronRight, Loader2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tipos basados en tu esquema de base de datos
interface Project {
  id: string;
  name: string;
  status: string;
  payment_percentage: number;
  total_budget: number;
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Aquí llamas a tu backend en Render
    const token = localStorage.getItem("supabase_token");
    if (!token) return navigate("/");
    
    try {
      const res = await fetch("https://fortresswebstudio-backend.onrender.com/api/admin/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(data.projects || []); // Ajusta según tu respuesta real
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

  const handleLogout = () => {
    localStorage.removeItem("supabase_token");
    navigate("/");
  };

  if (loading) return <div className="min-h-screen bg-[#050810] flex justify-center items-center"><Loader2 className="animate-spin text-cyan-400" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 p-6 flex flex-col md:flex-row gap-6">
      {/* Sidebar de Proyectos */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-[#0d1421]/80 backdrop-blur-xl border border-cyan-900/30 rounded-3xl p-6 flex flex-col h-[calc(100vh-3rem)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Proyectos</h2>
          <button onClick={handleLogout} className="text-slate-500 hover:text-red-400"><LogOut size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => loadProjectTasks(p)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedProject?.id === p.id ? "bg-cyan-900/20 border-cyan-500" : "bg-[#111827] border-slate-700 hover:border-cyan-500/50"
              }`}
            >
              <h3 className="font-semibold text-white">{p.name}</h3>
              <p className="text-sm text-slate-400 mt-1 capitalize">Estado: {p.status}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Panel de Tareas */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-[#0d1421]/80 backdrop-blur-xl border border-cyan-900/30 rounded-3xl p-6 flex flex-col h-[calc(100vh-3rem)]">
        {selectedProject ? (
          <>
            <div className="mb-6 pb-4 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
              <div className="flex gap-4 mt-2 text-sm text-slate-400">
                <span>Presupuesto: ${selectedProject.total_budget}</span>
                <span>Pagado: {selectedProject.payment_percentage}%</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-6 space-y-3">
              {tasks.length === 0 ? (
                <p className="text-slate-500 text-center py-10">No hay tareas para este proyecto.</p>
              ) : (
                tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-[#111827] rounded-xl border border-slate-700">
                    <span className="text-slate-200">{t.description}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
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

            <form onSubmit={handleAddTask} className="mt-auto flex gap-3">
              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Nueva tarea..."
                className="flex-1 bg-[#111827] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                required
              />
              <button type="submit" className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                <Plus size={20} /> Agregar
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <ListTodo size={64} className="mb-4 opacity-50" />
            <p>Selecciona un proyecto para gestionar sus tareas</p>
          </div>
        )}
      </div>
    </div>
  );
}