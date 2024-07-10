import { UpdateFileDto } from '@app/files/dto/update-file.dto';
import { File } from '@app/entities/file.entity';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from '@app/files/dto/create-file.dto';
import { UsersService } from '@app/users/users.service';
import { User } from '@app/entities/user.entity';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    file: Express.Multer.File,
    createFileDto: CreateFileDto,
    userId: number,
  ) {
    const user = (await this.usersService.findOne({
      where: { id: userId },
    })) as User;

    const newFile = this.fileRepository.create({
      ...createFileDto,
      owner: user,
      name: file.originalname.split('.')[0],
      type: file.mimetype,
      size: file.size,
      path: file.path,
    });
    return this.fileRepository.save(newFile);
  }

  async findOne(id: number, userId: number) {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }
    if (file.owner.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to work with this file',
      );
    }

    return file;
  }

  async update(id: number, updateFileDto: UpdateFileDto, userId: number) {
    const file = await this.findOne(id, userId);

    file.name = updateFileDto.name ?? file.name;
    file.isPublic = updateFileDto.isPublic ?? file.isPublic;

    return await this.fileRepository.save(file);
  }

  async remove(id: number, userId: number) {
    const file = await this.findOne(id, userId);

    if (!file) {
      throw new NotFoundException('File not found');
    }
    if (file.owner.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this file',
      );
    }

    try {
      await unlink(file.path);

      await this.fileRepository.remove(file);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async download(res: Response, id: number | string, userId: number) {
    const file = await this.findOne(+id, userId);

    const stream = createReadStream(join(process.cwd(), file.path));

    const filePathArray = file.path.split('.');

    const fileExp = filePathArray[filePathArray.length - 1];

    res.set({
      'Content-Disposition': `attachment; filename="${file.name}.${fileExp}"`,
    });

    return new StreamableFile(stream);
  }
}
