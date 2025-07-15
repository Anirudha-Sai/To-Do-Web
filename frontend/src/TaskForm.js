// frontend/src/TaskForm.js
import React, { useState } from 'react';

function TaskForm({ addTask }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
        style={{ width: "80%", padding: "8px" }}
      />
      <button type="submit" style={{ padding: "8px 12px" }}>Add</button>
    </form>
  );
}

export default TaskForm;
