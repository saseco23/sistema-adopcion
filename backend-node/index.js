const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { execSync } = require('child_process');
const connectDB = require('./config/db'); // 👈 conexión a MongoDB modular
const chatbotRoute = require("./chatbotRoute");

// Cargar variables de entorno
dotenv.config();

// Crear app y puerto
const app = express();
const PORT = process.env.PORT || 5000;

// Liberar puerto si esta en uso solo cuando se ejecuta localmente.
// Dentro de Docker no se debe ejecutar kill-port.
if (process.env.DOCKER !== 'true') {
  try {
    console.log(`🔄 Verificando si el puerto ${PORT} está en uso...`);
    execSync(`npx kill-port ${PORT}`);
    console.log(`✅ Puerto ${PORT} liberado.`);
  } catch (err) {
    console.log(`⚠️ No se pudo liberar el puerto ${PORT}, puede que no estuviera en uso.`);
  }
}

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'https://pett-a1d97.web.app'], // ✅ Se añadió localhost para el front local
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const petRoutes = require('./routes/pett');
const solicitudesRoutes = require('./routes/solicitudes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

// 👉 Rutas personalizadas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pett', petRoutes);

// 👉 Ruta del chatbot
app.use("/api", chatbotRoute);

// Ruta 404
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware global de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

