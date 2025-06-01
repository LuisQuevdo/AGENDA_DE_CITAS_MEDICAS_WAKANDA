import API from './api';
import type { MetodoPago } from '../types';

export const getMetodosPago = () => API.get('/metodos_pago/');
export const getMetodoPago = (id: number) => API.get(`/metodos_pago/${id}`);
export const createMetodoPago = (data: MetodoPago) => API.post('/metodos_pago/add', data);
export const updateMetodoPago = (id: number, data: MetodoPago) => API.put(`/metodos_pago/update/${id}`, data);
export const deleteMetodoPago = (id: number) => API.delete(`/metodos_pago/delete/${id}`);