import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import api from '../services/api';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toastRef = useRef(null);
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/registro', { nombre, email, password });
      localStorage.setItem('user', JSON.stringify(res.data)); 
      toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado' });
      navigate('/inicio');
    } catch (err) {
      toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Error de registro'
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Toast ref={toastRef} />
      <h2>Registro</h2>
      <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Registro;
