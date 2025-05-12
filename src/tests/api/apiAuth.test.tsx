import React from 'react';
import { renderHook } from '@testing-library/react';
import useAuthApi from '../../api/apiAuth';
import { AuthContext } from '../../contexts/AuthContext';
import { ConfigContext } from '../../contexts/ConfigContext';
import { handleApiError } from '../../api/apiErrors';

// Mock apiClient
const mockApiClientPost = vi.fn();
const mockApiClient = {
  apiClient: {
    post: mockApiClientPost
  }
};

vi.mock('../../api/apiClient', () => ({
  default: () => mockApiClient
}));

// Mock handleApiError
vi.mock('../../api/apiErrors', () => ({
  handleApiError: vi.fn((error) => {
    return {
      type: 'UNKNOWN_ERROR',
      message: 'Mocked error',
      originalError: error,
    };
  }),
}));

describe('useAuthApi', () => {
  const mockAuthContext = {
    token: 'test-token',
    isLoading: false,
    isLoggedIn: true,
    setIsLoggedIn: vi.fn(),
    setAccessToken: vi.fn(),
    csrfToken: 'test-csrf-token',
    fetchCsrfToken: vi.fn(),
    setLoggedOut: vi.fn(),
    refreshTokenApiCall: vi.fn(),
  };

  const mockConfigContext = {
    backendURL: 'http://localhost:8080',
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConfigContext.Provider value={mockConfigContext}>
      <AuthContext.Provider value={mockAuthContext}>
        {children}
      </AuthContext.Provider>
    </ConfigContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws an error if AuthContext is not provided', () => {
    // Create a wrapper without AuthContext
    const noAuthWrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigContext.Provider value={mockConfigContext}>
        {children}
      </ConfigContext.Provider>
    );

    // Use a try-catch block to properly handle the error
    // This prevents the error from being treated as an unhandled exception
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
      const { result } = renderHook(() => useAuthApi(), { wrapper });
      
      // Mock successful response
      const mockResponse = {
        status: 200,
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };
      
      // Use the mock directly instead of requiring the module
      mockApiClientPost.mockResolvedValueOnce(mockResponse);
      
      // Call login
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const response = await result.current.login(loginData);
      
      // Check if apiClient.post was called with correct parameters
      expect(mockApiClientPost).toHaveBeenCalledWith(
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
      const { result } = renderHook(() => useAuthApi(), { wrapper });
      
      // Mock failed response
      const mockResponse = {
        status: 401,
        statusText: 'Unauthorized',
      };
      
      // Use the mock directly instead of requiring the module
      mockApiClientPost.mockResolvedValueOnce(mockResponse);
      
      // Call login
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password',
      };
      
      // Expect login to throw an error - use toMatchObject instead of toEqual for more flexible matching
      await expect(result.current.login(loginData)).rejects.toMatchObject({
        type: 'UNKNOWN_ERROR',
        message: 'Mocked error'
      });
      
      // Check if handleApiError was called
      expect(handleApiError).toHaveBeenCalled();
    });
    
    it('handles network errors', async () => {
      const { result } = renderHook(() => useAuthApi(), { wrapper });
      
      // Mock network error
      const networkError = new Error('Network Error');
      
      // Use the mock directly instead of requiring the module
      mockApiClientPost.mockRejectedValueOnce(networkError);
      
      // Call login
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      // Expect login to throw an error
      await expect(result.current.login(loginData)).rejects.toEqual({
        type: 'UNKNOWN_ERROR',
        message: 'Mocked error',
        originalError: networkError,
      });
      
      // Check if handleApiError was called with the network error
      expect(handleApiError).toHaveBeenCalled();
    });
  });
  
  describe('logout', () => {
    it('calls apiClient.post with correct parameters', async () => {
      const { result } = renderHook(() => useAuthApi(), { wrapper });
      
      // Mock successful response
      const mockResponse = {
        status: 200,
      };
      
      // Use the mock directly instead of requiring the module
      mockApiClientPost.mockResolvedValueOnce(mockResponse);
      
      // Call logout
      await result.current.logout();
      
      // Check if apiClient.post was called with correct parameters
      expect(mockApiClientPost).toHaveBeenCalledWith(
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
      const { result } = renderHook(() => useAuthApi(), { wrapper });
      
      // Mock failed response
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };
      
      // Use the mock directly instead of requiring the module
      mockApiClientPost.mockResolvedValueOnce(mockResponse);
      
      // Expect logout to throw an error - use toMatchObject instead of toEqual
      await expect(result.current.logout()).rejects.toMatchObject({
        type: 'UNKNOWN_ERROR',
        message: 'Mocked error'
      });
      
      // Check if handleApiError was called
      expect(handleApiError).toHaveBeenCalled();
    });
  });
  
  describe('register', () => {
    it('calls apiClient.post with correct parameters', async () => {
      const { result } = renderHook(() => useAuthApi(), { wrapper });
      
      // Mock successful response
      const mockResponse = {
        status: 200,
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };
      
      // Use the mock directly instead of requiring the module
      mockApiClientPost.mockResolvedValueOnce(mockResponse);
      
      // Call register
      const registerData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const response = await result.current.register(registerData);
      
      // Check if apiClient.post was called with correct parameters
      expect(mockApiClientPost).toHaveBeenCalledWith(
        '/register',
        registerData,
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
      const { result } = renderHook(() => useAuthApi(), { wrapper });
      
      // Mock network error
      const registrationError = new Error('Email already in use');
      
      // Use the mock directly instead of requiring the module
      mockApiClientPost.mockRejectedValueOnce(registrationError);
      
      // Call register
      const registerData = {
        username: 'testuser',
        password: 'password123',
        email: 'existing@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      
      // Expect register to throw an error - use toMatchObject instead of toEqual
      await expect(result.current.register(registerData)).rejects.toMatchObject({
        type: 'UNKNOWN_ERROR',
        message: 'Mocked error'
      });
      
      // Check if handleApiError was called
      expect(handleApiError).toHaveBeenCalledWith(registrationError);
    });
  });
});