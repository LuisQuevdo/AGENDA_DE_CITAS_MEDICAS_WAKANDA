import API from './api';
import type { Medico } from '../types';

export const getMedicos = () => API.get('/medicos/');
export const getMedico = (id: string) => API.get(`/medicos/${id}`);
export const createMedico = (data: Medico) => API.post('/medicos/add', data);
export const updateMedico = (id: string, data: Medico) => API.put(`/medicos/update/${id}`, data);
export const deleteMedico = (id: string) => API.delete(`/medicos/delete/${id}`);