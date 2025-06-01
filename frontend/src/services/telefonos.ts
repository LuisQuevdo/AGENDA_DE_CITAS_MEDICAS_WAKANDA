import API from './api';
import type { TelefonoInput } from '../types';

export const getTelefonos = () => API.get('/telefonos/');
export const getTelefono = (id: string) => API.get(`/telefonos/${id}`);
export const createTelefono = (data: TelefonoInput) => API.post('/telefonos/add', data);
export const updateTelefono = (id: string, data: TelefonoInput) => API.put(`/telefonos/update/${id}`, data);
export const deleteTelefono = (id: string) => API.delete(`/telefonos/delete/${id}`);