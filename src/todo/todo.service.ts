import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {

  constructor(@InjectRepository(Todo) private readonly todoRepository: Repository<Todo>) { }

  async create(createTodoDto: CreateTodoDto) {
    try {
      const todo = this.todoRepository.create(createTodoDto);
      return await this.todoRepository.save(todo);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      return await this.todoRepository.find();
    } catch (error) {
      throw new RequestTimeoutException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const todo =  await this.todoRepository.findOne({ where: { id } });
      if(id !== todo?.id){
        throw new NotFoundException('ID does not match')
      }
      return todo
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.findOne(id)
      if (!todo) {
        throw new NotFoundException('Todo does not exist')
      }
      Object.assign(todo, updateTodoDto)
      return await this.todoRepository.save(todo);
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async toggleStatus(id: number){
    try {
      const todo = await this.findOne(id)
      if (todo) {
        todo.isCompleted = !todo.isCompleted
      }
      return await this.todoRepository.save(todo)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    const todo = await this.findOne(id)
    if (!todo) {
      throw new NotFoundException()
    }
    return await this.todoRepository.remove(todo);
  }
}
