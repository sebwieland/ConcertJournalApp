import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingIndicator from '../../../components/utilities/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders the CircularProgress component', () => {
    render(<LoadingIndicator />);
    
    // Check if the component renders with the correct structure
    const loadingElement = document.querySelector('.MuiCircularProgress-root');
    expect(loadingElement).toBeInTheDocument();
  });

  it('is wrapped in a Box with flex display', () => {
    render(<LoadingIndicator />);
    
    // Check if the Box component has the correct styling
    const boxElement = document.querySelector('.MuiBox-root');
    expect(boxElement).toBeInTheDocument();
    
    // Check if the Box has display: flex
    expect(boxElement).toHaveStyle('display: flex');
  });
});