export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CreateProductDto {
  name: string;
  price: number;
}