import { Folder } from '@app/entities/folder.entity';
import { UsersService } from '@app/users/users.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CreateFolderDto } from '@app/folders/dto/create-folder.dto';
import { UpdateFolderDto } from '@app/folders/dto/update-folder.dto';
import { FilesService } from '@app/files/files.service';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    private readonly userService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  async create(createFolderDto: CreateFolderDto, userId: number) {
    const user = await this.userService.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let parentFolder: Folder | null = null;

    if (createFolderDto.parentFolderId) {
      parentFolder = await this.folderRepository.findOne({
        where: {
          id: createFolderDto.parentFolderId,
          owner: user,
        },
        relations: ['childFolders'],
      });

      if (!parentFolder) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    const name = await this.generateUniqueFolderName(
      createFolderDto.name,
      parentFolder?.id,
    );

    const newFolder = this.folderRepository.create({
      name,
      isPublic: createFolderDto.isPublic,
      owner: user,
      parentFolder: parentFolder as Folder,
    });

    if (parentFolder?.childFolders) {
      parentFolder.childFolders.push(newFolder);
    }

    return await this.folderRepository.save(newFolder);
  }

  async clone(folderId: number, userId: number) {
    const folder = await this.getFolderByIdWithRelations(folderId);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    try {
      const uniqueFolderName = await this.generateUniqueFolderName(
        folder.name,
        folder.parentFolder?.id,
      );

      // Клонування папки та її вмісту
      const newFolder = await this.cloneFolderRecursive(
        folder,
        uniqueFolderName,
        userId,
      );

      return newFolder;
    } catch (error) {
      throw new InternalServerErrorException('Failed to clone folder');
    }
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

    let name = updateFolderDto.name;

    if (updateFolderDto.name) {
      name = await this.generateUniqueFolderName(updateFolderDto.name);
    }

    Object.assign(folder, { ...updateFolderDto, name });

    return await this.folderRepository.save(folder);
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

  private async cloneFolderRecursive(
    folder: Folder,
    newName: string,
    userId: number,
  ) {
    const newFolder = this.folderRepository.create({
      name: newName,
      owner: folder.owner,
      parentFolder: folder.parentFolder,
    });

    if (folder.childFolders) {
      newFolder.childFolders = await Promise.all(
        folder.childFolders.map(async (childFolder) => {
          return this.cloneFolderRecursive(
            childFolder,
            childFolder.name,
            userId,
          );
        }),
      );
    }

    if (folder.files) {
      newFolder.files = await Promise.all(
        folder.files.map(async (file) => {
          return this.filesService.clone(file.id, userId);
        }),
      );
    }
    await this.folderRepository.save(newFolder);
    return newFolder;
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

  private async generateUniqueFolderName(
    originalName: string,
    parentFolderId: number | null = null,
  ): Promise<string> {
    const similarFolders = await this.folderRepository.find({
      where: {
        name: Like(`${originalName}%`),
        parentFolder: parentFolderId ? { id: parentFolderId } : undefined,
      },
      order: { name: 'DESC' },
      take: 1,
    });

    if (!similarFolders.length) {
      return originalName;
    }

    const lastSimilarFolder = similarFolders[0];
    const match = lastSimilarFolder.name.match(/\((\d+)\)$/);
    const nextNumber = match ? parseInt(match[1], 10) + 1 : 1;
    return `${originalName} (${nextNumber})`;
  }
}
