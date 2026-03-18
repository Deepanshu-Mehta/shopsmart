import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export function useProducts(category = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const url = category
      ? `${API_URL}/api/products?category=${encodeURIComponent(category)}`
      : `${API_URL}/api/products`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch products');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  return { products, loading, error };
}
