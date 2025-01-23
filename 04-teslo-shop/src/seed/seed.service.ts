import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const user = await this.insertNewUsers();
    await this.insertNewProducts(user);
  }

  private async deleteTables(){
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();

  }

  private async insertNewUsers(){
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      const {password, ...userData} = user;

      users.push(this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      }));
    });

    await this.userRepository.save(users);
    console.log(users[0]);
    return users[0];
  }

  private async insertNewProducts(user: User){
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product =>{
      insertPromises.push(this.productService.create(product, user));
    })

    await Promise.all(insertPromises);

    return true;
  }
}
