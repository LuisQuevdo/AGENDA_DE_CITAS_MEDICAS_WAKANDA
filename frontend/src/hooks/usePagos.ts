import { useEffect, useState } from 'react';
import API from '../services/api';

export function usePagos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPagos = async () => {
    try {
      setLoading(true);
      const res = await API.get('/pagos/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  return { data, loading, error, refetch: fetchPagos };
}