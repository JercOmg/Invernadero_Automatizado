/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: cosechaService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio cosechaService
 */
import apiClient from './api';

/**
 * Servicio para operaciones CRUD de Cosecha
 */
const cosechaService = {
  /**
   * Obtener todos los registros
   */
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get('/cosecha', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener un registro por ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/cosecha/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo registro
   */
  create: async (data) => {
    const response = await apiClient.post('/cosecha', data);
    return response.data;
  },

  /**
   * Actualizar un registro existente
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/cosecha/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un registro
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/cosecha/${id}`);
    return response.data;
  },
};

export default cosechaService;
