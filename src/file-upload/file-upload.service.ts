import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from './entities/file-upload.entity';
import * as path from 'path';
import * as fs from 'fs'

@Injectable()
export class FileUploadService {
    constructor(@InjectRepository(FileUpload) private readonly fileRepository: Repository<FileUpload>) { }

    handleFileUpload(file: Express.Multer.File) {
        const uploadDir = path.join(__dirname,'..', 'upload')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        const newFilePath = path.join(uploadDir, file.filename)
        fs.renameSync(file.path, newFilePath)
        const fileUpload = new FileUpload()
        fileUpload.filePath = newFilePath
        this.fileRepository.save(fileUpload)
        return { message: 'File uploaded successfully', filePath: file.path };
    }

    find(){
        return this.fileRepository.find()
    }
}
