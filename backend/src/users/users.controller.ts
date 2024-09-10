import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { EntityNotFoundFilter } from 'src/common/filters/exceptions.filter';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@ApiExtraModels(User)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findOwn(@AuthUser() user: User): Promise<any> {
    return this.usersService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  async findMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.wishesService.findWishByOwnerId(user.id);
  }

  @Post('find')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  findManyUsers(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async update(@AuthUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.usersService.updateOne(user.id, updateUserDto);
    return res;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('username') username: string) {
    return await this.usersService.findOne({
      where: { username },
    });
  }

  @Get(':username/wishes')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async findUserWhishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  remove(@AuthUser() user: User, @Param('id') id: number) {
    return this.usersService.removeOne({ id }, user.id);
  }
}
