const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db'); // Your db.js file

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  const sql = 'INSERT INTO tasks (task) VALUES (?)';
  db.query(sql, [task], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, task });
  });
});

// Read all tasks
app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  const sql = 'UPDATE tasks SET task = ? WHERE id = ?';
  db.query(sql, [task, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'Task updated', id, task });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'Task deleted', id });
  });
});
