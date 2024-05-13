import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [PrismaModule, UsersModule, RolesModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
