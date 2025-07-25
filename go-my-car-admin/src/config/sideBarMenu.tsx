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
  BadgePlus,
  Eye,
  ShoppingCart,
  LocateIcon,
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
      icon: Eye,
    },
    {
      key: 'car-create',
      name: 'Create Car',
      path: '/car/create',
      icon: BadgePlus,
    },


  ],
  banner: [
    {
      title: 'banner',
      key: 'banner',
      name: 'Manage banner',
      path: '/banner',
      icon: Eye,
    },
    {
      key: 'banner-create',
      name: 'Create banner',
      path: '/banner/create',
      icon: BadgePlus,
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
  coupon: [
    {
      title: 'coupon',
      key: 'coupon',
      name: 'Manage coupon',
      path: '/coupon',
      icon: Gift,
    },
    {
      key: 'coupon-create',
      name: 'Create coupon',
      path: '/coupon/create',
      icon: BadgePlus,
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
      icon: BadgePlus,

    },
  ],
  favorite: [
    {
      key: 'favorite',
      name: 'favorite',
      path: '/favorite',
      icon: ShoppingCart,
      title: 'favorite',
    },
  ],
  location: [
    {
      key: 'location',
      name: 'location',
      path: '/location',
      icon: LocateIcon,
      title: 'location',
    },
      {
      key: 'create-location',
      name: 'create Location',
      path: '/location/create',
      icon: BadgePlus,

    },
  ],
};
