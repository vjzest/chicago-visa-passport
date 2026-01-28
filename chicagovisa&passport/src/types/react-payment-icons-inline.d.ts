declare module 'react-payment-icons-inline' {
    import { FC } from 'react';
  
    interface PaymentIconProps {
      id: string;
      style?: React.CSSProperties;
      className?: string;
    }
  
    export const PaymentIcon: FC<PaymentIconProps>;
  }