/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: zonaService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio zonaService
 */
import apiClient from './api';

/**
 * Servicio para operaciones CRUD de Zona
 */
const zonaService = {
  /**
   * Obtener todos los registros
   */
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get('/zona', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener un registro por ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/zona/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo registro
   */
  create: async (data) => {
    const response = await apiClient.post('/zona', data);
    return response.data;
  },

  /**
   * Actualizar un registro existente
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/zona/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un registro
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/zona/${id}`);
    return response.data;
  },
};

export default zonaService;
