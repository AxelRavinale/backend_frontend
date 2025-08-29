import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toastRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Login correcto' });
      navigate('/inicio');
    } catch (err) {
      toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Error al iniciar sesión'
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Toast ref={toastRef} />
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
