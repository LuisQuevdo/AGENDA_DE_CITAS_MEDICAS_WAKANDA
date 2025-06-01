import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Consultorio } from '../types';

export function useConsultorios() {
  const [data, setData] = useState<Consultorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConsultorios = async () => {
    try {
      setLoading(true);
      const res = await API.get('/consultorios/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar consultorios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultorios();
  }, []);

  return { data, loading, error, refetch: fetchConsultorios };
}