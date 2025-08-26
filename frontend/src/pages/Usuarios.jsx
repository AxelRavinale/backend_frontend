import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const toastRef = useRef(null);

  useEffect(() => {
    axios.get('/api/usuarios', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setUsuarios(res.data))
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message }));
  }, [user.token]);

  const cambiarRol = (id, nuevoRol) => {
    axios.put(`/api/usuarios/${id}/rol`, { rol: nuevoRol }, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setUsuarios(usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado' });
      })
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message }));
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