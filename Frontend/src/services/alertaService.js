/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: alertaService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio alertaService
 */
import apiClient from './api';

/**
 * Servicio para operaciones CRUD de Alerta
 */
const alertaService = {
  /**
   * Obtener todos los registros
   */
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get('/alerta', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener un registro por ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/alerta/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo registro
   */
  create: async (data) => {
    const response = await apiClient.post('/alerta', data);
    return response.data;
  },

  /**
   * Actualizar un registro existente
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/alerta/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un registro
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/alerta/${id}`);
    return response.data;
  },
};

export default alertaService;
