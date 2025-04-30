const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbDir = path.resolve(__dirname);
const dbPath = path.resolve(dbDir, 'database.sqlite');

// Cria o arquivo de banco se não existir
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      descricao TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS historico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      produto_id INTEGER,
      acao TEXT,
      quantidade INTEGER,
      data TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    )
  `);
});

db.close();
console.log('Banco de dados criado com sucesso!');
