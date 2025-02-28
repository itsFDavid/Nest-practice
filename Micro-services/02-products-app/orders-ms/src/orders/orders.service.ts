import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();    
    this.logger.log('Connected to the database');
  }
  
  create(createOrderDto: CreateOrderDto) {
    return this.order.create({
      data: createOrderDto
    });
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: string) {
    try {
      const order = await this.order.findFirst({
        where: { id}
      })
      if(!order) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Order not found'
        });
      }
      return order;
    }catch(err){
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: err.message
      });
    }
  }

  changeOrderStatus(){}
}
