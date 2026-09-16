var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
let ProductsService = class ProductsService {
    products = [
        { id: 1, name: 'Wireless Mouse', price: 25.99 },
        { id: 2, name: 'Mechanical Keyboard', price: 89.5 },
        { id: 3, name: 'USB-C Cable', price: 12 },
    ];
    findAll() {
        return this.products.map((product) => ({ ...product }));
    }
    findOne(id) {
        const product = this.products.find((item) => item.id === id);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return { ...product };
    }
    create(createProductDto) {
        this.validateProductData(createProductDto);
        const nextId = this.products.reduce((highestId, product) => Math.max(highestId, product.id), 0) + 1;
        const newProduct = {
            id: nextId,
            name: createProductDto.name.trim(),
            price: createProductDto.price,
        };
        this.products.push(newProduct);
        return { ...newProduct };
    }
    update(id, updateProductDto) {
        const productIndex = this.products.findIndex((item) => item.id === id);
        if (productIndex === -1) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        const updatedProduct = {
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
    remove(id) {
        const productIndex = this.products.findIndex((item) => item.id === id);
        if (productIndex === -1) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        const [deletedProduct] = this.products.splice(productIndex, 1);
        return { ...deletedProduct };
    }
    validateProductData(product) {
        if (typeof product.name !== 'string' || product.name.trim().length === 0) {
            throw new BadRequestException('Product name must be a non-empty string');
        }
        if (typeof product.price !== 'number' ||
            !Number.isFinite(product.price) ||
            product.price < 0) {
            throw new BadRequestException('Product price must be a finite non-negative number');
        }
    }
};
ProductsService = __decorate([
    Injectable()
], ProductsService);
export { ProductsService };
