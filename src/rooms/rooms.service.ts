import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    const { label, description, sensors = 1, switches = 1 } = createRoomDto;
    const data = await this.prisma.room.create({
      data: {
        label,
        description,
        sensors: {
          createMany: {
            data: Array.from({ length: sensors }).map(() => ({
              label: `Sensor ${Math.floor(Math.random() * 1000)}`,
            })),
          },
        },
        switches: {
          createMany: {
            data: Array.from({ length: switches }).map(() => ({
              label: `Switch ${Math.floor(Math.random() * 1000)}`,
            })),
          },
        },
      },
      select: {
        id: true,
        label: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Room created successfully',
      data,
      statusCode: 201,
    };
  }

  findAll() {
    return this.prisma.room.findMany({
      // select: {
      //   id: true,
      //   label: true,
      //   description: true,
      //   created_at: true,
      //   updated_at: true,
      // },
      include: {
        sensors: {
          include: {
            sensor_data: {
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
        },
        switches: {
          include: {
            SwitchState: {
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
      // select: {
      //   id: true,
      //   label: true,
      //   description: true,
      //   created_at: true,
      //   updated_at: true,
      // },
      include: {
        sensors: {
          include: {
            sensor_data: {
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
        },
        switches: {
          include: {
            SwitchState: {
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const { label, description } = updateRoomDto;
    const data = await this.prisma.room.update({
      where: {
        id,
      },
      data: {
        label,
        description,
      },
      select: {
        id: true,
        label: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Room updated successfully',
      data,
      statusCode: 200,
    };
  }

  async remove(id: number) {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const data = await this.prisma.room.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Room deleted successfully',
      data,
      statusCode: 200,
    };
  }
}
