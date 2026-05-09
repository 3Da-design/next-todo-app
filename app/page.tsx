'use client'

import { useEffect, useState } from 'react';
import { useFlashMessage } from './context/FlashMessageContext';
import { z } from 'zod';

type Todo = {
  id: number;
  text: string;
}

const todoSchema = z.object({
  text: z.string().min(1, 'Input is required.').max(100, 'Please enter your response within 100 characters.')
});

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const { showMessage } = useFlashMessage();
  const [inputError, setInputError] = useState('');
  const [editError, setEditError] = useState('');

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();

    if (data.status === 'success') {
      setTodos(data.todos);
    } else {
      showMessage(data.message, 'error');
    }
  }

  const handleAdd = async () => {
    const result = todoSchema.safeParse({ text: input });

    if (!result.success) {
      setInputError(result.error.issues[0].message);
      return;
    }

    setInputError('');

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });

    const data = await res.json();

    if (data.status === 'success') {
      showMessage(data.message, 'success');
      setInput('');
      fetchTodos();
    } else {
      showMessage(data.message, 'error');
    }
  }

  const handleDelete = async (id: number) => {
    const res =await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    const data = await res.json();

    if (data.status === 'success') {
      showMessage(data.message, 'success');
      fetchTodos();
    } else {
      showMessage(data.message, 'error');
    }
  }

  const handleEdit = async (todo: Todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  }

  const handleUpdate = async () => {
    const result = todoSchema.safeParse({ text: editText });

    if (!result.success) {
      setEditError(result.error.issues[0].message);
      return;
    }

    setEditError('');

    const res = await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, text: editText })
    })

    const data = await res.json();

    if (data.status === 'success') {
      showMessage(data.message, 'success');
      setEditId(null);
      setEditText('');
      fetchTodos();
    } else {
      showMessage(data.message, 'error');
    }
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

          {/* Validation Error */}
          {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}

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

                  {/* Validation Error */}
                  {editId === todo.id && editError && <p className="text-red-500 text-sm mt-1">{editError}</p>}
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
