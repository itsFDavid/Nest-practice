import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  // Add a logger instance to the ProductsService class
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ){}

  async create(createProductDto: CreateProductDto) {
    try{
      const { images = [], ...productData } = createProductDto;
      const product = this.productRepository.create({
        ...createProductDto,
        images: images.map( image => this.productImageRepository.create({url: image}))
      });
      await this.productRepository.save(product); 
      return {...product, images};
    }catch(err){
      this.hanndleDBExceptions(err);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    // Add a default value for the limit and offset query parameters
    const {limit = 10, offset = 0} = paginationDto;
    
    const products = await this.productRepository
      .find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        }
      });

    // this return a plain object with the images urls
    return products.map( ({images, ...rest}) => ({
      ...rest,
      images: images.map(image => image.url)
    }))
  }

  // Add a method to find a product by term (id, title or slug)
  async findOne(term: string) {
    let product: Product;
    // Check if the term is a UUID
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id: term});
    }else{
      // Add a query builder to find a product by title or slug
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase()
        })
        .leftJoinAndSelect('product.images', 'images') // Add a join to the images table
        .getOne();
    }

    if(!product)
      throw new NotFoundException(`Product with ${term} not found`);
    
    return product;
  }

  // Add a method to update a product
  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const {images, ...toUpdate} = updateProductDto;

    
    // Add a preload method to update a product
    const product = await this.productRepository.preload({ id,...toUpdate })
    
    if(!product) throw new NotFoundException('Product not found');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    // Add a check to see if the product title is unique
    try{

      if( images){
        await queryRunner.manager.delete(ProductImage, {product: {id}});
        product.images = images.map( image => this.productImageRepository.create({url: image}));
      }

      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      return this.findOnePlain(id);
    }catch(err){
      await queryRunner.rollbackTransaction();
      this.hanndleDBExceptions(err);
    }finally{
      await queryRunner.release();
    }
  }

  // this method will remove a product from the database
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

  // Add a method to find a product by ID and return a plain object
  async findOnePlain(id: string){
    const {images = [], ...product } = await this.findOne(id);
    // this return a plain object with the images urls
    return {
      ...product,
      images: images.map(image => image.url)
    }
  }

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');
   try{
    await query.
      delete().
      where({}).
      execute();
   }catch(err){
      this.logger.error(err);
      this.hanndleDBExceptions(err);
    }
  }
}
