import API from './api';
import type { PagoInput } from '../types';

export const getPagos = () => API.get('/pagos/');
export const getPago = (id: string) => API.get(`/pagos/${id}`);
export const createPago = (data: PagoInput) => API.post('/pagos/add', data);
export const updatePago = (id: string, data: PagoInput) => API.put(`/pagos/update/${id}`, data);
export const deletePago = (id: string) => API.delete(`/pagos/delete/${id}`);