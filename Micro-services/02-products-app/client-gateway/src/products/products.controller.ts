import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PRODUCT_SERVICE } from 'src/config';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  createPoroduct() {
    return 'Create a product';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto){
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto);
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){
    try{
      const product = await firstValueFrom(
        this.productsClient
          .send({ cmd: 'find_one_product' }, { id })
      );
      return product;
    }catch(error){
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number){
    return `This action deletes a #${id} product`;
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any
  ){
    return `This action updates a #${id} product`;
  }

}
