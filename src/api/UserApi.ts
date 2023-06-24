import { User } from '../models/User';
import api from './ApiConfig'

export const getUser = async (id: string) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const storeUserOnServer = async (user: User, token: string) => {
    try {
        console.log('User to be stored in the server');
        const response = await api.post('/user', user,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error storing user on the server', error);
    }
};