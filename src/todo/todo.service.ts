import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  async create(createTodoDto: CreateTodoDto, userId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } })
      if (!user) throw new NotFoundException('User id does not match')
      const todo = this.todoRepository.create({...createTodoDto, user});
      return await this.todoRepository.save(todo);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      return await this.todoRepository.find({
        relations: ['user'],
        select: { id: true, title: true, description: true, isCompleted: true, user: { name: true } }
      });
    } catch (error) {
      throw new RequestTimeoutException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('ID does not match')
      }
      const todo = await this.todoRepository.findOne({ where: { id } });
      if (!todo) {
        throw new NotFoundException(`Todo with ${id} not found`)
      }
      return
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.todoRepository.update(id, updateTodoDto)
      if (todo.affected == 0) {
        throw new NotFoundException('Todo ID does not match')
      }
      return
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async toggleStatus(id: number) {
    try {
      const todo = await this.todoRepository.findOne({ where: { id } })
      if (todo) {
        todo.isCompleted = !todo.isCompleted
        return await this.todoRepository.save(todo)
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try {
      const todo = await this.todoRepository.findOne({ where: { id } })
      if (!todo) {
        throw new NotFoundException('Todo ID does not match')
      }
      return await this.todoRepository.remove(todo);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findByUser(userId: number) {
    try {
      return this.todoRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
        select: { title: true, description: true, isCompleted: true }
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}