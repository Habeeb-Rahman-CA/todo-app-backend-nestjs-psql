import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('authUser')
export class AuthUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;
}
