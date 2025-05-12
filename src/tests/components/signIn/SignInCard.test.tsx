import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import SignInCard from '../../../components/signIn/SignInCard';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../../utils/test-utils';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('SignInCard', () => {
  const mockProps = {
    email: '',
    setEmail: vi.fn(),
    password: '',
    setPassword: vi.fn(),
    handleLogin: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sign-in form with all required elements', () => {
    renderWithProviders(<SignInCard {...mockProps} />);
    
    // Use more specific selector to avoid ambiguity
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    
    // Check if the email field is rendered
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    
    // Check if the password field is rendered
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    
    // Check if the sign-in button is rendered
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    
    // Check if the sign-up link is rendered
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('calls setEmail when email input changes', async () => {
    renderWithProviders(<SignInCard {...mockProps} />);
    
    const emailInput = screen.getByLabelText('Email');
    
    // Use fireEvent instead of userEvent for a single change event
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Check if setEmail was called with the complete string
    expect(mockProps.setEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('calls setPassword when password input changes', async () => {
    renderWithProviders(<SignInCard {...mockProps} />);
    
    const passwordInput = screen.getByLabelText('Password');
    
    // Use fireEvent instead of userEvent for a single change event
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Check if setPassword was called with the complete string
    expect(mockProps.setPassword).toHaveBeenCalledWith('password123');
  });

  it('calls handleLogin when form is submitted', async () => {
    renderWithProviders(<SignInCard {...mockProps} />);
    
    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    fireEvent.click(signInButton);
    
    expect(mockProps.handleLogin).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    renderWithProviders(<SignInCard {...{ ...mockProps, isLoading: true }} />);
    
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows error message for invalid email format', async () => {
    renderWithProviders(<SignInCard {...{ ...mockProps, email: 'invalid@email' }} />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.blur(emailInput);
    
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('shows error message for short password', async () => {
    renderWithProviders(<SignInCard {...{ ...mockProps, password: '12345' }} />);
    
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.blur(passwordInput);
    
    expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
  });

  it('submits the form when Enter key is pressed', async () => {
    renderWithProviders(<SignInCard {...mockProps} />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.keyDown(emailInput, { key: 'Enter' });
    
    expect(mockProps.handleLogin).toHaveBeenCalledTimes(1);
  });

  it('navigates to sign-up page when sign-up link is clicked', async () => {
    renderWithProviders(<SignInCard {...mockProps} />);
    
    const signUpLink = screen.getByText('Sign up');
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up');
  });
});