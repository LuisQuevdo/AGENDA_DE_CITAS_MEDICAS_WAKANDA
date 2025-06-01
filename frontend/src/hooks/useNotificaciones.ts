import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Notificacion } from '../types';

export function useNotificaciones() {
  const [data, setData] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotificaciones = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notificaciones/');
      setData(res.data.data);
    } catch {
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  return { data, loading, error, refetch: fetchNotificaciones };
}