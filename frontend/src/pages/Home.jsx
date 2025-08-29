import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="flex justify-content-center mt-6">
            <Card title="Bienvenido a la Plataforma" className="w-full md:w-6">
                <p className="m-0">
                    {user 
                        ? `Hola, ${user.nombre}! Tu rol es: ${user.rol.toUpperCase()}.`
                        : "Por favor inicia sesión o regístrate para acceder a la gestión de productos y usuarios."}
                </p>

                <div className="mt-4 flex gap-3 flex-wrap">
                    {!user && (
                        <>
                            <Button 
                                label="Iniciar Sesión" 
                                icon="pi pi-sign-in" 
                                onClick={() => navigate('/inicio-sesion')} 
                            />
                            <Button 
                                label="Registrarse" 
                                icon="pi pi-user-plus" 
                                onClick={() => navigate('/registro')} 
                                className="p-button-success"
                            />
                        </>
                    )}

                    {user && (
                        <>
                            <Button 
                                label="Ver Productos" 
                                icon="pi pi-box" 
                                onClick={() => navigate('/productos')} 
                            />
                            <Button 
                                label="Ver Usuarios" 
                                icon="pi pi-users" 
                                onClick={() => navigate('/usuarios')} 
                                className="p-button-info"
                            />
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Home;

