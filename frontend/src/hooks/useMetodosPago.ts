import { useEffect, useState } from 'react';
import API from '../services/api';

export function useMetodosPago() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetodosPago = async () => {
    try {
      setLoading(true);
      const res = await API.get('/metodos_pago/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar Metodos de Pago');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetodosPago();
  }, []);

  return { data, loading, error, refetch: fetchMetodosPago };
}