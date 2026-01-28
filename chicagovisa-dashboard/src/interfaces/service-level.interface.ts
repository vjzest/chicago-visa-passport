export interface IServiceLevel {
  _id: string;
  serviceLevel: string;
  time: string;
  price: string;
  nonRefundableFee: string;
  inboundFee: string;
  outboundFee: string;
  serviceTypes: string[];
  isActive: boolean;
}
