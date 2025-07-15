import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isBefore, isToday, parseISO } from 'date-fns';
import './index.css';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');

  const fetchTasks = () => {
    axios.get(API_URL).then(res => setTasks(res.data));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const deadline = format(selectedDate, 'yyyy-MM-dd');
    axios.post(API_URL, { title, deadline }).then(() => {
      fetchTasks();
      setTitle('');
    });
  };

  const markAsDone = (id) => {
    axios.put(`${API_URL}/${id}/complete`).then(fetchTasks);
  };

  const filteredTasks = tasks.filter(task =>
    !task.completed && format(new Date(task.deadline), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const sortedTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)
  );


  const getRowClass = (deadlineStr) => {
    const date = parseISO(deadlineStr);
    if (isToday(date)) return 'today';
    if (isBefore(date, new Date())) return 'past';
    return 'future';
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: "center", paddingBottom: "20px", fontSize: "40px" }}>📅 To-Do Manager</h1>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }} className="cal-container">
        <div style={{ flex: 3 }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date }) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const hasTask = tasks.some(task => format(new Date(task.deadline), 'yyyy-MM-dd') === dateStr);
              return hasTask ? 'highlight' : null;
            }}
          />

          <h3 style={{ marginTop: "20px" }}>
            Tasks for {format(selectedDate, 'PPP')}:
          </h3>
          <ul style={{ fontSize: "18px", listStyle: "none", padding: 0 }}>
            {filteredTasks.length === 0 && <p>No tasks for this day.</p>}
            {filteredTasks.map(task => (
              <li key={task.id} style={{ marginBottom: '10px' }}>
                {task.title}
                <button
                  className='done-button'
                  onClick={() => markAsDone(task.id)}
                >
                  Done
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddTask} style={{ marginTop: '30px' }}>
            <input
              type="text"
              value={title}
              placeholder="Enter task"
              onChange={e => setTitle(e.target.value)}
              style={{ width: '70%', padding: '8px', fontSize: '16px' }}
            />
            <button type="submit" style={{ padding: '8px 12px', marginLeft: '10px' }}>
              Add Task
            </button>
          </form>
        </div>
        <div style={{ flex: 0.5 }}></div>
        <div style={{ flex: 3 }} className="task-table-main">
          <h3 style={{ marginBottom: "10px" }}>📋 All Tasks (by Deadline)</h3>
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Deadline</th>
                <th>Done</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.length === 0 && (
                <tr><td colSpan="3"><p style={{ textAlign: "center", padding: "0", margin: "0", fontSize: "18px" }}>No tasks available.</p></td></tr>
              )}
              {sortedTasks.map(task => (
                <tr key={task.id} className={getRowClass(task.deadline)}>
                  <td>{task.title}</td>
                  <td>{format(new Date(task.deadline), 'PPP')}</td>
                  <td>
                    <button className="done-button" onClick={() => markAsDone(task.id)}>
                      Done
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
