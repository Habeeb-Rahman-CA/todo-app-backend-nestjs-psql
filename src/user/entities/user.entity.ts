import { Todo } from "src/todo/entities/todo.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'text', enum: ['Male', 'Female', 'Other'] })
    gender: string;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[]
    
}
