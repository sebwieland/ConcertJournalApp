import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EntryForm from '../../../components/entryForms/EntryForm';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BrowserRouter } from 'react-router-dom';

// Mock the MusicBrainz API
vi.mock('../../../api/musicBrainzApi', () => ({
  mbApi: {
    search: vi.fn().mockImplementation((type, options) => {
      if (type === 'artist') {
        return Promise.resolve({
          artists: [
            {
              name: 'Test Artist',
              type: 'Group',
              country: 'US',
              'life-span': { begin: '2000' },
              tags: [{ count: 10, name: 'rock' }]
            }
          ]
        });
      }
      return Promise.resolve({ artists: [] });
    })
  }
}));

// Mock the DefaultLayout component
vi.mock('../../../theme/DefaultLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="default-layout">{children}</div>
  )
}));

// Mock the apiErrors module
vi.mock('../../../api/apiErrors', () => ({
  handleApiError: vi.fn()
}));

describe('EntryForm Component', () => {
  // Common props for the EntryForm component
  const defaultProps = {
    onSubmit: vi.fn().mockResolvedValue(undefined),
    bandName: '',
    setBandName: vi.fn(),
    place: '',
    setPlace: vi.fn(),
    date: [2023, 5, 15],
    setDate: vi.fn(),
    rating: 0,
    setRating: vi.fn(),
    comment: '',
    setComment: vi.fn(),
    message: '',
    isSuccess: false,
    data: [],
    isUpdate: false,
    showArtistDetailsButton: true
  };

  // Helper function to render the component with the required providers
  const renderEntryForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <EntryForm {...defaultProps} {...props} />
        </LocalizationProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    renderEntryForm();
    
    // Check for form elements
    expect(screen.getByLabelText(/band/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/place/i)).toBeInTheDocument();
    
    // Date field is present - use getAllByText since there might be multiple elements
    expect(screen.getAllByText(/date/i).length).toBeGreaterThan(0);
    
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
    
    // Check for Rating component - MUI Rating uses radio inputs
    expect(screen.getByRole('radio', { name: /1 star/i })).toBeInTheDocument();
    
    // The submit button is "Create New Entry" in the form
    expect(screen.getByRole('button', { name: /create new entry/i })).toBeInTheDocument();
  });

  it('calls the onSubmit function when the form is submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderEntryForm({
      onSubmit,
      bandName: 'Test Band',
      place: 'Test Place',
      date: [2023, 5, 15],
      rating: 4,
      comment: 'Great show'
    });
    
    // Submit the form - the button is "Create New Entry"
    const submitButton = screen.getByRole('button', { name: /create new entry/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Check if onSubmit was called
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('displays success message when isSuccess is true', () => {
    renderEntryForm({ 
      isSuccess: true,
      message: 'Successfully saved!'
    });
    
    expect(screen.getByText('Successfully saved!')).toBeInTheDocument();
  });

  it('displays error message when isSuccess is false and message is provided', () => {
    renderEntryForm({ 
      isSuccess: false,
      message: 'Error saving data'
    });
    
    expect(screen.getByText('Error saving data')).toBeInTheDocument();
  });

  it('updates band name when input changes', () => {
    const setBandName = vi.fn();
    renderEntryForm({ setBandName });
    
    const bandNameInput = screen.getByLabelText(/band/i);
    fireEvent.change(bandNameInput, { target: { value: 'New Band Name' } });
    
    expect(setBandName).toHaveBeenCalledWith('New Band Name');
  });

  it('updates place when input changes', () => {
    const setPlace = vi.fn();
    renderEntryForm({ setPlace });
    
    const placeInput = screen.getByLabelText(/place/i);
    fireEvent.change(placeInput, { target: { value: 'New Place' } });
    
    expect(setPlace).toHaveBeenCalledWith('New Place');
  });

  it('updates comment when input changes', () => {
    const setComment = vi.fn();
    renderEntryForm({ setComment });
    
    const commentInput = screen.getByLabelText(/comment/i);
    fireEvent.change(commentInput, { target: { value: 'New Comment' } });
    
    expect(setComment).toHaveBeenCalledWith('New Comment');
  });

  it('updates rating when rating changes', () => {
    const setRating = vi.fn();
    renderEntryForm({ setRating });
    
    // Find the rating component and simulate a rating change
    const ratingElement = screen.getByLabelText('3 Stars');
    fireEvent.click(ratingElement);
    
    expect(setRating).toHaveBeenCalledWith(3);
  });

  it('shows artist details button when showArtistDetailsButton is true', () => {
    renderEntryForm({ 
      showArtistDetailsButton: true,
      bandName: 'Test Band'
    });
    
    expect(screen.getByRole('button', { name: /artist details/i })).toBeInTheDocument();
  });

  it('does not show artist details button when showArtistDetailsButton is false', () => {
    renderEntryForm({ 
      showArtistDetailsButton: false,
      bandName: 'Test Band'
    });
    
    expect(screen.queryByRole('button', { name: /artist details/i })).not.toBeInTheDocument();
  });

  it('shows artist details button when bandName is provided', () => {
    renderEntryForm({
      bandName: 'Test Artist',
      showArtistDetailsButton: true
    });
    
    // Verify the button is present
    expect(screen.getByRole('button', { name: /artist details/i })).toBeInTheDocument();
  });
});