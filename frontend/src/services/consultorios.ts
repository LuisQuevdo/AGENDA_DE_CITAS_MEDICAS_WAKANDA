import API from './api';
import type { Consultorio } from '../types';

export const getConsultorios = () => API.get('/consultorios/');
export const getConsultorio = (id: string) => API.get(`/consultorios/${id}`);
export const createConsultorio = (data: Consultorio) => API.post('/consultorios/add', data);
export const updateConsultorio = (id: string, data: Consultorio) => API.put(`/consultorios/update/${id}`, data);
export const deleteConsultorio = (id: string) => API.delete(`/consultorios/delete/${id}`);