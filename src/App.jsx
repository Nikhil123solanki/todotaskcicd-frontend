import { useEffect, useState } from 'react';
import './index.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todos`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Cannot connect to the backend. Is it running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) throw new Error('Failed to add');
      const created = await response.json();
      setTodos((curr) => [...curr, created]);
      setNewTitle('');
    } catch (err) {
      setError('Could not add todo.');
    }
  }

  async function toggleTodo(todo) {
    try {
      const response = await fetch(`${API_BASE}/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) throw new Error('Failed to update');
      const updated = await response.json();
      setTodos((curr) => curr.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError('Could not update todo.');
    }
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setTodos((curr) => curr.filter((t) => t.id !== id));
    } catch (err) {
      setError('Could not delete todo.');
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>Tasks</h1>
        <p className="subtitle">Full-Stack CI/CD Pipeline Masterclass</p>
      </header>

      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add Task</button>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading your workspace...</div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 && !error && (
            <p style={{ color: '#64748b' }}>No tasks found. Add one above!</p>
          )}
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div className="todo-content" onClick={() => toggleTodo(todo)}>
                <div className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}>
                  {todo.completed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.title}
                </span>
              </div>
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
