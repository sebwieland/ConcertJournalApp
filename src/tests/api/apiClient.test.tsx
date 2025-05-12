import React from 'react';
import { renderHook } from '@testing-library/react';
import axios from 'axios';
import useApiClient from '../../api/apiClient';
import { ConfigContext } from '../../contexts/ConfigContext';
import { ApiErrorType } from '../../types/api';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: vi.fn((successFn, errorFn) => {
            // Store the interceptors for testing
            mockedInterceptors.request = { successFn, errorFn };
          }),
        },
        response: {
          use: vi.fn((successFn, errorFn) => {
            // Store the interceptors for testing
            mockedInterceptors.response = { successFn, errorFn };
          }),
        },
      },
    })),
  },
}));

// Define types for interceptors
type InterceptorFunctions = {
  successFn: ((config: any) => any) | null;
  errorFn: ((error: any) => any) | null;
};

type MockedInterceptors = {
  request: InterceptorFunctions;
  response: InterceptorFunctions;
};

// Mock handleApiError
vi.mock('../../api/apiErrors', () => ({
  handleApiError: vi.fn((error) => ({
    type: ApiErrorType.UNKNOWN_ERROR,
    message: 'Mocked error',
    originalError: error,
  })),
}));

// Store mocked interceptors for testing
const mockedInterceptors: MockedInterceptors = {
  request: { successFn: null, errorFn: null },
  response: { successFn: null, errorFn: null },
};

describe('useApiClient', () => {
  const originalEnv = process.env.NODE_ENV;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Reset interceptors
    mockedInterceptors.request = { successFn: null, errorFn: null };
    mockedInterceptors.response = { successFn: null, errorFn: null };
  });
  
  afterAll(() => {
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });
  
  it('creates an axios instance with the correct configuration', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ConfigContext.Provider value={{ backendURL: 'https://api.example.com' }}>
        {children}
      </ConfigContext.Provider>
    );
    
    renderHook(() => useApiClient(), { wrapper });
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com',
      withCredentials: true,
      timeout: 10000,
    });
  });
  
  it('uses default URL when ConfigContext is not available', () => {
    renderHook(() => useApiClient());
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:8080',
      withCredentials: true,
      timeout: 10000,
    });
  });
  
  it('adds request and response interceptors', () => {
    renderHook(() => useApiClient());
    
    // Check if interceptors were added
    expect(mockedInterceptors.request.successFn).not.toBeNull();
    expect(mockedInterceptors.request.errorFn).not.toBeNull();
    expect(mockedInterceptors.response.successFn).not.toBeNull();
    expect(mockedInterceptors.response.errorFn).not.toBeNull();
  });
  
  it('logs requests in development mode', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development';
    
    renderHook(() => useApiClient());
    
    // Mock console.log
    const originalConsoleLog = console.log;
    console.log = vi.fn();
    
    // Create a mock request config
    const requestConfig = {
      method: 'get',
      url: '/test',
    };
    
    // Call the request interceptor
    const successFn = mockedInterceptors.request.successFn;
    if (!successFn) {
      fail('Request success interceptor should be defined');
      return;
    }
    const result = successFn(requestConfig);
    
    // Check if logging occurred
    expect(console.log).toHaveBeenCalledWith('API Request: GET /test');
    
    // Check if the config was returned unchanged
    expect(result).toEqual(requestConfig);
    
    // Restore console.log
    console.log = originalConsoleLog;
  });
  
  it('logs responses in development mode', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development';
    
    renderHook(() => useApiClient());
    
    // Mock console.log
    const originalConsoleLog = console.log;
    console.log = vi.fn();
    
    // Create a mock response
    const response = {
      status: 200,
      config: {
        url: '/test',
      },
    };
    
    // Call the response interceptor
    const successFn = mockedInterceptors.response.successFn;
    if (!successFn) {
      fail('Response success interceptor should be defined');
      return;
    }
    const result = successFn(response);
    
    // Check if logging occurred
    expect(console.log).toHaveBeenCalledWith('API Response: 200 /test');
    
    // Check if the response was returned unchanged
    expect(result).toEqual(response);
    
    // Restore console.log
    console.log = originalConsoleLog;
  });
  
  it('logs errors in development mode', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development';
    
    renderHook(() => useApiClient());
    
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Create a mock error
    const error = new Error('Test error');
    
    // Mock Promise.reject to prevent unhandled rejection
    const originalPromiseReject = Promise.reject;
    Promise.reject = vi.fn().mockImplementation(() => {
      const promise = originalPromiseReject();
      // Immediately attach a catch handler to prevent unhandled rejection
      promise.catch(() => {});
      return promise;
    });
    
    // Call the response error interceptor
    try {
      const errorFn = mockedInterceptors.response.errorFn;
      if (!errorFn) {
        fail('Response error interceptor should be defined');
        return;
      }
      errorFn(error);
    } catch (e) {
      // Expected to throw
    }
    
    // Restore Promise.reject
    Promise.reject = originalPromiseReject;
    
    // Check if error logging occurred
    expect(console.error).toHaveBeenCalledWith('API Error:', {
      type: ApiErrorType.UNKNOWN_ERROR,
      message: 'Mocked error',
      originalError: error,
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  it('does not log in production mode', () => {
    // Set environment to production
    process.env.NODE_ENV = 'production';
    
    renderHook(() => useApiClient());
    
    // Mock console functions
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    console.log = vi.fn();
    console.error = vi.fn();
    
    // Create mock request and response
    const requestConfig = { method: 'get', url: '/test' };
    const response = { status: 200, config: { url: '/test' } };
    
    // Call the interceptors
    const requestSuccessFn = mockedInterceptors.request.successFn;
    const responseSuccessFn = mockedInterceptors.response.successFn;
    
    if (requestSuccessFn) {
      requestSuccessFn(requestConfig);
    }
    
    if (responseSuccessFn) {
      responseSuccessFn(response);
    }
    
    // Check that no logging occurred
    expect(console.log).not.toHaveBeenCalled();
    
    // Restore console functions
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });
  
  it('handles request errors', async () => {
    renderHook(() => useApiClient());
    
    // Create a mock error
    const error = new Error('Request error');
    
    // Call the request error interceptor
    try {
      const errorFn = mockedInterceptors.request.errorFn;
      if (!errorFn) {
        fail('Request error interceptor should be defined');
        return;
      }
      await errorFn(error);
      fail('Should have thrown an error');
    } catch (e) {
      // Check if the error was processed
      expect(e).toEqual({
        type: ApiErrorType.UNKNOWN_ERROR,
        message: 'Mocked error',
        originalError: error,
      });
    }
  });
  
  it('handles response errors', async () => {
    renderHook(() => useApiClient());
    
    // Create a mock error
    const error = new Error('Response error');
    
    // Call the response error interceptor
    try {
      const errorFn = mockedInterceptors.response.errorFn;
      if (!errorFn) {
        fail('Response error interceptor should be defined');
        return;
      }
      await errorFn(error);
      fail('Should have thrown an error');
    } catch (e) {
      // Check if the error was processed
      expect(e).toEqual({
        type: ApiErrorType.UNKNOWN_ERROR,
        message: 'Mocked error',
        originalError: error,
      });
    }
  });
});