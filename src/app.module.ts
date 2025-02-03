import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { Todo } from './todo/entities/todo.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FileUpload } from './file-upload/entities/file-upload.entity';
import { AuthModule } from './auth/auth.module';
import { AuthUser } from './auth/entities/auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Todo, User, FileUpload, AuthUser],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TodoModule,
    UserModule,
    FileUploadModule,
    AuthModule,
  ],
})
export class AppModule { }
