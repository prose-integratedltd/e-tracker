import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new UnauthorizedException('No authorization token provided');

    const payload = await this.getPayload(token);

    await this.isSuspended(payload.email);

    request['user'] = payload;
    return true;
  }

  private async isSuspended(email: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (user?.suspended)
        throw new UnauthorizedException('Your account has been suspended');

      return false;
    } catch (error) {
      throw new UnauthorizedException('Unable to validate account');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async getPayload(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization token token');
    }
  }
}
