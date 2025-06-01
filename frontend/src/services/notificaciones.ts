import API from './api';
import type { Notificacion } from '../types';

export const getNotificaciones = () => API.get('/notificaciones/');
export const getNotificacion = (id: string) => API.get(`/notificaciones/${id}`);
export const createNotificacion = (data: Notificacion) => API.post('/notificaciones/add', data);
export const updateNotificacion = (id: string, data: Notificacion) => API.put(`/notificaciones/update/${id}`, data);
export const deleteNotificacion = (id: string) => API.delete(`/notificaciones/delete/${id}`);