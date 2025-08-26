import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '' });
  const [editProducto, setEditProducto] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const toastRef = useRef(null);

  useEffect(() => {
    fetchProductos();
  }, [user.token]);

  const fetchProductos = () => {
    axios.get('/api/productos', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setProductos(res.data))
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message }));
  };

  const crearProducto = () => {
    axios.post('/api/productos', nuevoProducto, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => {
        setProductos([...productos, res.data]);
        setNuevoProducto({ nombre: '', precio: '' });
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado' });
      })
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message }));
  };

  const actualizarProducto = () => {
    axios.put(`/api/productos/${editProducto.id}`, editProducto, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => {
        setProductos(productos.map(p => p.id === editProducto.id ? res.data : p));
        setEditProducto(null);
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado' });
      })
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message }));
  };

  const eliminarProducto = (producto) => {
    confirmDialog({
      message: `¿Seguro que quieres eliminar ${producto.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        axios.delete(`/api/productos/${producto.id}`, { headers: { Authorization: `Bearer ${user.token}` } })
          .then(() => {
            setProductos(productos.filter(p => p.id !== producto.id));
            toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado' });
          })
          .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message }));
      }
    });
  };

  return (
    <div>
      <Toast ref={toastRef} />
      <ConfirmDialog />
      <h2>Productos</h2>

      {user.rol === 'admin' && (
        <div>
          <h3>{editProducto ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <input
            placeholder="Nombre"
            value={editProducto ? editProducto.nombre : nuevoProducto.nombre}
            onChange={e => editProducto
              ? setEditProducto({ ...editProducto, nombre: e.target.value })
              : setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
          />
          <input
            placeholder="Precio"
            type="number"
            value={editProducto ? editProducto.precio : nuevoProducto.precio}
            onChange={e => editProducto
              ? setEditProducto({ ...editProducto, precio: e.target.value })
              : setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
          />
          <button onClick={editProducto ? actualizarProducto : crearProducto}>
            {editProducto ? 'Actualizar' : 'Crear'}
          </button>
          {editProducto && <button onClick={() => setEditProducto(null)}>Cancelar</button>}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            {user.rol === 'admin' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              {user.rol === 'admin' && (
                <td>
                  <button onClick={() => setEditProducto(p)}>Editar</button>
                  <button onClick={() => eliminarProducto(p)}>Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
