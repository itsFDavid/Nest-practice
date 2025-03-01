import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto, PaginationOrderDto } from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { SERVICES } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(SERVICES.PRODUCT_SERVICE)
    private readonly productClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productsIds = createOrderDto.items.map((item) => item.productId);

      const products = await firstValueFrom(
        this.productClient.send({ cmd: 'validate_products' }, productsIds),
      );

      // Calculate of the values of the products
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;
        return acc + price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      // Create transaction of db
      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          orderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        include: {
          orderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            }
          }
        }
      });

      return {
        ...order,
        orderItem: order.orderItem.map( (orderItem) => ({
          ...orderItem,
          name: products.find( product => product.id === orderItem.productId).name
        }))
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async findAll(paginationOrderDto: PaginationOrderDto) {
    const { page, limit, status } = paginationOrderDto;
    const totalPages = await this.order.count({
      where: { status },
    });
    const currentPage = page;
    const data = await this.order.findMany({
      where: { status },
      skip: (currentPage - 1) * limit,
      take: limit,
    });
    return {
      data,
      meta: {
        totalItems: totalPages,
        itemsPerPage: limit,
        page: currentPage,
        totalPages: Math.ceil(totalPages / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
      include: { orderItem: {
        select: {
          price: true,
          quantity: true,
          productId: true
        }
      }}
    });
    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Order not found',
      });
    }

    const productsIds = order.orderItem.map((orderItem) => orderItem.productId);
    const products = await firstValueFrom(
      this.productClient.send({ cmd: 'validate_products' }, productsIds),
    );

    return {
      ...order,
      orderItem: order.orderItem.map( (orderItem) => ({
        ...orderItem,
        name: products.find( product => product.id === orderItem.productId).name
      }))
    };
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }
    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}
