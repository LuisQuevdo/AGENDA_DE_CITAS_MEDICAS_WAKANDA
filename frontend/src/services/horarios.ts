import API from './api';
import type { Horario, HorarioInput } from '../types';

export const getHorarios = () => API.get('/horarios/');
export const getHorario = (id: string) => API.get(`/horarios/${id}`);
export const createHorario = (data: HorarioInput) => API.post('/horarios/add', data);
export const updateHorario = (id: string, data: HorarioInput) => API.put(`/horarios/update/${id}`, data);
export const deleteHorario = (id: string) => API.delete(`/horarios/delete/${id}`);