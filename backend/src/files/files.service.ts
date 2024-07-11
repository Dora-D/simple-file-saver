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
import { Like, Repository } from 'typeorm';
import { CreateFileDto } from '@app/files/dto/create-file.dto';
import { UsersService } from '@app/users/users.service';
import { User } from '@app/entities/user.entity';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { copyFile } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fileName = file.originalname;
    const folderId = createFileDto.folderId;

    const [uniqueFileName, fileExp] = await this.generateUniqueFileName(
      fileName,
      folderId,
    );

    const newFile = this.fileRepository.create({
      isPublic: createFileDto.isPublic,
      folder: folderId ? { id: folderId } : undefined,
      owner: user,
      name: uniqueFileName,
      type: file.mimetype,
      size: file.size,
      path: file.path,
      exp: fileExp,
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

  async clone(fileId: number, userId: number) {
    const file = await this.findOne(fileId, userId);

    try {
      const [newFileName] = await this.generateUniqueFileName(
        file.name + file.exp,
        file.folder?.id,
      );

      const newFilePath = `./uploads/${newFileName}-${Date.now()}${file.exp}`;
      await copyFile(file.path, newFilePath);

      const newFile = this.fileRepository.create({
        exp: file.exp,
        name: newFileName,
        type: file.type,
        size: file.size,
        path: newFilePath,
        isPublic: file.isPublic,
        owner: file.owner,
        folder: file.folder,
      });

      return await this.fileRepository.save(newFile);
    } catch (error) {
      throw new InternalServerErrorException('Failed to clone file');
    }
  }

  async update(id: number, updateFileDto: UpdateFileDto, userId: number) {
    if (!updateFileDto.isPublic && !updateFileDto.name) {
      return;
    }
    const file = await this.findOne(id, userId);

    let fileName = file.name;

    if (updateFileDto.name) {
      const [uniqueFileName] = await this.generateUniqueFileName(
        updateFileDto.name + file.exp,
      );
      fileName = uniqueFileName;
    }

    file.name = fileName;
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
      console.error(error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async download(res: Response, id: number | string, userId: number) {
    const file = await this.findOne(+id, userId);

    const stream = createReadStream(path.join(process.cwd(), file.path));

    const filePathArray = file.path.split('.');

    const fileExp = filePathArray[filePathArray.length - 1];

    res.set({
      'Content-Disposition': `attachment; filename="${file.name}.${fileExp}"`,
    });

    return new StreamableFile(stream);
  }

  async getFileByFolderId(folderId: number) {
    return this.fileRepository.find({
      where: { folder: { id: folderId } },
    });
  }

  private async generateUniqueFileName(
    originalName: string,
    folderId?: number,
  ): Promise<string[]> {
    const fileExtName = path.extname(originalName);
    const fileNameWithoutExt = originalName.replace(fileExtName, '');

    const similarFiles = await this.fileRepository.find({
      where: {
        name: Like(`${fileNameWithoutExt}%`),
        folder: folderId ? { id: folderId } : undefined,
        exp: fileExtName,
      },
    });

    let uniqueFileName = fileNameWithoutExt;

    if (similarFiles.length) {
      const lastSimilarFile = similarFiles[similarFiles.length - 1];
      const match = lastSimilarFile.name.match(/\((\d+)\)$/);
      const nextNumber = match ? parseInt(match[1], 10) + 1 : 1;
      uniqueFileName = `${fileNameWithoutExt}(${nextNumber})`;
    }

    return [uniqueFileName, fileExtName];
  }
}
