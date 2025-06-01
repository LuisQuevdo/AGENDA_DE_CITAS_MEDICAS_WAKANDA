import { useEffect, useState } from 'react';
import API from '../services/api';

export function useUsuarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/usuarios/')
      .then(res => setData(res.data.data))
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}