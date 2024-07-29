import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { PaymentCronService } from './payment-cron.service';

@Module({
  providers: [PaymentService, PaymentCronService, PaymentResolver],
  exports: [PaymentService],
})
export class PaymentModule {}
