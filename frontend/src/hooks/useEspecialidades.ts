import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Especialidad } from '../types';

export function useEspecialidades() {
  const [data, setData] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEspecialidades = async () => {
    try {
      setLoading(true);
      const res = await API.get('/especialidades/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar especialidades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  return { data, loading, error, refetch: fetchEspecialidades };
}