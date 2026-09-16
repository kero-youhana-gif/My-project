var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let CategoriesService = class CategoriesService {
    categories = [
        { id: 1, name: 'Electronics', description: 'Devices and gadgets' },
        { id: 2, name: 'Clothing', description: 'Men and Women fashion' },
    ];
    create(createCategoryDto) {
        const newCategory = { id: Date.now(), ...createCategoryDto };
        this.categories.push(newCategory);
        return newCategory;
    }
    findAll() {
        return this.categories;
    }
    findOne(id) {
        return this.categories.find((cat) => cat.id === id);
    }
    update(id, updateCategoryDto) {
        const category = this.findOne(id);
        if (category) {
            Object.assign(category, updateCategoryDto);
        }
        return category;
    }
    remove(id) {
        this.categories = this.categories.filter((cat) => cat.id !== id);
        return { deleted: true };
    }
};
CategoriesService = __decorate([
    Injectable()
], CategoriesService);
export { CategoriesService };
