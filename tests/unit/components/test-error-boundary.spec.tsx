import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import ErrorBoundary from '../../../src/components/ErrorBoundary'

// Component that throws an error
function ErrorComponent() {
  throw new Error('Test error')
}

describe('ErrorBoundary Component', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render error UI when an error occurs', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should allow retry when try again button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    // Click try again
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    })

    // Rerender with normal component
    act(() => {
      rerender(
        <ErrorBoundary>
          <div>Recovered content</div>
        </ErrorBoundary>
      )
    })

    expect(await waitFor(() => screen.getByText((content) => content.includes('Recovered content')))).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})