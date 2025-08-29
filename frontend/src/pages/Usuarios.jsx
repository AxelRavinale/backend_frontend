import React, { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import api from '../services/api';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const toastRef = useRef(null);

  // ✅ Aquí va el useEffect para cargar los usuarios al montar el componente
  useEffect(() => {
    api.get('/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err =>
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: err.response?.data?.message || 'Error al cargar usuarios'
        })
      );
  }, []);

  const cambiarRol = (id, nuevoRol) => {
    api.put(`/usuarios/${id}/rol`, { rol: nuevoRol })
      .then(() => {
        setUsuarios(usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado' });
      })
      .catch(err =>
        toastRef.current.show({
          severity: 'error',
          summary: 'Error',
          detail: err.response?.data?.message || 'Error al actualizar rol'
        })
      );
  };

  return (
    <div>
      <Toast ref={toastRef} />
      <h2>Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            {user.rol === 'admin' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              {user.rol === 'admin' && (
                <td>
                  <select value={u.rol} onChange={e => cambiarRol(u.id, e.target.value)}>
                    <option value="cliente">Cliente</option>
                    <option value="moderador">Moderador</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
