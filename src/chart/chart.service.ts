import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChartService {
  constructor(private prisma: PrismaService) {}

  async getTemperatureData(
    sensor_id?: number,
    date_lte?: string,
    date_gte?: string,
  ) {
    return this.prisma.sensorData.findMany({
      where: {
        ...(sensor_id ? { sensor_id: parseInt(String(sensor_id)) } : {}),
        ...(date_lte && date_gte
          ? {
              created_at: {
                lte: new Date(date_lte),
                gte: new Date(date_gte),
              },
            }
          : {}),
      },
    });
  }
}
