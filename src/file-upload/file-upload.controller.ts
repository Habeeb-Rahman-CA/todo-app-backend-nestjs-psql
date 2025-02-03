import { Controller, Post, UseInterceptors, UploadedFile, Get, UseGuards } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('file_upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.handleFileUpload(file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  find() {
    return this.fileUploadService.find()
  }
}
