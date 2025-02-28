import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto, PaginationOrderDto } from './dto';
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
