import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toastRef = useRef(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validaciones simples
        if (!email || !password) {
            toastRef.current.show({ severity: 'warn', summary: 'Campos vacíos', detail: 'Por favor completa todos los campos.' });
            return;
        }

        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(res.data)); // Guardamos token y datos del usuario
            toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Inicio de sesión correcto' });
            navigate('/inicio');
        } catch (err) {
            toastRef.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: err.response?.data?.message || 'Email o contraseña incorrectos' 
            });
        }
    };

    return (
        <div className="flex justify-content-center mt-6">
            <Toast ref={toastRef} />
            <Card title="Iniciar Sesión" className="w-full md:w-6">
                <form onSubmit={handleLogin} className="p-fluid">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText 
                            id="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Contraseña</label>
                        <Password 
                            id="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            feedback={false} 
                            required 
                        />
                    </div>
                    <Button 
                        label="Ingresar" 
                        icon="pi pi-sign-in" 
                        type="submit" 
                        className="mt-2" 
                    />
                </form>
            </Card>
        </div>
    );
};

export default Login;

