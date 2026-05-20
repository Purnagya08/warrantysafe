export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Product {
  _id: string;
  userId: string;
  name: string;
  brand: string;
  category: string;
  purchaseDate: string;
  price: number;
  warrantyDuration: number;
  warrantyExpiry: string;
  warrantyStatus: 'active' | 'expiring_soon' | 'expired';
  createdAt: string;
}

export interface Document {
  _id: string;
  productId: string;
  fileUrl: string;
  fileType: 'invoice' | 'warranty' | 'manual';
}

export interface DashboardStats {
  totalProducts: number;
  activeWarranties: number;
  expiringSoon: number;
  expired: number;
  recentProducts: Product[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
