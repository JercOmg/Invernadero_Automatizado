/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: cultivoService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio cultivoService
 */
import apiClient from './api';

/**
 * Servicio para operaciones CRUD de Cultivo
 */
const cultivoService = {
  /**
   * Obtener todos los registros
   */
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get('/cultivo', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener un registro por ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/cultivo/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo registro
   */
  create: async (data) => {
    const response = await apiClient.post('/cultivo', data);
    return response.data;
  },

  /**
   * Actualizar un registro existente
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/cultivo/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un registro
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/cultivo/${id}`);
    return response.data;
  },
};

export default cultivoService;
