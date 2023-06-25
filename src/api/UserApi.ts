// src/api/UserApi.ts
import { DsUser } from '../models/DsUser';
import api from './ApiConfig'

export const getUser = async (token: string) : Promise<DsUser | null>=> {
    try {
        console.log('User to be fetched from the server');
        const response = await api.get('/user',
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Error getting user from the server', error);
        return null;
    }
};

export const storeUserOnServer = async (user: DsUser, token: string) => {
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