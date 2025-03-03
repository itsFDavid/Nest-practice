import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession() {
    return 'This action returns a new payment session';
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment was successful',
    }
  }

  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'Payment was cancelled',
    }
  }

  @Post('webhook')
  async stripeWebhook() {
    return 'This action handles the Stripe webhook';
  }
}
