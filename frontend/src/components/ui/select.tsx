import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { cn } from 'cn';

const selectVariants = cva(
  'w-full min-w-0 appearance-none rounded-md border border-input bg-transparent text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 pr-9 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-900 dark:[&>option]:text-gray-100 cursor-pointer',
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 py-1 text-xs',
        md: 'h-10 px-3 py-2 text-sm',
        lg: 'h-11 px-3.5 py-2.5 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          data-slot="select"
          className={cn(selectVariants({ size }), className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground opacity-70" />
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select, selectVariants };
