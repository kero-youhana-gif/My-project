import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [CustomersModule, CategoriesModule, ProductsModule],
})
export class AppModule {}