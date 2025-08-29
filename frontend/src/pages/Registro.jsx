import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import api from '../services/api';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toastRef = useRef(null);
  const navigate = useNavigate();

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      toastRef.current.show({ severity: 'warn', summary: 'Campos requeridos', detail: 'Todos los campos son obligatorios' });
      return;
    }

    if (!validarEmail(email)) {
      toastRef.current.show({ severity: 'warn', summary: 'Email inválido', detail: 'Ingrese un email válido' });
      return;
    }

    if (password.length < 6) {
      toastRef.current.show({ severity: 'warn', summary: 'Contraseña débil', detail: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    try {
      const res = await api.post('/auth/registro', { nombre, email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado correctamente' });
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
    <div className="flex justify-content-center mt-6">
      <Toast ref={toastRef} />
      <Card title="Registro de Usuario" className="w-full md:w-6">
        <form onSubmit={handleRegistro} className="p-fluid">
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText id="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <Password id="password" value={password} onChange={e => setPassword(e.target.value)} feedback={false} required />
          </div>
          <Button label="Registrarse" icon="pi pi-user-plus" type="submit" className="mt-2" />
        </form>
      </Card>
    </div>
  );
};

export default Registro;
