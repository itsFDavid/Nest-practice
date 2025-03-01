import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';
import { TcpProductsModule } from 'src/transports/tcp-products.module';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    TcpProductsModule,
  ]
})
export class ProductsModule {}
