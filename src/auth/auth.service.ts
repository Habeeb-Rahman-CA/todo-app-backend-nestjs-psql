import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser) private readonly authRepository: Repository<AuthUser>,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.findOneWithEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: CreateAuthDto) {
    const payload = {
      username: user.email,
      sub: {
        name: user.name
      },
    };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload)
    };
  }

  async register(createAuthDto: CreateAuthDto) {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10)
    const user = this.authRepository.create({ ...createAuthDto, password: hashedPassword })
    return this.authRepository.save(user)
  }

  async findOneWithEmail(email: string) {
    try {
      return await this.authRepository.findOne({ where: { email: email } })
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async find(){
    try {
      return await this.authRepository.find();
    } catch (error) {
      throw new NotFoundException()
    }
  }

}
