import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

// destructure jwt constants for shorthand access
const { secret, expiresIn } = jwtConstants;

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret,
      signOptions: { expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
