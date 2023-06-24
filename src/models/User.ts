export interface User {
    id?: number;
    firebaseId?: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdOn?: Date;
    lastLogin?: Date;
  }