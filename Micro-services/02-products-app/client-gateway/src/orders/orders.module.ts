import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NatsModule } from 'src/transports/nats.module';
import { TcpOrdersModule } from 'src/transports/tcp-orders.module';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [TcpOrdersModule],
})
export class OrdersModule {}
