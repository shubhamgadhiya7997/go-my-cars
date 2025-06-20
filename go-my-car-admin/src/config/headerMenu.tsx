import {
  Users,
  Home,
  Car,
  CarFront,
  BookUser,
  Settings,
  BadgeInfo,
  Handshake,
  Bell,
  Component,
  ShoppingCart
} from 'lucide-react';

export const menuItems = [
  { name: 'dashboard', icon: Home, path: '/' },
  { name: 'users', icon: Users, path: '/users' },
  { name: 'car', icon: Car, path: '/car' },
  { name: 'banner', icon: CarFront, path: '/banner' },
  { name: 'bookings', icon: BookUser, path: '/booking' },
  { name: 'coupon', icon: Component, path: '/coupon' },
  { name: 'settings', icon: Settings, path: '/setting' },
  { name: 'support', icon: BadgeInfo, path: '/support' },
  { name: 'partner', icon: Handshake, path: '/partner' },
  { name: 'notifications', icon: Bell, path: '/notifications' },
  { name: 'favorite', icon: ShoppingCart, path: '/favorite' },
];
