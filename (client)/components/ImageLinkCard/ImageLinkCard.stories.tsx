import type { Meta, StoryObj } from '@storybook/react'
import ImageLinkCard from './ImageLinkCard'

const meta: Meta<typeof ImageLinkCard> = {
  title: 'Components/ImageLinkCard',
  component: ImageLinkCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'URL to navigate to when clicked',
    },
    imageUrl: {
      control: 'text',
      description: 'URL of the background image',
    },
    title: {
      control: 'text',
      description: 'Main title text displayed in bottom right',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle text',
    },
    imageAlt: {
      control: 'text',
      description: 'Alt text for the image (defaults to title)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    target: {
      control: { type: 'select' },
      options: ['_self', '_blank'],
      description: 'Link target behavior',
    },
    width: {
      control: { type: 'number', min: 100, max: 800 },
      description: 'Card width in pixels',
    },
    height: {
      control: { type: 'number', min: 100, max: 600 },
      description: 'Card height in pixels',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    title: 'Beautiful Landscape',
    subtitle: 'Discover amazing places',
  },
}

export const WithoutSubtitle: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    title: 'Nature Photography',
  },
}

export const ExternalLink: Story = {
  args: {
    href: 'https://unsplash.com',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
    title: 'Visit Unsplash',
    subtitle: 'Free high-resolution photos',
    target: '_blank',
  },
}

export const CustomSize: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
    title: 'Wide Card',
    subtitle: 'Custom dimensions',
    width: 400,
    height: 250,
  },
}

export const SmallCard: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200&h=200&fit=crop',
    title: 'Small',
    width: 200,
    height: 150,
  },
}

export const LongTitle: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    title: 'This is a very long title that might wrap to multiple lines',
    subtitle: 'Testing text overflow behavior',
  },
}

export const LoadingState: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
    title: 'Loading...',
    subtitle: 'Please wait',
  },
  parameters: {
    docs: {
      description: {
        story: 'Placeholder state while image is loading',
      },
    },
  },
}

export const ErrorState: Story = {
  args: {
    href: 'https://example.com',
    imageUrl: 'invalid-url',
    title: 'Image Failed to Load',
    subtitle: 'Error handling example',
  },
  parameters: {
    docs: {
      description: {
        story: 'How the component handles broken image URLs',
      },
    },
  },
}