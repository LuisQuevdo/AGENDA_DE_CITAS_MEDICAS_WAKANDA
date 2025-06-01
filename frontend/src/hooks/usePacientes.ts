import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Paciente } from '../types';

export function usePacientes() {
  const [data, setData] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/pacientes/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return { data, loading, error, refetch: fetchPacientes };
}