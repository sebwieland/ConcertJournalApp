import { render, screen } from '@testing-library/react';
import RatingStars from '../../../components/utilities/RatingStars';

describe('RatingStars Component', () => {
  it('renders 5 stars', () => {
    render(<RatingStars rating={3} />);
    
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  it('renders correct number of gold stars for rating 3', () => {
    render(<RatingStars rating={3} />);
    
    const stars = screen.getAllByText('★');
    
    // First 3 stars should be gold (rgb(255, 215, 0))
    expect(stars[0]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(stars[1]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(stars[2]).toHaveStyle('color: rgb(255, 215, 0)');
    
    // Last 2 stars should be gray (rgb(128, 128, 128))
    expect(stars[3]).toHaveStyle('color: rgb(128, 128, 128)');
    expect(stars[4]).toHaveStyle('color: rgb(128, 128, 128)');
  });

  it('renders all gold stars for rating 5', () => {
    render(<RatingStars rating={5} />);
    
    const stars = screen.getAllByText('★');
    
    // All 5 stars should be gold (rgb(255, 215, 0))
    stars.forEach(star => {
      expect(star).toHaveStyle('color: rgb(255, 215, 0)');
    });
  });

  it('renders all gray stars for rating 0', () => {
    render(<RatingStars rating={0} />);
    
    const stars = screen.getAllByText('★');
    
    // All 5 stars should be gray (rgb(128, 128, 128))
    stars.forEach(star => {
      expect(star).toHaveStyle('color: rgb(128, 128, 128)');
    });
  });

  it('handles decimal ratings correctly', () => {
    render(<RatingStars rating={3.7} />);
    
    const stars = screen.getAllByText('★');
    
    // First 3 stars should be gold (integer part) (rgb(255, 215, 0))
    expect(stars[0]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(stars[1]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(stars[2]).toHaveStyle('color: rgb(255, 215, 0)');
    
    // Last 2 stars should be gray (rgb(128, 128, 128))
    expect(stars[3]).toHaveStyle('color: rgb(128, 128, 128)');
    expect(stars[4]).toHaveStyle('color: rgb(128, 128, 128)');
  });
});