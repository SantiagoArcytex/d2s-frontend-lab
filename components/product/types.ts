/**
 * Minimal deal shape for product page components.
 * Real data comes from tRPC deal.get; extend as needed.
 */
export interface DealProduct {
  id?: string;
  title?: string;
  description?: string;
  tagline?: string;
  price?: number;
  original_price?: number;
  deal_type?: string;
  category?: string;
  rating?: number;
  review_count?: number;
  developer_name?: string;
  version?: string;
  updated_at?: string;
  created_at?: string;
  image_url?: string;
  tags?: string[];
  kills_list?: string[];
  features?: string[];
  [key: string]: unknown;
}
