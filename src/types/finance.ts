import { LucideIcon } from 'lucide-react';

export type Currency = 'CDF' | 'USD' | 'EUR';
export type TransactionType = 'sale' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  payment_method?: string;
  quantity?: number;
  product_id?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  initial_quantity: number;
  unit_price: number;
  currency: Currency;
  image_url?: string;
  user_id: string;
  created_at: string;
}

export interface StockEntry {
  id: string;
  product_id: string;
  quantity: number;
  date: string;
  user_id: string;
  created_at: string;
}

export interface StockStatus {
  product_id: string;
  product_name: string;
  initial_stock: number;
  total_entries: number;
  total_sold: number;
  final_stock: number;
}

export interface DashboardStats {
  dailySales: number;
  dailyExpenses: number;
  dailyProfit: number;
  currentBalance: number;
  monthlySales: number;
  monthlyExpenses: number;
  weeklySales: number;
  totalSales: number;
  totalExpenses: number;
  currency: Currency;
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}