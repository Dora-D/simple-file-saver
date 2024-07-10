import { Folder } from '@app/entities/folder.entity';
import { UsersService } from '@app/users/users.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFolderDto } from '@app/folders/dto/create-folder.dto';
import { UpdateFolderDto } from '@app/folders/dto/update-folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    private userService: UsersService,
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
      });

      if (!parentFolder) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    const newFolder = this.folderRepository.create({
      name: createFolderDto.name,
      owner: owner,
      parentFolder: parentFolder as Folder,
    });

    if (parentFolder) {
      let childFolders = [] as Folder[];

      if (parentFolder.childFolders) {
        childFolders = [...parentFolder.childFolders];
      }

      this.folderRepository.save({
        ...parentFolder,
        childFolders: [...childFolders, newFolder],
      });
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

  async remove(id: number, userId: number) {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['owner', 'files', 'childFolders'],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.owner.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this folder',
      );
    }

    // TODO: Implement logic to delete files and subfolders (if needed)

    await this.folderRepository.remove(folder);
  }
}
