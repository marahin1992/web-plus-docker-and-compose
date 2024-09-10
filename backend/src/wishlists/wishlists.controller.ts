import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWishlistDto: CreateWishlistDto, @AuthUser() user: User) {
    return this.wishlistsService.create(user, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.remove(id, user.id);
  }
}
