import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingComponent} from "../components/loading.component";

@Component({
  selector: 'payment-order',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <loading/>
  `,
  styles: []
})
export class PaymentOrderComponent implements OnInit {
  url = this.route.snapshot.queryParams['url'];

  constructor(private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    // alert('hello body')
    if (this.url) {
      localStorage.setItem('paymentUrl', this.url || '');
      sessionStorage.setItem('paymentUrl', this.url || '');
      setTimeout(() => {
        window.open(`${this.url}`, '_self');
      }, 20)
    } else {
      this.router.navigate(['/']);
    }
  }
}
