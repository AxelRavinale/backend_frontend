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
    <nav style={{ display: 'flex', gap: '15px', padding: '10px', borderBottom: '1px solid #ccc' }}>
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

          {user.rol === 'admin' && <span style={{ marginLeft: '10px', fontWeight: 'bold', color: 'red' }}>Panel Admin</span>}

          <span style={{ marginLeft: '10px' }}>
            Rol: <strong>{user.rol}</strong>
          </span>

          <button onClick={logout} style={{ marginLeft: 'auto' }}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;

