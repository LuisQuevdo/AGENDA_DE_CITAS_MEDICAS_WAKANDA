import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Horario } from '../types';

export function useHorarios() {
  const [data, setData] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const res = await API.get('/horarios/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  return { data, loading, error, refetch: fetchHorarios };
}