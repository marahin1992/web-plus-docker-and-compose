import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['username', 'email'])
export class User {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Имя пользователя', example: 'Никита Совулькин' })
  @Column({ unique: true })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty({
    description: 'О пользователе',
    example: 'Пока ничего не рассказал о себе',
  })
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @ApiProperty({ description: 'Аватар' })
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @ApiProperty({ description: 'Имэйл' })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: '1234567' })
  @Column({ select: false })
  @IsString()
  //@Exclude({})
  password: string;

  @ApiProperty({ description: 'Массив желаний' })
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ApiProperty({ description: 'Офферы пользователя' })
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @ApiProperty({ description: 'Массив списков желаний' })
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
