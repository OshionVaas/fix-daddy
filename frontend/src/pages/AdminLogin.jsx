import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 font-sans">
      <h2 className="text-2xl font-semibold mb-6">Fix Daddy Admin Login</h2>
      <form
        className="flex flex-col gap-3 w-80 p-6 border border-gray-300 rounded-lg bg-gray-100 shadow-md"
        onSubmit={handleLogin}
      >
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-400 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border border-gray-400 rounded"
        />
        <button
          type="submit"
          className="p-2 bg-gray-800 text-white rounded hover:bg-red-700 transition-colors duration-200"
        >
          Login
        </button>
        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
