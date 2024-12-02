import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/paginationDto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    try{
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product); 
      return product;
    }catch(err){
      this.hanndleDBExceptions(err);
    }

  }

  findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;
    
    return this.productRepository
      .find({
        take: limit,
        skip: offset
      });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({id});
    if(!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try{
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
    }catch(err){
      throw new BadRequestException('Product not found');
    }
  }

  private hanndleDBExceptions(err: any){
    if(err.code === '23505'){
      throw new BadRequestException(err.detail);
    }
    this.logger.error(err);
    throw new InternalServerErrorException('Error creating product');
  }
}
