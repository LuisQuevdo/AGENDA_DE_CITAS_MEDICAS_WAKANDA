import API from './api';
import type { Especialidad } from '../types';

export const getEspecialidades = () => API.get('/especialidades/');
export const getEspecialidad = (id: string) => API.get(`/especialidades/${id}`);
export const createEspecialidad = (data: Especialidad) => API.post('/especialidades/add', data);
export const updateEspecialidad = (id: string, data: Especialidad) => API.put(`/especialidades/update/${id}`, data);
export const deleteEspecialidad = (id: string) => API.delete(`/especialidades/delete/${id}`);