import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './config/database.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule, DatabaseModule, CommonModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
