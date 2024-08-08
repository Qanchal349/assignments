import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { PassportModule } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let jwtService: JwtService;
  const mockUser = { id: 1, username:"username", email: 'test@example.com', password: 'hashedPassword' }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), // Import PassportModule here
      ],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          return true;
        },
      })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        mockUser
      ];
      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      expect(await userController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      expect(await userController.findOne(1)).toBe(mockUser);
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = { username:"anchal", email: 'test@example.com', password: 'password' };
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
      expect(await userController.create(createUserDto)).toBe(mockUser);
    });
  });


  describe('update', () => {
    it('should update and return a user', async () => {
      jest.spyOn(userService, 'update').mockResolvedValue(mockUser);
      expect(await userController.update(1, mockUser)).toBe(mockUser);
    });
  });

  describe('remove', () => {
    it('should remove a user and return void', async () => {
      jest.spyOn(userService, 'remove').mockResolvedValue(undefined);
      expect(await userController.remove(1)).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should return a JWT token if login is successful', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await userController.login({} as any, loginDto);
      expect(result).toEqual({ token: 'mockToken' });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'wrongPassword' };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(userController.login({} as any, loginDto)).rejects.toThrow(
        'Invalid Email or Password',
      );
    });
  });
});
