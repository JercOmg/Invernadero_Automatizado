/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: App
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio App
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import InvernaderoList from './pages/invernadero/InvernaderoList';
import ZonaList from './pages/zona/ZonaList';
import CultivoList from './pages/cultivo/CultivoList';
import SiembraList from './pages/siembra/SiembraList';
import SensorList from './pages/sensor/SensorList';
import LecturaSensorList from './pages/lectura_sensor/LecturaSensorList';
import RiegoList from './pages/riego/RiegoList';
import AlertaList from './pages/alerta/AlertaList';
import InsumoList from './pages/insumo/InsumoList';
import AplicacionInsumoList from './pages/aplicacion_insumo/AplicacionInsumoList';
import CosechaList from './pages/cosecha/CosechaList';
import './App.css';

function App() {
  // En producción, este ID vendría de las variables de entorno (import.meta.env.VITE_GOOGLE_CLIENT_ID)
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Rutas CRUD generadas automáticamente en Modales */}
            <Route path="invernadero" element={<InvernaderoList />} />
            <Route path="zona" element={<ZonaList />} />
            <Route path="cultivo" element={<CultivoList />} />
            <Route path="siembra" element={<SiembraList />} />
            <Route path="sensor" element={<SensorList />} />
            <Route path="lectura_sensor" element={<LecturaSensorList />} />
            <Route path="riego" element={<RiegoList />} />
            <Route path="alerta" element={<AlertaList />} />
            <Route path="insumo" element={<InsumoList />} />
            <Route path="aplicacion_insumo" element={<AplicacionInsumoList />} />
            <Route path="cosecha" element={<CosechaList />} />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
