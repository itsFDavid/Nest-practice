import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items} = paymentSessionDto;
    
    const lineItems = items.map( items => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: items.name,
          },
          unit_amount: Math.round(items.price * 100), // <- Esto seria 20.00
        },
        quantity: items.quantity,
      }
    })

    const session = this.stripe.checkout.sessions.create({
      // Colocar el id de la orden
      payment_intent_data: {
        metadata: {}
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/payments/success',
      cancel_url: 'http://localhost:3000/payments/cancel',

    });
    return session;
  }
}
