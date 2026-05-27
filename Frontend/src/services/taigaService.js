/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: taigaService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Servicio para integracion con la API del Backend (Taiga)
 */
import api from './api';

const getSprintActual = async () => {
  const response = await api.get('/taiga/sprint-actual');
  return response.data;
};

const getCriteriosHistoria = async (id) => {
  const response = await api.get(`/taiga/historia/${id}/criterios`);
  return response.data;
};

const getMiembros = async () => {
  const response = await api.get('/taiga/miembros');
  return response.data;
};

const crearHistoria = async (data) => {
  const response = await api.post('/taiga/historia', data);
  return response.data;
};

const asignarHistoria = async (id, userId) => {
  const response = await api.put(`/taiga/historia/${id}/asignar`, { assigned_to: userId });
  return response.data;
};

const crearTarea = async (data) => {
  const response = await api.post('/taiga/tarea', data);
  return response.data;
};

const taigaService = {
  getSprintActual,
  getCriteriosHistoria,
  getMiembros,
  crearHistoria,
  asignarHistoria,
  crearTarea,
};

export default taigaService;

