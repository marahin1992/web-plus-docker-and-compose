import { forwardRef, Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), forwardRef(() => WishesModule)],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
