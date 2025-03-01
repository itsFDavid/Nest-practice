import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule, TcpProductsModule } from 'src/transports';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [TcpProductsModule, NatsModule],
})
export class ProductsModule {}
