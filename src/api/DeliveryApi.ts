// src/api/DeliveryApi.ts
import api from './ApiConfig'
import { DeliveryOrderDto } from '../models/DeliveryOrderDto';


export const postDeliveryOrder = async (order: DeliveryOrderDto, token: string) => {
    try {
        console.log('Delivery order to be stored on the server: ' + JSON.stringify(order));
        const response = await api.post('/delivery/order', order,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error posting order on the server', error);
    }
};
