import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
