import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';

type JwtPayload = { sub: string; username: string; iat: number; exp: number };

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async getUser(@Request() req: Record<string, unknown>) {
    const { sub } = req.user as JwtPayload;
    const { password, ...user } = await this.userService.findById(sub);
    return user;
  }
}
