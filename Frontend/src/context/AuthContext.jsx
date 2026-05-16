import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación
 * Maneja el estado de autenticación global de la aplicación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la app
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  /**
   * Login del usuario
   */
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser({
        userId: data.userId,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Registro de nuevo usuario
   */
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser({
        userId: data.userId,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout del usuario
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = (role) => {
    return user?.rol === role;
  };

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  const hasAnyRole = (roles) => {
    return roles.includes(user?.rol);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
