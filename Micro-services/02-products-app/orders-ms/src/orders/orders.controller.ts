import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto, PaginationOrderDto } from './dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';


@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    try{
      return this.ordersService.create(createOrderDto);
    }catch(err){
      throw new RpcException(err);
    }
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() paginationOrderDto: PaginationOrderDto) {
    return this.ordersService.findAll(paginationOrderDto);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseUUIDPipe ) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  async changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto){
    return await this.ordersService.changeOrderStatus(changeOrderStatusDto);
  }
}
