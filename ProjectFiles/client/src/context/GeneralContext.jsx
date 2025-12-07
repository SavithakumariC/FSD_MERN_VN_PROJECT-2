// src/context/GeneralContext.jsx
import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socketIoClient from 'socket.io-client';

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {
  const WS = 'http://localhost:6001';
  const navigate = useNavigate();

  // Create axios instance with interceptor
  const api = axios.create({
    baseURL: 'http://localhost:6001',
  });

  // Add request interceptor - THIS IS CRITICAL
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token); // Debug log
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log('401 error - redirecting to login');
        localStorage.clear();
        navigate('/authenticate');
      }
      return Promise.reject(error);
    }
  );

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  const socket = socketIoClient(WS);

  const login = async () => {
    try {
      const loginInputs = { email, password };
      console.log('Login attempt with:', { email }); // Debug
      
      const res = await axios.post('http://localhost:6001/login', loginInputs);
      console.log('Login response:', res.data); // Debug

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('usertype', res.data.user.usertype);
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('email', res.data.user.email);

      console.log('Token stored:', res.data.token); // Debug

      if(res.data.user.usertype === 'freelancer') navigate('/freelancer');
      else if(res.data.user.usertype === 'client') navigate('/client');
      else if(res.data.user.usertype === 'admin') navigate('/admin');
    } catch (err) {
      console.log('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed!!");
    }
  };

  const register = async () => {
    if (!username || !email || !password || !usertype) {
      alert("All fields are required!");
      return;
    }

    try {
      console.log('Register attempt:', { username, email, usertype }); // Debug
      const res = await axios.post('http://localhost:6001/register', { 
        username, email, password, usertype 
      });
      
      console.log('Register response:', res.data); // Debug

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('usertype', res.data.user.usertype);
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('email', res.data.user.email);

      console.log('Token stored after register:', res.data.token); // Debug

      if(res.data.user.usertype === 'freelancer') navigate('/freelancer');
      else if(res.data.user.usertype === 'client') navigate('/client');
      else if(res.data.user.usertype === 'admin') navigate('/admin');
    } catch (err) {
      console.log('Register error:', err.response?.data || err.message);
      alert(err.response?.data?.msg || "Registration failed!");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider value={{
      socket,
      api,  // Make sure this is included!
      login,
      register,
      logout,
      username,
      setUsername,
      email,
      setEmail,
      password,
      setPassword,
      usertype,
      setUsertype
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;