import { render, screen } from '@testing-library/react';
import FeedCard from './FeedCard';
import { FeedData } from '@/types';
import { describe, it, expect } from 'vitest';

// Framer Motion mock to avoid animation issues in test environment
// MotionCreate is usually hard to mock perfectly in JSDOM, 
// but often standard render is enough if we don't test animation details.
// If needed, we can mock 'framer-motion' entirely.

describe('FeedCard', () => {
    const mockFeed: FeedData = {
        slug: 'test-post',
        title: 'Test Title',
        description: 'Test Description',
        date: '2026-01-25',
        category: 'Dev',
        readingTime: 5,
    };

    it('should render feed information correctly', () => {
        render(<FeedCard feed={mockFeed} />);

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('2026-01-25')).toBeInTheDocument();
        expect(screen.getByText('5 min read')).toBeInTheDocument();
        expect(screen.getByText('Dev')).toBeInTheDocument();
    });

    it('should link to the correct slug', () => {
        render(<FeedCard feed={mockFeed} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/feed/test-post');
    });
});
