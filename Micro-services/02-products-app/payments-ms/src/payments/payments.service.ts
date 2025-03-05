import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

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

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;
    // const endpointSecret = 'whsec_dcf7322f065ac7888632896f8038fe04ee22119542bf3a7a34b24b628f4fe04f';
    const endpointSecret = "whsec_4xEqCeVk4vPgBNAqr3evlA1GrqDUwqGK";

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret
      );
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    switch (event.type) {
      case 'charge.succeeded':
          // TODO: Llamar nuetsro microservicio de ordenes
          console.log(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return res.status(200).json({
      sig
    });
  }

}
