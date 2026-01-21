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
  ticketType?: string;
  ticketCount?: number;
  status?: string;
  qrCode?: string;
  checkedIn?: boolean;
  checkedInAt?: string;
  totalAmount: number;
  createdAt: string;
}