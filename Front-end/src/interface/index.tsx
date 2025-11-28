export interface UserType {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface EventType {
  _id: string;
  name: string;
  description: string;
  organizer: string;
  guest: string[];
  address: string;
  city: string;
  pincode: string;
  date: string;
  time: string;
  media: string[];
  ticketTypes: {
    name: string;
    price: number;
    limit: number;
    available: number,
    booked: number
  }[];
}

export interface BookingType {
  _id: string;
  user: UserType;
  event: EventType;
  quantity: number;
  totalAmount: number;
  createdAt: string;
}