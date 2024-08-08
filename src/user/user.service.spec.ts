import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

const mockUserRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  const mockUser = {
    id: 1,
    username: 'username',
    email: 'test@example.com',
    password: 'hashedPassword',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [mockUser];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await userService.findAll();
      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single user if found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await userService.findOne(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await userService.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw a NotFoundException if no user is found by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        userService.findByEmail('notfound@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDto = {
        username: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };
      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      mockUserRepository.save.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await userService.create(dto);
      expect(result).toEqual(mockUser);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'Test User',
          email: 'test@example.com',
        }),
      );
    });

    it('should throw a ConflictException if user already exists', async () => {
      const dto: CreateUserDto = {
        username: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(userService.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await userService.update(1, mockUser);
      expect(result).toEqual(mockUser);
      expect(userRepository.update).toHaveBeenCalledWith(1, mockUser);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(userService.remove(1)).resolves.toBeUndefined();
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if no user is found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(userService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
