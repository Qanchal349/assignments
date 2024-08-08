import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ValidationPipe,
  ParseIntPipe,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}


  @Get()
  @UseGuards(AuthGuard())
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body(ValidationPipe) dtoUser: CreateUserDto): Promise<User> {
    return this.userService.create(dtoUser);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<User> {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(+id);
  }

  @Post('/login')
  async login(@Req() req, @Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid Email or Password');
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Email or Password');
    const payload = { id: user.id };
    return { token: this.jwtService.sign(payload) };
  }
}
