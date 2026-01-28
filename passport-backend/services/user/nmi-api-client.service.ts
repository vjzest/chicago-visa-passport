import axios from 'axios';

class NMIApiClient {
  private username: string;
  private password: string;
  private apiUrl: string;

  constructor(username: string, password: string, isProduction: boolean = false) {
    this.username = username;
    this.password = password;
    this.apiUrl = isProduction
      ? 'https://secure.networkmerchants.com/api/transact.php'
      : 'https://secure.nmi.com/api/transact.php';
  }

  async processPayment(params: {
    amount: number;
    cardNumber: string;
    expMonth: string;
    expYear: string;
    cvv: string;
  }): Promise<any> {
    const { amount, cardNumber, expMonth, expYear, cvv } = params;

    const payload = new URLSearchParams({
      username: this.username,
      password: this.password,
      amount: amount.toFixed(2),
      ccnumber: cardNumber,
      ccexp: `${expMonth}${expYear}`,
      cvv,
      type: 'sale',
    });

    try {
      const response = await axios.post(this.apiUrl, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Add more methods for other NMI API operations as needed
}

export default NMIApiClient;