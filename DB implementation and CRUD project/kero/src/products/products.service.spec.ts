import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Pick<Repository<Product>, 'create' | 'save' | 'findOneBy'>;

  beforeEach(async () => {
    repository = {
      create: vi.fn((data) => data as Product),
      save: vi.fn(async (product) => ({ id: 1, ...product }) as Product),
      findOneBy: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: repository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const created = await service.create({ name: 'Laptop Stand', price: 49.99 });

    expect(created).toMatchObject({ name: 'Laptop Stand', price: 49.99 });
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Laptop Stand',
      price: 49.99,
    });
    expect(repository.save).toHaveBeenCalled();
  });
});
