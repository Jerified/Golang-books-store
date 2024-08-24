import axios from 'axios';

const baseUrl = 'http://localhost:5000';

export const addBookToBookmark = async (userId: string, bookId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/api/user/${userId}/bookmarks/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding book to bookmark:', error);
    throw error;
  }
};

export const getUserBookmarks = async (userId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/api/user/${userId}/bookmarks`);
    return response.data;
  } catch (error) {
    console.error('Error getting user bookmarks:', error);
    throw error;
  }
};

export const removeBookFromBookmark = async (userId: string, bookId: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/user/${userId}/bookmarks/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing book from bookmark:', error);
    throw error;
  }
};