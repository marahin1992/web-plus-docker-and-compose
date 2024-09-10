import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const userWishes = await this.wishesService.findMany({
      where: { id: In(createWishlistDto.itemsId) },
    });
    console.log(createWishlistDto);
    console.log(userWishes);
    return await this.wishlistsRepository.save({
      owner: user,
      items: userWishes,
      ...createWishlistDto,
    });
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number) {
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(id);
    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Нет прав доступа');
    }
    if (updateWishlistDto.itemsId) {
      const wishes = await this.wishesService.findMany({
        where: { id: In(updateWishlistDto.itemsId) },
      });
      wishlist.items.push(...wishes);
      await this.wishlistsRepository.save(wishlist);
      await this.wishlistsRepository.update(id, updateWishlistDto);
    } else {
      await this.wishlistsRepository.update(id, updateWishlistDto);
    }
    return wishlist;
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Нет прав доступа');
    }
    return await this.wishlistsRepository.delete(id);
  }
}
