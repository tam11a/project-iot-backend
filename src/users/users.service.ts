import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const { first_name, last_name, email, password, role_id } = createUserDto;
    return this.prisma.user.create({
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
      include: {
        role: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        role: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const { first_name, last_name, email, role_id } = updateUserDto;
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email,
        role: {
          connect: {
            id: role_id,
          },
        },
      },
      include: {
        role: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
