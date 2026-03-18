import { render, screen, fireEvent } from '@testing-library/react';
import Nav from './Nav';

const defaultProps = {
  cartCount: 0,
  user: null,
  onLogout: () => {},
  onCartOpen: () => {},
};

describe('Nav', () => {
  it('renders VESTIR brand', () => {
    render(<Nav {...defaultProps} />);
    expect(screen.getByText('VESTIR')).toBeInTheDocument();
  });

  it('renders Sign in link when user is null', () => {
    render(<Nav {...defaultProps} user={null} />);
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  it('renders first name and · Out when user is set', () => {
    render(<Nav {...defaultProps} user={{ name: 'Jane Doe' }} />);
    expect(screen.getByText(/Jane · Out/i)).toBeInTheDocument();
  });

  it('calls onLogout when logout button is clicked', () => {
    const onLogout = vi.fn();
    render(<Nav {...defaultProps} user={{ name: 'Jane Doe' }} onLogout={onLogout} />);
    fireEvent.click(screen.getByRole('button', { name: /Log out/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('calls onCartOpen when shopping bag button is clicked', () => {
    const onCartOpen = vi.fn();
    render(<Nav {...defaultProps} onCartOpen={onCartOpen} />);
    fireEvent.click(screen.getByRole('button', { name: /Shopping bag/i }));
    expect(onCartOpen).toHaveBeenCalledTimes(1);
  });

  it('displays cartCount in the badge', () => {
    render(<Nav {...defaultProps} cartCount={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
