const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importando as rotas
const produtosRoutes = require('./routes/produtos');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usar rotas
app.use('/api/produtos', produtosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
