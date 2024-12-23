import axios, { AxiosError } from 'axios';
import { Bookmark, BookmarkFormData } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    console.log('API Health Check Response:', response.data);
    return response.data.status === 'OK';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('API Health Check Failed - Response:', axiosError.response.data);
        console.error('Status:', axiosError.response.status);
        console.error('Headers:', axiosError.response.headers);
      } else if (axiosError.request) {
        console.error('API Health Check Failed - No Response:', axiosError.request);
      } else {
        console.error('API Health Check Failed - Error:', axiosError.message);
      }
    } else {
      console.error('API Health Check Failed - Unexpected Error:', error);
    }
    return false;
  }
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export const fetchBookmarks = async (): Promise<Bookmark[]> => {
  const response = await api.get('/bookmarks');
  return response.data;
};

export const addBookmark = async (bookmark: BookmarkFormData): Promise<Bookmark> => {
  const response = await api.post('/bookmarks', bookmark);
  return response.data;
};

export const deleteBookmark = async (id: string): Promise<void> => {
  await api.delete(`/bookmarks/${id}`);
};

export const upgradeToPremiun = async (): Promise<void> => {
  await api.post('/auth/upgrade');
};

export const analyzeContent = async (url: string) => {
  try {
    const response = await api.post('/analyze', { url });
    return response.data;
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
};

export const syncBookmarks = async (bookmarks: Bookmark[]) => {
  try {
    const response = await api.post('/sync', { bookmarks });
    return response.data;
  } catch (error) {
    console.error('Error syncing bookmarks:', error);
    throw error;
  }
};