import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import Loading from '../../../src/components/Loading'

describe('Loading Component', () => {
  it('should render loading spinner and text', () => {
    render(<Loading />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('should have spinner with aria-hidden', () => {
    render(<Loading />)

    const spinner = document.querySelector('.spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<Loading />)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})