import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'apps/project-iot-backend/src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        maxAge: process.env.JWT_EXPIRE,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    if (!payload.sub) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: {
          select: {
            id: true,
            label: true,
            permissions: true,
          },
        },
        is_active: true,
      },
    });

    if (!user)
      throw new NotFoundException(
        'No user found. Contact administration about your account.',
      );

    if (!user.is_active)
      throw new UnauthorizedException(
        'Your account is temporarily suspended. Contact with administration.',
      );

    request['user'] = user;
    request['jwt_token'] = token;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
