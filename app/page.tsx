'use client'

type Todo = {
  id: number;
  text: string;
}

import { useEffect, useState } from 'react';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
  }

  const handleAdd = async () => {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    setInput('');
    fetchTodos();
  }

  const handleDelete = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchTodos();
  }

  const handleEdit = async (todo: Todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  }

  const handleUpdate = async () => {
    await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, text: editText })
    })
    setEditId(null);
    setEditText('');
    fetchTodos();
  }

  useEffect(() => {
    fetchTodos();
  }, [])

  return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">My Todo App</h1>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="Add a new todo"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div className="flex-1">
                  {editId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full border-b border-blue-400 px-1 focus:outline-none"
                    />
                  ) : (
                    <span>{todo.text}</span>
                  )}
                </div>
                <div className="flex gap-2 ml-2">
                  {editId === todo.id ? (
                    <button
                      onClick={() => handleUpdate()}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(todo)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
  );
}
