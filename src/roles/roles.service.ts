import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { label, permissions } = createRoleDto;
    const data = await this.prisma.role.create({
      data: {
        label,
        permissions,
      },
      select: {
        id: true,
        label: true,
        permissions: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Role created successfully',
      data,
      statusCode: 201,
    };
  }

  findAll() {
    return this.prisma.role.findMany({
      select: {
        id: true,
        label: true,
        permissions: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        label: true,
        permissions: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { label, permissions } = updateRoleDto;

    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const data = await this.prisma.role.update({
      where: {
        id,
      },
      data: {
        label,
        permissions,
      },
      select: {
        id: true,
        label: true,
        permissions: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Role updated successfully',
      data,
      statusCode: 200,
    };
  }

  async remove(id: number) {
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const data = await this.prisma.role.delete({
      where: {
        id,
      },
      select: {
        id: true,
        label: true,
        permissions: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Role deleted successfully',
      data,
      statusCode: 200,
    };
  }
}
