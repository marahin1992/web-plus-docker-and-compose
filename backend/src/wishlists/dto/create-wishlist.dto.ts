import { PickType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';
import { IsNumber } from 'class-validator';

export class CreateWishlistDto extends PickType(Wishlist, [
  'name',
  'image',
] as const) {
  @IsNumber({}, { each: true })
  itemsId: number[];
}
