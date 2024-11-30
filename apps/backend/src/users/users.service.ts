import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(uniqueUserInput: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({ where: uniqueUserInput });
  }

  async findById(id: string): Promise<User> {
    try {
      return await this.prisma.user.findFirstOrThrow({ where: { id } });
    } catch (e) {
      console.debug(`Could not find user by id "${id}"`);
      throw new NotFoundException('User could not be found');
    }
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
