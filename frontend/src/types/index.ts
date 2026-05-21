export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  brand?: string;
  category?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  retailerName?: string;
  serialNumber?: string;
  modelNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  warranty?: Warranty;
  documents?: Document[];
  repairs?: Repair[];
}

export interface Warranty {
  id: string;
  productId: string;
  startDate?: string;
  endDate?: string;
  warrantyType: 'MANUFACTURER' | 'EXTENDED' | 'STORE';
  providerName?: string;
  coverageDetails?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  productId: string;
  userId: string;
  type: 'RECEIPT' | 'INVOICE' | 'MANUAL' | 'WARRANTY_CARD' | 'OTHER';
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  extractedData?: Record<string, unknown>;
  uploadedAt: string;
}

export interface Repair {
  id: string;
  productId: string;
  issue: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  repairCenter?: string;
  cost?: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'WARRANTY_EXPIRY' | 'REPAIR_UPDATE' | 'DOCUMENT_PROCESSED' | 'GENERAL';
  title: string;
  body: string;
  isRead: boolean;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeWarranties: number;
  expiringSoon: number;
  expired: number;
  recentProducts: Product[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}