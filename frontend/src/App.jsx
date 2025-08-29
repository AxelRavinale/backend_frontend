import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Navbar from './components/Navbar';
import Productos from './pages/Productos';
import Usuarios from './pages/Usuarios';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Ruta raíz y /inicio van al mismo Home */}
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Home />} />

        {/* Rutas públicas */}
        <Route path="/inicio-sesion" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/registro" element={<PublicRoute><Registro /></PublicRoute>} />

        {/* Rutas privadas */}
        <Route path="/productos/*" element={<PrivateRoute><Productos /></PrivateRoute>} />
        <Route path="/usuarios/*" element={<PrivateRoute><Usuarios /></PrivateRoute>} />

        {/* Cualquier ruta desconocida redirige al Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
