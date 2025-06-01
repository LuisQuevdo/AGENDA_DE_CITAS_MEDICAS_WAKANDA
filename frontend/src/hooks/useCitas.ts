import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Cita } from '../types';

export function useCitas() {
  const [data, setData] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const res = await API.get('/citas/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return { data, loading, error, refetch: fetchCitas };
}