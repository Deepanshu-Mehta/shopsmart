import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './products.js';

describe('useProducts hook', () => {
  it('starts with loading=true, products=[], error=null', () => {
    fetch.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('sets products and loading=false on successful fetch', async () => {
    const mockData = [{ id: 1, name: 'Linen Drape Top' }];
    fetch.mockResolvedValue({ ok: true, json: async () => mockData });

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('sets error when response is not ok', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to fetch products');
    expect(result.current.products).toEqual([]);
  });

  it('includes ?category= in URL when category is provided', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });

    renderHook(() => useProducts('tops'));
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('?category=tops'));
  });

  it('does not include ?category= when no category is given', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });

    renderHook(() => useProducts());
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const url = fetch.mock.calls[0][0];
    expect(url).not.toContain('?category=');
  });

  it('does not update state after unmount (no errors thrown)', async () => {
    let resolvePromise;
    fetch.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { unmount } = renderHook(() => useProducts());
    unmount();

    // Resolve after unmount — should not throw
    await Promise.resolve(
      resolvePromise({ ok: true, json: async () => [{ id: 1 }] })
    );
  });
});
