import React, { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import api from '../services/api';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const toastRef = useRef(null);

    useEffect(() => {
        api.get('/usuarios', { headers: { Authorization: `Bearer ${user.token}` } })
           .then(res => setUsuarios(res.data))
           .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message }));
    }, [user.token]);

    const cambiarRol = (id, rol) => {
        api.put(`/usuarios/${id}/rol`, { rol }, { headers: { Authorization: `Bearer ${user.token}` } })
           .then(() => {
               setUsuarios(usuarios.map(u => u.id === id ? { ...u, rol } : u));
               toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado' });
           })
           .catch(err => toastRef.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message }));
    };

    const rolBodyTemplate = (rowData) => (
        user.rol === 'admin' ? 
        <Dropdown value={rowData.rol} options={['cliente','moderador','admin']} onChange={e => cambiarRol(rowData.id, e.value)} /> 
        : rowData.rol
    );

    return (
        <div className="m-4">
            <Toast ref={toastRef} />
            <h2>Usuarios</h2>
            <DataTable value={usuarios} responsiveLayout="scroll">
                <Column field="nombre" header="Nombre" />
                <Column field="email" header="Email" />
                <Column header="Rol" body={rolBodyTemplate} />
            </DataTable>
        </div>
    );
};

export default Usuarios;
