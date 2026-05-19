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

const taigaService = {
  getSprintActual,
  getCriteriosHistoria,
};

export default taigaService;
