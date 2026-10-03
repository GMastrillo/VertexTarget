import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-vt-accent-cyan)] text-[#050510] font-semibold hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-[0.98]',
        secondary:
          'bg-[var(--color-vt-surface)] text-[var(--color-vt-text)] border border-[var(--color-vt-border)] hover:bg-[var(--color-vt-bg-card)] active:scale-[0.98]',
        outline:
          'border border-[var(--color-vt-border)] bg-transparent text-[var(--color-vt-text)] hover:bg-[var(--color-vt-surface)] hover:text-white',
        ghost:
          'text-[var(--color-vt-text-muted)] hover:text-[var(--color-vt-text)] hover:bg-[var(--color-vt-surface)]',
        destructive:
          'bg-[var(--color-vt-error)] text-white hover:brightness-110 shadow-md shadow-red-500/20',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
