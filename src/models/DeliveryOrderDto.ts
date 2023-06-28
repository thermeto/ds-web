// src/models/DeliveryOrderDto.ts
interface Dimensions {
    width: string | null;
    length: string | null;
    height: string | null;
}

export interface DeliveryOrderDto {
    origin: {
        lat: number,
        lng: number
    };
    destination: {
        lat: number,
        lng: number
    };
    distance: number | null;
    duration: number | null;
    dimensions: Dimensions | null;
    weight: string | null;
    packageFeatures: string | null;
    receiverName: string;
    receiverPhoneNumber: string;
    comments: string | null;
}
