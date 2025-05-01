const express = require('express');
const router = express.Router();
const db = require('../db/initDatabase'); // ou o nome do seu arquivo que contém a conexão com o SQLite

// Registrar log
router.post('/', (req, res) => {
  const { usuario, acao, produto, quantidade } = req.body;
  const data = new Date().toLocaleString();

  db.run(
    `INSERT INTO logs (usuario, acao, produto, quantidade, data) VALUES (?, ?, ?, ?, ?)`,
    [usuario, acao, produto, quantidade, data],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Buscar logs
router.get('/', (req, res) => {
  db.all('SELECT * FROM logs ORDER BY id DESC LIMIT 50', [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

module.exports = router;
