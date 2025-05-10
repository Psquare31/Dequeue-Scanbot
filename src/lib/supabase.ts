import { createClient } from '@supabase/supabase-js';
import type { Product } from '../types';

// In a real application, you would use environment variables for these values
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'your-supabase-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  try {
    // In a real application, you would query your actual PostgreSQL database
    // This is a mock implementation for demonstration purposes
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function mockGetProductByBarcode(barcode: string): Promise<Product | null> {
  // This is a mock function that returns fake data for demonstration
  // In a real app, you would use the getProductByBarcode function above
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock database with a few products
  const mockProducts: Record<string, Product> = {
    '9780201896831': {
      id: 1,
      name: 'The Art of Computer Programming',
      price: 79.99,
      barcode: '9780201896831',
      image_url: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Classic computer science textbook by Donald Knuth'
    },
    '5901234123457': {
      id: 2,
      name: 'Organic Bananas',
      price: 1.99,
      barcode: '5901234123457',
      image_url: 'https://images.pexels.com/photos/2116020/pexels-photo-2116020.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Fresh organic bananas, bunch of 5'
    },
    '4007817327098': {
      id: 3,
      name: 'Wireless Headphones',
      price: 149.99,
      barcode: '4007817327098',
      image_url: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Premium noise-canceling wireless headphones'
    },
    // Use any barcode that doesn't match above as a fallback for testing
    'default': {
      id: 4,
      name: 'Test Product',
      price: 9.99,
      barcode: 'default',
      image_url: 'https://images.pexels.com/photos/4039921/pexels-photo-4039921.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'This is a test product for demonstration'
    }
  };

  // Return matching product or default test product
  return mockProducts[barcode] || mockProducts['default'];
}