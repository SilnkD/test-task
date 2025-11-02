import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByLoginOrEmail(login: string, email: string) {
    return this.repo.findOne({ where: [{ login }, { email }] });
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<User>) {
    const exist = await this.findByLoginOrEmail(data.login!, data.email!);
    if (exist)
      throw new ConflictException('User with this login or email already exists');
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async updateProfile(
    id: string,
    updates: Partial<User> & { password?: string },
  ) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const toUpdate: Partial<User> = {};

    if (updates.login) toUpdate.login = updates.login;
    if (updates.email) toUpdate.email = updates.email;
    if (updates.displayName) toUpdate.displayName = updates.displayName;

    if (updates.password) {
      if (updates.password.length < 8)
        throw new BadRequestException('Password must be at least 8 characters');

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(updates.password + salt, 10);
      toUpdate.passwordHash = passwordHash;
      toUpdate.salt = salt;
    }

    await this.repo.update({ id }, toUpdate);
    return await this.findById(id);
  }

  async updateRefreshToken(id: string, token: string) {
    await this.repo.update({ id }, { refreshToken: token });
  }

  async removeRefreshToken(id: string) {
    await this.repo.update({ id }, { refreshToken: undefined });
  }
}