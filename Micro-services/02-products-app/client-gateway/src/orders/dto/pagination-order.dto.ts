import { IsEnum, IsOptional } from "class-validator"
import { PaginationDto } from "src/common"
import { OrderStatus, OrderStatusList } from "../enum";

export class PaginationOrderDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList,{
    message: `Valid status values are ${OrderStatusList}`
  })
  status: OrderStatus;
}