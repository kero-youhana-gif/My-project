import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Injectable()
export class CategoriesService {
  private categories = [
    { id: 1, name: 'Electronics', description: 'Devices and gadgets' },
    { id: 2, name: 'Clothing', description: 'Men and Women fashion' },
  ];

  create(createCategoryDto: CreateCategoryDto) {
    const newCategory = { id: Date.now(), ...createCategoryDto };
    this.categories.push(newCategory);
    return newCategory;
  }

  findAll() {
    return this.categories;
  }

  findOne(id: number) {
    return this.categories.find((cat) => cat.id === id);
  }

  update(id: number, updateCategoryDto: CreateCategoryDto) {
    const category = this.findOne(id);
    if (category) {
      Object.assign(category, updateCategoryDto);
    }
    return category;
  }

  remove(id: number) {
    this.categories = this.categories.filter((cat) => cat.id !== id);
    return { deleted: true };
  }
}