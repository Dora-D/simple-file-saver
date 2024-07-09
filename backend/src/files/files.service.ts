import { UpdateFileDto } from '@app/files/dto/update-file.dto';
import { File } from '@app/entities/file.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from '@app/files/dto/create-file.dto';
import { UsersService } from '@app/users/users.service';
import { User } from '@app/entities/user.entity';

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
      name: file.filename,
      type: file.mimetype,
      size: file.size,
      path: file.path,
    });
    return this.fileRepository.save(newFile);
  }

  findOne(id: number) {
    return this.fileRepository.findOne({ where: { id } });
  }

  async update(id: number, updateFileDto: UpdateFileDto) {
    await this.fileRepository.update(id, updateFileDto);
    return this.fileRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (file) {
      await this.fileRepository.remove(file);
    }
  }
}
