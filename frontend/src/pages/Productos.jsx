import React, { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import api from '../services/api';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: null });
  const [editProducto, setEditProducto] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const toastRef = useRef(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    api.get('/productos', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setProductos(res.data))
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'No se pudieron cargar los productos' }));
  };

  const validarProducto = (producto) => {
    if (!producto.nombre || !producto.precio) {
      toastRef.current.show({ severity: 'warn', summary: 'Campos requeridos', detail: 'Nombre y precio son obligatorios' });
      return false;
    }
    if (producto.precio <= 0) {
      toastRef.current.show({ severity: 'warn', summary: 'Precio inválido', detail: 'El precio debe ser mayor que cero' });
      return false;
    }
    return true;
  };

  const crearProducto = () => {
    if (!validarProducto(nuevoProducto)) return;

    api.post('/productos', nuevoProducto, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => {
        setProductos([...productos, res.data]);
        setNuevoProducto({ nombre: '', precio: null });
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado' });
      })
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Error al crear producto' }));
  };

  const actualizarProducto = () => {
    if (!validarProducto(editProducto)) return;

    api.put(`/productos/${editProducto.id}`, editProducto, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => {
        setProductos(productos.map(p => p.id === editProducto.id ? res.data : p));
        setEditProducto(null);
        toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado' });
      })
      .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Error al actualizar producto' }));
  };

  const eliminarProducto = (producto) => {
    confirmDialog({
      message: `¿Seguro que quieres eliminar ${producto.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        api.delete(`/productos/${producto.id}`, { headers: { Authorization: `Bearer ${user.token}` } })
          .then(() => {
            setProductos(productos.filter(p => p.id !== producto.id));
            toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado' });
          })
          .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Error al eliminar producto' }));
      }
    });
  };

  return (
    <div className="flex justify-content-center mt-6">
      <Toast ref={toastRef} />
      <ConfirmDialog />
      <Card title="Gestión de Productos" className="w-full md:w-8">
        {user.rol === 'admin' && (
          <div className="mb-4">
            <h3>{editProducto ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <div className="p-fluid">
              <div className="field">
                <label>Nombre</label>
                <InputText
                  value={editProducto ? editProducto.nombre : nuevoProducto.nombre}
                  onChange={e => editProducto
                    ? setEditProducto({ ...editProducto, nombre: e.target.value })
                    : setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Precio</label>
                <InputNumber
                  value={editProducto ? editProducto.precio : nuevoProducto.precio}
                  onValueChange={e => editProducto
                    ? setEditProducto({ ...editProducto, precio: e.value })
                    : setNuevoProducto({ ...nuevoProducto, precio: e.value })}
                  mode="currency" currency="USD" locale="en-US"
                />
              </div>
              <Button
                label={editProducto ? 'Actualizar' : 'Crear'}
                icon={editProducto ? 'pi pi-refresh' : 'pi pi-plus'}
                onClick={editProducto ? actualizarProducto : crearProducto}
                className="mt-2"
              />
              {editProducto && <Button label="Cancelar" className="mt-2 ml-2" onClick={() => setEditProducto(null)} />}
            </div>
          </div>
        )}

        <table className="w-full mt-4">
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
                    <Button icon="pi pi-pencil" className="p-button-text" onClick={() => setEditProducto(p)} />
                    <Button icon="pi pi-trash" className="p-button-text p-button-danger ml-2" onClick={() => eliminarProducto(p)} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Productos;
