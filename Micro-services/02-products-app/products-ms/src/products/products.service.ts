import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RpcException } from '@nestjs/microservices';
import { ValidateProductsDto } from './dto/validate-products.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages / limit);

    const take = limit;
    const skip = (page - 1) * limit;

    return {
      data: await this.product.findMany({
        take,
        skip,
        where: { available: true },
      }),
      meta: {
        total: totalPages,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });
    if (!product) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;
    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // return await this.product.delete({
    //   where: { id }
    // });
    const deletedProduct = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return HttpStatus.OK;
  }

  async validateProducts(validateProductsDto: ValidateProductsDto) {
    let { ids } = validateProductsDto;
    const { available } = validateProductsDto;

    // if available is false, return all products
    if (!available) {
      return await this.product.findMany({
        where: { id: { in: ids } },
      });
    }

    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
        available,
      },
    });

    const invalidatedIds = ids.filter(
      (id) => !products.map((p) => p.id).includes(id),
    );
    
    const wordProduct = this.pluralize('Product', invalidatedIds.length);

    if (products.length !== ids.length) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `${wordProduct} with ids ${invalidatedIds.join(', ')} not found`,
      });
    }

    return products;
  }

  private pluralize(word: string, count: number) {
    return count === 1 ? word : word + 's';
  }
}
