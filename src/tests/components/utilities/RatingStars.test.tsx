import React from 'react';
import { render, screen } from '@testing-library/react';
import RatingStars from '../../../components/utilities/RatingStars';

describe('RatingStars', () => {
  it('renders 5 stars', () => {
    render(<RatingStars rating={3} />);
    
    // Check if 5 stars are rendered
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  it('renders the correct number of gold stars based on rating', () => {
    render(<RatingStars rating={3} />);
    
    // Get all star elements
    const stars = screen.getAllByText('★');
    
    // Check that the first 3 stars are gold (using RGB value)
    for (let i = 0; i < 3; i++) {
      expect(stars[i]).toHaveStyle('color: rgb(255, 215, 0)');
    }
    
    // Check that the remaining stars are gray (using RGB value)
    for (let i = 3; i < 5; i++) {
      expect(stars[i]).toHaveStyle('color: rgb(128, 128, 128)');
    }
  });

  it('renders all gold stars when rating is 5', () => {
    render(<RatingStars rating={5} />);
    
    // Get all star elements
    const stars = screen.getAllByText('★');
    
    // Check that all stars are gold (using RGB value)
    stars.forEach(star => {
      expect(star).toHaveStyle('color: rgb(255, 215, 0)');
    });
  });

  it('renders all gray stars when rating is 0', () => {
    render(<RatingStars rating={0} />);
    
    // Get all star elements
    const stars = screen.getAllByText('★');
    
    // Check that all stars are gray (using RGB value)
    stars.forEach(star => {
      expect(star).toHaveStyle('color: rgb(128, 128, 128)');
    });
  });

  it('handles decimal ratings by rounding down', () => {
    render(<RatingStars rating={3.7} />);
    
    // Get all star elements
    const stars = screen.getAllByText('★');
    
    // Check that the first 3 stars are gold (rounding down) (using RGB value)
    for (let i = 0; i < 3; i++) {
      expect(stars[i]).toHaveStyle('color: rgb(255, 215, 0)');
    }
    
    // Check that the remaining stars are gray (using RGB value)
    for (let i = 3; i < 5; i++) {
      expect(stars[i]).toHaveStyle('color: rgb(128, 128, 128)');
    }
  });
});