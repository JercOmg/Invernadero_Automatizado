/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: insumoService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio insumoService
 */
import apiClient from './api';

/**
 * Servicio para operaciones CRUD de Insumo
 */
const insumoService = {
  /**
   * Obtener todos los registros
   */
  getAll: async (page = 0, size = 10) => {
    const response = await apiClient.get('/insumo', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener un registro por ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/insumo/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo registro
   */
  create: async (data) => {
    const response = await apiClient.post('/insumo', data);
    return response.data;
  },

  /**
   * Actualizar un registro existente
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/insumo/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un registro
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/insumo/${id}`);
    return response.data;
  },
};

export default insumoService;
