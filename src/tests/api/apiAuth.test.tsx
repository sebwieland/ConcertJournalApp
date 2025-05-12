import React from 'react';
import { renderHook } from '@testing-library/react';
import useAuthApi from '../../api/apiAuth';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AllProviders } from '../utils/test-utils';
import { 
  mockLoginData, 
  mockRegistrationData 
} from '../utils/test-fixtures';

// Mock modules - these must be at the top level due to hoisting
vi.mock('../../api/apiClient', () => {
  return {
    default: () => ({
      apiClient: {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
      }
    })
  };
});

vi.mock('../../api/apiErrors', () => {
  return {
    handleApiError: vi.fn((error) => ({
      type: 'UNKNOWN_ERROR',
      message: 'Mocked error',
      originalError: error,
    }))
  };
});

describe('useAuthApi', () => {
  // Import the mocked modules directly
  const apiClientMock = vi.hoisted(() => ({
    default: () => ({
      apiClient: {
        post: vi.fn(),
      }
    })
  }));
  
  const apiErrorsMock = vi.hoisted(() => ({
    handleApiError: vi.fn()
  }));
  
  vi.mock('../../api/apiClient', () => apiClientMock);
  vi.mock('../../api/apiErrors', () => apiErrorsMock);

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up default behavior for handleApiError
    apiErrorsMock.handleApiError.mockImplementation((error) => ({
      type: 'UNKNOWN_ERROR',
      message: 'Mocked error',
      originalError: error,
    }));
  });

  it('throws an error if AuthContext is not provided', () => {
    // Create a wrapper without AuthContext
    const noAuthWrapper = ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    );

    // Use a try-catch block to properly handle the error
    let error: Error | null = null;
    try {
      renderHook(() => useAuthApi(), { wrapper: noAuthWrapper });
    } catch (e) {
      error = e as Error;
    }
    
    // Verify the error was thrown with the expected message
    expect(error).not.toBeNull();
    expect(error?.message).toBe('AuthContext is not provided');
  });

  describe('login', () => {
    it('calls apiClient.post with correct parameters', async () => {
      // Setup mock response
      apiClientMock.default().apiClient.post.mockResolvedValueOnce({
        status: 200,
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      });
      
      const { result } = renderHook(() => useAuthApi(), { 
        wrapper: AllProviders 
      });
      
      // Call login
      const response = await result.current.login(mockLoginData);
      
      // Check if apiClient.post was called with correct parameters
      expect(apiClientMock.default().apiClient.post).toHaveBeenCalledWith(
        '/login',
        'email=test%40example.com&password=password123',
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-XSRF-TOKEN': 'test-csrf-token',
          },
        }
      );
      
      // Check if the response is correct
      expect(response).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });
    
    it('handles login failure', async () => {
      // Setup mock response for failure
      apiClientMock.default().apiClient.post.mockResolvedValueOnce({
        status: 401,
        statusText: 'Unauthorized',
      });
      
      const { result } = renderHook(() => useAuthApi(), { 
        wrapper: AllProviders 
      });
      
      // Expect login to throw an error
      await expect(result.current.login(mockLoginData)).rejects.toMatchObject({
        type: 'UNKNOWN_ERROR',
        message: 'Mocked error'
      });
      
      // Check if handleApiError was called
      expect(apiErrorsMock.handleApiError).toHaveBeenCalled();
    });
    
    it('handles network errors', async () => {
      // Setup mock response for network error
      const networkError = new Error('Network Error');
      apiClientMock.default().apiClient.post.mockRejectedValueOnce(networkError);
      
      const { result } = renderHook(() => useAuthApi(), { 
        wrapper: AllProviders 
      });
      
      // Expect login to throw an error
      await expect(result.current.login(mockLoginData)).rejects.toMatchObject({
        type: 'UNKNOWN_ERROR',
        message: 'Mocked error',
      });
      
      // Check if handleApiError was called with the network error
      expect(apiErrorsMock.handleApiError).toHaveBeenCalledWith(networkError);
    });
  });
  
  describe('logout', () => {
    it('calls apiClient.post with correct parameters', async () => {
      // Mock successful response
      apiClientMock.default().apiClient.post.mockResolvedValueOnce({
        status: 200,
      });
      
      const { result } = renderHook(() => useAuthApi(), { 
        wrapper: AllProviders 
      });
      
      // Call logout
      await result.current.logout();
      
      // Check if apiClient.post was called with correct parameters
      expect(apiClientMock.default().apiClient.post).toHaveBeenCalledWith(
        '/logout',
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-XSRF-TOKEN': 'test-csrf-token',
          },
        }
      );
    });
    
    it('handles logout failure', async () => {
      // Mock failed response
      apiClientMock.default().apiClient.post.mockResolvedValueOnce({
        status: 500,
        statusText: 'Internal Server Error',
      });
      
      const { result } = renderHook(() => useAuthApi(), { 
        wrapper: AllProviders 
      });
      
      // Expect logout to throw an error
      await expect(result.current.logout()).rejects.toMatchObject({
        type: 'UNKNOWN_ERROR',
        message: 'Mocked error'
      });
      
      // Check if handleApiError was called
      expect(apiErrorsMock.handleApiError).toHaveBeenCalled();
    });
  });
  
  describe('register', () => {
    it('calls apiClient.post with correct parameters', async () => {
      // Setup mock response
      apiClientMock.default().apiClient.post.mockResolvedValueOnce({
        status: 200,
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      });
      
      const { result } = renderHook(() => useAuthApi(), { 
        wrapper: AllProviders 
      });
      
      // Call register
      const response = await result.current.register(mockRegistrationData);
      
      // Check if apiClient.post was called with correct parameters
      expect(apiClientMock.default().apiClient.post).toHaveBeenCalledWith(
        '/register',
        mockRegistrationData,
        {
          withCredentials: true,
        }
      );
      
      // Check if the response is correct
      expect(response).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });
    
    it('handles registration errors', async () => {
      // Setup failed registration mock
      const registrationError = new Error('Email already in use');
      apiClientMock.default().apiClient.post.mockRejectedValueOnce(registrationError);
      
      const { result } = renderHook(() => useAuthApi(), { 
        wrapper: AllProviders 
      });
      
      // Expect register to throw an error
      await expect(result.current.register(mockRegistrationData)).rejects.toMatchObject({
        type: 'UNKNOWN_ERROR',
        message: 'Mocked error'
      });
      
      // Check if handleApiError was called
      expect(apiErrorsMock.handleApiError).toHaveBeenCalledWith(registrationError);
    });
  });
});