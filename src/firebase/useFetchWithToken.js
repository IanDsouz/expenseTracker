import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const useFetchWithToken = (url, method = 'GET', body = null, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(url, {
        method,
        data: body,
        ...config,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching data:', err);
      // setError(err);
      // throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, body, user]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchWithToken;
