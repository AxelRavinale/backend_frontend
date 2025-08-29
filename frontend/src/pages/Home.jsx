import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bienvenido{user ? `, ${user.nombre}` : ''}!</h1>
      {user && (
        <p>
          Tu rol: <strong>{user.rol}</strong>
        </p>
      )}
      {!user && (
        <p>
          Por favor, inicia sesión o regístrate para acceder a los productos y usuarios.
        </p>
      )}
    </div>
  );
};

export default Home;

