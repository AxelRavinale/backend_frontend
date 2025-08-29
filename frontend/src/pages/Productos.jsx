import React, { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import api from '../services/api';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '' });
  const [editProducto, setEditProducto] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const toastRef = useRef(null);

  // Cargar productos al montar
  useEffect(() => {
    api.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Error al cargar productos'
      }));
  }, []);

  // Crear producto
  const crearProducto = () => {
    api.post('/productos', nuevoProducto)
      .then(res => {
        setProductos([...productos, res.data]);
        setNuevoProducto({ nombre: '', precio: '' });
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado' });
      })
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.message }));
  };

  // Actualizar producto
  const actualizarProducto = () => {
    api.put(`/productos/${editProducto.id}`, editProducto)
      .then(res => {
        setProductos(productos.map(p => p.id === editProducto.id ? res.data : p));
        setEditProducto(null);
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado' });
      })
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.message }));
  };

  // Eliminar producto con confirmación
  const eliminarProducto = (producto) => {
    confirmDialog({
      message: `¿Seguro que quieres eliminar ${producto.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        api.delete(`/productos/${producto.id}`)
          .then(() => {
            setProductos(productos.filter(p => p.id !== producto.id));
            toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado' });
          })
          .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.message }));
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
