import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateUserDto, required: true })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'gender', required: false })
  findAll(
    @Query('name') text: string,
    @Query('gender') gender: string
  ) {
    if (text) return this.userService.findByName(text)
    if (gender) return this.userService.findByGender(gender)
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: false })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: false })
  @ApiBody({ type: UpdateUserDto, required: false })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: false })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
