import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NatsModule, TcpOrdersModule, TcpProductsModule } from './transports';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    NatsModule,
    TcpOrdersModule,
    TcpProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
