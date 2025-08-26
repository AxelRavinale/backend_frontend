import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/inicio-sesion');
  };

  return (
    <nav>
      <Link to="/inicio">Inicio</Link>
      {!user && (
        <>
          <Link to="/inicio-sesion">Login</Link>
          <Link to="/registro">Registro</Link>
        </>
      )}
      {user && (
        <>
          <Link to="/productos">Productos</Link>
          <Link to="/usuarios">Usuarios</Link>
          {user.rol === 'admin' && <span>Panel Admin</span>}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;