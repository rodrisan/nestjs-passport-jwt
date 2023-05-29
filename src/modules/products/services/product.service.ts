import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from 'src/modules/products/entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/modules/products/dtos/product.dto';
import { RootEntity } from './../../../common/root-entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) // In order to use MySQL, pass the second param 'mysqlDB'.
    private _productRepository: Repository<Product>,
  ) {}

  findAll() {
    return this._productRepository.find();
  }

  async findOne(id: RootEntity['id']) {
    const product = await this._productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    // Using Active Record.
    // const newProduct = new Product();
    // newProduct.description = payload.description;
    // newProduct.image = payload.image;
    // newProduct.name = payload.name;
    // newProduct.price = payload.price;
    // newProduct.stock = payload.stock;

    // Using Repository Patter.
    const newProduct = this._productRepository.create(data);
    return this._productRepository.save(newProduct);
  }

  async update(id: RootEntity['id'], changes: UpdateProductDto) {
    const product = await this._productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product id #${id} does not exists`);
    }
    this._productRepository.merge(product, changes);
    return this._productRepository.save(product);
  }

  async remove(id: RootEntity['id']) {
    const product = await this._productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product id #${id} does not exists`);
    }
    return this._productRepository.delete(id);
  }
}
