import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit{

  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
      this.$connect();
      this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {

    return this.product.create({
      data: createProductDto
    });

  }

  async findAll(paginationDto: PaginationDto) {
    const {page, limit} = paginationDto;
    
    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages / limit);

    const take = limit;
    const skip = (page - 1) * limit;
    
    return {
      data: 
      await this.product.findMany({
        take,
        skip,
        where: { available: true }
      }),
      meta:{
        total: totalPages,
        page,
        lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true }
    });
    if(!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data: updateProductDto
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
        available: false
      }
    });

    return {
      message: `Product with id ${id} deleted successfully`
    }
  }
}
