import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductGrid from './ProductGrid';

const mockProducts = [
  {
    id: 1,
    name: 'Linen Drape Top',
    filter: 'tops',
    category: 'tops',
    categoryLabel: 'Tops',
    price: 4200,
    priceLabel: '₹4,200',
    imgUrl: null,
    hoverImgUrl: null,
    imgClass: 'img-top',
    hoverClass: 'img-top-hover',
  },
  {
    id: 2,
    name: 'Silk Trouser',
    filter: 'bottoms',
    category: 'bottoms',
    categoryLabel: 'Bottoms',
    price: 5500,
    priceLabel: '₹5,500',
    imgUrl: null,
    hoverImgUrl: null,
    imgClass: 'img-bottom',
    hoverClass: 'img-bottom-hover',
  },
];

describe('ProductGrid', () => {
  it('shows loading state while fetch is pending', () => {
    fetch.mockReturnValue(new Promise(() => {}));
    render(<ProductGrid onOpenProduct={() => {}} onQuickAdd={() => {}} />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders products after fetch resolves', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => mockProducts });
    render(<ProductGrid onOpenProduct={() => {}} onQuickAdd={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Linen Drape Top')).toBeInTheDocument();
    });
    expect(screen.getByText('Silk Trouser')).toBeInTheDocument();
  });

  it('renders all filter tabs', () => {
    fetch.mockReturnValue(new Promise(() => {}));
    render(<ProductGrid onOpenProduct={() => {}} onQuickAdd={() => {}} />);
    for (const f of ['all', 'tops', 'bottoms', 'outerwear', 'accessories']) {
      expect(screen.getByRole('tab', { name: f })).toBeInTheDocument();
    }
  });

  it('shows only matching products when a filter tab is clicked', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => mockProducts });
    render(<ProductGrid onOpenProduct={() => {}} onQuickAdd={() => {}} />);

    await waitFor(() => screen.getByText('Linen Drape Top'));
    fireEvent.click(screen.getByRole('tab', { name: 'tops' }));

    expect(screen.getByText('Linen Drape Top')).toBeInTheDocument();
    expect(screen.queryByText('Silk Trouser')).not.toBeInTheDocument();
  });

  it('calls onOpenProduct with the product when a card is clicked', async () => {
    const onOpenProduct = vi.fn();
    fetch.mockResolvedValue({ ok: true, json: async () => mockProducts });
    render(<ProductGrid onOpenProduct={onOpenProduct} onQuickAdd={() => {}} />);

    await waitFor(() => screen.getByText('Linen Drape Top'));
    fireEvent.click(screen.getByText('Linen Drape Top'));

    expect(onOpenProduct).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('calls onQuickAdd and NOT onOpenProduct when ADD TO BAG is clicked', async () => {
    const onOpenProduct = vi.fn();
    const onQuickAdd = vi.fn();
    fetch.mockResolvedValue({ ok: true, json: async () => mockProducts });
    render(<ProductGrid onOpenProduct={onOpenProduct} onQuickAdd={onQuickAdd} />);

    await waitFor(() => screen.getAllByLabelText(/Quick add/i));
    fireEvent.click(screen.getAllByLabelText(/Quick add/i)[0]);

    expect(onQuickAdd).toHaveBeenCalled();
    expect(onOpenProduct).not.toHaveBeenCalled();
  });
});
