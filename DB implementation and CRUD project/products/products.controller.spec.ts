const { beforeEach, describe, expect, it, jest } = globalThis as any;
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn().mockReturnValue([
      { id: 1, name: 'Wireless Mouse', price: 25.99 },
      { id: 2, name: 'Mechanical Keyboard', price: 89.5 },
      { id: 3, name: 'USB-C Cable', price: 12 },
    ]),
    findOne: jest.fn().mockImplementation((id: number) => ({
      id,
      name: 'Wireless Mouse',
      price: 25.99,
    })),
    create: jest.fn().mockImplementation((dto: { name: string; price: number; categoryId: number }) => ({
      id: 4,
      ...dto,
    })),
    update: jest.fn().mockImplementation(
      (id: number, dto: { name?: string; price?: number }) => ({
      id,
      name: dto.name || 'Wireless Mouse',
      price: dto.price ?? 25.99,
      }),
    ),
    remove: jest.fn().mockImplementation((id: number) => ({
      id,
      name: 'Wireless Mouse',
      price: 25.99,
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = mockProductsService as unknown as ProductsService;
    controller = new ProductsController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all products', () => {
    const result = controller.findAll();
    expect(result).toHaveLength(3);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single product by id', () => {
    const product = controller.findOne(1);
    expect(product).toEqual({ id: 1, name: 'Wireless Mouse', price: 25.99 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a new product', () => {
    const newProductDto = { name: 'Gaming Chair', price: 150, categoryId: 2 };
    const createdProduct = controller.create(newProductDto);

    expect(createdProduct).toEqual({ id: 4, ...newProductDto });
    expect(service.create).toHaveBeenCalledWith(newProductDto);
  });

  it('should update a product', () => {
    const updateDto = { price: 30.0 };
    const updatedProduct = controller.update(1, updateDto);

    expect(updatedProduct.price).toBe(30.0);
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('should remove a product', () => {
    const deletedProduct = controller.remove(1);

    expect(deletedProduct.id).toBe(1);
    expect((service as any).remove).toHaveBeenCalledWith(1);
  });
});