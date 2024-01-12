
// Importera nödvändiga moduler
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const server = express();

// Skapat en variabel för serverporten
const PORT = 5500;

//  När vi startar servern i terminalen, för att ansluta SQLite.
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Ansluten till SQLite-databasen.');
  }
});

server
  .use(express.json())  
  .use(express.static('../client')) 
  .use((req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');

    next();
  });

// GET förfrågan - för att hämta listan med alla bilar
server.get('/cars', (req, res) => {
  db.all('SELECT * FROM cars', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ resources: rows });
  });
});



// POST förfrågan - för att lägga till en ny bil
server.post('/cars', (req, res) => {
  const { model, year, gear, fuel, color, mileage } = req.body;
  const sql = 'INSERT INTO cars (model, year, gear, fuel, color, mileage) VALUES (?, ?, ?, ?, ? ,?)';
  db.run(sql, [model, parseInt(year), gear, fuel, color, mileage], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    } else {
      res.json({ message: 'Ny resurs skapad', id: this.lastID });
    }
  });
});

// GET förfrågan- för att hämta en specifik bil via ID
server.get('/cars/:id', (req, res) => {
  const id = req.params.id;
  db.all('SELECT * FROM cars WHERE ID = ?', id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ resources: row });
  });
});

// PUT förfrågan -för att uppdatera en bil via ID
server.put('/cars/:id', (req, res) => {
  const { model, year, gear, fuel, color, mileage } = req.body;
  const id = req.params.id;

  const sql = `UPDATE cars SET model = ?, year = ?, gear = ?, fuel = ?, color = ?, mileage = ? WHERE id = ?`;

  db.run(sql, [model, year, gear, fuel, color, mileage, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: `Bil med ID ${id} uppdaterad framgångsrikt` });
  });
});

// DELETE förfrågan - för att ta bort en bil via ID
server.delete('/cars/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM cars WHERE id = ?`, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: `Resurs med ID ${id} borttagen framgångsrikt` });
  });
});

// Starta servern
server.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});

// Skapa databastabell (om den inte redan finns)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model TEXT,
    year INTEGER,
    gear TEXT,
    fuel TEXT,
    color TEXT,
    mileage TEXT
  )`);
});
