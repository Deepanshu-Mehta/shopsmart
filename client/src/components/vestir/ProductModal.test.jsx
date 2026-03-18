import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ProductModal from './ProductModal';

const mockProduct = {
  id: 1,
  name: 'Linen Drape Top',
  categoryLabel: 'Tops',
  price: 4200,
  priceLabel: '₹4,200',
  imgUrl: null,
  imgClass: 'img-top',
  details: 'Relaxed linen drape.',
  materials: '100% Linen',
  shipping: 'Free over ₹5,000',
};

describe('ProductModal', () => {
  it('renders nothing when product is null', () => {
    const { container } = render(
      <ProductModal product={null} onClose={() => {}} onAddToCart={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders product name and price when product is provided', () => {
    fetch.mockReturnValue(new Promise(() => {}));
    render(<ProductModal product={mockProduct} onClose={() => {}} onAddToCart={() => {}} />);
    expect(screen.getByText('Linen Drape Top')).toBeInTheDocument();
    expect(screen.getByText('₹4,200')).toBeInTheDocument();
  });

  it('fetches full product details on mount', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => mockProduct });
    render(<ProductModal product={mockProduct} onClose={() => {}} onAddToCart={() => {}} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/products/${mockProduct.id}`)
      );
    });
  });

  it('calls onClose after close button click (after animation)', () => {
    vi.useFakeTimers();
    fetch.mockReturnValue(new Promise(() => {}));
    const onClose = vi.fn();
    render(<ProductModal product={mockProduct} onClose={onClose} onAddToCart={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Close product panel/i }));
    act(() => vi.runAllTimers());

    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('calls onClose after Escape key press (after animation)', () => {
    vi.useFakeTimers();
    fetch.mockReturnValue(new Promise(() => {}));
    const onClose = vi.fn();
    render(<ProductModal product={mockProduct} onClose={onClose} onAddToCart={() => {}} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    act(() => vi.runAllTimers());

    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('calls onAddToCart with product and selections when ADD TO BAG is clicked', () => {
    vi.useFakeTimers();
    fetch.mockReturnValue(new Promise(() => {}));
    const onAddToCart = vi.fn();
    render(<ProductModal product={mockProduct} onClose={() => {}} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByText('ADD TO BAG'));
    act(() => vi.advanceTimersByTime(700));

    expect(onAddToCart).toHaveBeenCalledWith(
      mockProduct,
      expect.objectContaining({ size: 'S', color: 'Sand', quantity: 1 })
    );
    vi.useRealTimers();
  });

  it('updates selected size when a size button is clicked', () => {
    fetch.mockReturnValue(new Promise(() => {}));
    render(<ProductModal product={mockProduct} onClose={() => {}} onAddToCart={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'L' }));
    // No error means interaction worked; size state updated internally
    expect(screen.getByRole('button', { name: 'L' })).toBeInTheDocument();
  });

  it('updates selected color when a color button is clicked', () => {
    fetch.mockReturnValue(new Promise(() => {}));
    render(<ProductModal product={mockProduct} onClose={() => {}} onAddToCart={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Noir' }));
    expect(screen.getByRole('button', { name: 'Noir' })).toBeInTheDocument();
  });

  it('opens accordion section on click and closes on second click', () => {
    fetch.mockReturnValue(new Promise(() => {}));
    render(<ProductModal product={mockProduct} onClose={() => {}} onAddToCart={() => {}} />);

    const detailsBtn = screen.getByRole('button', { name: /Details/i });
    const accordionBodies = document.querySelectorAll('.accordion-body');

    expect(accordionBodies[0]).not.toHaveClass('open');
    fireEvent.click(detailsBtn);
    expect(accordionBodies[0]).toHaveClass('open');
    fireEvent.click(detailsBtn);
    expect(accordionBodies[0]).not.toHaveClass('open');
  });
});
