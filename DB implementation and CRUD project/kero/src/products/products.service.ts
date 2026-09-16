import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return { ...product };
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.validateProductData(createProductDto);

    const newProduct = this.productsRepository.create({
      name: createProductDto.name.trim(),
      price: createProductDto.price,
    });

    return this.productsRepository.save(newProduct);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    const updatedProduct = {
      ...product,
      ...(updateProductDto.name !== undefined
        ? { name: updateProductDto.name.trim() }
        : {}),
      ...(updateProductDto.price !== undefined
        ? { price: updateProductDto.price }
        : {}),
    };

    this.validateProductData(updatedProduct);

    return this.productsRepository.save(updatedProduct);
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);

    await this.productsRepository.remove(product);
    return product;
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