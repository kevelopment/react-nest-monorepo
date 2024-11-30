import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email: username });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    // TODO: Generate a JWT and return it here
    return 'JWT';
  }
}
