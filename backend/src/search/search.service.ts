import { FilesService } from '@app/files/files.service';
import { FoldersService } from '@app/folders/folders.service';
import { Injectable } from '@nestjs/common';
import { ILike, IsNull, Not } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    private readonly fileService: FilesService,
    private readonly folderService: FoldersService,
  ) {}
  async search(
    query: string,
    userId: number,
    searchIn: 'own' | 'available',
    folderId?: number,
  ) {
    const isQueryEmpty = !query || query.trim().length === 0;

    if (searchIn === 'own') {
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
      const folder = await this.folderService.findOneOptions({
        where: [
          {
            id: folderId,
            childFolders: isQueryEmpty
              ? undefined
              : { name: ILike(`%${query}%`) },
            files: isQueryEmpty ? undefined : { name: ILike(`%${query}%`) },
            permissions: { user: { id: userId } },
          },
          {
            id: folderId,
            childFolders: isQueryEmpty
              ? undefined
              : { name: ILike(`%${query}%`) },
            files: isQueryEmpty ? undefined : { name: ILike(`%${query}%`) },
            owner: { id: Not(userId) },
            isPublic: true,
          },
        ],
        relations: [
          'owner',
          'permissions',
          'files',
          'childFolders',
          'childFolders.owner',
          'files.owner',
        ],
      });
      const breadcrumbs = await this.folderService.getBreadcrumbs(folderId);

      return { folder, breadcrumbs };
    }

    const folders = await this.folderService.findManyOptions({
      where: [
        {
          parentFolder: IsNull(),
          name: isQueryEmpty ? undefined : ILike(`%${query}%`),
          files: { name: isQueryEmpty ? undefined : ILike(`%${query}%`) },
          permissions: { user: { id: userId } },
        },
        {
          parentFolder: IsNull(),
          name: isQueryEmpty ? undefined : ILike(`%${query}%`),
          files: { name: isQueryEmpty ? undefined : ILike(`%${query}%`) },
          isPublic: true,
        },
      ],
      relations: ['owner', 'permissions'],
    });

    const files = await this.fileService.findManyOptions({
      where: [
        {
          folder: IsNull(),
          name: isQueryEmpty ? undefined : ILike(`%${query}%`),
          permissions: { user: { id: userId } },
        },
        {
          folder: IsNull(),
          name: isQueryEmpty ? undefined : ILike(`%${query}%`),
          isPublic: true,
        },
      ],
      relations: ['owner', 'permissions'],
    });

    return { folder: { childFolders: folders, files }, breadcrumbs: [] };
  }

  private async getMineData(
    isQueryEmpty: boolean,
    query: string,
    userId: number,
    folderId?: number,
  ) {
    if (folderId) {
      const folder = await this.folderService.findOneOptions({
        where: [
          {
            id: folderId,
            childFolders: isQueryEmpty
              ? undefined
              : { name: ILike(`%${query}%`) },
            owner: { id: userId },
          },
          {
            id: folderId,
            files: isQueryEmpty ? undefined : { name: ILike(`%${query}%`) },
            owner: { id: userId },
          },
        ],
        relations: [
          'owner',
          'permissions',
          'files',
          'childFolders',
          'parentFolder',
          'childFolders.owner',
          'files.owner',
        ],
      });

      const breadcrumbs = await this.folderService.getBreadcrumbs(folderId);

      return { folder, breadcrumbs };
    }
    const folders = await this.folderService.findManyOptions({
      where: {
        owner: { id: userId },
        parentFolder: IsNull(),
        name: isQueryEmpty ? undefined : ILike(`%${query}%`),
      },
      relations: ['owner', 'permissions'],
    });
    const files = await this.fileService.findManyOptions({
      where: {
        folder: IsNull(),
        owner: { id: userId },
        name: isQueryEmpty ? undefined : ILike(`%${query}%`),
      },
      relations: ['owner', 'permissions'],
    });
    return { folder: { childFolders: folders, files }, breadcrumbs: [] };
  }
}
