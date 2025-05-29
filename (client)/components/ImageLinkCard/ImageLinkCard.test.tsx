import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ImageLinkCard from './ImageLinkCard'

describe('ImageLinkCard', () => {
  const defaultProps = {
    href: 'https://example.com',
    imageUrl: 'https://via.placeholder.com/300x200',
    title: 'Test Card',
  }

  it('renders with required props', () => {
    render(<ImageLinkCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    const image = screen.getByRole('img')
    const title = screen.getByText('Test Card')
    
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x200')
    expect(title).toBeInTheDocument()
  })

  it('renders with subtitle when provided', () => {
    render(<ImageLinkCard {...defaultProps} subtitle="Test subtitle" />)
    
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test subtitle')).toBeInTheDocument()
  })

  it('uses custom image alt text when provided', () => {
    render(<ImageLinkCard {...defaultProps} imageAlt="Custom alt text" />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Custom alt text')
  })

  it('falls back to title for image alt when imageAlt not provided', () => {
    render(<ImageLinkCard {...defaultProps} />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Test Card')
  })

  it('applies custom className', () => {
    render(<ImageLinkCard {...defaultProps} className="custom-class" />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('sets target="_blank" and rel attributes for external links', () => {
    render(<ImageLinkCard {...defaultProps} target="_blank" />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('sets target="_self" without rel for internal links', () => {
    render(<ImageLinkCard {...defaultProps} target="_self" />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_self')
    expect(link).not.toHaveAttribute('rel')
  })

  it('defaults to target="_self"', () => {
    render(<ImageLinkCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_self')
  })

  it('applies custom width and height', () => {
    render(<ImageLinkCard {...defaultProps} width={400} height={300} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveStyle({ width: '400px', height: '300px' })
  })

  it('applies default width and height when not specified', () => {
    render(<ImageLinkCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveStyle({ width: '300px', height: '200px' })
  })

  it('has proper accessibility attributes', () => {
    render(<ImageLinkCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    const image = screen.getByRole('img')
    
    expect(link).toBeInTheDocument()
    expect(image).toHaveAttribute('alt')
  })

  it('includes hover and transition classes', () => {
    render(<ImageLinkCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('hover:scale-105', 'transition-transform', 'duration-200')
  })
})