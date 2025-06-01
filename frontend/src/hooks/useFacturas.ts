import { useEffect, useState } from 'react';
import API from '../services/api';

export function useFacturas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFacturas = async () => {
    try {
      setLoading(true);
      const res = await API.get('/facturas/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return { data, loading, error, refetch: fetchFacturas };
}