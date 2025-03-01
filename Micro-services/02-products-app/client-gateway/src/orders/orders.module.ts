import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NatsModule, TcpOrdersModule } from 'src/transports';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [TcpOrdersModule, NatsModule],
})
export class OrdersModule {}
