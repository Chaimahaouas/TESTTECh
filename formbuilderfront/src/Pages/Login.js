import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';

import AuthSer from '../Services/AuthService';



const Login = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
     const response = await AuthSer.login(email, password);
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('User data:', user);
      console.log(user.role)
;
      if (user.role === 'admin') {
       navigate('/admin/mainapp');
        console.log("admin is here")
      } else {
        navigate('/user/UserDash');
      }
     
    } catch (error) {
      setMessage('Invalid email or password');
    }
  };

            
       
        console.log('Login Attempt:', email, password);
      
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex w-2/3">
                <div className="md:w-1/3">
                    <img src="/login.jpg" alt="Login Visual" className="object-cover w-full h-full"/>
                </div>
                <div className="p-8 md:w-2/3 flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-8 text-center">Welcome!</h1>
                    <form onSubmit={handleLogin} className="w-full max-w-xs space-y-6">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 text-center">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => setemail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 text-center">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                            Login
                        </button>
                        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
                    </form>
                    <div className="mt-4">
            <Link to="/signup" className="text-blue-500 hover:underline">Don't have an account? Sign up</Link>
          </div>
                </div>
            </div>
        </div>
    );
}

export default Login;