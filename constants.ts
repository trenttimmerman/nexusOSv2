import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nexus Core Tee // Black',
    price: 4500,
    image: 'https://picsum.photos/800/1000?random=1',
    stock: 120,
    category: 'Apparel'
  },
  {
    id: '2',
    name: 'Cyber Shell Jacket',
    price: 18500,
    image: 'https://picsum.photos/800/1000?random=2',
    stock: 4,
    category: 'Outerwear'
  },
  {
    id: '3',
    name: 'Data Runner Sneakers',
    price: 12000,
    image: 'https://picsum.photos/800/1000?random=3',
    stock: 35,
    category: 'Footwear'
  },
  {
    id: '4',
    name: 'Neural Link Cap',
    price: 3500,
    image: 'https://picsum.photos/800/1000?random=4',
    stock: 200,
    category: 'Accessories'
  }
];

export const NAV_LINKS = [
  { label: 'New Arrivals', href: '#' },
  { label: 'Apparel', href: '#' },
  { label: 'Accessories', href: '#', active: true },
  { label: 'Editorial', href: '#' },
];