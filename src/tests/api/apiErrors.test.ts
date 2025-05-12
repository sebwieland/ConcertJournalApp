import axios from 'axios';
import { handleApiError } from '../../api/apiErrors';
import { ApiErrorType } from '../../types/api';

describe('handleApiError', () => {
  it('handles network errors', () => {
    const axiosError = {
      isAxiosError: true,
      response: undefined,
      message: 'Network Error',
    };
    
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockImplementation(() => true);
    
    const result = handleApiError(axiosError);
    
    expect(result).toEqual({
      type: ApiErrorType.NETWORK_ERROR,
      message: 'Network error. Please check your connection.',
      originalError: axiosError,
    });
  });

  it('handles unauthorized errors (401)', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: {},
      },
      message: 'Request failed with status code 401',
    };
    
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockImplementation(() => true);
    
    const result = handleApiError(axiosError);
    
    expect(result).toEqual({
      type: ApiErrorType.UNAUTHORIZED,
      message: 'Unauthorized. Please log in again.',
      statusCode: 401,
      originalError: axiosError,
    });
  });

  it('handles forbidden errors (403)', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 403,
        data: {},
      },
      message: 'Request failed with status code 403',
    };
    
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockImplementation(() => true);
    
    const result = handleApiError(axiosError);
    
    expect(result).toEqual({
      type: ApiErrorType.FORBIDDEN,
      message: 'You do not have permission to perform this action.',
      statusCode: 403,
      originalError: axiosError,
    });
  });

  it('handles not found errors (404)', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 404,
        data: {},
      },
      message: 'Request failed with status code 404',
    };
    
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockImplementation(() => true);
    
    const result = handleApiError(axiosError);
    
    expect(result).toEqual({
      type: ApiErrorType.NOT_FOUND,
      message: 'The requested resource was not found.',
      statusCode: 404,
      originalError: axiosError,
    });
  });

  it('handles validation errors (422)', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          errors: {
            email: 'Invalid email format',
            password: 'Password too short',
          },
        },
      },
      message: 'Request failed with status code 422',
    };
    
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockImplementation(() => true);
    
    const result = handleApiError(axiosError);
    
    expect(result).toEqual({
      type: ApiErrorType.VALIDATION_ERROR,
      message: 'Validation error. Please check your input.',
      statusCode: 422,
      details: {
        email: 'Invalid email format',
        password: 'Password too short',
      },
      originalError: axiosError,
    });
  });

  it('handles server errors (500, 502, 503, 504)', () => {
    const serverErrorCodes = [500, 502, 503, 504];
    
    serverErrorCodes.forEach(statusCode => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: statusCode,
          data: {},
        },
        message: `Request failed with status code ${statusCode}`,
      };
      
      // Mock axios.isAxiosError
      vi.spyOn(axios, 'isAxiosError').mockImplementation(() => true);
      
      const result = handleApiError(axiosError);
      
      expect(result).toEqual({
        type: ApiErrorType.SERVER_ERROR,
        message: 'Server error. Please try again later.',
        statusCode,
        originalError: axiosError,
      });
    });
  });

  it('handles unknown status codes', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 418, // I'm a teapot
        data: {
          message: 'I refuse to brew coffee',
        },
      },
      message: 'Request failed with status code 418',
    };
    
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockImplementation(() => true);
    
    const result = handleApiError(axiosError);
    
    expect(result).toEqual({
      type: ApiErrorType.UNKNOWN_ERROR,
      message: 'Error: I refuse to brew coffee',
      statusCode: 418,
      originalError: axiosError,
    });
  });

  it('handles non-axios errors', () => {
    const error = new Error('Some random error');
    
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockImplementation(() => false);
    
    const result = handleApiError(error);
    
    expect(result).toEqual({
      type: ApiErrorType.UNKNOWN_ERROR,
      message: 'Some random error',
      originalError: error,
    });
  });

  it('handles unknown errors that are not Error instances', () => {
    const error = 'Just a string error';
    
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockImplementation(() => false);
    
    const result = handleApiError(error);
    
    expect(result).toEqual({
      type: ApiErrorType.UNKNOWN_ERROR,
      message: 'Unknown error occurred',
      originalError: error,
    });
  });
});