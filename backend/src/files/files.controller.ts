import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  Res,
  Header,
} from '@nestjs/common';
import { FilesService } from '@app/files/files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from '@app/files/dto/create-file.dto';
import { UpdateFileDto } from '@app/files/dto/update-file.dto';
import { GetCurrentUserId } from '@app/common/decprators/get-current-user-id.decorator';

import {
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtAuthGuard)
@Controller('files')
@ApiTags('Files')
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new file' })
  @ApiCreatedResponse({ description: 'File uploaded successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({
    type: CreateFileDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename: string = file.originalname.split('.')[0];
          const fileExtName: string = extname(file.originalname);
          cb(null, `${filename}${fileExtName}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Omit<CreateFileDto, 'file'>,
    @GetCurrentUserId() userId: number,
  ) {
    await this.fileService.create(file, body as CreateFileDto, userId);
    return res.status(HttpStatus.CREATED).send('File created');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiOkResponse({ description: 'File found' })
  @ApiNotFoundResponse({ description: 'File not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getFile(
    @Res() res: Response,
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
  ) {
    const file = await this.fileService.findOne(+id, userId);
    return res.status(HttpStatus.OK).json(file);
  }

  @ApiOperation({ summary: 'Delete file by ID' })
  @ApiOkResponse({ description: 'File deleted successfully' })
  @ApiNotFoundResponse({ description: 'File not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete(':id')
  async deleteFile(
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
    @Res() res: Response,
  ) {
    await this.fileService.remove(+id, userId);
    return res.status(HttpStatus.OK).send('Deleted');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update file by ID' })
  @ApiOkResponse({ description: 'File updated successfully' })
  @ApiNotFoundResponse({ description: 'File not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateFile(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
    @GetCurrentUserId() userId: number,
  ) {
    await this.fileService.update(+id, updateFileDto, userId);
    return res.status(HttpStatus.OK).send('File Updated');
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Download file by ID' })
  @ApiOkResponse({ description: 'File downloaded successfully' })
  @ApiNotFoundResponse({ description: 'File not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Header('Content-Type', 'application/octet-stream')
  async downloadFile(
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.fileService.download(res, id, userId);
  }
}
