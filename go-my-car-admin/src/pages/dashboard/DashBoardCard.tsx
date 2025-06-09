'use client';

import { cva } from 'class-variance-authority';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart2,
  BookUser,
  Bookmark,
  Car,
  CheckCircle,
  CreditCard,
  Star,
  Target,
  TrendingUp,
  User,
  UserCheck,
  UserX,
  Users,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type IconName =
  | 'activity'
  | 'alert-triangle'
  | 'award'
  | 'bar-chart-2'
  | 'bookmark'
  | 'check-circle'
  | 'BookUser'
  | 'cars'
  | 'star'
  | 'target'
  | 'trending-up'
  | 'user'
  | 'user-check'
  | 'user-x'
  | 'users'
  | 'x-circle'
  | 'zap';

type ColorVariant = 'primary' | 'success' | 'warning' | 'destructive' | 'info';

const iconMap: Record<IconName, LucideIcon> = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  award: Award,
  'bar-chart-2': BarChart2,
  bookmark: Bookmark,
  'check-circle': CheckCircle,
  'BookUser': BookUser,
  'cars': Car,
  star: Star,
  target: Target,
  'trending-up': TrendingUp,
  user: User,
  'user-check': UserCheck,
  'user-x': UserX,
  users: Users,
  'x-circle': XCircle,
  zap: Zap,
};

const cardVariants = cva(
  'relative overflow-hidden transition-all duration-300 hover:shadow-lg group',
  {
    variants: {
      color: {
        primary: [
          'hover:bg-primary hover:text-primary-foreground',
          'before:absolute before:inset-0 before:bg-primary/5 before:rounded-xl',
        ],
        success: [
          'hover:bg-green-600 hover:text-white',
          'before:absolute before:inset-0 before:bg-green-500/5 before:rounded-xl',
        ],
        warning: [
          'hover:bg-amber-600 hover:text-white',
          'before:absolute before:inset-0 before:bg-amber-500/5 before:rounded-xl',
        ],
        destructive: [
          'hover:bg-destructive hover:text-destructive-foreground',
          'before:absolute before:inset-0 before:bg-destructive/5 before:rounded-xl',
        ],
        info: [
          'hover:bg-blue-600 hover:text-white',
          'before:absolute before:inset-0 before:bg-blue-500/5 before:rounded-xl',
        ],
      },
    },
    defaultVariants: {
      color: 'primary',
    },
  }
);

const iconVariants = cva(
  'absolute right-4 top-4 transition-all duration-300 opacity-20 group-hover:opacity-30',
  {
    variants: {
      color: {
        primary: 'text-primary',
        success: 'text-green-500',
        warning: 'text-amber-500',
        destructive: 'text-destructive',
        info: 'text-blue-500',
      },
    },
    defaultVariants: {
      color: 'primary',
    },
  }
);

interface DashBoardCardProps {
  heading: string;
  number: number;
  description?: string;
  trend?: number | string;
  icon?: IconName;
  color?: ColorVariant;
}

function DashBoardCard({
  heading,
  number,
  description,
  trend,
  icon,
  color = 'primary',
}: Readonly<DashBoardCardProps>) {
  const Icon = icon ? iconMap[icon] : null;

  return (
    <Card className={cn(cardVariants({ color }), 'flex justify-between flex-col')}>
      <CardHeader className='pb-2 relative z-10'>
        <CardDescription className='text-sm font-medium group-hover:text-current'>
          {heading}
        </CardDescription>
        {Icon && (
          <div className={iconVariants({ color })}>
            <Icon size={48} />
          </div>
        )}
      </CardHeader>
      <CardContent className='relative z-10'>
        <div className='text-4xl font-bold'>{number.toLocaleString()}</div>

        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium mt-2',
              trend > '0' ? 'text-green-500' : 'text-red-500',
              'group-hover:text-current'
            )}
          >
            {trend > '0' ? (
              <>
                <TrendingUp size={14} />
                <span>+{trend}% from last period</span>
              </>
            ) : (
              <>
                <TrendingUp size={14} className='rotate-180' />
                <span>{trend}% from last period</span>
              </>
            )}
          </div>
        )}

        {description && (
          <p className='text-muted-foreground text-sm mt-1 group-hover:text-current'>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default DashBoardCard;
