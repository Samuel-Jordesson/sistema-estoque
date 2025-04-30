const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/db/database.sqlite');

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.get('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
    if (!row) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // Aqui poderia ser gerado um token (JWT), mas vamos simplificar por enquanto
    res.status(200).json({ mensagem: 'Login bem-sucedido', usuario: row });
  });
});

module.exports = router;
