import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id!: number;

  @Column({ name: 'product_name' })
  name!: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
  
}