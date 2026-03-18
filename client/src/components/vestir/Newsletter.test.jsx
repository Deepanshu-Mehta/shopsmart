import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Newsletter from './Newsletter';

describe('Newsletter', () => {
  it('renders heading, input, and subscribe button', () => {
    render(<Newsletter />);
    expect(screen.getByText(/Stay in the loop/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument();
  });

  it('shows thank you message on 201 response', async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 201 });
    render(<Newsletter />);

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'user@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/Thank you\. You're in\./i)).toBeInTheDocument();
    });
  });

  it('shows thank you message on 409 response (already subscribed)', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 409 });
    render(<Newsletter />);

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'existing@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Subscribe/i }));

    await waitFor(() => {
      expect(screen.getByText(/Thank you\. You're in\./i)).toBeInTheDocument();
    });
  });

  it('does not call fetch when email is empty', () => {
    render(<Newsletter />);
    fireEvent.click(screen.getByRole('button', { name: /Subscribe/i }));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('calls fetch with correct method, headers, and body', async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 201 });
    render(<Newsletter />);

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'user@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Subscribe/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/newsletter'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'user@test.com' }),
        })
      );
    });
  });
});
