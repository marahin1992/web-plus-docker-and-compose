/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  FindOneOptions,
  FindOptionsWhere,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { hashValue } from 'src/helpers/hash';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const user = this.userRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });

    return this.userRepository.save(user).catch((err) => {
      console.log(err);
      if (err instanceof QueryFailedError) {
        throw new BadRequestException(
          'Пользователь с таким именем или электронной почтой уже зарегестрирован',
        );
      }
    });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOne(query: FindOneOptions<User>) {
    console.log(query)
    query = { ...query, relations: ['wishes', 'offers'] };
    return await this.userRepository.findOneOrFail(query);
  }

  async findMany(query: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return await this.userRepository.save({ ...user, ...updateUserDto }).catch((err) => {
      console.log(err);
      if (err instanceof QueryFailedError) {
        throw new BadRequestException(
          'Пользователь с таким именем или электронной почтой уже зарегестрирован',
        );
      }
    });;
  }

  async removeOne(query: FindOptionsWhere<User>, userId: number) {
    const user = await this.findOne({ where: query });
    if (userId !== user.id) {
      throw new ForbiddenException('Можно удалить только свой аккаунт');
    }
    return await this.userRepository.delete(query);
  }

  async findUserWishes(username: string) {
    const user = await this.findOne({ where: { username } });
    console.log(user);
    if (user) {
      return user.wishes;
    }
  }
}
