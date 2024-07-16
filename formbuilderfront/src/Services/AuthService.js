import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:3000/api/user/';

const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + 'signin', {
      email,
      password,
    });

    if (response.data.token) {
      const decodedToken = jwtDecode(response.data.token);
      //console.log('Decoded Token:', decodedToken); 
      const userRole = decodedToken.user.role; 
     // console.log('User Role:', userRole); 

      localStorage.setItem('user', JSON.stringify({ ...response.data, role: userRole }));
     // console.log('Stored User:', JSON.parse(localStorage.getItem('user'))); 
    }
    return response.data;
  } catch (error) {
    throw new Error('Invalid email or password');
  }
};
const signup = async (email,username, password,  role) => {
  try {

    const payload = { email, username, password, role };
    console.log('Signup Payload:', payload);
    const response = await axios.post(API_URL + 'signup', payload);

    if (response.data.token) {
      const decodedToken = jwtDecode(response.data.token);
      const userRole = decodedToken.user.role; 

      localStorage.setItem('user', JSON.stringify({ ...response.data, role: userRole }));
    }
    return response.data;
  } catch (error) {
    throw new Error('Error during signup');
  }
};


const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login,
  logout,
  getCurrentUser,
  signup
};
