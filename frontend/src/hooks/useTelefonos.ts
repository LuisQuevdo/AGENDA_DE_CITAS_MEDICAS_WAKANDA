import { useEffect, useState } from 'react';
import API from '../services/api';

export function useTelefonos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTelefonos = async () => {
    try {
      setLoading(true);
      const res = await API.get('/telefonos/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar teléfonos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelefonos();
  }, []);

  return { data, loading, error, refetch: fetchTelefonos };
}