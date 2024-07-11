import { Folder } from '@app/entities/folder.entity';
import { UsersService } from '@app/users/users.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFolderDto } from '@app/folders/dto/create-folder.dto';
import { UpdateFolderDto } from '@app/folders/dto/update-folder.dto';
import { FilesService } from '@app/files/files.service';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    private userService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  async create(createFolderDto: CreateFolderDto, userId: number) {
    const owner = await this.userService.findOne({ where: { id: userId } });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    let parentFolder: Folder | null = null;

    if (createFolderDto.parentFolderId) {
      parentFolder = await this.folderRepository.findOne({
        where: {
          id: createFolderDto.parentFolderId,
          owner: owner,
        },
        relations: ['childFolders'],
      });

      if (!parentFolder) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    const newFolder = this.folderRepository.create({
      name: createFolderDto.name,
      isPublic: createFolderDto.isPublic,
      owner: owner,
      parentFolder: parentFolder as Folder,
    });

    if (parentFolder?.childFolders) {
      parentFolder.childFolders.push(newFolder);
    }

    return await this.folderRepository.save(newFolder);
  }

  async findOne(id: number, userId: number) {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.owner.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this folder',
      );
    }

    return folder;
  }

  async update(id: number, updateFolderDto: UpdateFolderDto, userId: number) {
    const folder = await this.findOne(id, userId);

    Object.assign(folder, updateFolderDto);

    return await this.folderRepository.save(folder);
  }

  private async getFolderByIdWithRelations(
    id: number,
    relations: string[] = ['owner', 'files', 'childFolders'],
  ) {
    return await this.folderRepository.findOne({
      where: { id },
      relations,
    });
  }

  async remove(id: number, userId: number) {
    const folder = await this.getFolderByIdWithRelations(id);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.owner.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this folder',
      );
    }

    await this.deleteFolder(folder);
  }

  private async deleteFolder(folder: Folder) {
    try {
      const files = await this.filesService.getFileByFolderId(folder.id);

      for (const file of files) {
        await this.filesService.remove(file.id, folder.owner.id);
      }

      const childFolders = await this.folderRepository.find({
        where: { parentFolder: { id: folder.id } },
        relations: ['files', 'owner'],
      });

      for (const childFolder of childFolders) {
        await this.deleteFolder(childFolder);
      }

      await this.folderRepository.remove(folder);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete folder');
    }
  }
}
