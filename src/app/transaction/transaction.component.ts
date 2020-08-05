import { TransactionService } from '../core/services/transaction.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit, OnDestroy {
  @ViewChild('creditCard', { static: true }) form: FormGroup;
  @ViewChild('typeOfCard', { static: true }) typeOfCard;
  @ViewChild('amountInput', { static: true }) amountElement;
  httpSubscription: Subscription;
  successfullTransaction = false;
  constructor(private transaction: TransactionService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      creditCardNumber: new FormGroup({
        firstQuarter: new FormControl('', [
          Validators.required,
          this.lengthValidator(4),
        ]),
        secondQuarter: new FormControl('', [
          Validators.required,
          this.lengthValidator(4),
        ]),
        thirdQuarter: new FormControl('', [
          Validators.required,
          this.lengthValidator(4),
        ]),
        fourthQuarter: new FormControl('', [
          Validators.required,
          this.lengthValidator(4),
        ]),
      }),
      cardHolder: new FormControl('', [Validators.required]),
      expirationDate: new FormGroup({
        month: new FormControl('', [
          Validators.required,
          this.lengthValidator(2),
        ]),
        year: new FormControl('', [
          Validators.required,
          this.lengthValidator(2),
        ]),
      }),
      securityCode: new FormControl('', this.cvcValidator),
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
    });
    this.form.get('expirationDate').setValidators(this.expirationDateValidator);
    this.amountElement.nativeElement.focus();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.successfullTransaction = true;
      this.httpSubscription = this.transaction.postRequest(this.form.value);
      this.form.reset();

      setTimeout(() => {
        this.successfullTransaction = false;
      }, 3000);
    }
  }

  lengthValidator(length: number): ValidatorFn {
    return (control: FormControl) => {
      if (control.value) {
        if (control.value.length !== length) {
          return { invalidLength: true };
        }
      }
      return null;
    };
  }

  expirationDateValidator(expirationDate: FormGroup): { [s: string]: boolean } {
    if (expirationDate.value) {
      const month = parseInt(expirationDate.get('month').value, 10);
      const year = parseInt(expirationDate.get('year').value, 10);
      const date = new Date();
      const currentMonth = date.getMonth() + 1;
      const currentYear = parseInt(
        date.getFullYear().toString().substring(2, 4),
        10
      );
      if (
        month > 12 ||
        month === 0 ||
        year < currentYear ||
        (year === currentYear && month <= currentMonth)
      ) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  cvcValidator(form: FormControl): { [invalidCode: string]: boolean } {
    if (form.value) {
      if (form.value.length !== 3 && form.value !== '') {
        return { invalidCode: true };
      }
    }
    return null;
  }

  checkInput(event: KeyboardEvent, type: string): boolean {
    this.checkTypeOfTransaction();
    if (type === 'number') {
      if (!event.code.includes('Digit')) {
        return false;
      }
    } else {
      if (!event.code.includes('Key') && !event.code.includes('Space')) {
        return false;
      }
    }
  }

  checkTypeOfTransaction(): string {
    const firstDigit = this.typeOfCard.nativeElement.value.charAt(0);
    if (firstDigit === '3') {
      return 'american-express.png';
    } else if (firstDigit === '4') {
      return 'visa.png';
    } else if (firstDigit === '5') {
      return 'mastercard.png';
    } else if (firstDigit === '6') {
      return 'discover.png';
    }
    return '';
  }
  ngOnDestroy(): void {
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
  }
}
