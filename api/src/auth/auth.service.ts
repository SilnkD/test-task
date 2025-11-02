import { ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
  import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

interface AuthJwtPayload {
  sub: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register({ login, email, password, displayName }) {
    const existing = await this.users.findByLoginOrEmail(login, email);
    if (existing)
      throw new ConflictException('User with this login or email already exists');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password + salt, 10);
    const user = await this.users.create({
      login,
      email,
      passwordHash,
      salt,
      displayName,
    });

    const tokens = this.issueTokens(user);
    await this.users.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login({ loginOrEmail, password }) {
    const user = await this.users.findByLoginOrEmail(loginOrEmail, loginOrEmail);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password + user.salt, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.issueTokens(user);
    await this.users.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify<AuthJwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.users.findById(payload.sub);
      if (!user || user.refreshToken !== refreshToken)
        throw new UnauthorizedException('Invalid refresh token');

      const tokens = this.issueTokens(user);
      await this.users.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private issueTokens(user: User) {
    const payload: AuthJwtPayload = { sub: user.id, login: user.login };

    const accessExp = (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as any;
    const refreshExp = (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as any;

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: accessExp,
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: refreshExp,
    });

    return { accessToken, refreshToken };
  }
}