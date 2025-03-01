import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NatsModule } from 'src/transports/nats.module';
import { TcpProductsModule } from 'src/transports/tcp-products.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TcpProductsModule,
  ],
})
export class OrdersModule {}
