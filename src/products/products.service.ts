import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.prisma.product.count({
      where: { deleted_at: null },
    });
    const data = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { deleted_at: null },
    });
    const lastPage = Math.ceil(totalPages / limit);

    return { data, meta: { page, total: totalPages, lastPage } };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, deleted_at: null },
    });
    if (!product) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const { id: __, ...data } = updateProductDto;

    return await this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    //return await this.prisma.product.delete({ where: { id } });
    const product = await this.prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return product;
  }
}
