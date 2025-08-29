import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar estilos de PrimeReact (si los estás usando)
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // tema
import 'primereact/resources/primereact.min.css';                 // estilos base
import 'primeicons/primeicons.css';                               // iconos

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

