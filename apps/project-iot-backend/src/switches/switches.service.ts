import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSwitchDto } from './dto/create-switch.dto';
import { UpdateSwitchDto } from './dto/update-switch.dto';
import { PrismaService } from 'apps/project-iot-backend/src/prisma/prisma.service';

@Injectable()
export class SwitchesService {
  constructor(private prisma: PrismaService) {}

  async create(createSwitchDto: CreateSwitchDto) {
    const { label, description, room_id } = createSwitchDto;

    const data = await this.prisma.switch.create({
      data: {
        label,
        description,
        room: {
          connect: {
            id: room_id,
          },
        },
      },
      select: {
        id: true,
        label: true,
        description: true,
        room: {
          select: {
            id: true,
            label: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Switch created successfully',
      data,
      statusCode: 201,
    };
  }

  findAll() {
    return this.prisma.switch.findMany({
      select: {
        id: true,
        label: true,
        description: true,
        room: {
          select: {
            id: true,
            label: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const switch_ = await this.prisma.switch.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        label: true,
        description: true,
        room: {
          select: {
            id: true,
            label: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    if (!switch_) {
      throw new NotFoundException('Switch not found');
    }

    return switch_;
  }

  async update(id: number, updateSwitchDto: UpdateSwitchDto) {
    const { label, description, room_id } = updateSwitchDto;

    const switch_ = await this.prisma.switch.findUnique({
      where: {
        id,
      },
    });

    if (!switch_) {
      throw new NotFoundException('Switch not found');
    }

    const data = await this.prisma.switch.update({
      where: {
        id,
      },
      data: {
        label,
        description,
        room: {
          connect: {
            id: room_id,
          },
        },
      },
      select: {
        id: true,
        label: true,
        description: true,
        room: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Switch updated successfully',
      data,
      statusCode: 200,
    };
  }

  async remove(id: number) {
    const switch_ = await this.prisma.switch.findUnique({
      where: {
        id,
      },
    });

    if (!switch_) {
      throw new NotFoundException('Switch not found');
    }

    const data = await this.prisma.switch.delete({
      where: {
        id,
      },
      select: {
        id: true,
        label: true,
        description: true,
        room: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Switch deleted successfully',
      data,
      statusCode: 200,
    };
  }
}
