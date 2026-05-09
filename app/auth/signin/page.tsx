'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message:'Please enter a password of 6 characters or more.' })
});

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signInSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: { email?: string, password?: string } = {};
      result.error.issues.forEach(({ path, message }) => {
        if (path[0] === 'email') fieldErrors.email = message;
        if (path[0] === 'password') fieldErrors.password = message;
      });
      setErrors(fieldErrors);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (res?.ok) {
      router.push('/')
    } else {
      alert("Failed to sign in");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
          />
          {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
          />
          {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password}</p>)}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}