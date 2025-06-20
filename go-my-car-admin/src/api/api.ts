import { BASE_API_URL } from '@/utils/constants';
import { getToken } from '@/utils/sessionStorage';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Toast from '@/components/toast/commonToast';

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000, // Optional: Set request timeout
});

// Optional: Add request interceptor (e.g., for auth tokens)
api.interceptors.request.use(
  config => {
    // Example: Attach token if needed
    const token = getToken();
    console.log("token", token)
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Optional: Add response interceptor (e.g., for error handling)
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const request = async (
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response: AxiosResponse = await api.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {

    let errorMessage = error.message||'An unexpected error occurred';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage =
        (error.response.data as { message?: string })?.message || error.message;
    }

    if (typeof Toast === 'function') {
      Toast('destructive', errorMessage, '', 5000);
    }

    throw error;
  }
};

// Type for the Toast function (add this if you don't have it defined elsewhere)

export default api;
