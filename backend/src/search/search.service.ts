import { FilesService } from '@app/files/files.service';
import { FoldersService } from '@app/folders/folders.service';
import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    private readonly fileService: FilesService,
    private readonly folderService: FoldersService,
  ) {}
  async search(
    query: string,
    userId: number,
    folderId?: number,
    isMine?: boolean,
  ) {
    const isQueryEmpty = !query || query.trim().length === 0;
    if (isMine) {
      return this.getMineData(isQueryEmpty, query, userId, folderId);
    } else {
      return this.getData(isQueryEmpty, query, userId, folderId);
    }
  }

  private async getData(
    isQueryEmpty: boolean,
    query: string,
    userId: number,
    folderId?: number,
  ) {
    if (folderId) {
      return await this.folderService.findManyOptions({
        where: {
          parentFolder: { id: folderId },
          childFolders: isQueryEmpty ? undefined : { name: Like(`%${query}%`) },
          files: isQueryEmpty ? undefined : { name: Like(`%${query}%`) },
          permissions: { user: { id: userId } },
        },
        relations: ['owner', 'permissions', 'files', 'childFolders'],
      });
    }
    const folders = await this.folderService.findManyOptions({
      where: {
        name: isQueryEmpty ? undefined : Like(`%${query}%`),
        permissions: { user: { id: userId } },
      },
      relations: ['owner', 'permissions'],
    });
    const files = await this.fileService.findManyOptions({
      where: {
        name: isQueryEmpty ? undefined : Like(`%${query}%`),
        permissions: { user: { id: userId } },
      },
      relations: ['owner', 'permissions'],
    });
    return {
      folders,
      files,
    };
  }

  private async getMineData(
    isQueryEmpty: boolean,
    query: string,
    userId: number,
    folderId?: number,
  ) {
    if (folderId) {
      return await this.folderService.findManyOptions({
        where: {
          parentFolder: { id: folderId },
          childFolders: isQueryEmpty ? undefined : { name: Like(`%${query}%`) },
          files: isQueryEmpty ? undefined : { name: Like(`%${query}%`) },
          owner: { id: userId },
        },
        relations: ['owner', 'permissions', 'files', 'childFolders'],
      });
    }
    const folders = await this.folderService.findManyOptions({
      where: {
        owner: { id: userId },
        name: isQueryEmpty ? undefined : Like(`%${query}%`),
      },
      relations: ['owner', 'permissions'],
    });
    const files = await this.fileService.findManyOptions({
      where: {
        owner: { id: userId },
        name: isQueryEmpty ? undefined : Like(`%${query}%`),
      },
      relations: ['owner', 'permissions'],
    });
    return { folders, files };
  }
}
