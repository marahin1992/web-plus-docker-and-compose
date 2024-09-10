import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { EntityNotFoundFilter } from 'src/common/filters/exceptions.filter';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user: User) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id') id: number) {
    return this.offersService.findOne({ where: { id } });
  }
}
