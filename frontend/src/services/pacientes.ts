import API from './api';
import type { PacienteCreate, PacienteUpdate } from '../types';

export const getPacientes = () => API.get('/pacientes/');
export const getPaciente = (id: string) => API.get(`/pacientes/${id}`);
export const createPaciente = async (paciente: PacienteCreate) => {return await API.post('/pacientes/add', paciente);};
export const updatePaciente = async (id: string, paciente: PacienteUpdate) => {return await API.put(`/pacientes/update/${id}`, paciente);};
export const deletePaciente = (id: string) => API.delete(`/pacientes/delete/${id}`);