import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `ring-offset-backgroundD inline-flex items-center justify-center whitespace-nowrap   rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`,
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "active-nav": "border-b-2 border-primary text-primary",
        expandIcon:
          "group relative bg-primary text-primary-foreground hover:bg-primary/90",
        ringHover:
          "bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] text-primary-foreground ",
        gooeyRight:
          "relative z-0 overflow-hidden bg-primary from-zinc-400 text-primary-foreground transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:transition-transform before:duration-1000  hover:before:translate-x-0 hover:before:translate-y-0 ",

        "gooeyLeft-outline":
          "relative z-0 overflow-hidden border-2 border-primary bg-background from-zinc-400 transition-all  duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:transition-transform before:duration-1000 hover:bg-accent hover:text-accent-foreground  hover:before:translate-x-0 hover:before:translate-y-0",

        gooeyLeft:
          "relative z-0 overflow-hidden bg-primary from-zinc-400 text-primary-foreground transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:transition-transform after:duration-1000  hover:after:translate-x-0 hover:after:translate-y-0 ",
        "gooeyRight-outline":
          "relative z-0 overflow-hidden border-2 border-primary bg-background text-primary transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:transition-transform before:duration-1000 hover:bg-accent hover:text-accent-foreground hover:before:translate-x-0 hover:before:translate-y-0",

        "gooeyLeft-primary":
          "relative z-0 overflow-hidden bg-primary text-primary-foreground transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:transition-transform after:duration-1000 hover:after:translate-x-0 hover:after:translate-y-0",
        linkHover1:
          "relative after:absolute after:bottom-2 after:h-px after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0",
        linkHover2:
          "relative after:absolute after:bottom-2 after:h-px after:w-2/3 after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",
      },
      size: {
        default: "h-10 px-2  py-1 md:px-3",
        sm: "h-9 rounded-md px-3",
        xsm: "h-7 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
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
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
