import { UpdateFileDto } from '@app/files/dto/update-file.dto';
import { File } from '@app/entities/file.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
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

  async findManyOptions(params: FindManyOptions<File> = {}) {
    return await this.fileRepository.find(params);
  }

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
      userId,
      folderId,
    );

    const newFile = this.fileRepository.create({
      isPublic: Boolean(createFileDto.isPublic),
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

  async findFileById(id: number) {
    return this.fileRepository.findOne({
      where: { id },
      relations: ['owner', 'folder'],
    });
  }

  async findOne(id: number) {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    return file as File;
  }

  async clone(fileId: number, userId: number) {
    const file = (await this.fileRepository.findOne({
      where: { id: fileId },
      relations: ['owner', 'folder'],
    })) as File;

    try {
      let fileName = file.name;

      const [newFileName] = await this.generateUniqueFileName(
        file.name + file.exp,
        userId,
        file.folder?.id,
      );
      fileName = newFileName;

      const newFilePath = `./uploads/${fileName}-${Date.now()}${file.exp}`;
      await copyFile(file.path, newFilePath);

      const newFile = this.fileRepository.create({
        exp: file.exp,
        name: fileName,
        type: file.type,
        size: file.size,
        path: newFilePath,
        isPublic: file.isPublic,
        owner: { id: userId },
        folder: file.folder,
      });

      return await this.fileRepository.save(newFile);
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Failed to clone file');
    }
  }

  async update(id: number, updateFileDto: UpdateFileDto, userId: number) {
    if (!updateFileDto.isPublic && !updateFileDto.name) {
      return;
    }

    const file = (await this.fileRepository.findOne({
      where: { id },
    })) as File;

    let fileName = file.name;

    if (updateFileDto.name) {
      const [uniqueFileName] = await this.generateUniqueFileName(
        updateFileDto.name + file.exp,
        userId,
      );
      fileName = uniqueFileName;
    }

    file.name = fileName;
    file.isPublic = updateFileDto.isPublic ?? file.isPublic;

    return await this.fileRepository.save(file);
  }

  async remove(id: number) {
    const file = (await this.fileRepository.findOne({
      where: { id },
    })) as File;

    try {
      await unlink(file.path);
      await this.fileRepository.remove(file);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async download(res: Response, id: number) {
    const file = (await this.fileRepository.findOne({
      where: { id },
    })) as File;

    const stream = createReadStream(path.join(process.cwd(), file.path));

    const filePathArray = file.path.split('.');

    const fileExp = filePathArray[filePathArray.length - 1];

    res.set({
      'Content-Disposition': `attachment; filename="${file.name}.${fileExp}"`,
    });

    return new StreamableFile(stream);
  }

  async getFilesByFolderId(folderId: number) {
    return await this.fileRepository.find({
      where: { folder: { id: folderId } },
    });
  }

  private async generateUniqueFileName(
    originalName: string,
    userId: number,
    folderId?: number,
  ): Promise<string[]> {
    const fileExtName = path.extname(originalName);
    const fileNameWithoutExt = originalName.replace(fileExtName, '');

    const similarFiles = await this.fileRepository.find({
      where: {
        owner: { id: userId },
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
