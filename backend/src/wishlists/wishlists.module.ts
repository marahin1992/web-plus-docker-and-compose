import { forwardRef, Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './entities/wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
    forwardRef(() => WishesModule),
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
