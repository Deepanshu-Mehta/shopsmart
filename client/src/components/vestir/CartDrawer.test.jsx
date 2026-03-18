import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartDrawer from './CartDrawer';

const items = [
  {
    id: 'item-1',
    quantity: 2,
    size: 'M',
    color: 'Sand',
    product: { id: 1, name: 'Linen Drape Top', price: 420000, priceLabel: '₹4,200', imgClass: '' },
  },
];

const itemQty1 = [
  {
    id: 'item-1',
    quantity: 1,
    size: 'S',
    color: 'Noir',
    product: { id: 1, name: 'Silk Shirt', price: 650000, priceLabel: '₹6,500', imgClass: '' },
  },
];

describe('CartDrawer', () => {
  it('is off-screen when open=false', () => {
    render(<CartDrawer open={false} onClose={() => {}} user={null} cartItems={[]} onCartItemsChange={() => {}} />);
    const drawer = screen.getByRole('dialog', { name: /Shopping bag/i });
    expect(drawer).toHaveStyle({ transform: 'translateX(100%)' });
  });

  it('shows sign-in prompt when user=null', () => {
    render(<CartDrawer open={true} onClose={() => {}} user={null} cartItems={[]} onCartItemsChange={() => {}} />);
    expect(screen.getByText(/Sign in to view your bag/i)).toBeInTheDocument();
  });

  it('shows empty bag message when cartItems is empty', () => {
    render(<CartDrawer open={true} onClose={() => {}} user={{ id: 'u1' }} cartItems={[]} onCartItemsChange={() => {}} />);
    expect(screen.getByText(/Your bag is empty/i)).toBeInTheDocument();
  });

  it('renders cart items from props immediately without fetching', () => {
    render(<CartDrawer open={true} onClose={() => {}} user={{ id: 'u1' }} cartItems={items} onCartItemsChange={() => {}} />);
    expect(screen.getByText('Linen Drape Top')).toBeInTheDocument();
    expect(screen.getByText('M · Sand')).toBeInTheDocument();
    expect(screen.getByText('₹4,200')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<CartDrawer open={true} onClose={onClose} user={null} cartItems={[]} onCartItemsChange={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Close bag/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onCartItemsChange to remove item and fires DELETE', async () => {
    const onCartItemsChange = vi.fn();
    fetch.mockResolvedValue({ ok: true });

    render(
      <CartDrawer open={true} onClose={() => {}} user={{ id: 'u1' }} cartItems={items} onCartItemsChange={onCartItemsChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: /Remove item/i }));

    expect(onCartItemsChange).toHaveBeenCalled();
    await waitFor(() => {
      const deleteCalls = fetch.mock.calls.filter(([, opts]) => opts?.method === 'DELETE');
      expect(deleteCalls).toHaveLength(1);
      expect(deleteCalls[0][0]).toContain('/api/cart/items/item-1');
    });
  });

  it('calls onCartItemsChange to update qty and fires PATCH', async () => {
    const onCartItemsChange = vi.fn();
    fetch.mockResolvedValue({ ok: true });

    render(
      <CartDrawer open={true} onClose={() => {}} user={{ id: 'u1' }} cartItems={items} onCartItemsChange={onCartItemsChange} />
    );

    fireEvent.click(screen.getByLabelText('Decrease'));

    expect(onCartItemsChange).toHaveBeenCalled();
    await waitFor(() => {
      const patchCalls = fetch.mock.calls.filter(([, opts]) => opts?.method === 'PATCH');
      expect(patchCalls).toHaveLength(1);
    });
  });

  it('calls DELETE when decrease qty on item with qty=1', async () => {
    const onCartItemsChange = vi.fn();
    fetch.mockResolvedValue({ ok: true });

    render(
      <CartDrawer open={true} onClose={() => {}} user={{ id: 'u1' }} cartItems={itemQty1} onCartItemsChange={onCartItemsChange} />
    );

    fireEvent.click(screen.getByLabelText('Decrease'));

    expect(onCartItemsChange).toHaveBeenCalled();
    await waitFor(() => {
      const deleteCalls = fetch.mock.calls.filter(([, opts]) => opts?.method === 'DELETE');
      expect(deleteCalls).toHaveLength(1);
    });
  });
});
