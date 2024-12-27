import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/paginationDto';

@Controller('products')
export class ProductsController {
  // this is a dependency injection of the ProductsService class
  constructor(private readonly productsService: ProductsService) {}

  // this controller method will be called when a POST request is made to the /products endpoint
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // this controller method will be called when a GET request is made to the /products endpoint
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  // this controller method will be called when a GET request is made to the /products/:id endpoint
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  // this controller method will be called when a PATCH request is made to the /products/:id endpoint
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  // this controller method will be called when a DELETE request is made to the /products/:id endpoint
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
