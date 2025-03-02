import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch, Logger } from '@nestjs/common';


import { SERVICES } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, PaginationOrderDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try{
      const order = await firstValueFrom(
        this.client.send('createOrder', createOrderDto)
      );
      if(order.status === 400){
        throw new RpcException(order);
      }
      return order;
    }catch(error){
      throw new RpcException(error.error);
    }
  }

  @Get()
  async findAll( @Query() orderPaginationDto: PaginationOrderDto ) {
    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', orderPaginationDto)
      )
      return orders;

    } catch (error) {
      throw new RpcException(error);
    }
  }
  
  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe ) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id })
      );
      
      if(order.status === 404) {
        throw new RpcException(order);
      }
      return order;
    } catch (error) {
      throw new RpcException(error.error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {

      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });

    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.client.send('changeOrderStatus', { id, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error);
    }
  }



}