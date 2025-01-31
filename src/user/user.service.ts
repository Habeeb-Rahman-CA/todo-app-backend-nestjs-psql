import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto)
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find({ relations: ['todos'] })
    } catch (error) {
      throw new RequestTimeoutException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('User ID does not match')
      }
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ${id} not found`)
      }
      return user
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.update(id, updateUserDto)
      if (user.affected == 0) {
        throw new NotFoundException('User ID does not match')
      }
      return user
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } })
      if (!user) {
        throw new NotFoundException('User ID does not match')
      }
      return this.userRepository.remove(user)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
