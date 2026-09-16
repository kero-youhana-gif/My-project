var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let CustomersService = class CustomersService {
    customers = [
        { id: 1, name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '01012345678' },
        { id: 2, name: 'Mina Samir', email: 'mina@example.com', phone: '01212345678' },
    ];
    create(createCustomerDto) {
        const newCustomer = { id: Date.now(), ...createCustomerDto };
        this.customers.push(newCustomer);
        return newCustomer;
    }
    findAll() {
        return this.customers;
    }
    findOne(id) {
        return this.customers.find((cust) => cust.id === id);
    }
    update(id, updateCustomerDto) {
        const customer = this.findOne(id);
        if (customer) {
            Object.assign(customer, updateCustomerDto);
        }
        return customer;
    }
    remove(id) {
        this.customers = this.customers.filter((cust) => cust.id !== id);
        return { deleted: true };
    }
};
CustomersService = __decorate([
    Injectable()
], CustomersService);
export { CustomersService };
