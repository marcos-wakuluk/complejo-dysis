export interface InventoryItem {
  _id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  price: number;
  status: string;
}
