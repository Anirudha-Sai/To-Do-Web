const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Add a task
app.post('/tasks', (req, res) => {
  const { title, deadline } = req.body;
  db.run('INSERT INTO tasks (title, deadline) VALUES (?, ?)', [title, deadline], function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ id: this.lastID, title, completed: 0, deadline });
  });
});

// Mark task as completed instead of deleting
app.put('/tasks/:id/complete', (req, res) => {
  db.run('UPDATE tasks SET completed = 1 WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

// Update task
app.put('/tasks/:id', (req, res) => {
  const { title, deadline } = req.body;
  db.run(
    'UPDATE tasks SET title = ?, deadline = ? WHERE id = ?',
    [title, deadline, req.params.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.sendStatus(200);
    }
  );
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
