import {
  Users,
  LayoutDashboardIcon,
  SettingsIcon,
  PenToolIcon,
  Tag,
  Gift,
  Newspaper,
  ListChecks,
  HelpCircle,
  Lightbulb,
  Share2,
  CreditCard,
  Bell,
  MessageCircle,
  Settings,
  BadgeInfo,
  Handshake,
} from 'lucide-react';

export const sidebarMenus = {
  dashboard: [
    {
      key: 'dashboard-main',
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboardIcon,
      title: 'DashBoard',
    },
  ],
  users: [
    {
      key: 'users',
      name: 'Users',
      path: '/users',
      icon: Users,
      title: 'Users',
    },
  ],
  car: [
    {
      title: 'car',
      key: 'car',
      name: 'Manage Car',
      path: '/car',
      icon: Tag,
    },
    {
      key: 'car-create',
      name: 'Create Car',
      path: '/car/create',
      icon: Tag,
    },
    

  ],
  banner: [
    {
      title: 'banner',
      key: 'banner',
      name: 'Manage banner',
      path: '/banner',
      icon: Gift,
    },
    {
      key: 'banner-create',
      name: 'Create banner',
      path: '/banner/create',
      icon: Gift,
    },
  ],
  bookings: [
    {
      key: 'bookings',
      name: 'bookings',
      path: '/booking',
      icon: Newspaper,
      title: 'bookings',
    },
  ],
  settings: [
    {
      key: 'settings',
      name: 'settings',
      path: '/setting',
      icon: Settings,
      title: 'settings',
    },
  ],
   support: [
    {
      key: 'support',
      name: 'support',
      path: '/support',
      icon: BadgeInfo,
      title: 'support',
    },
  ],
   partner: [
    {
      key: 'partner',
      name: 'partner',
      path: '/partner',
      icon: Handshake,
      title: 'partner',
    },
  ],
    notifications: [
    {
      key: 'notifications-home',
      name: 'Manage Notifications',
      path: '/notifications',
      icon: Bell,
      title: 'Notifications',
    },
       {
      key: 'create-notifications',
      name: 'create Notifications',
      path: '/notifications/create',
      icon: Bell,

    },
  ],
};
