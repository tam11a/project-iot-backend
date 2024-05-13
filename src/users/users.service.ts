import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { first_name, last_name, email, password, role_id } = createUserDto;
    const data = await this.prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password,
        role: {
          connect: {
            id: role_id,
          },
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'User registered successfully',
      data,
      statusCode: 201,
    };
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { first_name, last_name, email, role_id } = updateUserDto;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const data = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email,
        ...(role_id && {
          role: {
            connect: {
              id: role_id,
            },
          },
        }),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'User updated successfully',
      data,
      statusCode: 200,
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const data = await this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'User deleted successfully',
      data,
      statusCode: 200,
    };
  }
}
