import { motion } from 'framer-motion';
import { Package, Truck, Home, CheckCircle2, ClipboardList } from 'lucide-react';

interface OrderTrackerProps {
  status: number; // 0-4
}

const steps = [
  { icon: ClipboardList, label: 'Order Placed' },
  { icon: Package, label: 'Packed' },
  { icon: Truck, label: 'Shipped' },
  { icon: Truck, label: 'Out for Delivery' },
  { icon: Home, label: 'Delivered' }
];

export function OrderTracker({ status }: OrderTrackerProps) {
  return (
    <div className="w-full py-8">
      <div className="relative flex justify-between items-center w-full">
        {/* Connecting line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-muted w-full z-0" />
        
        {/* Progress line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: status / (steps.length - 1) }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= status;
          const isCurrent = index === status;
          
          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-card border-muted text-muted-foreground'
                } ${isCurrent ? 'ring-4 ring-primary/30 ring-offset-2' : ''}`}
              >
                {isCompleted && index < steps.length - 1 ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </motion.div>
              <div className={`mt-2 text-xs font-medium text-center absolute top-12 w-24 transition-colors ${
                isCompleted ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}