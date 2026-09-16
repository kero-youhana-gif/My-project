import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './products.model.js';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: 1, name: 'Wireless Mouse', price: 25.99 },
    { id: 2, name: 'Mechanical Keyboard', price: 89.5 },
    { id: 3, name: 'USB-C Cable', price: 12 },
  ];

  findAll(): Product[] {
    return [...this.products];
  }

  findOne(id: number): Product {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return { ...product };
  }

  create(createProductDto: CreateProductDto): Product {
    this.validateProductData(createProductDto);

    const nextId =
      this.products.reduce(
        (highestId, product) => Math.max(highestId, product.id),
        0,
      ) + 1;

    const newProduct: Product = {
      id: nextId,
      name: createProductDto.name.trim(),
      price: createProductDto.price,
    };

    this.products.push(newProduct);
    return { ...newProduct };
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex((item) => item.id === id);

    if (productIndex === -1) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const updatedProduct: Product = {
      ...this.products[productIndex],
      ...updateProductDto,
      id,
    };

    if (typeof updateProductDto.name === 'string') {
      updatedProduct.name = updateProductDto.name.trim();
    }

    this.validateProductData(updatedProduct);
    this.products[productIndex] = updatedProduct;

    return { ...updatedProduct };
  }

  remove(id: number): Product {
    const productIndex = this.products.findIndex((item) => item.id === id);

    if (productIndex === -1) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const [deletedProduct] = this.products.splice(productIndex, 1);
    return { ...deletedProduct };
  }

  private validateProductData(
    product: Partial<CreateProductDto>,
  ): asserts product is CreateProductDto {
    if (typeof product.name !== 'string' || product.name.trim().length === 0) {
      throw new BadRequestException('Product name must be a non-empty string');
    }

    if (
      typeof product.price !== 'number' ||
      !Number.isFinite(product.price) ||
      product.price < 0
    ) {
      throw new BadRequestException(
        'Product price must be a finite non-negative number',
      );
    }
  }
}