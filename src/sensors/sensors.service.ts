import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}

  async create(createSensorDto: CreateSensorDto) {
    const { label, description, room_id } = createSensorDto;

    const data = await this.prisma.sensor.create({
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
      message: 'Sensor created successfully',
      data,
      statusCode: 201,
    };
  }

  findAll() {
    return this.prisma.sensor.findMany({
      select: {
        id: true,
        label: true,
        description: true,
        room: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const sensor = await this.prisma.sensor.findUnique({
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

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    return sensor;
  }

  async update(id: number, updateSensorDto: UpdateSensorDto) {
    const { label, description, room_id } = updateSensorDto;

    const sensor = await this.prisma.sensor.findUnique({
      where: {
        id,
      },
    });

    if (!sensor) throw new NotFoundException(`Sensor with id ${id} not found`);

    const data = await this.prisma.sensor.update({
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
      message: 'Sensor updated successfully',
      data,
      statusCode: 200,
    };
  }

  async remove(id: number) {
    const sensor = await this.prisma.sensor.findUnique({
      where: {
        id,
      },
    });

    if (!sensor) throw new NotFoundException(`Sensor with id ${id} not found`);

    await this.prisma.sensor.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Sensor deleted successfully',
      statusCode: 200,
    };
  }
}
