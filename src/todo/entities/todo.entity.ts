import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'todos'})
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'boolean', default: false })
    isCompleted: boolean;
}