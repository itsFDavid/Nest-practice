import { Controller, Get, Post, Body, Patch, Param, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { SERVICES } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, PaginationOrderDto, StatusDto } from './dto';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(SERVICES.ORDER_SERVICE) private readonly ordersClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto );
  }

  @Get()
  findAll(@Query() paginationOrderDto: PaginationOrderDto) {
    return this.ordersClient.send('findAllOrders', paginationOrderDto);
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this
      .ordersClient
      .send('findOneOrder', { id })
      .pipe(
        catchError(err => { throw new RpcException(err); })
      );
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() PaginationDto: PaginationDto
  ) {
    return this
      .ordersClient
        .send('findAllOrders', { 
          status: statusDto.status,
          ...PaginationDto
        })
        .pipe(
          catchError(err => { throw new RpcException(err); })
        );
  }
}
