import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('files')
export class FileUpload {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filePath: string;
}
