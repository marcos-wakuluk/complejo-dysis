export interface Tanda {
  date: string;
  price: number;
}
export interface Event {
  _id?: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  numberOfPeople: number;
  peopleEntered: number;
  ticketsSold: number;
  status: string;
  tandas: Tanda[];
}
