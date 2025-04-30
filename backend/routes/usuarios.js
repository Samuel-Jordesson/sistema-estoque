const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/db/database.sqlite');

// Cadastrar novo usuário
router.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;

  db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha],
    function (err) {
      if (err) {
        return res.status(400).json({ erro: 'Erro ao cadastrar usuário.' });
      }
      res.status(201).json({ id: this.lastID });
    });
});

module.exports = router;
