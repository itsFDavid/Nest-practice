import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';


@Controller('products')
export class ProductsController {
  constructor() {}

  @Post()
  createPoroduct() {
    return 'Create a product';
  }

  @Get()
  findAllProducts(){
    return 'Find all products';
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
