import API from './api';
import type { Cita } from '../types';

export const getCitas = () => API.get('/citas/');
export const getCita = (id: string) => API.get(`/citas/${id}`);
export const createCita = (data: Cita) => API.post('/citas/add', data);
export const updateCita = (id: string, data: Cita) => API.put(`/citas/update/${id}`, data);
export const deleteCita = (id: string) => API.delete(`/citas/delete/${id}`);