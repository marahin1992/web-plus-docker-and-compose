import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/singin-user.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { instanceToPlain } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@AuthUser() user, @Body() singInUserDto: SigninUserDto) {
    //const { username, password } = singInUserDto;
    return this.authService.login(singInUserDto);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return instanceToPlain(user);
  }
}
