const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/db/database.sqlite');

// Cadastrar novo produto
router.post('/cadastro', (req, res) => {
  const { nome, quantidade, descricao } = req.body;

  db.run('INSERT INTO produtos (nome, quantidade, descricao) VALUES (?, ?, ?)',
    [nome, quantidade, descricao],
    function (err) {
      if (err) {
        return res.status(400).json({ erro: 'Erro ao cadastrar produto.' });
      }
      res.status(201).json({ id: this.lastID });
    });
});

// Buscar todos os produtos
router.get('/', (req, res) => {
  db.all('SELECT * FROM produtos', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    }
    res.status(200).json(rows);
  });
});

// Pesquisar produtos por nome
router.get('/buscar', (req, res) => {
  const { nome } = req.query;

  db.all('SELECT * FROM produtos WHERE nome LIKE ?', [`%${nome}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao pesquisar produto.' });
    }
    res.status(200).json(rows);
  });
});

// Atualizar quantidade de um produto
router.put('/atualizar/:id', (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  db.run('UPDATE produtos SET quantidade = ? WHERE id = ?', [quantidade, id], function(err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao atualizar produto.' });
    }

    res.status(200).json({ mensagem: 'Produto atualizado com sucesso.' });
  });
});

// Atualizar quantidade do produto (adicionar ou retirar)
router.post('/movimentar', (req, res) => {
  const { produtoId, quantidade, tipo } = req.body;

  const operacao = tipo === 'adicionar' ? '+' : '-';

  const sql = `
    UPDATE produtos
    SET quantidade = quantidade ${operacao} ?
    WHERE id = ?
  `;

  db.run(sql, [quantidade, produtoId], function (err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao atualizar quantidade do produto.' });
    }

    res.status(200).json({ mensagem: 'Quantidade atualizada com sucesso.' });
  });
});

// Deletar produto por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM produtos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao deletar produto.' });
    }

    res.status(200).json({ mensagem: 'Produto deletado com sucesso.' });
  });
});



module.exports = router;
