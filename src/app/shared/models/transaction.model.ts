export class Transaction {
  creditCardNumber: string;
  cardHolder: string;
  expirationDate: Date;
  securityCode: string;
  amount: number;
  constructor(
    cardNumber: {
      firstQuarter: string;
      secondQuarter: string;
      thirdQuarter: string;
      fourthQuarter: string;
    },
    cardHolder: string,
    expirationDate: { month: string; year: string },
    amount: string,
    securityCode: string
  ) {
    this.creditCardNumber = Object.values(cardNumber).join('');
    this.cardHolder = cardHolder;
    this.amount = parseInt(amount);

    this.expirationDate = new Date(
      parseInt('20' + expirationDate.year),
      parseInt(expirationDate.month) - 1,
      1
    );
    this.securityCode = securityCode;
  }
}
