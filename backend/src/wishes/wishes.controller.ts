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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { EntityNotFoundFilter } from 'src/common/filters/exceptions.filter';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.findLastCreatedWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.findTopCopiedWishes();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  findOne(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  copy(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.copy({ id }, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user: User,
  ) {
    return this.wishesService.update({ id }, updateWishDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  remove(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishesService.remove({ id }, user);
  }
}
