import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Inicialización de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Usar la Service Key, NUNCA exponerla en el frontend
);

// Middleware
app.use(cors({ origin: '*' })); // Cambiar por tu URL real en producción
app.use(express.json());

// Middleware para verificar el token de Supabase enviado desde el frontend
const authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }

  // Guardamos el usuario en res.locals para usarlo en los siguientes endpoints
  res.locals.user = data.user;
  next();
};

// ==========================================
// ENDPOINT LOGIN (Público)
// ==========================================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) return res.status(401).json({ error: authError.message });

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profileError) return res.status(404).json({ error: 'Perfil no encontrado' });

    res.json({
      user: authData.user,
      role: profileData.role,
      session: authData.session 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// ENDPOINTS ADMIN PANEL (Protegidos)
// ==========================================

// Obtener todos los proyectos
app.get('/api/admin/projects', authenticateUser, async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ projects: data });
});

// Obtener tareas de un proyecto en específico
app.get('/api/projects/:id/tasks', authenticateUser, async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', id)
    .order('creation_date', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ tasks: data });
});

// Crear una nueva tarea
app.post('/api/tasks', authenticateUser, async (req, res) => {
  const { project_id, description, status } = req.body;

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ 
      project_id, 
      description, 
      status, 
      creation_date: new Date().toISOString() 
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ task: data });
});

// ==========================================
// ENDPOINTS CLIENT DASHBOARD (Protegidos)
// ==========================================

// Obtener los datos y tareas del cliente logueado
app.get('/api/client/dashboard', authenticateUser, async (req, res) => {
  const user = res.locals.user;

  // 1. Buscar el proyecto asociado al ID del usuario logueado
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (projectError || !project) {
    return res.status(404).json({ error: 'No se encontró un proyecto asignado a este cliente.' });
  }

  // 2. Buscar las tareas asociadas a ese proyecto
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', project.id)
    .order('creation_date', { ascending: true });

  if (tasksError) {
    return res.status(500).json({ error: tasksError.message });
  }

  // 3. Retornar la estructura que espera el frontend
  res.json({
    project,
    tasks: tasks || []
  });
});



// ==========================================
// NUEVOS ENDPOINTS PARA CREAR PROYECTOS
// ==========================================

// Obtener la lista de clientes (perfiles) para el select
app.get('/api/admin/clients', authenticateUser, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    // Opcional: .eq('role', 'client') si manejas roles en la tabla profiles
    .order('full_name', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ clients: data });
});

// Crear un nuevo proyecto
app.post('/api/admin/projects', authenticateUser, async (req, res) => {
  const { name, user_id, total_budget, payment_percentage, status } = req.body;

  const { data, error } = await supabase
    .from('projects')
    .insert([{ 
      name, 
      user_id, 
      total_budget, 
      payment_percentage, 
      status: status || 'waiting',
      created_at: new Date().toISOString()
    }])
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ project: data });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
