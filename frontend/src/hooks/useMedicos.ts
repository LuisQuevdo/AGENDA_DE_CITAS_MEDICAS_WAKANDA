import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Medico } from '../types';

export function useMedicos() {
  const [data, setData] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const res = await API.get('/medicos/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar médicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  return { data, loading, error, refetch: fetchMedicos };
}