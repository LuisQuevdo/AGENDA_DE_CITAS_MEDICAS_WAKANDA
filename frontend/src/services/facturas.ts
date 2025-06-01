import API from './api';
import type { FacturaForm } from '../types';

export const getFacturas = () => API.get('/facturas/');
export const getFactura = (id: string) => API.get(`/facturas/${id}`);

export const createFactura = (data: FacturaForm) => {
  const subtotal = parseFloat(data.subtotal);
  const iva = parseFloat(data.iva);
  const total = subtotal + iva;

  return API.post('/facturas/add', {
    ...data,
    subtotal,
    iva,
    total
  });
};

export const updateFactura = (id: string, data: FacturaForm) => {
  const subtotal = parseFloat(data.subtotal);
  const iva = parseFloat(data.iva);
  const total = subtotal + iva;

  return API.put(`/facturas/update/${id}`, {
    ...data,
    subtotal,
    iva,
    total
  });
};

export const deleteFactura = (id: string) => API.delete(`/facturas/delete/${id}`);