const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Importar modelos y sincronizar base de datos
const { sequelize } = require('./models');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/moves', require('./routes/assetMoves'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/licenses', require('./routes/licenses'));
app.use('/api/consumables', require('./routes/consumables'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/reports', require('./routes/reports'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Inventario funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida correctamente');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

startServer();
