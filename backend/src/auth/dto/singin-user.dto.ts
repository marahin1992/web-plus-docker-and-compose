import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class SigninUserResponseDto {
  @ApiProperty({ example: '1qw23er45t6yu78iop90pandanotherpenis' })
  access_token: string;
}

export class SigninUserDto extends PickType(User, ['username', 'password']) {}
