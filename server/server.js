const express = require('express');
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const server = express();
const path = require('path');


const PORT = 5500;

const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware to parse JSON bodies
server.use(express.json())
.use(express.static('../client'))
.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');

  next();
});

// Define API Routes

// GET all resources
server.get('/cars', (req, res) => {
  db.all('SELECT * FROM cars', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ resources: rows });
  });
});
/*
server.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, '../client/index.html'));
});*/

server.get('/test', (req, res) =>{
  res.json({response:"heloo"});
});

// POST - Create a new resource
server.post('/cars', (req, res) => {

  const {model, year, gear, fuel, color, mileage} = req.body;
  const sql = 'INSERT INTO cars (model, year, gear, fuel, color, mileage) VALUES (?, ?, ?, ?, ? ,?)';
  db.run(sql, [model, parseInt(year), gear, fuel, color, mileage], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
      
    }else{
      res.json({ message: 'New resource created', id: this.lastID });
    }
  }); 
});

server.get('/cars/:id', (req, res) => { 
  const id = req.params.id;
  db.all('SELECT * FROM cars WHERE ID = ?', id,(err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ resources: row });
  });
})


// PUT - Update a resource
server.put('/cars/:id', (req, res) => {
  const { model, year, gear, fuel, color, mileage } = req.body;
  const id = req.params.id;

  const sql = `UPDATE cars SET model = ?, year = ?, gear = ?, fuel = ?, color = ?, mileage = ? WHERE id = ?`;

  db.run(sql, [model, year, gear, fuel, color, mileage, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: `Car with ID ${id} updated successfully` });
  });
});




res.json({ message: `Car with ID ${id} updated successfully` });

// DELETE - Delete a resource by ID
server.delete('/cars/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM cars WHERE id = ?`, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: `Resource with ID ${id} deleted successfully` });
  });
});

// Start the server
server.use(cors())

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Database setup (create a table)
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