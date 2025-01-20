import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';


@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService
  ) {}

  async runSeed() {
    await this.insertNewProducts();
  }

  private async insertNewProducts(){
    return await this.productService.deleteAllProducts();
  }
}
