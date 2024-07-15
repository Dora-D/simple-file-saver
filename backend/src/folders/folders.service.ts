import { Folder } from '@app/entities/folder.entity';
import { UsersService } from '@app/users/users.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { CreateFolderDto } from '@app/folders/dto/create-folder.dto';
import { UpdateFolderDto } from '@app/folders/dto/update-folder.dto';
import { FilesService } from '@app/files/files.service';
import { PermissionsService } from '@app/permissions/permissions.service';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    private readonly userService: UsersService,
    private readonly filesService: FilesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async findManyOptions(params: FindManyOptions<Folder> = {}) {
    return await this.folderRepository.find(params);
  }

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
        },
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

    return await this.folderRepository.save(newFolder);
  }

  async clone(folderId: number, userId: number) {
    this.permissionsService.checkUserCanEditFolder(userId, folderId);

    const folder = (await this.getFolderByIdWithRelations(folderId)) as Folder;

    try {
      const uniqueFolderName = await this.generateUniqueFolderName(
        folder.name,
        folder?.parentFolder?.id,
      );

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

  async findFileById(id: number) {
    return this.folderRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async findOne(id: number, userId: number) {
    this.permissionsService.checkUserCanReadFolder(userId, id);

    const folder = (await this.folderRepository.findOne({
      where: { id },
      relations: ['owner'],
    })) as Folder;

    return folder;
  }

  async update(id: number, updateFolderDto: UpdateFolderDto, userId: number) {
    this.permissionsService.checkUserCanEditFolder(userId, id);

    const folder = await this.findOne(id, userId);

    let name = updateFolderDto.name;

    if (updateFolderDto.name) {
      name = await this.generateUniqueFolderName(updateFolderDto.name);
    }

    Object.assign(folder, { ...updateFolderDto, name });

    return await this.folderRepository.save(folder);
  }

  async remove(id: number, userId: number) {
    this.permissionsService.checkUserFolderOwner(userId, id);

    const folder = (await this.getFolderByIdWithRelations(id)) as Folder;

    await this.deleteFolder(folder);
  }

  private async deleteFolder(folder: Folder) {
    try {
      const files = await this.filesService.getFilesByFolderId(folder.id);

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
      owner: { id: userId },
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
