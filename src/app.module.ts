import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RoomsModule } from './rooms/rooms.module';
import { SensorsModule } from './sensors/sensors.module';
import { SwitchesModule } from './switches/switches.module';
import { AuthModule } from './auth/auth.module';
import { MqttModule } from './mqtt/mqtt.module';
import { ChartModule } from './chart/chart.module';

@Module({
  imports: [
    PrismaModule,
    MqttModule,
    AuthModule,
    UsersModule,
    RolesModule,
    RoomsModule,
    SensorsModule,
    SwitchesModule,
    ChartModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
