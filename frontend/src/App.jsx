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
        <Route path="/inicio" element={<Home />} />
        <Route path="/inicio-sesion" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/registro" element={<PublicRoute><Registro /></PublicRoute>} />
        <Route path="/productos/*" element={<PrivateRoute><Productos /></PrivateRoute>} />
        <Route path="/usuarios/*" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/inicio" />} />
      </Routes>
    </Router>
  );
}

export default App;