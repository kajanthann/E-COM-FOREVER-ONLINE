import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (currentState === 'Sign Up' && !name) {
      toast.error('Please enter your name');
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(
          `${backendUrl}/api/user/register`,
          { name, email, password }
        );
        
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Registration successful!');
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(
          `${backendUrl}/api/user/login`,
          { email, password }
        );
        
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Login successful!');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      
      {currentState === 'Sign Up' && (
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full px-3 py-2 rounded border border-gray-700'
          placeholder='Name'
          required
        />
      )}
      
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full px-3 py-2 border rounded border-gray-700'
        placeholder='Email'
        required
      />
      
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full px-3 py-2 border rounded border-gray-700'
        placeholder='Password'
        required
      />

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot Password</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        )}
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className={`w-full px-8 py-2 mt-4 text-white font-light ${
          loading ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'
        } transition-colors`}
      >
        {loading ? 'Please wait...' : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  )
}

export default Login