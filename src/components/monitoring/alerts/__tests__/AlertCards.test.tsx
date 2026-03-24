import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AlertCards from '../AlertCards';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

// Mock window.addToast used in BaseAlertsView
Object.defineProperty(window, 'addToast', {
  value: vi.fn(),
  writable: true
});

describe('AlertCards', () => {
  const mockConnections = [
    { id: '1', name: 'AWS Connection' },
    { id: '2', name: 'Azure Connection' }
  ];

  it('renders all alerts when no connection is selected', () => {
    render(<AlertCards selectedConnection="all" connections={mockConnections as any} />);

    expect(screen.getByText('High Latency Detected')).toBeInTheDocument();
    expect(screen.getByText('Bandwidth Usage')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Scheduled')).toBeInTheDocument();
  });

  it('filters alerts by selected connection', () => {
    render(<AlertCards selectedConnection="1" connections={mockConnections as any} />);

    expect(screen.getByText('High Latency Detected')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Scheduled')).toBeInTheDocument();
    expect(screen.queryByText('Bandwidth Usage')).not.toBeInTheDocument();
  });

  it('shows empty state when no alerts match filter', () => {
    render(<AlertCards selectedConnection="3" connections={mockConnections as any} />);

    expect(screen.getByText('No active alerts for the selected connection')).toBeInTheDocument();
  });

  it('displays correct number of alert cards', () => {
    const { container } = render(<AlertCards selectedConnection="all" connections={mockConnections as any} />);

    // Count the alert cards (each alert renders as a rounded-lg div)
    const alertCards = container.querySelectorAll('.rounded-lg');
    expect(alertCards.length).toBeGreaterThanOrEqual(3);
  });

  it('removes an alert when dismissed', async () => {
    vi.useFakeTimers();

    render(<AlertCards selectedConnection="all" connections={mockConnections as any} />);

    // Find all dismiss buttons
    const dismissButtons = screen.getAllByLabelText('Dismiss alert');
    expect(dismissButtons.length).toBe(3);

    // Click the first dismiss button
    fireEvent.click(dismissButtons[0]);

    // onDismiss is called after a 300ms setTimeout in AlertCard
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Check that the alert is removed
    expect(screen.queryByText('High Latency Detected')).not.toBeInTheDocument();
    expect(screen.getByText('Bandwidth Usage')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Scheduled')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
