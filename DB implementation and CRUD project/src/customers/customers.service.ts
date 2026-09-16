import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto.js';

@Injectable()
export class CustomersService {
  private customers = [
    { id: 1, name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '01012345678' },
    { id: 2, name: 'Mina Samir', email: 'mina@example.com', phone: '01212345678' },
  ];

  create(createCustomerDto: CreateCustomerDto) {
    const newCustomer = { id: Date.now(), ...createCustomerDto };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  findAll() {
    return this.customers;
  }

  findOne(id: number) {
    return this.customers.find((cust) => cust.id === id);
  }

  update(id: number, updateCustomerDto: CreateCustomerDto) {
    const customer = this.findOne(id);
    if (customer) {
      Object.assign(customer, updateCustomerDto);
    }
    return customer;
  }

  remove(id: number) {
    this.customers = this.customers.filter((cust) => cust.id !== id);
    return { deleted: true };
  }
}