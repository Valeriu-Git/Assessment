import { Transaction } from '../../shared/models/transaction.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private httpClient: HttpClient) {}

  // postRequest(transaction: Transaction): void {
  //   console.log(transaction);
  // }

  postRequest(formValues: {
    creditCardNumber: {
      firstQuarter: string;
      secondQuarter: string;
      thirdQuarter: string;
      fourthQuarter: string;
    };
    cardHolder: string;
    amount: string;
    expirationDate: {
      month: string;
      year: string;
    };
    securityCode: string;
  }): Subscription {
    const transaction = new Transaction(
      formValues.creditCardNumber,
      formValues.cardHolder,
      formValues.expirationDate,
      formValues.amount,
      formValues.securityCode
    );

    return this.httpClient
      .post('https://ng-fetch.firebaseio.com/posts.json', transaction)
      .subscribe((data) => {});
  }
}
