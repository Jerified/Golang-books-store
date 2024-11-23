import axios from 'axios';

const baseUrl = 'http://localhost:5000';


export const getUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/user`, {
        withCredentials: true,
    });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error getting user bookmarks:', error);
      throw error;
    }
  };