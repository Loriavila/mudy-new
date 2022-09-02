import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PostRequestService } from 'src/app/services/post-request.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Oneclick,Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes  } from 'transbank-sdk';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  stripePayment= {return_url: 'http://www.mudy.itsirius.com/'};
  dataPayment:{ url?: any, token_ws?:any } = {};

  @ViewChild('startForm') startForm!: ElementRef;

  constructor(
    private postService: PostRequestService,
    private http: HttpClient,
    ) { this.payment() }

  ngOnInit(): void {
  }


  async payment() {

    await this.postService.payment(this.stripePayment)
    .then(res => {
      this.dataPayment={
        url:res.data.url,
        token_ws: res.data.token,
      }

    })
  }

  async onSubmit(event: Event){
    console.log(`url: ${this.dataPayment.url} / token:${this.dataPayment.token_ws}`)
    this.startForm.nativeElement.submit();

  }
}
