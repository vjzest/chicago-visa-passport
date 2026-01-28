import { FC } from "react";

interface PaymentMethodProps {
  method: string;
  lastFour: string;
}

const PaymentMethod: FC<PaymentMethodProps> = ({ method, lastFour }) => {
  return (
    <div className="flex items-center justify-between rounded-md bg-white p-4 shadow-md">
      <div>{method}</div>
      <div>**** **** **** {lastFour}</div>
    </div>
  );
};

export default PaymentMethod;
