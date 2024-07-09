import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  //   Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from '@app/files/files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateFileDto } from '@app/files/dto/create-file.dto';
// import { UpdateFileDto } from './dto/update-file.dto';
import { GetCurrentUserId } from '@app/common/decprators/get-current-user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename: string = file.originalname.split('.')[0];
          const fileExtName: string = '.' + file.originalname.split('.').pop();
          cb(null, `${filename}-${Date.now()}${fileExtName}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.fileService.create(file, createFileDto, userId);
  }

  @Get(':id')
  getFile(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Delete(':id')
  deleteFile(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }

  //   @Put(':id')
  //   updateFile(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //     return this.fileService.update(+id, updateFileDto);
  //   }
}
