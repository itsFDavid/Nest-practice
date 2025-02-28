import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum";

export class StatusDto {
  @IsEnum(OrderStatusList, {
    message: `Valid status values are ${OrderStatusList}`,
  })
  @IsOptional()
  status: OrderStatus;
}