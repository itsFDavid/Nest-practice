import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto, PaginationOrderDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

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

  async findAll(paginationOrderDto: PaginationOrderDto) {
    const { page, limit, status } = paginationOrderDto;
    const totalPages = await this.order.count({
      where: { status }
    });
    const currentPage = page;
    const data = await this.order.findMany({
      where: { status },
      skip: (currentPage - 1) * limit,
      take: limit
    });
    return {
      data,
      meta: {
        totalItems: totalPages,
        itemsPerPage: limit,
        page: currentPage,
        totalPages: Math.ceil(totalPages / limit),
      }
    };
  }

  async findOne(id: string) {
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
    }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto){
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);
    if(order.status === status){
      return order;
    }
    return this.order.update({
      where: { id },
      data: { status }
    });
  }
}
