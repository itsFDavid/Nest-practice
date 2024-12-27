import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  // Add a logger instance to the ProductsService class
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
    // Add a default value for the limit and offset query parameters
    const {limit = 10, offset = 0} = paginationDto;
    
    return this.productRepository
      .find({
        take: limit,
        skip: offset
      });
  }

  async findOne(term: string) {
    let product: Product;

    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id: term});
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase()
        })
        .getOne();
    }

    if(!product)
      throw new NotFoundException(`Product with ${term} not found`);
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

  // Add a private method to handle database exceptions
  private hanndleDBExceptions(err: any){
    if(err.code === '23505'){
      throw new BadRequestException(err.detail);
    }
    this.logger.error(err);
    throw new InternalServerErrorException('Error creating product');
  }
}
