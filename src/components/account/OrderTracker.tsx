'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, Truck, Package, PackageCheck } from 'lucide-react';

type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

const statuses: OrderStatus[] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const statusDetails = {
  Processing: { icon: Package, text: 'Order Placed' },
  Shipped: { icon: Truck, text: 'Shipped' },
  'Out for Delivery': { icon: Truck, text: 'Out for Delivery' },
  Delivered: { icon: PackageCheck, text: 'Delivered' },
};

type OrderTrackerProps = {
  currentStatus: OrderStatus;
};

export default function OrderTracker({ currentStatus }: OrderTrackerProps) {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {statuses.map((status, index) => {
          const Icon = statusDetails[status].icon;
          const isActive = index <= currentIndex;
          return (
            <div key={status} className="flex flex-1 flex-col items-center text-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2',
                  isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className={cn('mt-2 text-xs font-medium', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                {statusDetails[status].text}
              </p>
            </div>
          );
        })}
      </div>
      <div className="relative mx-auto mt-[-2.2rem] h-1 w-[calc(100%-80px)] bg-muted">
        <div
          className="absolute h-1 bg-primary transition-all duration-500"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
