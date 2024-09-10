import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}
  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.userService.findById(userId);
    const wish = await this.wishRepository.create({ ...createWishDto, owner });

    return await this.wishRepository.save(wish);
  }

  async findAll(query: { page: number; limit: number }) {
    const skip = (query.page - 1) * query.limit;
    const [data, totalCount] = await this.wishRepository.findAndCount({
      take: query.limit,
      skip,
    });
    const totalPage = Math.ceil(totalCount / query.limit);

    return {
      data,
      page: query.page,
      size: query.limit,
      totalCount,
      totalPage,
    };
  }

  async findOne(query: FindOneOptions<Wish>) {
    return await this.wishRepository.findOneOrFail(query);
  }

  async findMany(query: FindManyOptions<Wish>) {
    const wishes = await this.wishRepository.find(query);
    return wishes;
  }

  async findLastCreatedWishes() {
    return this.findMany({
      relations: ['owner', 'offers'],
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTopCopiedWishes() {
    return this.findMany({
      relations: ['owner', 'offers'],
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findWishById(id: number) {
    return await this.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  async findWishByOwnerId(ownerId: number) {
    return await this.wishRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'offers'],
    });
  }

  async raise(id: number, amount: number) {
    return this.wishRepository.update({ id }, { raised: amount });
  }

  async update(
    query: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
    ownerId: number,
  ) {
    const wish = await this.findOne({
      where: query,
      relations: ['owner', 'offers'],
    });
    if (wish.offers.length > 0 || wish.raised > 0) {
      throw new BadRequestException(
        'На подарок уже скидываются, надо было раньше',
      );
    }
    if (ownerId !== wish.owner.id) {
      throw new ForbiddenException('Доступ запрещен');
    }
    return this.wishRepository.update(query, updateWishDto);
  }

  async remove(query: FindOptionsWhere<Wish>, user: User) {
    const wish = await this.findOne({
      where: query,
      relations: ['owner', 'offers'],
    });
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя удалить чужой подарок');
    }
    return this.wishRepository.delete(query);
  }

  async copy(query: FindOptionsWhere<Wish>, user: User) {
    const wish = await this.findOne({
      where: query,
      relations: ['owner'],
    });
    const { name, link, image, price, description } = wish;
    const myWishes = await this.findWishByOwnerId(user.id);
    if (
      myWishes.find(
        (wish) =>
          wish.name === name &&
          wish.link === link &&
          wish.price === price &&
          wish.description === description,
      )
    ) {
      throw new BadRequestException('Вы уже копировали этот подарок себе');
    }
    const baseWish = { ...wish, copied: wish.copied + 1 };
    const newWish = await this.create(
      {
        name,
        link,
        image,
        price,
        description,
      },
      user.id,
    );

    await this.wishRepository.update(query, baseWish);
    return newWish;
  }
}
