/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: authService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio authService
 */
import apiClient from './api';

/**
 * Servicio de autenticación
 * Maneja login, registro, logout y refresh de tokens
 */
const authService = {
  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} Datos del usuario y tokens
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, userId, nombre, apellido, rol } = response.data;

    // Guardar tokens y datos del usuario en localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify({ userId, email, nombre, apellido, rol }));

    return response.data;
  },

  /**
   * Login con Google
   * @param {string} idToken - Token de ID devuelto por Google
   * @returns {Promise} Datos del usuario y tokens
   */
  loginWithGoogle: async (idToken) => {
    const response = await apiClient.post('/auth/google', { idToken });
    const { accessToken, refreshToken, userId, nombre, apellido, rol, email } = response.data;

    // Guardar tokens y datos del usuario en localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify({ userId, email, nombre, apellido, rol }));

    return response.data;
  },

  /**
   * Registro de nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise} Datos del usuario y tokens
   */
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    const { accessToken, refreshToken, userId, email, nombre, apellido, rol } = response.data;

    // Guardar tokens y datos del usuario en localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify({ userId, email, nombre, apellido, rol }));

    return response.data;
  },

  /**
   * Logout del usuario
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Obtener usuario actual
   * @returns {Object|null} Datos del usuario o null si no está autenticado
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} true si está autenticado, false en caso contrario
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Obtener información del usuario autenticado desde el backend
   * @returns {Promise} Datos del usuario
   */
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Refrescar el access token
   * @returns {Promise} Nuevo access token
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    return response.data;
  },

  /**
   * Obtener todos los usuarios registrados en el sistema
   * @returns {Promise} Lista de usuarios
   */
  getUsuarios: async () => {
    const response = await apiClient.get('/auth/usuarios');
    return response.data;
  },
};

export default authService;
