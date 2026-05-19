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
import InvernaderoForm from './pages/invernadero/InvernaderoForm';
import ZonaList from './pages/zona/ZonaList';
import ZonaForm from './pages/zona/ZonaForm';
import CultivoList from './pages/cultivo/CultivoList';
import CultivoForm from './pages/cultivo/CultivoForm';
import SiembraList from './pages/siembra/SiembraList';
import SiembraForm from './pages/siembra/SiembraForm';
import SensorList from './pages/sensor/SensorList';
import SensorForm from './pages/sensor/SensorForm';
import LecturaSensorList from './pages/lectura_sensor/LecturaSensorList';
import LecturaSensorForm from './pages/lectura_sensor/LecturaSensorForm';
import RiegoList from './pages/riego/RiegoList';
import RiegoForm from './pages/riego/RiegoForm';
import AlertaList from './pages/alerta/AlertaList';
import AlertaForm from './pages/alerta/AlertaForm';
import InsumoList from './pages/insumo/InsumoList';
import InsumoForm from './pages/insumo/InsumoForm';
import AplicacionInsumoList from './pages/aplicacion_insumo/AplicacionInsumoList';
import AplicacionInsumoForm from './pages/aplicacion_insumo/AplicacionInsumoForm';
import CosechaList from './pages/cosecha/CosechaList';
import CosechaForm from './pages/cosecha/CosechaForm';
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
            
            {/* Rutas CRUD generadas automáticamente */}
            <Route path="invernadero" element={<InvernaderoList />} />
            <Route path="invernadero/new" element={<InvernaderoForm />} />
            <Route path="invernadero/:id" element={<InvernaderoForm />} />
            
            <Route path="zona" element={<ZonaList />} />
            <Route path="zona/new" element={<ZonaForm />} />
            <Route path="zona/:id" element={<ZonaForm />} />
            
            <Route path="cultivo" element={<CultivoList />} />
            <Route path="cultivo/new" element={<CultivoForm />} />
            <Route path="cultivo/:id" element={<CultivoForm />} />
            
            <Route path="siembra" element={<SiembraList />} />
            <Route path="siembra/new" element={<SiembraForm />} />
            <Route path="siembra/:id" element={<SiembraForm />} />
            
            <Route path="sensor" element={<SensorList />} />
            <Route path="sensor/new" element={<SensorForm />} />
            <Route path="sensor/:id" element={<SensorForm />} />
            
            <Route path="lectura_sensor" element={<LecturaSensorList />} />
            <Route path="lectura_sensor/new" element={<LecturaSensorForm />} />
            <Route path="lectura_sensor/:id" element={<LecturaSensorForm />} />
            
            <Route path="riego" element={<RiegoList />} />
            <Route path="riego/new" element={<RiegoForm />} />
            <Route path="riego/:id" element={<RiegoForm />} />
            
            <Route path="alerta" element={<AlertaList />} />
            <Route path="alerta/new" element={<AlertaForm />} />
            <Route path="alerta/:id" element={<AlertaForm />} />
            
            <Route path="insumo" element={<InsumoList />} />
            <Route path="insumo/new" element={<InsumoForm />} />
            <Route path="insumo/:id" element={<InsumoForm />} />
            
            <Route path="aplicacion_insumo" element={<AplicacionInsumoList />} />
            <Route path="aplicacion_insumo/new" element={<AplicacionInsumoForm />} />
            <Route path="aplicacion_insumo/:id" element={<AplicacionInsumoForm />} />
            
            <Route path="cosecha" element={<CosechaList />} />
            <Route path="cosecha/new" element={<CosechaForm />} />
            <Route path="cosecha/:id" element={<CosechaForm />} />
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
