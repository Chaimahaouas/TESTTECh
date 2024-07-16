import React, { useState } from 'react';
import AuthSer from '../Services/AuthService';
import { useNavigate,Link } from 'react-router-dom';
const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthSer.signup(email, username, password, role);
      console.log('Signup response:', response);
      setMessage('Signup successful! You can now log in.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex w-2/3">
        <div className="md:w-1/3">
          <img src="/login.jpg" alt="Signup Visual" className="object-cover  h-full" />
        </div>
        <div className="p-8 md:w-2/3 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-8 text-center">Sign Up</h1>
          <form onSubmit={handleSignup} className="w-full max-w-xs space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 text-center">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700 text-center">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 text-center">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700 text-center">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
              Sign Up
            </button>
            {message && <p className="text-red-500 text-center mt-4">{message}</p>}
            <div className="text-center mt-4">
              <Link to="/" className="text-blue-500 hover:underline">Already have an account? Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
