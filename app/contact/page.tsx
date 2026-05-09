'use client';

import { useState } from 'react';
import { useFlashMessage } from '../context/FlashMessageContext';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, { message:'Please enter a name with at least two characters.' }),
  email: z.string().email({ message:'Please enter a valid email address.' }),
  message: z.string().min(10, { message:'Please enter a message with at least ten characters.' })
});

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string, email?: string, message?: string }>({});
  const { showMessage } = useFlashMessage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { name?: string, email?: string, message?: string } = {};
      result.error.issues.forEach(({ path, message }) => {
        if (path[0] === 'name') fieldErrors.name = message;
        if (path[0] === 'email') fieldErrors.email = message;
        if (path[0] === 'message') fieldErrors.message = message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.status === 'success') {
        showMessage(data.message, 'success');
        setForm({ name: '', email: '', message: '' });
      } else {
        showMessage(data.message || 'Sending failed.', 'error');
      }
    } catch (error) {
      showMessage('An error occurred. Please try again.', 'error');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Contact</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="山田 太郎"
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
          />
          {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name}</p>)}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@example.com"
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
          />
          {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Please enter your inquiry details."
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.message ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
          />
          {errors.message && (<p className="text-red-500 text-sm mt-1">{errors.message}</p>)}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  )
}