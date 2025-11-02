import { Body, Controller, Get, NotFoundException, Patch, Req, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const user = await this.users.findById(req.user.sub);
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
  }

  @ApiOperation({ summary: 'Update user profile or password' })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Req() req, @Body() dto: UpdateUserDto) {
    return await this.users.updateProfile(req.user.sub, dto);
  }
}