import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
  findAllProducts(){
    return this.productsClient.send({ cmd: 'find_all_products' }, {});
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number){
    return `This action returns a #${id} product`;
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
