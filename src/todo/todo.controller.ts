import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto, createTodoDto.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'todoTitle', required: false })
  @ApiQuery({ name: 'status', required: false })
  find(
    @Query('userId') userId: string,
    @Query('todoTitle') todoTitle: string,
    @Query('status') status: boolean
  ) {
    if (userId) return this.todoService.findByUser(+userId)
    if (todoTitle) return this.todoService.findByTodoTitle(todoTitle)
    if (status) return this.todoService.findByStatus(status)
    return this.todoService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: false })
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: false })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'todoId', required: false })
  toggle(@Query('todoId') todoId: string) {
    return this.todoService.toggleStatus(+todoId)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: false })
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
