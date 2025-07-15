import React from 'react';

function TaskList({ tasks, deleteTask, toggleTask }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map(task => (
        <li key={task.id} style={{ margin: '10px 0' }}>
          <input
            type="checkbox"
            checked={!!task.completed}
            onChange={() => toggleTask(task.id, !task.completed)}
          />
          <span
            style={{
              marginLeft: '10px',
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            style={{ marginLeft: '20px', color: 'red' }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
